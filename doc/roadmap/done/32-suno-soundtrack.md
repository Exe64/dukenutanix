---
plan:
  id: '32'
  name: 32-suno-soundtrack.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/32-suno-soundtrack.md
status: done
enriched: 2026-11-03
date: 2026-11-03
description: >
  Bande-son générée avec Suno (10 thèmes, 2 versions chacun) à la place de la musique procédurale, qui reste en secours.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: []
labels: [feature]
scope:
  modules:
    - js/audio.js
    - js/game.js
    - music/
    - tools/encode-music.js
    - tools/build-web.js
    - js/music.js
    - index.html
    - README.md
issue:
  id: 32
  url: https://github.com/Exe64/dukenutanix/issues/32
---

# [🎸] Plan #32 - Bande-son Suno

## Objectif

Remplacer la musique procédurale par des morceaux générés avec Suno, un par moment du jeu, en gardant le tracker comme secours pour tout thème sans fichier.

## Périmètre

### Inclus
- 10 thèmes : `ep0`–`ep4`, `ovh`, `boss`, `metal`, et les nouveaux `title` (écran titre, menus) et `defend` (90 s de failover), 2 versions chacun (`<thème>-a.mp3`, `<thème>-b.mp3`).
- Lecture via `<audio>` : versions enchaînées A → B → A, fondu de 1,5 s entre thèmes, musique baissée sous les voix, MUSIC ON/OFF, volume et N respectés, reprise après le premier geste si l'autoplay bloque.
- `tools/encode-music.js` (ffmpeg) ; `build-web` copie `music/` ; README.

