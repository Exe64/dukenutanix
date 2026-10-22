---
plan:
  id: '2'
  name: 2-perf-overlay.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/2-perf-overlay.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Afficher avec F3 les métriques de rendu (ms/frame, draw calls, sprites, durée du bake) pour mesurer avant d'optimiser.
priority: high
complexity: S
intent: null
depends_on: []
blocks: ['10', '11', '12', '22']
labels: [perf]
issue:
  id: 2
  url: https://github.com/Exe64/dukenutanix/issues/2
---

# [📊] Plan #2 - Overlay de performance (F3)

## Objectif

Aucune mesure n'existe sur du vrai matériel (ROADMAP). Un overlay léger donne la base chiffrée des plans d'optimisation #10, #11, #12 et #22.

## Périmètre

### Inclus
- `js/game.js` : touche F3, moyenne glissante du temps de frame
- `js/gl.js` : compteur de draw calls et de sprites par frame
- `js/lighting.js` : durée du dernier `Light.bake`
- Affichage en MODERN (GPU et logiciel) et en RETRO

### Hors scope
- Profilage GPU par passe (timer queries)
- Envoi de télémétrie

### Dépendances

- Bloque : [`10-reflection-cost.md`](10-reflection-cost.md) (#10)
- Bloque : [`11-progressive-lightmap-bake.md`](11-progressive-lightmap-bake.md) (#11)
- Bloque : [`12-lazy-asset-build.md`](12-lazy-asset-build.md) (#12)
- Bloque : [`22-modern-real-hw-benchmark.md`](22-modern-real-hw-benchmark.md) (#22)

## Étapes

- [x] Étape 1 — Compteurs : ms/frame, draw calls, sprites, durée du bake (S · standard → Sonnet)
- [x] Étape 2 — Affichage F3 en MODERN et RETRO, état mémorisé (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Comptage des draw calls | Enveloppe de `drawArrays`/`drawElements`/`drawArraysInstanced` sur le contexte, à l'init | Un seul point au lieu de 10 sites d'appel |
| Temps CPU | Durée du callback `requestAnimationFrame` (logique + appels de rendu), échantillons plafonnés à 200 ms | Sous un GPU logiciel ou au chargement, une frame isolée faussait la moyenne |
| Moyennes | Glissantes (0.05), remises à zéro à l'entrée du niveau | Le chargement du niveau ne pollue pas la mesure |
| Sprites en RETRO | Non comptés | Le rendu RETRO a sa propre liste ; pas utile pour les plans d'optimisation (MODERN) |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

Banc : `run.js` charge `/srv/dev/dukenutanix/index.html` dans Chromium headless (WebGL SwiftShader),
joue le scénario, et échoue sur toute erreur de page ou de console. Options `--style modern|retro`, `--gfx high|low`.

### Procédure de test

```bash
echo "=== Overlay In MODERN GPU HIGH ==="
node run.js t2-perf.js --style modern --gfx high

echo "=== Overlay In MODERN GPU LOW ==="
node run.js t2-perf.js --style modern --gfx low

echo "=== Overlay In RETRO ==="
node run.js t2-perf.js --style retro

echo "=== Non Regression Smoke In Both Styles ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro

echo "=== Levels Still Valid ==="
cd /srv/dev/dukenutanix && node tools/validate-levels.js | tail -1
```

**Résultats attendus :**
- chaque `run.js` sort en code 0 avec `"ok": true` et `"errors": []` ;
- `t2-perf.js` : `on.showPerf` vrai et `on.stored` = `"1"`, `off.showPerf` faux et `off.stored` = `"0"` ;
  `frameMs` > 0 et `cpuMs` ≤ `frameMs` + 5 ; en MODERN GPU `draws` > 0, `glSprites` > 0, `glBakeMs` > 0 ;
  en LOW, moins de draw calls qu'en HIGH ; en RETRO `bakeMs` > 0 ;
- captures `t2-gpu-modern.png` et `t2-sw-retro.png` : bloc vert de 3 lignes en haut à gauche, texte dans son fond ;
- `validate-levels` : `Levels OK`.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Overlay MODERN GPU HIGH (t2-perf) | ok, bascule F3 mémorisée, draws/sprites/bake > 0, cpu ≤ frame | ok ; draws 169, sprites 16, GPU bake 144 ms, frame 200 / cpu 195 ms | ✅ PASS |
| 2026-10-22 | Overlay MODERN GPU LOW (t2-perf) | ok, draws < HIGH | ok ; draws 90 < 169 | ✅ PASS |
| 2026-10-22 | Overlay RETRO (t2-perf) | ok, bake > 0, cpu ≤ frame | ok ; bake 20.7 ms, frame 67.6 / cpu 62.4 ms | ✅ PASS |
| 2026-10-22 | Captures | bloc vert 3 lignes en haut à gauche, texte dans son fond | conforme (chevauche le titre du niveau, affiché 5 s) | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, state playing, aucune erreur | ok, E1M1 playing, errors [] | ✅ PASS |
| 2026-10-22 | validate-levels | Levels OK | Levels OK (712 ms) | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #2
- ✅ Fait : overlay F3 (FPS, temps de frame et CPU, draw calls, sprites, durée des bakes CPU et GPU), mémorisé
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
