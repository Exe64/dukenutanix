---
plan:
  id: '23'
  name: 23-procedural-music.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/23-procedural-music.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Séquenceur Web Audio façon tracker, un thème par épisode et un thème de boss, sans fichier audio.
priority: low
complexity: L
intent: null
depends_on: []
blocks: []
labels: [feature]
issue:
  id: 23
  url: https://github.com/Exe64/dukenutanix/issues/23
---

# [🎵] Plan #23 - Musique procédurale

## Objectif

Le jeu n'a pas de musique. Un séquenceur synthétisé garde l'esprit « zéro asset ».

## Périmètre

### Inclus
- `js/audio.js` : séquenceur (patterns, instruments synthétisés), bus musique séparé
- Un thème par épisode, un thème de boss
- Volume et coupure de la musique séparés des effets

### Hors scope
- Musique adaptative à l'action

## Étapes

- [x] Étape 1 — Séquenceur Web Audio façon tracker (L · reasoning → Opus)
- [x] Étape 2 — Un thème par épisode et un pour les boss (M · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Style (phase 6, Q1) | Boucles chiptune / tracker (carré, scie, bruit : basse, arpèges, batterie) | Identité rétro « zéro asset » ; musique adaptative hors scope |
| Volume (Q2) | Activée, environ 35 % du volume des effets ; MUSIC ON / OFF et curseur dans la pause, mémorisés ; N coupe tout | Discrète par défaut |
| Tests (Q3) | Contrôles automatiques : thème par épisode, thème de boss, volume séparé, aucune erreur audio, non-régression complète ; qualité musicale à écouter après le push | Pas de juge automatique de la musique |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t23-music.js` lit `Sfx.musicState` (thème, gain du bus musique, nombre de notes jouées) : E1M1, E2M1, E1M10 avec le
boss au repos puis engagé, pause (bouton MUSIC et curseur de volume), écran titre, rechargement. `regress.js` rejoue
ensuite tous les scénarios (24 avec celui-ci). La qualité musicale ne se juge pas automatiquement : écoute après le push.

### Procédure de test

```bash
echo "=== Music ==="
node run.js t23-music.js --style retro

echo "=== Full Non Regression Suite ==="
node regress.js
```

**Résultats attendus :**
- `e1.theme` = ep0, `e1.notesGrow` vrai, `e1.gain` ≈ 0.35 ; `e2` = ep1 ; `bossIdle` = ep0, `bossEngaged` = boss ; `pausedTheme` = boss ;
- bouton : `offGain` = 0, `offVolGain` = 0 (le volume ne rallume pas), `onGain` = 0.5, `saved` = {on true, vol 0.5} ;
- `titleTheme` null ; `afterReload` = {on false, vol 0.5} ;
- `regress.js` : « 24/24 scenarios passed ».

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Thèmes (t23) | ep0 en E1, ep1 en E2, boss une fois le boss engagé, notes jouées en continu | conforme | ✅ PASS |
| 2026-10-22 | Volume et bouton | bus musique séparé (≈ 0.35), OFF = 0, volume sans rallumer, ON = 0.5, mémorisé | conforme, afterReload {on false, vol 0.5} | ✅ PASS |
| 2026-10-22 | Menus | silence à l'écran titre | null | ✅ PASS |
| 2026-10-22 | Non-régression complète (regress.js) | 24/24 | 24/24 PASS | ✅ PASS |
| 2026-10-22 | Qualité musicale | écoute humaine | non vérifiable automatiquement : à écouter après le push | ⏳ À faire par l'utilisateur |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #23
- ✅ Fait : musique procédurale façon tracker : un thème par épisode et un thème de boss, volume et bouton dans la pause
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
