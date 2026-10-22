---
plan:
  id: '15'
  name: 15-modern-free-aim.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/15-modern-free-aim.md
status: active
date: 2026-10-22
description: >
  En MODERN, utiliser le pitch de la caméra pour la visée (hitscan et projectiles) au lieu de l'auto-visée en hauteur.
priority: medium
complexity: S
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 15
  url: https://github.com/Exe64/dukenutanix/issues/15
---

# [🎯] Plan #15 - Visée libre en MODERN

## Objectif

En MODERN on regarde en haut et en bas, mais la visée reste automatique en hauteur : ça peut surprendre. Viser au réticule rend le regard vertical cohérent.

## Périmètre

### Inclus
- `hitscan` et projectiles du joueur : prise en compte de `P.pitch` en MODERN
- RETRO inchangé (auto-visée comme Doom)
- Éventuelle option pour garder l'auto-visée

### Hors scope
- Hitboxes par partie du corps

## Étapes

- [ ] Étape 1 — Visée au réticule avec le pitch, hitscan et projectiles (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #15
- 📋 Prochain : étape 1
