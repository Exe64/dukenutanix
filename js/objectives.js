'use strict';
/*
 * Level objectives. Every level has one (LEVEL_OBJECTIVES in levels.js, placed on the
 * map by LevelGen.placeObjective); the REBOOT terminal stays locked until it is done.
 * Timed objectives (overheat, ransomware, evacuation) fail the level when their
 * 5 minutes run out. The Nutanix migrations stay on every level as a bonus.
 *
 *   backup    bring the 5 LTO tapes (l) to the tape library (T)
 *   overheat  repair the 3 broken CRAC units (O): hold E for 3 s each, 5 minutes
 *   power     the level is dark: switch the 3 MAIN POWER panels (J) back on
 *   ransom    unplug the 6 infected racks (E) before encryption hits 100%, 5 minutes
 *   hotswap   carry the spare disk (h) to the failed server (8); hands full meanwhile
 *   defend    start the failover on the PROD DB (9) and keep it alive for 90 s
 *   firmware  stand in the 3 upload zones (z) until each upload completes
 *   evac      reach the REBOOT terminal before the gas suppression fires, 5 minutes
 *   thief     stop the data thief (y) before he reaches the exit
 *   miniboss / boss  the guardian of the x5 / x10 levels
 *
 * game.js calls init (on load), update (each step), use (E on a wall), pickup,
 * kill, done, and the HUD and map helpers. The state lives in L.obj.
 */
