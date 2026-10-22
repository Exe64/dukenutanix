---
plan:
  id: '14'
  name: 14-gamepad-remap.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/14-gamepad-remap.md
status: active
date: 2026-10-22
description: >
  Support manette via l'API Gamepad et menu de remappage des touches sauvegardé localement.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 14
  url: https://github.com/Exe64/dukenutanix/issues/14
---

# [🎮] Plan #14 - Manette et remappage des touches

## Objectif

Pas de manette ni de remappage. L'API Gamepad suffit, sans dépendance ; utile pour l'app desktop (Steam Deck, salon).

## Périmètre

### Inclus
- Lecture de `navigator.getGamepads()` dans la boucle, zone morte, visée au stick
- Navigation des menus à la manette
- Menu de remappage clavier, stocké dans `localStorage`

### Hors scope
- Vibrations
- Configurations par manette

## Étapes

- [ ] Étape 1 — Manette via l'API Gamepad (M · standard → Sonnet)
- [ ] Étape 2 — Menu de remappage des touches, sauvegardé localement (M · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #14
- 📋 Prochain : étape 1
