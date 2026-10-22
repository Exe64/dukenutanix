---
plan:
  id: '10'
  name: 10-reflection-cost.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/10-reflection-cost.md
status: active
date: 2026-10-22
description: >
  Le reflet redessine toute la scène : le passer à demi-résolution et le sauter quand le sol n'est pas visible.
priority: medium
complexity: S
intent: null
depends_on: ['2']
blocks: []
labels: [perf]
issue:
  id: 10
  url: https://github.com/Exe64/dukenutanix/issues/10
---

# [🪞] Plan #10 - Réduire le coût du reflet du sol

## Objectif

En HIGH, la passe de reflet (`js/gl.js`, `render`) redessine monde, objets, monstres et sprites : le coût de rendu est à peu près doublé. C'est probablement le plus gros levier GPU.

## Périmètre

### Inclus
- Mesure avant/après avec l'overlay (#2)
- FBO de reflet à demi-résolution
- Passe sautée quand le pitch regarde vers le haut (sol hors champ)

### Hors scope
- Reflets en screen space (SSR)

### Dépendances

- Dépend de : [`2-perf-overlay.md`](2-perf-overlay.md) (#2)

## Étapes

- [ ] Étape 1 — Mesure du coût du reflet (XS · standard → Sonnet)
- [ ] Étape 2 — Reflet à demi-résolution, sauté quand le sol est hors champ (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #10
- 📋 Prochain : étape 1
