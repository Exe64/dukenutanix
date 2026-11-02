---
plan:
  id: '29'
  name: 29-hud-avatar-real-face.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/29-hud-avatar-real-face.md
status: in-progress
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

- [x] Étape 1 — Redessiner `drawFace` d'après la photo, toutes humeurs conservées (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test (avant-dernière étape, obligatoire)
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
# Playwright 1.64.1 + Chromium libs extracted locally (EL10 without root), see the session memory recipe
export LD_LIBRARY_PATH=$SCRATCH/libs/usr/lib64 NODE_PATH=$SCRATCH/pw/node_modules
```

### Procédure de test

```bash
node tools/validate-levels.js
node tools/smoke-test.js
node $SCRATCH/avatar/render.js        # drawFace taken from js/game.js, every mood at 1x and 8x -> sheet.png, retro-sheet.png
# Human: look at the HUD face in game (MODERN and RETRO), take damage, pick up god mode, die.
```

**Résultats attendus :**
- Lunettes carrées à verres miroir bleus, barbe courte, front dégagé, t-shirt noir : reconnaissable à 1x.
- Humeurs : normal (sourire en coin), regard gauche/droite, grin, dieu (reflets dorés), aïe, PV < 60 et < 30 (marques, pâleur), mort (yeux en x).

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-11-02 | `validate-levels.js` | PASS | 50 niveaux + 72 runs OK | ✅ |
| 2026-11-02 | `smoke-test.js` | PASS | modern OK, retro OK | ✅ |
| 2026-11-02 | Planche des 9 humeurs (8x et 1x, MODERN et RETRO) | toutes présentes, ressemblance | relue par un agent « directeur artistique » (6/10 → 10 corrections appliquées), vérifiée à l'œil | ✅ |
| 2026-11-02 | Retour utilisateur : cheveux noirs, fond adapté | cheveux et barbe plus foncés, fond bleu ardoise #3c5068 (MODERN et RETRO) | planche re-rendue, smoke OK | ✅ |
| — | Vérif en jeu par l'utilisateur | ressemblance validée | à faire | ⏳ |
