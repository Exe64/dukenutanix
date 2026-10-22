---
plan:
  id: '8'
  name: 8-version-doc.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/8-version-doc.md
status: active
date: 2026-10-22
description: >
  Suivre `doc/` (plans de roadmap) dans git ; `graft/` est déjà ignoré.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: []
labels: [tooling]
issue:
  id: 8
  url: https://github.com/Exe64/dukenutanix/issues/8
---

# [🙈] Plan #8 - Versionner doc/

## Objectif

`doc/` n'est pas suivi par git alors qu'il contient les plans. `graft/` est déjà dans `.gitignore` (fait par une autre session).

## Périmètre

### Inclus
- Ajout de `doc/` au dépôt
- Vérifier que `.gitignore` et `.ignore` couvrent bien `graft/`

### Hors scope
- Autres nettoyages du dépôt

## Étapes

- [ ] Étape 1 — `doc/` suivi par git (XS · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #8
- 📋 Prochain : étape 1
