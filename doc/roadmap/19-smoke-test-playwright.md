---
plan:
  id: '19'
  name: 19-smoke-test-playwright.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/19-smoke-test-playwright.md
status: active
date: 2026-10-22
description: >
  Charger E1M1 en MODERN et en RETRO via `window.__duke`, jouer quelques secondes, échouer sur toute exception ; lancé en CI.
priority: medium
complexity: M
intent: null
depends_on: ['7']
blocks: []
labels: [tooling]
issue:
  id: 19
  url: https://github.com/Exe64/dukenutanix/issues/19
---

# [🧪] Plan #19 - Test de fumée navigateur (Playwright)

## Objectif

Aucun test ne lance le jeu. Le hook `window.__duke` existe déjà pour piloter le jeu.

## Périmètre

### Inclus
- Script Playwright (Chromium headless, WebGL logiciel)
- E1M1 en MODERN et RETRO, quelques secondes, `iddqd`, aucune erreur console
- Ajout au workflow CI (#7)

### Hors scope
- Tests visuels par capture d'écran

### Dépendances

- Dépend de : [`7-ci-validate-levels.md`](7-ci-validate-levels.md) (#7)

## Étapes

- [ ] Étape 1 — Script Playwright basé sur `window.__duke` (M · standard → Sonnet)
- [ ] Étape 2 — Intégration à la CI (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #19
- 📋 Prochain : étape 1
