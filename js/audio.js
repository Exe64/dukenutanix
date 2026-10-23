'use strict';
/* Sounds are 100% synthesized with the Web Audio API: no audio files. */
const Sfx = (() => {
  let ac = null, master = null, noiseBuf = null, hum = null;
  let muted = false;

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = 0.55;
    master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    startHum();
  }

  // Datacenter fan hum (filtered noise + 50 Hz mains hum).
  function startHum() {
    const src = ac.createBufferSource();
    src.buffer = noiseBuf; src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 380;
    const g = ac.createGain(); g.gain.value = 0.05;
    src.connect(lp); lp.connect(g); g.connect(master);
    src.start();
    const osc = ac.createOscillator();
    osc.type = 'sine'; osc.frequency.value = 50;
    const og = ac.createGain(); og.gain.value = 0.025;
    osc.connect(og); og.connect(master);
    osc.start();
    hum = { g, og };
  }

  function env(g, t, a, peak, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  // Output of a sound: straight to the master, or through a stereo panner (pn in -1..1).
  function out(pn) {
    if (!pn || !ac.createStereoPanner) return master;
    const p = ac.createStereoPanner();
    p.pan.value = pn;
    p.connect(master);
    return p;
  }

  function noise(dur, f0, f1, vol, type = 'lowpass', q = 1, pn = 0) {
    if (!ac || muted || vol <= 0.01) return;
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuf;
    const f = ac.createBiquadFilter();
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ac.createGain();
    env(g, t, 0.004, vol, dur);
    src.connect(f); f.connect(g); g.connect(out(pn));
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  function tone(type, f0, f1, dur, vol, delay = 0, pn = 0) {
    if (!ac || muted || vol <= 0.01) return;
    const t = ac.currentTime + delay;
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ac.createGain();
    env(g, t, 0.005, vol, dur);
    o.connect(g); g.connect(out(pn));
    o.start(t); o.stop(t + dur + 0.05);
  }

  /* ---------------------------------------------------------------- music */
  // A small tracker: 16 steps per bar, a bass line, an arpeggio over a chord
  // progression and a drum pattern per theme, all synthesized. Notes are scheduled
  // a little ahead on the audio clock, so the tempo stays steady whatever the frame
  // rate. The music has its own volume (musicGain) under the master (N mutes both).
  // Theme: bpm, root (MIDI note), minor or major scale degrees, chord roots (one per
  // bar, in scale degrees), bass rhythm, arpeggio rhythm, kick / snare / hat patterns.
  const MIN = [0, 2, 3, 5, 7, 8, 10], MAJ = [0, 2, 4, 5, 7, 9, 11];
  const THEMES = {
    ep0: { bpm: 112, root: 45, scale: MIN, chords: [0, 5, 3, 4], bass: 'x.x.x.xxx.x.x.x.', arp: 'x.xx.xx.x.xx.xx.', kick: 'x...x...x...x...', snare: '....x.......x...', hat: '..x...x...x...x.' },
    ep1: { bpm: 100, root: 43, scale: MIN, chords: [0, 3, 5, 4], bass: 'x..x..x.x..x..x.', arp: 'x.x.x.x.x.x.x.x.', kick: 'x.....x.x.......', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.' },
    ep2: { bpm: 128, root: 47, scale: MIN, chords: [0, 0, 5, 6], bass: 'xxx.xxx.xxx.x.x.', arp: 'xxxxxxxxxxxxxxxx', kick: 'x...x...x...x...', snare: '....x.......x..x', hat: '.xxx.xxx.xxx.xxx' },
    ep3: { bpm: 88, root: 40, scale: MIN, chords: [0, 5, 6, 4], bass: 'x.......x.x.....', arp: 'x...x...x...x...', kick: 'x.......x.......', snare: '........x.......', hat: '....x.......x...' },
    ep4: { bpm: 120, root: 48, scale: MAJ, chords: [0, 4, 5, 3], bass: 'x.x.x.x.x.x.x.x.', arp: 'x.xxx.xxx.xxx.xx', kick: 'x..x..x.x..x..x.', snare: '....x.......x...', hat: 'xxxxxxxxxxxxxxxx' },
    boss: { bpm: 140, root: 38, scale: MIN, chords: [0, 1, 0, 6], bass: 'xxxxxxxxxxxxxxxx', arp: 'x.x.xx.xx.x.xx.x', kick: 'x.x.x.x.x.x.x.x.', snare: '....x..x....x..x', hat: '.x.x.x.x.x.x.x.x' },
  };
  const midi = (n) => 440 * 2 ** ((n - 69) / 12);
  let musicGain = null, musicVol = 0.35, musicOn = true, theme = null, themeName = null, step = 0, nextT = 0, timer = null;
  const notesPlayed = { n: 0 };   // for the automated tests
  function mtone(type, f, t, dur, vol, cut) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    if (cut) { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cut; o.connect(lp); lp.connect(g); } else o.connect(g);
    g.connect(musicGain); o.start(t); o.stop(t + dur + 0.02);
    notesPlayed.n++;
  }
  function mnoise(t, dur, vol, type, f) {
    const src = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = noiseBuf; flt.type = type; flt.frequency.value = f;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt); flt.connect(g); g.connect(musicGain); src.start(t, Math.random()); src.stop(t + dur + 0.02);
    notesPlayed.n++;
  }
  function playStep(t) {
    const th = theme, s = step % 16, bar = Math.floor(step / 16) % th.chords.length;
    const deg = th.chords[bar], sc = th.scale, note = (d) => th.root + sc[((d % 7) + 7) % 7] + 12 * Math.floor(d / 7);
    const sixteenth = 60 / th.bpm / 4;
    if (th.bass[s] === 'x') mtone('sawtooth', midi(note(deg) - 12), t, sixteenth * 1.6, 0.22, 700);
    if (th.arp[s] === 'x') mtone('square', midi(note(deg + [0, 2, 4, 7][s % 4]) + 12), t, sixteenth * 0.9, 0.06, 2600);
    if (th.kick[s] === 'x') { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); o.connect(g); g.connect(musicGain); o.start(t); o.stop(t + 0.2); notesPlayed.n++; }
    if (th.snare[s] === 'x') mnoise(t, 0.14, 0.22, 'bandpass', 1800);
    if (th.hat[s] === 'x') mnoise(t, 0.04, 0.08, 'highpass', 7000);
  }
  function schedule() {
    if (!theme || !ac) return;
    while (nextT < ac.currentTime + 0.12) { playStep(nextT); nextT += 60 / theme.bpm / 4; step++; }
  }
  // music(name): a theme of THEMES (ep0..ep4, boss), or null to stop; same name = no restart
  function music(name) {
    if (!ac || name === themeName) return;
    themeName = name; theme = name ? THEMES[name] : null; step = 0; nextT = ac.currentTime + 0.05;
    if (!musicGain) { musicGain = ac.createGain(); musicGain.connect(master); }
    musicGain.gain.value = musicOn ? musicVol : 0;
    if (theme && !timer) timer = setInterval(schedule, 25);
    if (!theme && timer) { clearInterval(timer); timer = null; }
  }
  function setMusic(on, vol) {
    musicOn = on; if (vol !== undefined) musicVol = vol;
    if (musicGain) musicGain.gain.value = musicOn ? musicVol : 0;
  }

  // A sound from point p ({x, y}, or none: at the player) gets [volume, pan]: the
  // volume falls off with distance, the pan follows the side it comes from
  // (screen right is the player's angle + 90 degrees); close sounds stay centered.
  function at(p) {
    if (!p) return [1, 0];
    const dx = p.x - P.x, dy = p.y - P.y, d = Math.hypot(dx, dy);
    return [Math.max(0, 1 - d / 18), Math.sin(Math.atan2(dy, dx) - P.a) * 0.8 * Math.min(1, d)];
  }

  return {
    init, music, setMusic,
    get musicState() { return { theme: themeName, on: musicOn, vol: musicVol, gain: musicGain ? musicGain.gain.value : null, notes: notesPlayed.n }; },
    toggleMute() {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.55;
      return muted;
    },
    fist() { noise(0.12, 900, 200, 0.4); tone('square', 180, 60, 0.08, 0.15); },
    pistol() { noise(0.18, 3000, 300, 0.6); tone('square', 900, 120, 0.1, 0.18); },
    shotgun() { noise(0.45, 2200, 80, 0.9); tone('sawtooth', 160, 40, 0.3, 0.3); },
    chaingun() { noise(0.1, 3500, 400, 0.45); tone('square', 700, 200, 0.05, 0.1); },
    plasma() { tone('sawtooth', 1400, 300, 0.14, 0.18); tone('sine', 2200, 900, 0.1, 0.12); },
    click() { tone('square', 1200, 1100, 0.03, 0.1); },
    door(p) { const [v, pn] = at(p); noise(0.9, 300, 120, 0.35 * v, 'bandpass', 2, pn); tone('sawtooth', 70, 55, 0.8, 0.08 * v, 0, pn); },
    deny() { tone('square', 220, 200, 0.12, 0.2); tone('square', 160, 150, 0.2, 0.2, 0.13); },
    pickup() { tone('square', 660, 660, 0.06, 0.15); tone('square', 990, 990, 0.08, 0.15, 0.06); },
    weaponPickup() { tone('square', 440, 440, 0.08, 0.2); tone('square', 660, 660, 0.08, 0.2, 0.08); tone('square', 880, 880, 0.15, 0.2, 0.16); },
    key() { tone('triangle', 520, 520, 0.1, 0.3); tone('triangle', 780, 780, 0.1, 0.3, 0.1); tone('triangle', 1040, 1040, 0.2, 0.3, 0.2); },
    hurt() { tone('sawtooth', 300, 90, 0.25, 0.3); noise(0.2, 800, 200, 0.3); },
    playerDeath() { tone('sawtooth', 400, 40, 1.4, 0.4); noise(1.2, 1200, 60, 0.4); },
    alert(kind, p) {
      const [v, pn] = at(p);
      if (kind === 'bug') { tone('square', 120, 260, 0.2, 0.2 * v, 0, pn); noise(0.2, 4000, 1200, 0.2 * v, 'bandpass', 4, pn); }
      else if (kind === 'drone') { tone('sine', 500, 1600, 0.35, 0.18 * v, 0, pn); }
      else if (kind === 'bot') { tone('square', 200, 200, 0.12, 0.18 * v, 0, pn); tone('square', 150, 150, 0.2, 0.18 * v, 0.12, pn); }
      else { tone('sawtooth', 60, 40, 1.2, 0.5 * v, 0, pn); noise(1.2, 400, 60, 0.5 * v, 'lowpass', 1, pn); }
    },
    enemyPain(kind, p) { const [v, pn] = at(p); tone('square', kind === 'boss' ? 90 : 400, kind === 'boss' ? 60 : 180, 0.12, 0.2 * v, 0, pn); noise(0.1, 5000, 2000, 0.15 * v, 'highpass', 1, pn); },
    enemyDeath(kind, p) {
      const [v, pn] = at(p);
      if (kind === 'boss') { noise(2.5, 1500, 30, 0.9, 'lowpass', 1, pn); tone('sawtooth', 200, 20, 2.4, 0.5, 0, pn); return; }
      noise(0.5, 3000, 100, 0.5 * v, 'lowpass', 1, pn); tone('square', 600, 40, 0.45, 0.25 * v, 0, pn);
    },
    enemyShoot(kind, p) {
      const [v, pn] = at(p);
      if (kind === 'drone') tone('sine', 900, 200, 0.25, 0.2 * v, 0, pn);
      else if (kind === 'bot') { tone('square', 1200, 400, 0.08, 0.15 * v, 0, pn); noise(0.08, 3000, 800, 0.2 * v, 'lowpass', 1, pn); }
      else { tone('sawtooth', 300, 80, 0.5, 0.35 * v, 0, pn); noise(0.4, 1500, 200, 0.3 * v, 'lowpass', 1, pn); }
    },
    melee(p) { const [v, pn] = at(p); noise(0.15, 2000, 400, 0.4 * v, 'lowpass', 1, pn); },
    nutgun() { tone('square', 1800, 900, 0.05, 0.18); noise(0.12, 4000, 1500, 0.4, 'highpass'); tone('triangle', 2600, 2400, 0.08, 0.1, 0.03); },
    rivet() { tone('square', 1500, 900, 0.04, 0.12); noise(0.07, 5000, 1800, 0.3, 'highpass'); },
    rocket() { noise(0.6, 900, 200, 0.6); tone('sawtooth', 120, 60, 0.4, 0.25); },
    throw() { noise(0.15, 600, 300, 0.25, 'bandpass', 2); },
    bounce(p) { const [v, pn] = at(p); tone('square', 300, 200, 0.05, 0.15 * v, 0, pn); noise(0.05, 2000, 800, 0.15 * v, 'lowpass', 1, pn); },
    bigBoom(p) {
      const [a, pn] = at(p), v = Math.max(0.35, a);
      noise(1.4, 1200, 30, 1.0 * v, 'lowpass', 1, pn); tone('sawtooth', 90, 25, 1.0, 0.45 * v, 0, pn); tone('sine', 55, 30, 1.2, 0.5 * v, 0, pn);
    },
    shrink() { tone('sine', 1600, 200, 0.4, 0.25); tone('square', 800, 100, 0.35, 0.08); },
    squish() { noise(0.2, 900, 200, 0.4); tone('sine', 200, 60, 0.2, 0.3); },
    secret() { [392, 523, 659, 784, 1046].forEach((f, i) => tone('triangle', f, f, 0.2, 0.2, i * 0.07)); },
    nutanix() { [523, 784, 1046, 1568].forEach((f, i) => tone('square', f, f, 0.12, 0.16, i * 0.08)); tone('sine', 2093, 2093, 0.5, 0.15, 0.32); },
    slurp() { noise(0.4, 600, 1200, 0.25, 'bandpass', 4); tone('sine', 300, 500, 0.3, 0.1); },
    exit() { [523, 659, 784, 1046].forEach((f, i) => tone('square', f, f, 0.18, 0.2, i * 0.12)); },
    alarm() { tone('square', 880, 660, 0.35, 0.12); tone('square', 880, 660, 0.35, 0.12, 0.4); },
  };
})();
