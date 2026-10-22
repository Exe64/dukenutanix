---
plan:
  id: '20'
  name: 20-daily-seed-endless.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/20-daily-seed-endless.md
status: active
date: 2026-10-22
description: >
  Niveaux générés à partir d'une graine hors campagne : une graine par date et un enchaînement infini, avec scores locaux.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: ['21']
labels: [feature]
issue:
  id: 20
  url: https://github.com/Exe64/dukenutanix/issues/20
---

# [🎲] Plan #20 - Graine du jour et mode infini

## Objectif

Le générateur est déjà seedé : une graine aléatoire donne des niveaux à l'infini, une graine par date permet de comparer ses scores.

## Périmètre

### Inclus
- Mode « graine du jour » (graine = date) et « infini » (difficulté croissante)
- Paramètres de génération (épisode, objectif) dérivés de la graine
- Scores locaux par graine

### Hors scope
- Classement en ligne
- Saisie d'une graine (#21)

### Dépendances

- Bloque : [`21-custom-seed.md`](21-custom-seed.md) (#21)

## Étapes

- [ ] Étape 1 — Niveaux générés hors campagne à partir d'une graine (M · standard → Sonnet)
- [ ] Étape 2 — Graine du jour et scores locaux (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #20
- 📋 Prochain : étape 1
