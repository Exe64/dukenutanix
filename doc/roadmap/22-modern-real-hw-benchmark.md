---
plan:
  id: '22'
  name: 22-modern-real-hw-benchmark.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/22-modern-real-hw-benchmark.md
status: active
date: 2026-10-22
description: >
  Mesurer le chargement et les fps sur plusieurs machines réelles et consigner les résultats.
priority: medium
complexity: S
intent: null
depends_on: ['2']
blocks: []
labels: [perf]
issue:
  id: 22
  url: https://github.com/Exe64/dukenutanix/issues/22
---

# [📏] Plan #22 - Mesurer MODERN sur du vrai matériel

## Objectif

Item de ROADMAP.md : les textures 512 px, le parallax et les monstres 3D n'ont été vérifiés que sur un GPU logiciel.

## Périmètre

### Inclus
- Protocole de mesure avec l'overlay (#2)
- Machines : iGPU, GPU dédié, Mac, app desktop
- Tableau de résultats dans ce plan, issues ouvertes pour les régressions

### Hors scope
- Optimisations elles-mêmes (#10, #11, #12)

### Dépendances

- Dépend de : [`2-perf-overlay.md`](2-perf-overlay.md) (#2)

## Étapes

- [ ] Étape 1 — Mesure du chargement et des fps sur du vrai matériel, rapport dans le plan (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #22
- 📋 Prochain : étape 1
