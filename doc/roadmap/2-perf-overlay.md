---
plan:
  id: '2'
  name: 2-perf-overlay.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/2-perf-overlay.md
status: active
date: 2026-10-22
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

- [ ] Étape 1 — Compteurs : ms/frame, draw calls, sprites, durée du bake (S · standard → Sonnet)
- [ ] Étape 2 — Affichage F3 en MODERN et RETRO, état mémorisé (XS · standard → Sonnet)
- [ ] 🧪 Tests — Rédiger et exécuter la procédure de test
- [ ] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|

## Tests

### Prérequis pour les tests

```bash
(à rédiger à l'étape 🧪 Tests)
```

### Procédure de test

```bash
(à rédiger à l'étape 🧪 Tests)
```

**Résultats attendus :** à définir à l'étape 🧪 Tests.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #2
- 📋 Prochain : étape 1
