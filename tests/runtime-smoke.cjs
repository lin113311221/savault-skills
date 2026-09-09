'use strict';
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), assert = require('node:assert/strict'), { spawnSync } = require('node:child_process');
const skill = path.resolve(__dirname, '../skills/savault-notion'), work = fs.mkdtempSync(path.join(os.tmpdir(), 'savault-skill-check-'));
const evidence = [];
const env = { ...process.env, SAVAULT_CLI_HOME: path.join(work, 'profile') };
function execute(script, args, input, timeout = 60000) {
  const r = spawnSync(process.execPath, [path.join(skill, 'scripts', script), ...args], { env, encoding: 'utf8', input, timeout, windowsHide: true });
  if (r.error) throw r.error;
  let result; try { result = JSON.parse(r.stdout.trim()); } catch { throw Error('Invalid JSON from ' + script + ': ' + r.stderr); }
  evidence.push({ script, args: args.filter((v,i) => i === 0 || args[i-1] !== '--dir'), exitCode: r.status, result });
  return { result, status: r.status };
}
try {
  const archive = process.argv[2];
  const installed = execute('install.cjs', ['--dir', path.join(work, 'runtime'), ...(archive ? ['--archive', path.resolve(archive)] : [])], undefined, 300000);
  assert.equal(installed.result.ok, true); env.SAVAULT_CLI_DIR = installed.result.directory;
  const repeat = execute('install.cjs', ['--dir', path.join(work, 'runtime')]); assert.equal(repeat.result.ok, false);
  const call = (args,input) => execute('savault.cjs', args, input).result;
  assert.equal(call(['--version']).value.version, '0.1.0');
  const doctor = call(['doctor']); assert.equal(doctor.ok, true); assert.equal(doctor.value.platform, process.platform);
  const readOnly = call(['status']); assert.equal(readOnly.value.notion.hasKey, false);
  assert.equal(call(['sync','start','--platform','xiaohongshu']).ok, false);
  const token = 'synthetic-skill-smoke-token';
  const saved = call(['config','set','--stdin'], JSON.stringify({ notion: { token, parentId:'0123456789abcdef0123456789abcdef' } }));
  if (doctor.value.encryptionAvailable) {
    assert.equal(saved.ok, true); assert.equal(saved.value.notion.hasKey, true);
    assert.equal(fs.readFileSync(path.join(work,'profile/profiles/default/settings.enc')).includes(Buffer.from(token)),false);
    assert.equal(call(['daemon','stop']).ok,true);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,800);
    assert.equal(call(['status']).value.notion.hasKey,true);
  } else assert.equal(saved.ok,false);
  assert.equal(JSON.stringify(evidence).includes(token),false);
  assert.equal(call(['daemon','stop']).ok,true);
  const report={platform:process.platform,arch:process.arch,passed:true,encryptionPersistence:doctor.value.encryptionAvailable?'PASS':'UNAVAILABLE',realPlatformSync:'NOT_RUN',evidence};
  const output=process.env.SAVAULT_SKILL_REPORT || path.join(work,'report.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:true,report:output}));
} catch(error) { console.error(error);process.exitCode=1; }
finally { if(env.SAVAULT_CLI_DIR) try{execute('savault.cjs',['daemon','stop']);}catch{} }
