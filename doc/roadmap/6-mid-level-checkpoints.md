---
plan:
  id: '6'
  name: 6-mid-level-checkpoints.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/6-mid-level-checkpoints.md
status: active
date: 2026-10-22
description: >
  Snapshot automatique à chaque étape d'objectif, restauré à la mort au lieu de recommencer le niveau.
priority: high
complexity: M
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 6
  url: https://github.com/Exe64/dukenutanix/issues/6
---

# [💾] Plan #6 - Checkpoints en cours de niveau

## Objectif

Une mort ou un objectif raté renvoie au début du niveau, ce qui pèse sur les niveaux chronométrés à 5 minutes. Un snapshot à chaque étape d'objectif (bande chargée, CRAC réparé, panneau rallumé…) réduit la frustration.

## Périmètre

### Inclus
- Sérialisation de l'état : `L` (ennemis, objets, portes, tuiles, objectif, temps), `P`, `INV`
- Déclenchement depuis `js/objectives.js` à chaque étape
- Écran de mort : « restaurer le checkpoint » ou « recommencer le niveau »

### Hors scope
- Quicksave F5/F9 libre
- Persistance du checkpoint entre deux sessions

## Étapes

- [ ] Étape 1 — Snapshot de l'état du niveau, de l'objectif et de l'inventaire (M · standard → Sonnet)
- [ ] Étape 2 — Déclenchement à chaque étape d'objectif (S · standard → Sonnet)
- [ ] Étape 3 — Restauration à la mort (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #6
- 📋 Prochain : étape 1
