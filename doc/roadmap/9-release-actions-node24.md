---
plan:
  id: '9'
  name: 9-release-actions-node24.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/9-release-actions-node24.md
status: active
date: 2026-10-22
description: >
  Mettre à jour les actions de `release.yml` vers des versions qui tournent sur Node 24.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: []
labels: [tooling]
issue:
  id: 9
  url: https://github.com/Exe64/dukenutanix/issues/9
---

# [⬆️] Plan #9 - Actions de release sur Node 24

## Objectif

Item de ROADMAP.md : les versions actuelles des actions GitHub vont être dépréciées avec le passage des runners à Node 24.

## Périmètre

### Inclus
- `.github/workflows/release.yml` : versions des actions (checkout, setup-node, cache, upload, tauri-action…)

### Hors scope
- Refonte du workflow

## Étapes

- [ ] Étape 1 — Mise à jour des actions de `release.yml` (XS · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #9
- 📋 Prochain : étape 1
