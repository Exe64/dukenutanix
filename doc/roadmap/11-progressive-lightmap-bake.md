---
plan:
  id: '11'
  name: 11-progressive-lightmap-bake.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/11-progressive-lightmap-bake.md
status: active
date: 2026-10-22
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

- [ ] Étape 1 — Mesure de `Light.bake` sur un panneau électrique (XS · standard → Sonnet)
- [ ] Étape 2 — Si saccade, calcul étalé sur plusieurs frames (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #11
- 📋 Prochain : étape 1
