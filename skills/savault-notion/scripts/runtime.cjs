'use strict';
const path = require('node:path'), os = require('node:os');
const manifest = require('../references/runtime.json');
function platform() {
  const key = process.platform + '-' + process.arch;
  const entry = manifest.platforms[key];
  if (!entry) throw Error('Supported runtimes: Windows x64 and macOS arm64/x64');
  return entry;
}
function base() { return path.join(process.platform === 'win32' ? process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData/Local') : path.join(os.homedir(), 'Applications'), 'SavaultCLI', manifest.version); }
function directory() { return path.resolve(process.env.SAVAULT_CLI_DIR || path.join(base(), platform().directory)); }
function entry(dir = directory()) {
  if (process.platform === 'win32') return { executable: path.join(dir, 'Savault CLI.exe'), launcher: path.join(dir, 'resources/app.asar/launcher.cjs') };
  return { executable: path.join(dir, 'Savault CLI.app/Contents/MacOS/Savault CLI'), launcher: path.join(dir, 'Savault CLI.app/Contents/Resources/app.asar/launcher.cjs') };
}
module.exports = { manifest, platform, base, directory, entry };
