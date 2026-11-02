// Generates and checks all 50 levels and the 5 of the OVHCLOUD SPECIAL mod: dimensions, borders, framed doors,
// reachability with badges, special racks, objectives (what each one needs is on
// the map, and never the same objective on two levels in a row), enemies left on the
// easiest difficulty.
// Usage: node tools/validate-levels.js
const fs = require('fs');
const path = require('path');
const load = (f) => fs.readFileSync(path.join(__dirname, '../js', f), 'utf8');
const { getLevel, LEVEL_COUNT, MOD_FIRST, MOD_COUNT, LevelGen, SKILLS, keepEnemy, seedLevel } = new Function(load('levelgen.js').replace(/if \(typeof module[^\n]*/, '') + load('levels.js') + '; return { getLevel, LEVEL_COUNT, MOD_FIRST, MOD_COUNT, LevelGen, SKILLS, keepEnemy, seedLevel };')();
let ok = true, prevObj = null;
const t0 = Date.now();
const indices = [...Array(LEVEL_COUNT).keys(), ...Array.from({ length: MOD_COUNT }, (_, k) => MOD_FIRST + k)];
for (const i of indices) {
  if (i === MOD_FIRST) prevObj = null;   // the mod is a campaign of its own
  const def = getLevel(i);
  const r = LevelGen.validate(def.map);
  const n = (c) => def.map.join('').split(c).length - 1;
  const enemies = [...'bdotmZV'].reduce((a, c) => a + n(c), 0);
  // enemies kept on the easiest skill (bosses, mini-bosses and the thief always stay): some must remain
  let easy = 0;
  def.map.forEach((row, y) => [...row].forEach((c, x) => { if ('bdotmZVy'.includes(c) && keepEnemy(c, x, y, 0)) easy++; }));
  if (enemies && !easy) { r.ok = false; r.errors.push('no enemy left on the easiest skill'); }
  if (def.miniType && n('V') !== 1) { r.ok = false; r.errors.push(`expected 1 mini-boss, found ${n('V')}`); }
  const need = LevelGen.OBJ_NEEDS[def.objective];
  if (need) for (const [ch, , cnt] of [...(need.walls || []), ...(need.floor || []).map(([c, k]) => [c, null, k])]) {
    if (n(ch) !== cnt) { r.ok = false; r.errors.push(`objective ${def.objective}: expected ${cnt} x ${ch}, found ${n(ch)}`); }
  }
  if (def.objective === prevObj) { r.ok = false; r.errors.push(`same objective as the previous level: ${def.objective}`); }
  const racks = { lcm: 4, migrate: 1 }[def.objective];
  if (racks && !LevelGen.pickRacks(def.map, racks)) { r.ok = false; r.errors.push(`objective ${def.objective}: needs ${racks} reachable racks`); }
  prevObj = def.objective;
  console.log(`${def.code.padEnd(10)} ${String(def.map[0].length).padStart(2)}x${String(def.map.length).padEnd(2)} enemies ${String(enemies).padStart(2)} (${String(easy).padStart(2)} ${SKILLS[0].name.toLowerCase()})  secret ${n('?')}  badge doors ${n('1') + n('2')}  ${(def.objective === 'boss' ? 'boss ' + def.bossType : def.objective === 'miniboss' ? 'mini-boss ' + def.miniType : def.objective).padEnd(20)} ${r.ok ? 'OK' : 'ERROR'}`);
  if (!r.ok) { ok = false; r.errors.slice(0, 5).forEach((e) => console.log('   ' + e)); }
}
// seeded runs (daily seed, endless): a sample of seeds and depths must generate valid maps
let seeded = 0;
for (const seed of [1, 7, 20261022, 123456789]) for (let depth = 1; depth <= 18; depth++) {
  const def = seedLevel(seed, depth), r = LevelGen.validate(def.map);
  if (!r.ok) { ok = false; console.log(`seed ${seed} depth ${depth} ERROR`); r.errors.slice(0, 5).forEach((e) => console.log('   ' + e)); }
  seeded++;
}
console.log(`${seeded} seeded run levels checked`);
console.log(`${ok ? 'Levels OK' : 'Errors found'} (${Date.now() - t0} ms)`);
process.exit(ok ? 0 : 1);
