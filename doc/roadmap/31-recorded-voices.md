---
plan:
  id: '31'
  name: 31-recorded-voices.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/31-recorded-voices.md
status: active
enriched: 2026-11-03
date: 2026-11-03
description: >
  Voix enregistrées (clips ElevenLabs embarqués) pour l'admin, les techniciens AWS / Azure / GCP, l'AWS Solutions Architect et THE OVH FOUNDER, à la place de la synthèse vocale du navigateur.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: []
labels: [feature]
scope:
  modules:
    - js/game.js
    - js/audio.js
    - js/voices.js
    - tools/gen-voices.js
    - index.html
    - README.md
issue:
  id: 31
  url: https://github.com/Exe64/dukenutanix/issues/31
---

# [🎙️] Plan #31 - Voix enregistrées

## Objectif

Remplacer la synthèse vocale du navigateur (voix différente selon l'OS, absente sous WebKitGTK donc muette dans l'AppImage Linux, hors Web Audio) par des clips générés une fois avec ElevenLabs et embarqués dans le jeu. En profiter pour faire parler les techniciens cloud du mod OVH.

## Périmètre

### Inclus
- Les 57 répliques existantes : 56 de l'admin (`QUIPS`), 1 de THE OVH FOUNDER (`bossShout`).
- Nouvelles répliques : AWS, Azure, GCP (environ 3 à l'alerte, 2 à la mort, une voix par fournisseur) et AWS Solutions Architect (2-3, voix AWS).
- `tools/gen-voices.js` : extraction des textes depuis `game.js`, table de prononciation, mode `--test`, API ElevenLabs, filtre FFmpeg, écriture de `js/voices.js`.
- `Sfx.voice` : lecture Web Audio, atténuation de la musique, N et V respectés, spatialisation des voix ennemies, repli sur `speechSynthesis`.
- README : section voix, Linux, attribution ElevenLabs, nuance sur « aucun asset externe ».

### Hors scope
- Voix du consultant et du SRE.
- Effet radio ou traitement en jeu de la voix de l'admin.
- Génération en CI (les clips sont versionnés ; régénérer demande un mois ElevenLabs).

## Étapes

- [x] Étape 1 — Répliques des techniciens et de l'Architect, validées par l'utilisateur avant génération (S · standard → Sonnet)
- [x] Étape 2 — `tools/gen-voices.js` : extraction, prononciation, `--test`, ElevenLabs, FFmpeg, `js/voices.js` (M · standard → Sonnet)
- [x] Étape 3 — `Sfx.voice` : décodage, atténuation musique, N/V, spatialisation, repli `speechSynthesis`, cri du boss ralenti sur `growl` (M · standard → Sonnet)
- [x] Étape 4 — Techniciens et Architect parlent à l'alerte et à la mort (probabilité, délai minimal partagé) (S · standard → Sonnet)
- [x] Étape 5 — Opérateur : souscription Starter, choix des 5 voix, `--test` puis lot complet ; intégration de `js/voices.js` (XS · standard → Sonnet)
- [x] Étape 6 — README et `index.html` (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [ ] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Moteur TTS | ElevenLabs, plan Starter (1 $ le premier mois) | Meilleur jeu d'acteur ; le plan Free n'a pas de licence commerciale |
| Qui génère | L'utilisateur, clé dans `ELEVENLABS_API_KEY` | La clé n'entre jamais dans le dépôt ni dans la session |
| Choix des voix | Voice Library, validées sur 3 répliques test par voix | Pas d'imitation d'un comédien réel |
| Langage du script | Node (comme `tools/smoke-test.js`) | Lit `game.js` sans dupliquer les textes |
| Source des textes | `QUIPS` et les nouveaux tableaux dans `game.js` | Un seul endroit ; la table de prononciation ne modifie jamais les sous-titres |
| Nommage des clips | Catégorie + hash du texte | Ajouter ou retirer une réplique ne décale pas les autres |
| Format | MP3 mono 48 kbit/s, -14 LUFS, compression FFmpeg | Décodé partout (Chromium, WebKitGTK, WKWebView), ~1 Mo pour ~80 clips |
| Embarquement | Base64 dans `js/voices.js` | `fetch` échoue en `file://` (smoke-test, ouverture directe) |
| Traitement en jeu | Aucun pour l'admin ; boss ralenti sur `Sfx.growl` | Choix de cadrage |
| Repli | `speechSynthesis` quand un clip manque | Les étapes 1-4 marchent avant toute génération |
| Clé des clips | Le texte exact de la réplique (pas de hash dans le jeu) | Aucun code de hachage côté jeu ; une réplique modifiée retombe sur la synthèse jusqu'à régénération |
| Techniciens sans clip | Muets (pas de synthèse, pas de sous-titre) | `speechSynthesis.cancel()` couperait l'admin ; leurs répliques sont de l'ambiance |
| Touche V | Coupe toutes les voix (admin, boss, techniciens) ; N coupe aussi les clips | Avant, N ne coupait pas la synthèse vocale |
| Fréquence des techniciens | 40 % à l'alerte et à la mort, 3 s de délai partagé, pas d'atténuation de la musique | Une escouade ne parle pas en chœur |
| Voix du boss | `eleven_v3`, stabilité 0, texte `[furious] [shouting] … !!!` | Avec `multilingual_v2`, le cri était lu au lieu d'être crié ; v3 interprète les indications de jeu |
| Garde ffmpeg | Le script vérifie ffmpeg avant toute prise payante | Sans ffmpeg, la première prise était payée puis le script plantait |
| Prises brutes | Cache local `tools/.voice-cache/` (ignoré par git), `--redo` pour refaire une prise | Une relance ne repaie que les répliques nouvelles ou changées |

## Tests

### Prérequis pour les tests

```bash
cd /srv/dev/dukenutanix
# Playwright hors dépôt (voir la mémoire playwright-on-el10) :
D=<scratchpad>/pw   # npm i playwright@1.64.1 dans $D/pw, libs Chromium extraites dans $D/libs
export LD_LIBRARY_PATH=$D/libs/usr/lib64 NODE_PATH=$D/pw/node_modules
```

### Procédure de test

```bash
node --check js/game.js && node --check js/audio.js && node --check js/voices.js
node tools/gen-voices.js --dry                       # liste et compte des répliques
ELEVENLABS_API_KEY= node tools/gen-voices.js         # doit refuser sans clé
node $D/voice-test.js /srv/dev/dukenutanix           # Sfx.voice avec un faux clip WAV injecté dans VOICES
node $D/decode-all.js /srv/dev/dukenutanix         # décode les 75 vrais clips, joue quip / bark / bossShout
node tools/validate-levels.js
node tools/smoke-test.js
```

`voice-test.js` (scratchpad) : lance E1M1, injecte un WAV de 1 s dans `VOICES` pour `QUIPS.kill`, les répliques AWS et le cri du boss, puis appelle `quip`, `bark` et `bossShout`. Il instrumente `AudioBufferSourceNode.start` et `AudioParam.setTargetAtTime` (en headless, `gain.value` ne reflète pas l'automation).

**Résultats attendus :** `Sfx.voice` renvoie `false` sans clip. Une réplique de l'admin avec un clip joue le clip à 1×, et la musique descend à 0,35 × 0,35 ≈ 0,122 puis remonte à 0,35. Les techniciens parlent environ 40 % du temps, sans toucher à la musique, et un ennemi hors mod ne parle pas. Le boss joue à 0,8× avec la musique atténuée. Aucune erreur de page. `validate-levels` et le smoke-test sont OK.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-11-03 | `node --check` (game, audio, voices) | Pas d'erreur | Pas d'erreur | ✅ |
| 2026-11-03 | `gen-voices.js --dry` | 75 répliques, ~2 400 caractères | admin 56 (1 786), boss 1 (22), aws 8 (220), azure 5 (164), gcp 5 (165) : 75, 2 357 caractères ; prononciations appliquées (four-oh-four, S-L-A, U-P-S, A-C, Control) | ✅ |
| 2026-11-03 | `gen-voices.js` sans clé | Refus | `ELEVENLABS_API_KEY is not set`, exit 1 | ✅ |
| 2026-11-03 | Repli sans clip | `Sfx.voice` = `false` | `false` ; `VOICES` vide au chargement | ✅ |
| 2026-11-03 | Réplique de l'admin avec clip | Clip joué, musique atténuée puis rétablie | Clip à 1× ; cibles 0,122 puis 0,35 | ✅ |
| 2026-11-03 | Techniciens (`bark`) | ~40 %, pas d'atténuation, pas de voix pour un ennemi hors mod | 15/40 ; aucune cible d'atténuation ajoutée ; `bug` muet | ✅ |
| 2026-11-03 | Cri du boss | Clip à 0,8× sur le grognement, musique atténuée | 0,8× ; cibles 0,122 puis 0,35 | ✅ |
| 2026-11-03 | Sourdine N | `voice` renvoie `true` (pas de repli sur la synthèse) | `true` | ✅ |
| 2026-11-03 | `validate-levels.js` | Levels OK | Levels OK (1 769 ms) | ✅ |
| 2026-11-03 | `smoke-test.js` | OK dans les deux styles, sans erreur | modern OK, retro OK, Smoke test OK | ✅ |
| 2026-11-03 | Génération complète (opérateur) | 75 clips, ~1 Mo | 75 clips pour 75 répliques, aucune manquante ni en trop, tous MP3, 958 Ko de MP3, `js/voices.js` 1,3 Mo | ✅ |
| 2026-11-03 | Décodage Chromium des 75 clips | 75 décodés | 75/75 ; 1,07 s (« Come to daddy. ») à 5,39 s ; 158 s au total | ✅ |
| 2026-11-03 | Lecture réelle `quip` / `bark` / `bossShout` | Admin 1×, Azure 1×, boss 0,8×, pas d'erreur | Admin 2,88 s à 1× ; Azure 1,9-2,32 s à 1× ; boss 2,48 s à 0,8× ; aucune erreur | ✅ |
| 2026-11-03 | Non-régression finale | Levels OK, smoke-test OK | Levels OK (1 606 ms) ; modern OK, retro OK | ✅ |

## Journal de session

### Session 2026-11-03
- ✅ Fait : cadrage, issue #31, plan créé. Étapes 1, 2, 3, 4 et 6 implémentées en one-shot et vérifiées avec un faux clip.
- ✅ Fait : voix choisies et validées par l'opérateur ; cri du boss passé sur `eleven_v3` ; garde ffmpeg ; génération complète (75 clips) ; 🧪 Tests finaux PASS.
- 📋 Prochain : ✅ Validation (écoute en jeu par l'opérateur, commit), puis clôture.
