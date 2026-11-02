---
plan:
  id: '29'
  name: 29-hud-avatar-real-face.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/29-hud-avatar-real-face.md
status: active
date: 2026-11-02
description: >
  Avatar du HUD redessiné en pixel-art stylisé d'après la vraie tête de l'auteur (photo de référence).
priority: medium
complexity: S
intent: null
depends_on: []
blocks: []
labels: [feature]
scope:
  modules:
    - js/game.js
issue:
  id: 29
  url: https://github.com/Exe64/dukenutanix/issues/29
---

# [🙂] Plan #29 - Avatar du HUD d'après la vraie tête

## Objectif

Remplacer la tête à la Duke (flat-top blond) de `drawFace` par une version stylisée de l'auteur, d'après sa photo :
cheveux bruns courts (front légèrement dégagé), lunettes de soleil carrées noires à verres miroir bleus,
barbe courte châtain, t-shirt noir, sourire en coin.

## Périmètre

### Inclus
- `drawFace` (`js/game.js`), utilisée par le HUD MODERN et le HUD RETRO (`js/retro.js`) : même zone (~26×33 px), même origine.
- Toutes les humeurs : normal, sourire (`grin` / mode dieu), aïe (`ouch`), mort (`dead`), regard qui suit `P.look`, reflets dorés en mode dieu.
- Les marques de blessure sous 60 et 30 PV, la peau qui pâlit avec les PV.

### Hors scope
- Le sprite du joueur vu par les autres en coop / les modèles 3D.
- La photo elle-même : elle n'est pas versionnée (référence seulement).

## Étapes

- [ ] Étape 1 — Redessiner `drawFace` d'après la photo, toutes humeurs conservées (S · standard → Sonnet)
- [ ] 🧪 Tests — Rédiger et exécuter la procédure de test (avant-dernière étape, obligatoire)
- [ ] ✅ Validation — Vérifier les résultats des tests et clôturer (dernière étape, obligatoire)

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Technique | Dessin procédural en rectangles canvas, comme l'existant | Cohérent avec le reste des assets, net en RETRO comme en MODERN |
| Lunettes | Verres miroir bleus (au lieu du noir) avec reflet qui suit `P.look` | Trait le plus reconnaissable de la photo |
| Photo | Non versionnée | Donnée personnelle, inutile au jeu |

## Tests

### Prérequis pour les tests

```bash
```

### Procédure de test

```bash
```

**Résultats attendus :**

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
