---
plan:
  id: '7'
  name: 7-ci-validate-levels.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/7-ci-validate-levels.md
status: active
date: 2026-10-22
description: >
  Workflow GitHub léger qui lance `node tools/validate-levels.js` sur push et PR.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: ['19']
labels: [tooling]
issue:
  id: 7
  url: https://github.com/Exe64/dukenutanix/issues/7
---

# [✅] Plan #7 - CI : valider les niveaux à chaque push

## Objectif

La validation des 50 niveaux ne tourne qu'au moment d'une release. Une régression du générateur doit être vue dès le push.

## Périmètre

### Inclus
- `.github/workflows/ci.yml` : checkout, Node, `node tools/validate-levels.js`

### Hors scope
- Tests navigateur (plan #19)

### Dépendances

- Bloque : [`19-smoke-test-playwright.md`](19-smoke-test-playwright.md) (#19)

## Étapes

- [ ] Étape 1 — Workflow `ci.yml` sur push et PR (XS · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #7
- 📋 Prochain : étape 1
