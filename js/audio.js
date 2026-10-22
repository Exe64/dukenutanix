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

  // A sound from point p ({x, y}, or none: at the player) gets [volume, pan]: the
  // volume falls off with distance, the pan follows the side it comes from
  // (screen right is the player's angle + 90 degrees); close sounds stay centered.
  function at(p) {
    if (!p) return [1, 0];
    const dx = p.x - P.x, dy = p.y - P.y, d = Math.hypot(dx, dy);
    return [Math.max(0, 1 - d / 18), Math.sin(Math.atan2(dy, dx) - P.a) * 0.8 * Math.min(1, d)];
  }

  return {
    init,
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
