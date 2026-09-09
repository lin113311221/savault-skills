'use strict';
const fs = require('node:fs'), { spawn } = require('node:child_process');
try {
  const { entry } = require('./runtime.cjs'); const { executable, launcher } = entry();
  if (!fs.existsSync(executable)) throw Error('Savault CLI is not installed. Run this skill\'s scripts/install.cjs or set SAVAULT_CLI_DIR to an existing CLI package directory.');
  const env = { ...process.env, ELECTRON_RUN_AS_NODE: '1' }; delete env.NODE_OPTIONS; delete env.NODE_PATH;
  const child = spawn(executable, [launcher, ...process.argv.slice(2)], { env, stdio: 'inherit', windowsHide: true, shell: false });
  child.on('error', () => { process.stdout.write(JSON.stringify({ ok: false, error: { code: 'RUNTIME_START_FAILED', message: 'Could not start Savault CLI' } }) + '\n'); process.exitCode = 1; });
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1); });
  process.on('SIGINT', () => child.kill('SIGINT'));
} catch (error) { process.stdout.write(JSON.stringify({ ok: false, error: { code: 'RUNTIME_MISSING', message: error.message } }) + '\n'); process.exitCode = 1; }
