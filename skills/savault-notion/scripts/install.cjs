'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), { execFileSync } = require('node:child_process'), { parseArgs } = require('node:util');
const { manifest, platform, base, entry } = require('./runtime.cjs');
function run(executable, args) { return execFileSync(executable, args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true, timeout: 300000, maxBuffer: 2 * 1024 * 1024 }); }
let staging, installRoot;
try {
  const { values } = parseArgs({ options: { archive: { type: 'string' }, dir: { type: 'string' }, help: { type: 'boolean' } }, strict: true });
  if (values.help) { console.log(JSON.stringify({ options: { '--dir PATH': 'Version installation base directory', '--archive FILE': 'Use a local archive, still verify pinned SHA256' }, version: manifest.version })); process.exit(0); }
  const selected = platform(), root = path.resolve(values.dir || base()), destination = path.join(root, selected.directory);
  installRoot = root;
  if (fs.existsSync(destination)) throw Error('Destination already exists; use the existing runtime or choose another --dir. No files were replaced.');
  fs.mkdirSync(root, { recursive: true });
  staging = fs.mkdtempSync(path.join(root, '.install-'));
  const archive = values.archive ? path.resolve(values.archive) : path.join(staging, selected.file);
  if (!values.archive) run(process.platform === 'win32' ? 'curl.exe' : '/usr/bin/curl', ['--fail', '--silent', '--show-error', '--location', '--proto', '=https', '--proto-redir', '=https', '--retry', '2', '--max-time', '240', '--output', archive, selected.url]);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  if (hash !== selected.sha256) throw Error('Archive SHA256 mismatch; nothing was installed');
  const extracted = path.join(staging, 'extracted');
  if (process.platform === 'win32') {
    const script = path.join(staging, 'extract.ps1');
    fs.writeFileSync(script, 'param([string]$Archive,[string]$Destination)\n$ErrorActionPreference = "Stop"\nExpand-Archive -LiteralPath $Archive -DestinationPath $Destination\n');
    run('powershell.exe', ['-NoProfile', '-NonInteractive', '-File', script, archive, extracted]);
  } else {
    run('/usr/bin/ditto', ['-x', '-k', archive, extracted]);
    run('/usr/bin/codesign', ['--verify', '--deep', '--strict', path.join(extracted, selected.directory, 'Savault CLI.app')]);
  }
  const source = path.join(extracted, selected.directory), execPath = entry(source).executable;
  if (!fs.existsSync(execPath)) throw Error('Archive does not contain the expected CLI runtime');
  fs.renameSync(source, destination);
  console.log(JSON.stringify({ ok: true, version: manifest.version, directory: destination, sha256: hash, next: values.dir ? 'Set SAVAULT_CLI_DIR to directory, then run scripts/savault.cjs doctor' : 'Run scripts/savault.cjs doctor' }));
} catch (error) { console.log(JSON.stringify({ ok: false, error: { code: 'INSTALL_FAILED', message: error.status !== undefined ? 'Download, extraction or signature verification failed; inspect network/system permissions and retry in a new directory' : error.message } })); process.exitCode = 1; }
finally {
  // Only this invocation's staging is removed; an external --archive is retained.
  if (staging && path.dirname(staging) === installRoot && path.basename(staging).startsWith('.install-')) {
    try { fs.rmSync(staging, { recursive: true, force: true }); } catch { process.stderr.write('Temporary install files could not be cleaned; remove the .install-* directory in the chosen install root after closing dependent processes.\n'); }
  }
}
