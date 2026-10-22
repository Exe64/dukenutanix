---
plan:
  id: '18'
  name: 18-players-list-refactor.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/18-players-list-refactor.md
status: active
date: 2026-10-22
description: >
  Transformer `P` et `INV` en liste de joueurs, testée avec des bots locaux ; fondation du coop et du deathmatch.
priority: medium
complexity: L
intent: null
depends_on: ['13']
blocks: ['26', '27']
labels: [tooling]
issue:
  id: 18
  url: https://github.com/Exe64/dukenutanix/issues/18
---

# [👥] Plan #18 - Liste de joueurs (fondation multijoueur)

## Objectif

Le jeu suppose un joueur unique (`P`, `INV` globaux dans `js/game.js`, ~2000 lignes). ROADMAP.md prévoit d'en faire une liste avant tout réseau.

## Périmètre

### Inclus
- `P`/`INV` → `players[]` avec un joueur local
- IA ennemie : cible = joueur le plus proche visible ; flow field multi-sources
- Bots locaux pour tester
- Rendu : autres joueurs en modèle 3D (MODERN) et sprites 8 rotations (RETRO)

### Hors scope
- Réseau (#26, #27)

### Dépendances

- Dépend de : [`13-fixed-timestep.md`](13-fixed-timestep.md) (#13)
- Bloque : [`26-coop-2p.md`](26-coop-2p.md) (#26)
- Bloque : [`27-deathmatch.md`](27-deathmatch.md) (#27)

## Étapes

- [ ] Étape 1 — `P` et `INV` deviennent une liste de joueurs (L · reasoning → Opus)
- [ ] Étape 2 — Bots locaux pour tester (M · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #18
- 📋 Prochain : étape 1
