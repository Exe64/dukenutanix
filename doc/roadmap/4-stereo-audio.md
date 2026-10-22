---
plan:
  id: '4'
  name: 4-stereo-audio.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/4-stereo-audio.md
status: active
date: 2026-10-22
description: >
  Ajouter un panoramique stéréo aux sons du monde pour entendre d'où viennent les monstres.
priority: high
complexity: S
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 4
  url: https://github.com/Exe64/dukenutanix/issues/4
---

# [🔊] Plan #4 - Son spatialisé (stéréo)

## Objectif

Les sons ne tiennent compte que de la distance (`Sfx.enemyShoot(kind, dist)`) : impossible de localiser un ennemi à l'oreille. Un `StereoPannerNode` calé sur l'angle relatif au joueur est un gain de jouabilité important pour peu de code.

## Périmètre

### Inclus
- `js/audio.js` : paramètre d'angle optionnel, `StereoPannerNode` par son
- `js/game.js` : calcul de l'angle relatif (ennemis, projectiles, explosions, portes) chez les appelants

### Hors scope
- HRTF / `PannerNode` 3D complet
- Occlusion par les murs

## Étapes

- [ ] Étape 1 — `StereoPannerNode` dans `Sfx`, avec un paramètre d'angle (S · standard → Sonnet)
- [ ] Étape 2 — Angle relatif calculé chez les appelants (ennemis, explosions) (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #4
- 📋 Prochain : étape 1
