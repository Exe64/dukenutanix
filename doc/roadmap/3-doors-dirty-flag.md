---
plan:
  id: '3'
  name: 3-doors-dirty-flag.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/3-doors-dirty-flag.md
status: active
date: 2026-10-22
description: >
  `buildDoors` recrée et réenvoie le mesh des portes à chaque frame ; le faire seulement quand un `d.open` change.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: []
labels: [perf]
issue:
  id: 3
  url: https://github.com/Exe64/dukenutanix/issues/3
---

# [🚪] Plan #3 - Portes GPU : reconstruire seulement quand elles bougent

## Objectif

`buildDoors` (`js/gl.js:918-960`) vide les tableaux, recrée un `Float32Array`/`Uint32Array` et appelle `bufferData` à chaque frame, même portes immobiles : allocations et upload inutiles.

## Périmètre

### Inclus
- `js/gl.js` `buildDoors` : signature des `d.open` (et `d.glPush`), sortie anticipée si inchangée, comme `updateCells`
- Forcer la reconstruction au changement de niveau

### Hors scope
- Refonte du rendu des portes

## Étapes

- [ ] Étape 1 — Signature des portes, reconstruction seulement si elle change (XS · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #3
- 📋 Prochain : étape 1
