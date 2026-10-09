// Generates and checks all 50 levels: dimensions, borders, framed doors,
// reachability with badges, special racks, objectives (what each one needs is on
// the map, and never the same objective on two levels in a row).
// Usage: node tools/validate-levels.js
const fs = require('fs');
const path = require('path');
const load = (f) => fs.readFileSync(path.join(__dirname, '../js', f), 'utf8');
const { getLevel, LEVEL_COUNT, LevelGen } = new Function(load('levelgen.js').replace(/if \(typeof module[^\n]*/, '') + load('levels.js') + '; return { getLevel, LEVEL_COUNT, LevelGen };')();
let ok = true, prevObj = null;
const t0 = Date.now();
for (let i = 0; i < LEVEL_COUNT; i++) {
  const def = getLevel(i);
  const r = LevelGen.validate(def.map);
  const n = (c) => def.map.join('').split(c).length - 1;
  const enemies = [...'bdotmZV'].reduce((a, c) => a + n(c), 0);
  if (def.miniType && n('V') !== 1) { r.ok = false; r.errors.push(`expected 1 mini-boss, found ${n('V')}`); }
  const need = LevelGen.OBJ_NEEDS[def.objective];
  if (need) for (const [ch, , cnt] of [...(need.walls || []), ...(need.floor || []).map(([c, k]) => [c, null, k])]) {
    if (n(ch) !== cnt) { r.ok = false; r.errors.push(`objective ${def.objective}: expected ${cnt} x ${ch}, found ${n(ch)}`); }
  }
  if (def.objective === prevObj) { r.ok = false; r.errors.push(`same objective as the previous level: ${def.objective}`); }
  prevObj = def.objective;
  console.log(`${def.code.padEnd(6)} ${String(def.map[0].length).padStart(2)}x${String(def.map.length).padEnd(2)} enemies ${String(enemies).padStart(2)}  secret ${n('?')}  badge doors ${n('1') + n('2')}  ${(def.objective === 'boss' ? 'boss ' + def.bossType : def.objective === 'miniboss' ? 'mini-boss ' + def.miniType : def.objective).padEnd(20)} ${r.ok ? 'OK' : 'ERROR'}`);
  if (!r.ok) { ok = false; r.errors.slice(0, 5).forEach((e) => console.log('   ' + e)); }
}
console.log(`${ok ? 'Levels OK' : 'Errors found'} (${Date.now() - t0} ms)`);
process.exit(ok ? 0 : 1);
