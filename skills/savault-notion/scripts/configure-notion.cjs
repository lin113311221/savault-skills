'use strict';
const path = require('node:path'), { spawn } = require('node:child_process'), { parseArgs } = require('node:util');
try {
  const { values } = parseArgs({ options: { 'parent-id': { type: 'string' }, 'parent-type': { type: 'string', default: 'database' }, profile: { type: 'string', default: 'default' } }, strict: true });
  if (!values['parent-id'] || !['database', 'data_source', 'page'].includes(values['parent-type'])) throw Error('Supply --parent-id and valid --parent-type');
  if (!process.stdin.isTTY || !process.stdin.setRawMode) throw Error('Run this secure prompt in an interactive local terminal');
  let secret = ''; process.stderr.write('Notion token (hidden; Enter to save, Ctrl+C to cancel): '); process.stdin.setRawMode(true); process.stdin.setEncoding('utf8'); process.stdin.resume();
  process.stdin.on('data', chunk => {
    for (const ch of chunk) {
      if (ch === '\u0003') { process.stdin.setRawMode(false); process.stdin.pause(); process.stderr.write('\nCancelled\n'); process.exit(130); }
      if (ch === '\r' || ch === '\n') {
        process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.removeAllListeners('data'); process.stderr.write('\n');
        if (!secret.trim()) { process.stderr.write('Empty token; nothing saved\n'); process.exitCode = 2; return; }
        const child = spawn(process.execPath, [path.join(__dirname, 'savault.cjs'), 'config', 'set', '--stdin', '--profile', values.profile], { stdio: ['pipe','inherit','inherit'], windowsHide: true });
        child.on('error', () => { process.stderr.write('Could not start CLI\n'); process.exitCode = 1; });
        child.stdin.on('error', () => {});
        child.stdin.end(JSON.stringify({ notion: { token: secret.trim(), parentId: values['parent-id'], parentType: values['parent-type'] } })); secret = '';
        child.on('exit', code => { process.exitCode = code ?? 1; }); return;
      }
      if (ch === '\u007f' || ch === '\b') secret = secret.slice(0, -1);
      else if (ch >= ' ' && secret.length < 8192) secret += ch;
    }
  });
} catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 2; }
