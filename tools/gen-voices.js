#!/usr/bin/env node
// Records the game's spoken lines with ElevenLabs and embeds them in js/voices.js
// (text -> base64 MP3), the clips Sfx.voice plays instead of the browser's speech synthesis.
// The lines are read from js/game.js (QUIPS, ENEMY_LINES, bossShout), never copied here.
// Each take goes through ffmpeg (80 Hz high-pass, a little low-end, compression, -14 LUFS)
// into a mono 48 kbps MP3. Raw takes are cached in tools/.voice-cache/, so a rerun only pays
// for new or changed lines; --redo throws away the takes of the lines matching a text.
//
// Usage:
//   node tools/gen-voices.js --dry               lists the lines per voice and the characters billed
//   node tools/gen-voices.js --test              3 lines per voice, MP3s left in the cache to listen to
//   node tools/gen-voices.js                     every line, then writes js/voices.js
//   node tools/gen-voices.js --redo "SLA"        new takes for the lines containing "SLA"
// Environment: ELEVENLABS_API_KEY, and the voice ID of each group (VOICE_ADMIN, VOICE_BOSS,
// VOICE_AWS, VOICE_AZURE, VOICE_GCP); a group without its ID keeps the clips it already has.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const cache = path.join(__dirname, '.voice-cache');
const outFile = path.join(root, 'js', 'voices.js');
const args = process.argv.slice(2);
const dry = args.includes('--dry'), test = args.includes('--test');
const redo = args.includes('--redo') ? args[args.indexOf('--redo') + 1] : null;

// What the TTS reads instead of the subtitle text: acronyms spelled out, numbers said the IT way.
const SAY = [
  [/\bCtrl\b/g, 'Control'], [/\b404\b/g, 'four-oh-four'],
  [/\bSLA\b/g, 'S-L-A'], [/\bUPS\b/g, 'U-P-S'], [/\bAC\b/g, 'A-C'],
];
// stability low = more acted; style high = more punch. The boss uses eleven_v3 for its audio
// tags (cue): it shouts rather than reads; v3 only takes a stability of 0, 0.5 or 1.
const GROUPS = {
  admin: { env: 'VOICE_ADMIN', stability: 0.35, style: 0.65 },
  boss: { env: 'VOICE_BOSS', stability: 0, style: 1, model: 'eleven_v3', cue: (t) => `[furious] [shouting] ${t}!!!` },
  aws: { env: 'VOICE_AWS', stability: 0.4, style: 0.5 },
  azure: { env: 'VOICE_AZURE', stability: 0.4, style: 0.5 },
  gcp: { env: 'VOICE_GCP', stability: 0.4, style: 0.5 },
};
const FILTER = 'highpass=f=80,equalizer=f=150:width_type=h:width=100:g=3,'
  + 'acompressor=threshold=-18dB:ratio=4:attack=5:release=50,loudnorm=I=-14:TP=-1.5:LRA=11';

// [{ group, text }] from js/game.js
function readLines() {
  const src = fs.readFileSync(path.join(root, 'js', 'game.js'), 'utf8');
  const obj = (name) => new Function(`return ${src.match(new RegExp(`const ${name} = (\\{[\\s\\S]*?\\n\\});`))[1]}`)();
  const lines = [];
  for (const list of Object.values(obj('QUIPS'))) for (const text of list) lines.push({ group: 'admin', text });
  for (const [, text] of src.matchAll(/bossShout\('([^']+)'\)/g)) lines.push({ group: 'boss', text });
  for (const [type, kinds] of Object.entries(obj('ENEMY_LINES'))) {
    for (const list of Object.values(kinds)) for (const text of list) lines.push({ group: type === 'architect' ? 'aws' : type, text });
  }
  return lines;
}

function readVoices() {
  if (!fs.existsSync(outFile)) return {};
  return new Function(`${fs.readFileSync(outFile, 'utf8')}; return VOICES;`)();
}

const model = (g) => g.model || 'eleven_multilingual_v2';
const spoken = (text, g = {}) => (g.cue || ((t) => t))(SAY.reduce((t, [re, s]) => t.replace(re, s), text));
// a take is keyed by voice, line and model: another voice or model records it again, --redo forces it
const takePath = (voiceId, g, text) => path.join(cache,
  `${voiceId}-${crypto.createHash('sha1').update(text).digest('hex').slice(0, 10)}${g.model ? `-${g.model}` : ''}.mp3`);

async function record(voiceId, g, text, file) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: spoken(text, g), model_id: model(g),
      voice_settings: { stability: g.stability, similarity_boost: 0.8, style: g.style, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status} on "${text}": ${await res.text()}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

// raw take -> filtered mono 48 kbps MP3, as base64
function master(file) {
  const out = file.replace(/\.mp3$/, '.out.mp3');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-af', FILTER, '-ac', '1', '-ar', '44100', '-b:a', '48k', out]);
  return fs.readFileSync(out).toString('base64');
}

async function main() {
  let lines = readLines();
  if (dry) {
    for (const name of Object.keys(GROUPS)) {
      const own = lines.filter((l) => l.group === name), g = GROUPS[name];
      console.log(`${name} (${g.env}, ${model(g)}): ${own.length} lines, ${own.reduce((n, l) => n + spoken(l.text, g).length, 0)} characters`);
      for (const l of own) console.log(`  ${spoken(l.text, g)}`);
    }
    console.log(`total: ${lines.length} lines, ${lines.reduce((n, l) => n + spoken(l.text, GROUPS[l.group]).length, 0)} characters`);
    return;
  }
  if (!process.env.ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY is not set');
  // checked before any paid take is recorded
  if (!test) try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch (e) { throw new Error('ffmpeg is not installed (needed to master the takes)'); }
  fs.mkdirSync(cache, { recursive: true });
  if (test) lines = Object.keys(GROUPS).flatMap((name) => lines.filter((l) => l.group === name).slice(0, 3));
  const voices = readVoices(), known = new Set(readLines().map((l) => l.text));
  for (const text of Object.keys(voices)) if (!known.has(text)) delete voices[text];   // lines removed from the game
  for (const l of lines) {
    const voiceId = process.env[GROUPS[l.group].env];
    if (!voiceId) continue;
    const file = takePath(voiceId, GROUPS[l.group], l.text);
    if (redo && l.text.includes(redo)) fs.rmSync(file, { force: true });
    if (!fs.existsSync(file)) { console.log(`recording [${l.group}] ${l.text}`); await record(voiceId, GROUPS[l.group], l.text, file); }
    if (test) { console.log(`  ${file}`); continue; }
    voices[l.text] = master(file);
  }
  if (test) return console.log('test takes ready: listen to them, then run without --test');
  const body = Object.keys(voices).sort().map((t) => `  ${JSON.stringify(t)}: '${voices[t]}',`).join('\n');
  fs.writeFileSync(outFile, `'use strict';\n/* Recorded voice lines: spoken text -> base64 MP3. Generated by tools/gen-voices.js, do not edit. */\nconst VOICES = {\n${body}\n};\n`);
  const missing = readLines().filter((l) => !voices[l.text]);
  console.log(`js/voices.js: ${Object.keys(voices).length} clips, ${(fs.statSync(outFile).size / 1048576).toFixed(2)} MB`
    + (missing.length ? `; ${missing.length} lines without a clip (speech synthesis for the admin, silent for the technicians)` : ''));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
