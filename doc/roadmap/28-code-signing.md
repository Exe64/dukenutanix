---
plan:
  id: '28'
  name: 28-code-signing.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/28-code-signing.md
status: active
date: 2026-10-22
description: >
  Apple Developer ID avec notarisation et certificat Windows dans le workflow de release.
priority: low
complexity: M
intent: null
depends_on: []
blocks: []
labels: [tooling]
issue:
  id: 28
  url: https://github.com/Exe64/dukenutanix/issues/28
---

# [🔏] Plan #28 - Signature de code des apps desktop

## Objectif

Item de ROADMAP.md : sans signature, SmartScreen et Gatekeeper bloquent l'installation (voir README).

## Périmètre

### Inclus
- Apple Developer ID, notarisation dans `release.yml`
- Certificat de signature Windows dans `release.yml`
- Mise à jour du README

### Hors scope
- Signature Linux

## Étapes

- [ ] Étape 1 — Apple Developer ID et notarisation (M · standard → Sonnet)
- [ ] Étape 2 — Certificat Windows dans le workflow de release (M · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #28
- 📋 Prochain : étape 1
