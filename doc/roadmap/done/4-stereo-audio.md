---
plan:
  id: '4'
  name: 4-stereo-audio.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/4-stereo-audio.md
status: done
date: 2026-10-22
enriched: 2026-10-22
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

- [x] Étape 1 — `StereoPannerNode` dans `Sfx`, avec un paramètre d'angle (S · standard → Sonnet)
- [x] Étape 2 — Angle relatif calculé chez les appelants (ennemis, explosions) (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| API | Les sons positionnels reçoivent un point `{x, y}` (entité, porte, projectile) au lieu d'une distance | L'audio calcule distance et angle à un seul endroit ; les appelants passent juste l'entité |
| Côté droit | `sin(angle source − P.a)`, droite = `P.a + 90°` | Plan caméra `(-dirY, dirX)` du raycaster : `dir + plane` est le bord droit de l'écran |
| Amplitude | ±0.8, réduite sous 1 case | Pas de son « tout à gauche » ; un son collé au joueur reste centré |
| Sons centrés | Sans panner quand pan = 0 | Aucun nœud en plus pour les sons du joueur |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t4-stereo.js` enregistre la valeur de chaque `StereoPannerNode` créé, joue un tir de drone placé à 5 cases
à droite, à gauche, devant, sur le joueur et à 0,3 case à droite, puis place un vrai monstre d'E1M1 à droite
du joueur et enregistre les sons de son attaque pendant 3 s.

### Procédure de test

```bash
echo "=== Stereo Panning ==="
node run.js t4-stereo.js --style retro

echo "=== Non Regression Smoke In Both Styles ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `unit.right` ne contient que des valeurs > 0.5 ; `unit.left` que des valeurs < -0.5 ; `unit.front` et
  `unit.atPlayer` vides (pas de panoramique, son centré) ; `unit.near` entre 0 et 0.5 (son proche peu latéralisé) ;
- `live.pans` non vide et toutes ses valeurs > 0 (le monstre placé à droite s'entend à droite) ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Panoramique unitaire (t4-stereo) | droite > 0.5, gauche < -0.5, devant / sur le joueur centrés, proche < 0.5 | droite 0.8, gauche -0.8, devant et joueur sans panner, proche 0.24 | ✅ PASS |
| 2026-10-22 | Monstre réel placé à droite (t4-stereo) | sons de l'attaque à droite (> 0) | 0.8, 0.8, 0.8, 0.49, 0.49 | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing, aucune erreur | ok, E1M1 playing, errors [] | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #4
- ✅ Fait : panoramique stéréo des sons du monde selon le côté d'où ils viennent
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