const TIMED_S = 300;
const Objectives = (() => {
  const near = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 < r * r;
  const cellsOf = (L, ch) => {
    const out = [], code = ch.charCodeAt(0);
    for (let i = 0; i < L.map.length; i++) if (L.map[i] === code) out.push({ x: i % L.w, y: (i / L.w) | 0, i });
    return out;
  };
  const fmt = (t) => `${Math.floor(Math.max(0, t) / 60)}:${String(Math.floor(Math.max(0, t) % 60)).padStart(2, '0')}`;

  // Changes a wall tile (repaired CRAC, isolated rack...) in every renderer.
  function setTile(L, x, y, ch) {
    L.map[y * L.w + x] = ch.charCodeAt(0);
    if (useGL) GLR.retile(L);
  }

  // Lighting changed (power panels): rebake the lightmaps.
  function relight(L) {
    Light.bake(L);
    if (useGL) GLR.relight(L);
  }

  function init(L) {
    const type = L.def.objective || 'evac';
    const o = L.obj = { type, done: false, failed: false, left: TIMED_S };
    switch (type) {
      case 'backup':
        o.total = L.items.filter((it) => it.type === 'l').length; o.carried = 0; o.stored = 0;
        o.lib = cellsOf(L, 'T')[0];
        break;
      case 'overheat': o.units = cellsOf(L, 'O'); o.fixed = 0; o.burnT = 0; break;
      case 'power': {
        o.panels = cellsOf(L, 'J'); o.on = 0; o.dark = true;
        // every ceiling light hangs on the nearest panel; all of them are off for now
        o.lamps = [];
        for (let i = 0; i < L.ceil.length; i++) {
          if (L.ceil[i] !== 1) continue;
          const x = i % L.w, y = (i / L.w) | 0;
          let best = 0, bd = 1e9;
          o.panels.forEach((p, k) => { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = k; } });
          o.lamps.push({ i, panel: best });
          L.ceil[i] = 0;
        }
        L.ambMul = 0.3;
        break;
      }
      case 'ransom': o.racks = cellsOf(L, 'E'); o.cut = 0; break;
      case 'hotswap': o.server = cellsOf(L, '8')[0]; o.carry = false; break;
      case 'defend': o.rack = cellsOf(L, '9')[0]; o.started = false; o.hp = 100; o.left = 90; o.spawnT = 0; break;
      case 'firmware': o.zones = L.zones.map((z) => ({ ...z, prog: 0 })); o.spawnT = 0; o.beep = 0; break;
      case 'thief':
        o.thief = L.enemies.find((e) => e.type === 'thief');
        o.field = exitField(L);
        break;
      default: break;
    }
  }

  // Distance (in cells) to the exit for the thief, who has keys to every door.
  function exitField(L) {
    const f = new Int16Array(L.w * L.h).fill(-1), q = [];
    const X = 'X'.charCodeAt(0);
    for (let i = 0; i < L.map.length; i++) {
      if (L.map[i] !== X) continue;
      const x = i % L.w, y = (i / L.w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = (y + dy) * L.w + x + dx;
        if (n >= 0 && n < f.length && !L.map[n] && f[n] < 0) { f[n] = 0; q.push(n); }
      }
    }
    for (let h = 0; h < q.length; h++) {
      const c = q[h], cx = c % L.w, cy = (c / L.w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= L.w || ny >= L.h) continue;
        const n = ny * L.w + nx;
        if (f[n] >= 0 || L.block[n] || (L.map[n] && !L.doors[n])) continue;
        f[n] = f[c] + 1; q.push(n);
      }
    }
    return f;
  }

  function complete(L, text) {
    const o = L.obj;
    if (o.done) return;
    o.done = true;
    msg(`OBJECTIVE COMPLETE: ${text}. Reach the REBOOT terminal.`);
    Sfx.secret();
    quip('objective', 1, true);
  }

  function fail(L, reason) {
    const o = L.obj;
    if (o.failed || o.done || P.dead) return;
    o.failed = true;
    L.failReason = reason;
    P.dead = true; P.deadT = 0; firing = false;
    Sfx.playerDeath();
  }

  // Waves for the defense and firmware objectives: monsters coming from out of sight.
  function spawnAround(L, cx, cy, n) {
    const types = [...new Set(L.enemies.filter((e) => !ETYPES[e.type].boss && e.type !== 'thief').map((e) => e.type))];
    if (!types.length) types.push('bug');
    for (let k = 0; k < n; k++) {
      for (let t = 0; t < 30; t++) {
        const x = (cx + (Math.random() - 0.5) * 20) | 0, y = (cy + (Math.random() - 0.5) * 20) | 0;
        if (x < 1 || y < 1 || x >= L.w - 1 || y >= L.h - 1) continue;
        const i = y * L.w + x, d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (L.map[i] || L.block[i] || L.flow[i] < 0 || d < 6 || hasLOS(x + 0.5, y + 0.5, P.x, P.y)) continue;
        const e = spawnEnemy(types[(Math.random() * types.length) | 0], x + 0.5, y + 0.5);
        e.alerted = true; e.state = 'chase';
        addFx(x + 0.5, y + 0.5, 'plasmaHit', 0.5, 0.4, 1);
        break;
      }
    }
  }

  function update(L, dt) {
    const o = L.obj;
    if (!o || o.done || o.failed || P.dead) return;
    switch (o.type) {
      case 'overheat': {
        o.left -= dt;
        if (o.repair) {
          const u = o.repair;
          if (!(keys.KeyE || keys.Space) || !near(P.x, P.y, u.x + 0.5, u.y + 0.5, 1.9)) { o.repair = null; msg('Repair interrupted!'); break; }
          u.prog = (u.prog || 0) + dt / 3;
          if ((u.prog * 6 | 0) !== ((u.prog - dt / 3) * 6 | 0)) Sfx.click();
          if (u.prog >= 1) {
            o.repair = null; o.fixed++;
            setTile(L, u.x, u.y, 'C');
            Sfx.key();
            msg(`CRAC unit repaired (${o.fixed}/${o.units.length})`);
            if (o.fixed >= o.units.length) complete(L, 'the cooling is back');
          }
        }
        // the heat starts to hurt in the last minute
        if (o.left < 60) { o.burnT += dt; if (o.burnT > 2) { o.burnT = 0; damagePlayer(2, P.x, P.y); } }
        if (o.left <= 0) fail(L, 'THERMAL SHUTDOWN: the servers cooked before the AC came back.');
        break;
      }
      case 'ransom':
        o.left -= dt;
        if (o.left <= 0) fail(L, 'ENCRYPTION COMPLETE: the ransom note is now the only file left.');
        break;
      case 'evac':
        o.left -= dt;
        o.sirenT = (o.sirenT || 0) - dt;
        if (o.sirenT <= 0) { Sfx.alarm(); o.sirenT = o.left < 60 ? 1 : 2.5; }
        if (o.left <= 0) fail(L, 'GAS RELEASED: the fire suppression system did its job. On you.');
        break;
      case 'defend': {
        if (!o.started) break;
        o.left -= dt;
        const rx = o.rack.x + 0.5, ry = o.rack.y + 0.5;
        o.spawnT -= dt;
        if (o.spawnT <= 0) { spawnAround(L, rx, ry, 2 + (Math.random() < 0.5 ? 1 : 0)); o.spawnT = 9; }
        for (const e of L.enemies) if (alive(e) && near(e.x, e.y, rx, ry, 1.7)) o.hp -= 7 * dt;
        if (o.hp <= 0) fail(L, 'PROD IS DOWN: the database went offline and took the company with it.');
        else if (o.left <= 0) complete(L, 'failover complete, the PROD DB survived');
        break;
      }
      case 'firmware': {
        let active = null;
        for (const z of o.zones) if (z.prog < 1 && near(P.x, P.y, z.x, z.y, 0.85)) active = z;
        if (active) {
          const before = active.prog;
          active.prog = Math.min(1, active.prog + dt / 20);
          if ((before * 4 | 0) !== (active.prog * 4 | 0)) Sfx.click();
          o.spawnT -= dt;
          if (o.spawnT <= 0) { spawnAround(L, active.x, active.y, 1); o.spawnT = 7; }
          if (active.prog >= 1) {
            const n = o.zones.filter((z) => z.prog >= 1).length;
            Sfx.key();
            msg(`Firmware upload ${n}/${o.zones.length} complete`);
            if (n >= o.zones.length) complete(L, 'all firmware updated');
          }
        }
        break;
      }
      default: break;
    }
  }

  // AI of the data thief: waits until he spots the admin, then runs to the exit,
  // opening any door on his way (he has every badge).
  function thief(L, e, dt) {
    const o = L.obj, T = ETYPES.thief;
    if (!o || o.type !== 'thief' || o.done || o.failed) return;
    e.animT += dt;
    const dP = Math.hypot(P.x - e.x, P.y - e.y);
    if (e.shrunk > 0) { e.shrunk -= dt; return; }   // compressed: can't run
    if (!e.fleeing) {
      // he bolts when the admin gets close, sees him or shoots him
      const hit = e.state !== 'idle';
      e.state = 'idle';
      if (hit || dP < 7 || (e.sees = hasLOS(e.x, e.y, P.x, P.y) && dP < 14)) {
        e.fleeing = true; e.state = 'chase';
        msg('The DATA THIEF spotted you: he is running for the exit!');
        quip('thief', 1, true);
      }
      return;
    }
    if (e.painT > 0) { e.painT -= dt; return; }
    const f = o.field, cx = e.x | 0, cy = e.y | 0, c = cy * L.w + cx;
    if (f[c] === 0) { fail(L, 'DATA EXFILTRATED: the customer database is on sale on the dark web.'); return; }
    // next cell: the neighbor closest to the exit
    let best = -1, bd = f[c] < 0 ? 1e9 : f[c];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = (cy + dy) * L.w + cx + dx;
      if (f[n] >= 0 && f[n] < bd) { bd = f[n]; best = n; }
    }
    if (best < 0) return;
    const d = L.doors[best];
    if (d && d.open < 0.9) { openDoor(d); return; }   // waits for the door
    const tx = (best % L.w) + 0.5, ty = ((best / L.w) | 0) + 0.5;
    const mx = tx - e.x, my = ty - e.y, md = Math.hypot(mx, my) || 1;
    const sp = T.speed * (dP < 5 ? 1.15 : 1) * dt;
    e.face = Math.atan2(my, mx);
    e.x += mx / md * Math.min(sp, md); e.y += my / md * Math.min(sp, md);
  }

  // E on a wall tile; true when the objective handled it.
  function use(L, x, y, ch) {
    const o = L.obj;
    if (!o || o.failed) return false;
    switch (ch) {
      case 'T':
        if (o.type !== 'backup') return false;
        if (!o.carried) { msg(`TAPE LIBRARY: ${o.stored}/${o.total} tapes restored. Bring the LTO tapes here.`); Sfx.deny(); return true; }
        o.stored += o.carried; o.carried = 0;
        Sfx.key();
        msg(`Tapes loaded: ${o.stored}/${o.total}`);
        if (o.stored >= o.total) complete(L, 'the backups are safe');
        return true;
      case 'O': {
        if (o.type !== 'overheat') return false;
        const u = o.units.find((k) => k.x === x && k.y === y);
        if (u && !o.repair) { o.repair = u; msg('Repairing the CRAC unit... hold E'); }
        return true;
      }
      case 'J':
        if (o.type !== 'power') return false;
        setTile(L, x, y, 'Q');
        o.on++;
        o.panels.forEach((p, k) => { if (p.x === x && p.y === y) for (const l of o.lamps) if (l.panel === k) L.ceil[l.i] = 1; });
        L.ambMul = 0.3 + 0.7 * o.on / o.panels.length;
        relight(L);
        Sfx.door(0);
        msg(`Power restored: ${o.on}/${o.panels.length} panels`);
        if (o.on >= o.panels.length) { o.dark = false; complete(L, 'the lights are back'); }
        return true;
      case 'E':
        if (o.type !== 'ransom') return false;
        setTile(L, x, y, 'U');
        o.cut++;
        Sfx.click(); Sfx.deny();
        msg(`Infected rack isolated (${o.cut}/${o.racks.length})`);
        if (o.cut >= o.racks.length) complete(L, 'the ransomware is contained');
        return true;
      case '8':
        if (o.type !== 'hotswap') return false;
        if (!o.carry) { msg('DISK FAIL: you need the SPARE disk to hot-swap it.'); Sfx.deny(); return true; }
        o.carry = false;
        setTile(L, x, y, 'R');
        complete(L, 'disk hot-swapped, the RAID is rebuilding');
        return true;
      case '9':
        if (o.type !== 'defend') return false;
        if (!o.started && !o.done) {
          o.started = true; o.spawnT = 3;
          Sfx.alarm();
          msg('FAILOVER STARTED: keep the PROD DB alive for 90 seconds!');
          quip('defend', 1, true);
        }
        return true;
      default: return false;
    }
  }

  function pickup(L, it) {
    const o = L.obj;
    if (it.type === 'l' && o.type === 'backup') {
      o.carried++;
      msg(`LTO tape picked up (${o.carried} carried, ${o.stored}/${o.total} restored)`);
      Sfx.pickup(); P.pickT = 0.25;
      return true;
    }
    if (it.type === 'h' && o.type === 'hotswap') {
      o.carry = true;
      if (INV.cur > 1) switchWeapon(INV.weapons[1] ? 1 : 0);
      msg('SPARE disk in hand: keyboard or pistol only until it is swapped in.');
      Sfx.weaponPickup(); P.pickT = 0.3;
      return true;
    }
    return false;
  }

  function kill(L, e) {
    const o = L.obj;
    if (o && o.type === 'thief' && e.type === 'thief') {
      L.items.push({ x: e.x, y: e.y, type: 'w', taken: false, drop: true });
      complete(L, 'the data thief is down, the disk is back');
    }
  }

  // Only the keyboard and the pistol while carrying the spare disk.
  const canHold = (L, i) => !(L.obj && L.obj.carry && i > 1);

  function done(L) {
    const o = L.obj;
    if (!o) return true;
    if (o.type === 'boss' || o.type === 'miniboss') return !L.bossAlive;
    return o.done;
  }

  function lockedText(L) {
    const o = L.obj;
    if (o.type === 'boss' || o.type === 'miniboss') return 'The system is locked! Destroy the boss.';
    return `The system is locked: ${hud(L).replace(/ {2,}/g, ' ')}`;
  }

  // One line for the HUD: what to do, progress, time left.
  function hud(L) {
    const o = L.obj;
    if (!o) return '';
    if (o.done) return 'OBJECTIVE COMPLETE: reach the REBOOT terminal';
    switch (o.type) {
      case 'backup': return `BACKUP: tapes ${o.stored}/${o.total} restored${o.carried ? `, ${o.carried} carried` : ''}`;
      case 'overheat': return `COOLING: CRAC ${o.fixed}/${o.units.length} repaired${o.repair ? ` (${Math.round((o.repair.prog || 0) * 100)}%)` : ''}  TEMP ${Math.round(100 - o.left / TIMED_S * 60)}C  ${fmt(o.left)}`;
      case 'power': return `POWER: panels ${o.on}/${o.panels.length} on`;
      case 'ransom': return `RANSOMWARE: racks ${o.cut}/${o.racks.length} isolated  ENCRYPTED ${Math.round((1 - o.left / TIMED_S) * 100)}%  ${fmt(o.left)}`;
      case 'hotswap': return o.carry ? 'HOT SWAP: bring the spare disk to the failed server' : 'HOT SWAP: find the SPARE disk';
      case 'defend': return o.started ? `DEFEND THE PROD DB: ${fmt(o.left)}  RACK ${Math.max(0, Math.round(o.hp))}%` : 'DEFEND: start the failover on the PROD DB rack';
      case 'firmware': {
        const n = o.zones.filter((z) => z.prog >= 1).length, act = o.zones.find((z) => z.prog > 0 && z.prog < 1);
        return `FIRMWARE: ${n}/${o.zones.length} zones${act ? `  upload ${Math.round(act.prog * 100)}%` : ''}`;
      }
      case 'evac': return `EVACUATE! Gas suppression in ${fmt(o.left)}`;
      case 'thief': return o.thief && o.thief.fleeing ? 'STOP THE DATA THIEF before he reaches the exit!' : 'Find the DATA THIEF';
      case 'miniboss': case 'boss': return L.bossAlive ? 'Destroy the guardian of the REBOOT terminal' : 'OBJECTIVE COMPLETE: reach the REBOOT terminal';
      default: return '';
    }
  }
  const TITLES = {
    backup: ['Restore the backups: bring the 5 LTO tapes to the tape library', 'Backups restored'],
    overheat: ['Repair the 3 broken CRAC units before the servers cook (5 min)', 'Cooling repaired'],
    power: ['Power outage: switch the 3 MAIN POWER panels back on', 'Power restored'],
    ransom: ['Unplug the 6 infected racks before the encryption completes (5 min)', 'Ransomware contained'],
    hotswap: ['Hot-swap the failed disk: bring the SPARE disk to the failed server', 'Disk hot-swapped'],
    defend: ['Start the failover on the PROD DB rack and keep it alive for 90 s', 'PROD DB saved'],
    firmware: ['Stand in the 3 upload zones until each firmware upload completes', 'Firmware updated'],
    evac: ['Fire alarm: reach the REBOOT terminal before the gas is released (5 min)', 'Evacuated'],
    thief: ['Stop the data thief before he reaches the exit with the disk', 'Data thief stopped'],
    miniboss: ['Destroy the mini-boss guarding the REBOOT terminal', 'Mini-boss destroyed'],
    boss: ['Destroy the boss guarding the REBOOT terminal', 'Boss destroyed'],
  };
  // The objective in one sentence (briefing), or its short name once done (level stats).
  const title = (L, short) => (TITLES[L.obj ? L.obj.type : 'evac'] || TITLES.evac)[short ? 1 : 0];

  // Red flashes of the fire alarm (opacity of the overlay, 0 when none).
  function alarm(L) {
    const o = L.obj;
    if (!o || o.type !== 'evac' || o.done || o.failed) return 0;
    const k = Math.sin(L.time * (o.left < 60 ? 9 : 4)) * 0.5 + 0.5;
    return k * (o.left < 60 ? 0.16 : 0.07);
  }

  // true when the line should blink (time running out)
  const urgent = (L) => L.obj && !L.obj.done && 'overheat ransom evac'.includes(L.obj.type) && L.obj.left < 60;

  // Where to go, for the automap: [x, y, color].
  function markers(L) {
    const o = L.obj, out = [];
    if (!o || o.done) return out;
    const wall = (c, col) => out.push([c.x + 0.5, c.y + 0.5, col]);
    switch (o.type) {
      case 'backup': for (const it of L.items) if (it.type === 'l' && !it.taken) out.push([it.x, it.y, '#4fb4ff']); if (o.lib) wall(o.lib, '#3dff6a'); break;
      case 'overheat': for (const u of o.units) if (L.map[u.i] === 79) wall(u, '#ff3b3b'); break;
      case 'power': for (const p of o.panels) if (L.map[p.i] === 74) wall(p, '#ffe14a'); break;
      case 'ransom': for (const r of o.racks) if (L.map[r.i] === 69) wall(r, '#ff3b3b'); break;
      case 'hotswap': if (!o.carry) for (const it of L.items) if (it.type === 'h' && !it.taken) out.push([it.x, it.y, '#ffe14a']); if (o.server) wall(o.server, '#ff3b3b'); break;
      case 'defend': if (o.rack) wall(o.rack, '#3dff6a'); break;
      case 'firmware': for (const z of o.zones) if (z.prog < 1) out.push([z.x, z.y, '#20e8ff']); break;
      case 'thief': if (o.thief && alive(o.thief)) out.push([o.thief.x, o.thief.y, '#ff9a1a']); break;
      default: break;
    }
    return out;
  }

  return { init, update, thief, use, pickup, kill, canHold, done, lockedText, hud, urgent, markers, title, alarm, TIMED_S };
})();
