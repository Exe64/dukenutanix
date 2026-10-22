---
plan:
  id: '13'
  name: 13-fixed-timestep.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/13-fixed-timestep.md
status: active
date: 2026-10-22
description: >
  Logique à 60 Hz avec accumulateur en MODERN comme en RETRO, rendu interpolé ; prérequis du multijoueur.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: ['18']
labels: [perf]
issue:
  id: 13
  url: https://github.com/Exe64/dukenutanix/issues/13
---

# [⏲️] Plan #13 - Logique en pas fixe pour les deux styles

## Objectif

MODERN avance la logique en pas variable (plafonné à 50 ms), RETRO en tics de 35 Hz : le jeu se comporte différemment selon le style. Un pas fixe rend la logique déterministe et prépare #18.

## Périmètre

### Inclus
- `js/game.js` `frame` : accumulateur, `update(1/60)` en MODERN
- RETRO : garder l'affichage à 35 Hz (choix à trancher : logique à 35 Hz conservée ou 60 Hz)
- Interpolation de la caméra et des entités au rendu

### Hors scope
- Rollback / prédiction réseau

### Dépendances

- Bloque : [`18-players-list-refactor.md`](18-players-list-refactor.md) (#18)

## Étapes

- [ ] Étape 1 — Logique en pas fixe avec accumulateur (M · standard → Sonnet)
- [ ] Étape 2 — Rendu interpolé (M · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #13
- 📋 Prochain : étape 1
