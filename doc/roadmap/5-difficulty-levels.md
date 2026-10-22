---
plan:
  id: '5'
  name: 5-difficulty-levels.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/5-difficulty-levels.md
status: active
date: 2026-10-22
description: >
  Choix de la difficulté au lancement d'une partie : densité d'ennemis et multiplicateur de dégâts, niveaux seedés inchangés.
priority: high
complexity: M
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 5
  url: https://github.com/Exe64/dukenutanix/issues/5
---

# [🎚️] Plan #5 - Niveaux de difficulté

## Objectif

Le joueur ne peut pas choisir la difficulté. À la manière de Doom, filtrer des ennemis au chargement et appliquer un multiplicateur de dégâts, sans toucher aux cartes seedées.

## Périmètre

### Inclus
- Menu : choix parmi 4 niveaux au lancement d'une nouvelle partie, stocké dans la sauvegarde
- `js/game.js` `loadLevel` : filtrage déterministe des ennemis, multiplicateur de dégâts reçus
- `tools/validate-levels.js` : contrôle par difficulté (mini-boss et boss toujours présents)

### Hors scope
- Difficulté adaptative en cours de partie
- Changement de difficulté en cours de campagne

## Étapes

- [ ] Étape 1 — Choix de la difficulté au lancement, stocké dans la sauvegarde (S · standard → Sonnet)
- [ ] Étape 2 — Filtrage des ennemis et multiplicateur de dégâts dans `loadLevel` (M · standard → Sonnet)
- [ ] Étape 3 — `validate-levels` par difficulté (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #5
- 📋 Prochain : étape 1
