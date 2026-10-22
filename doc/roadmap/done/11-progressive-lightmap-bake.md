---
plan:
  id: '11'
  name: 11-progressive-lightmap-bake.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/11-progressive-lightmap-bake.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Mesurer `Light.bake` au rallumage d'un panneau électrique ; s'il saccade, l'étaler sur plusieurs frames.
priority: medium
complexity: S
intent: null
depends_on: ['2']
blocks: []
labels: [perf]
issue:
  id: 11
  url: https://github.com/Exe64/dukenutanix/issues/11
---

# [💡] Plan #11 - Rebake progressif de la lightmap

## Objectif

L'objectif « power » rebake toute la lightmap d'un bloc (`js/objectives.js`, `relight`). À mesurer : si ça provoque une saccade, découper le calcul.

## Périmètre

### Inclus
- Mesure avec l'overlay (#2)
- Si > 1 frame : bake découpé par zones sur plusieurs frames, ancienne lightmap affichée en attendant

### Hors scope
- Bake sur GPU

### Dépendances

- Dépend de : [`2-perf-overlay.md`](2-perf-overlay.md) (#2)

## Étapes

- [x] Étape 1 — Mesure de `Light.bake` sur un panneau électrique (XS · standard → Sonnet)
- [x] Étape 2 — Si saccade, calcul étalé sur plusieurs frames (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Mesure | Bake GPU au rallumage : 229 ms bloquants sous SwiftShader (calcul JavaScript, comparable sur vrai matériel) ; bake CPU ~25 ms | Le bake GPU justifie l'étalement ; le CPU reste synchrone (environ une frame) |
| Étalement | Générateur `baking(L)` qui cède après chaque ligne de cellules, avancé 4 ms par frame dans `render` | Même principe que `warmUp` ; `bake()` l'exécute d'un bloc au chargement du niveau |
| Pendant le calcul | L'ancienne lightmap reste affichée, la nouvelle remplace d'un coup | Pas d'état intermédiaire incohérent |
| Changement de niveau / checkpoint | `setLevel` annule le bake en attente | Évite d'appliquer la lumière d'un autre `L` |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location And A Copy Of HEAD Before The Change ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
rm -rf ../base && mkdir ../base && git -C /srv/dev/dukenutanix archive HEAD | tar -x -C ../base
```

`t11-relight.js` (MODERN, E1M4, objectif power) chronomètre l'appel synchrone `GLR.relight` déclenché en rallumant
le premier panneau MAIN POWER (E), relève la durée de calcul du bake (`GLR.stats.bakeMs`) et prend une capture
avant et 4 s après.

### Procédure de test

```bash
echo "=== Relight After The Change ==="
node run.js t11-relight.js --style modern

echo "=== Relight Before The Change (HEAD Copy) ==="
node run.js t11-relight.js --style modern --root $PWD/../base

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- avant : `relightSyncMs` ≈ durée complète du bake (> 100 ms sous SwiftShader) ;
- après : `relightSyncMs` < 40 ms (reste la reconstruction de la géométrie), `on` = 1, `bakeMsAfter` différent de `bake0`
  (le nouveau bake s'est terminé en arrière-plan) ;
- captures : `t11-after.png` plus éclairée que `t11-before.png` (plafonniers rallumés) ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Rallumage avant (copie HEAD) | appel bloquant > 100 ms | 210.8 ms | ✅ PASS |
| 2026-10-22 | Rallumage après | appel bloquant < 40 ms, panneau allumé | 27.5 ms, on = 1 | ✅ PASS |
| 2026-10-22 | Bake terminé en arrière-plan | bakeMsAfter ≠ bake0 | 27.2 → 76.4 ms | ✅ PASS |
| 2026-10-22 | Captures avant / après | plafonniers rallumés, HUD panels 1/3 on | conforme | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing, aucune erreur | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #11
- ✅ Fait : rebake GPU de la lightmap étalé sur plusieurs frames au rallumage d'un panneau (frame bloquée : 211 → 28 ms)
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