### Hors scope
- Bruitages ElevenLabs (plan #33).
- Musique dynamique selon l'intensité du combat.

## Étapes

- [x] Étape 1 — Lecteur `<audio>` dans `audio.js` : A → B, fondu, volume (ON/OFF, N, baisse sous les voix), secours tracker, reprise après geste (M · standard → Sonnet)
- [x] Étape 2 — Thèmes `title` et `defend` dans `updateMusic`, avec leurs thèmes de secours dans le tracker (S · standard → Sonnet)
- [x] Étape 3 — `tools/encode-music.js` (MP3 stéréo 96 kbit/s, 2:30 max) ; `build-web` copie `music/` (S · standard → Sonnet)
- [x] Étape 4 — Opérateur : 10 prompts Suno, 20 exports déposés dans `music/src/`, encodage (XS · standard → Sonnet)
- [x] Étape 5 — README : crédit Suno, `music/`, poids de l'app (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Source | Suno, morceaux instrumentaux, prompts par thème (voir ci-dessous) | Régénération complète avec des prompts adaptés aux moments du jeu |
| Embarquement | MP3 séparés dans `music/`, pas de base64 | ~35 Mo : un JS de cette taille serait trop lourd à charger |
| Lecteur | `<audio>` (pas `fetch` + Web Audio) | Marche en `file://` |
| Format | MP3 stéréo 96 kbit/s, coupé à 2:30 avec fondu de fin | ~35 Mo pour 20 fichiers au lieu de ~90 Mo |
| Stockage | Dans git, sans LFS | 35 Mo ne justifient pas de compliquer clone et CI |
| Versions | Toutes les versions d'un thème jouées à tour de rôle (1 → 2 → … → 1), une seule boucle | L'opérateur a livré 1 à 4 versions selon le thème (`dn-ovh01`…`04`, `dn-defend` seul) |
| Nommage | Exports `[dn-]<thème>[<nn>]`, encodés en `music/<thème>-<n>.mp3` ; manifeste `js/music.js` (nombre de versions) | Suit la convention de l'opérateur ; en `file://` le jeu ne peut pas lister `music/` |
| Fondu | Calculé sur le temps réellement écoulé (pas 50 ms supposés) | Les minuteurs prennent du retard quand une frame est lourde (vu en headless : ~1 passage/s) |
| Musique de l'écran titre | `Sfx.init()` au premier geste (clic ou touche) | Le navigateur bloque l'audio avant un geste |
| Transition | Fondu enchaîné 1,5 s | Choix de cadrage |
| Secours | Tracker procédural pour tout thème sans fichier | Code existant ; l'intégration marche avant la génération |

### Prompts Suno (Instrumental activé ; champ Lyrics : `[Intro: short] [Main Theme] [Variation] [Breakdown] [Main Theme] [End: hard stop]`)

| Thème | Style |
|---|---|
| `ep0` | 90s PC shooter soundtrack, groove metal, gritty FM synth bass, chugging palm-muted riffs, 115 BPM, dark industrial datacenter mood, punchy drums, steady driving loop |
| `ep1` | cold industrial metal, icy FM synth pads, mechanical fan-like hi-hats, mid-tempo 120 BPM, chilly metallic atmosphere, chugging guitars, retro 90s FPS game music |
| `ep2` | electro-industrial metal, glitchy sequenced synth arpeggios, data-stream bleeps, tight syncopated riffs, 128 BPM, tense and busy, 90s cyber shooter soundtrack |
| `ep3` | dark ambient doom metal, slow heavy riffs, eerie tape-warble synth drones, distant mechanical clicks, 85 BPM, ominous and creepy, 90s horror shooter soundtrack |
| `ep4` | epic industrial thrash metal, massive wide synth pads, galloping riffs, double kick bursts, 135 BPM, vast and menacing, final-episode 90s FPS soundtrack |
| `ovh` | upbeat 90s arcade rock, catchy FM synth lead melody, bright crunchy guitars, bouncy bass, 124 BPM, cheeky and fun, retro bonus-level shooter soundtrack, French touch flavor |
| `boss` | boss battle, symphonic industrial metal, dark choir stabs, double kick drums, heavy distorted synth bass, 150 BPM, epic and menacing, relentless |
| `metal` | over-the-top heavy metal anthem, shredding guitar solos, lightning-fast double bass drums, power chords, 170 BPM, triumphant and unhinged, 80s metal guitar hero energy |
| `defend` | urgent darksynth, ticking clock rhythm, frantic electro-industrial, siren-like synth leads, 160 BPM, rising tension, countdown adrenaline rush |
| `title` | moody 90s PC game main menu theme, slow heavy groove, FM synth bass, ominous server-room hum, 95 BPM, cool and confident, short loopable |

## Tests

### Prérequis pour les tests

```bash
cd /srv/dev/dukenutanix
```

### Procédure de test

```bash
D=<scratchpad>/pw   # Playwright 1.64.1 + libs Chromium (mémoire playwright-on-el10)
export LD_LIBRARY_PATH=$D/libs/usr/lib64 NODE_PATH=$D/pw/node_modules
node tools/encode-music.js                           # music/src -> music/ + js/music.js
node $D/music-test.js /srv/dev/dukenutanix           # lecteur avec les vrais fichiers
node tools/validate-levels.js
node tools/smoke-test.js
node tools/build-web.js && ls dist/music             # 19 fichiers, pas de src/
```

`music-test.js` (scratchpad) : écran titre avant et après un clic, briefing, E1M1 (fondu), réplique de l'admin avec un clip injecté (baisse), N, MUSIC OFF, objectif defend simulé, thème sans fichier (tracker), changement de thème. En headless, l'horloge audio avance 20 à 40 fois plus vite que le temps réel et les minuteurs tournent ~1 fois/s : la baisse se lit sur les relevés successifs de `musicState.duck`.

**Résultats attendus :** pas de musique avant le premier geste, puis `title-1.mp3`. Silence au briefing (fondu de sortie). `ep0-1.mp3` monte en fondu jusqu'à 0,35. Baisse à 0,35 × pendant une réplique de l'admin. Volume 0 avec N et avec MUSIC OFF. Thème `defend` pendant le failover. Tracker (notes jouées) pour un thème sans fichier. Aucune erreur de page. Niveaux et smoke-test OK. `dist/music` sans `src/`.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-11-03 | `encode-music.js` | 19 exports encodés, ~35 Mo, manifeste | 19 fichiers, 36,4 Mo, 150 s chacun ; `MUSIC = { ep0: 2, ep1: 2, ep2: 2, ep3: 2, ep4: 2, ovh: 4, boss: 2, metal: 1, defend: 1, title: 1 }` | ✅ |
| 2026-11-03 | Écran titre | Rien avant geste, `title-1.mp3` après | Avant : aucun thème ; après clic : `title-1.mp3`, volume 0,35 | ✅ |
| 2026-11-03 | Briefing puis E1M1 | Fondu de sortie, puis `ep0-1.mp3` en fondu | Briefing : thème nul, 1 piste en sortie ; E1M1 : 0,117 → 0,233 → 0,35 | ✅ |
| 2026-11-03 | Baisse sous une réplique | `duck` 0,35 pendant le clip, puis 1 | 1 → 0,35 → 1 (horloge audio accélérée en headless) | ✅ |
| 2026-11-03 | N / MUSIC OFF | Volume 0 | 0 / 0 | ✅ |
| 2026-11-03 | Failover (defend) | Thème `defend` | `defend` | ✅ |
| 2026-11-03 | Thème sans fichier | Tracker | Pas de fichier, 108 notes jouées | ✅ |
| 2026-11-03 | Erreurs de page | Aucune | Aucune | ✅ |
| 2026-11-03 | `validate-levels.js` | Levels OK | Levels OK (1 733 ms) | ✅ |
| 2026-11-03 | `smoke-test.js` | OK dans les deux styles | modern OK, retro OK | ✅ |
| 2026-11-03 | `build-web.js` | `dist/music` : 19 fichiers, sans `src/` | 19 fichiers, 37 Mo, pas de `src/` | ✅ |

## Journal de session

### Session 2026-11-03
- ✅ Fait : cadrage, prompts Suno, issue #32, plan créé.
- ✅ Fait : étapes 1 à 5 en one-shot. L'opérateur avait déjà déposé 19 exports Suno (`dn-*.mp3`, 3 à 6 min, 130 Mo) : déplacés dans `music/src/`, encodeur et lecteur adaptés à son nommage et à un nombre de versions variable. 🧪 Tests PASS.
- ✅ Validation : écoute en jeu validée par l'opérateur (volume conservé, `FILE_GAIN = 1`) ; commit 15bdc44 ; plan clôturé.
