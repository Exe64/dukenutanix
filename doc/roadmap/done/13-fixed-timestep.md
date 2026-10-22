---
plan:
  id: '13'
  name: 13-fixed-timestep.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/13-fixed-timestep.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Logique à 60 Hz avec accumulateur en MODERN comme en RETRO, rendu interpolé ; prérequis du multijoueur.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: ['18']
labels: [perf]
issue:
  id: 13
  url: https://github.com/Exe64/dukenutanix/issues/13
---

# [⏲️] Plan #13 - Logique en pas fixe pour les deux styles

## Objectif

MODERN avance la logique en pas variable (plafonné à 50 ms), RETRO en tics de 35 Hz : le jeu se comporte différemment selon le style. Un pas fixe rend la logique déterministe et prépare #18.

## Périmètre

### Inclus
- `js/game.js` `frame` : accumulateur, `update(1/60)` en MODERN
- RETRO : garder l'affichage à 35 Hz (choix à trancher : logique à 35 Hz conservée ou 60 Hz)
- Interpolation de la caméra et des entités au rendu

### Hors scope
- Rollback / prédiction réseau

### Dépendances

- Bloque : [`18-players-list-refactor.md`](18-players-list-refactor.md) (#18)

## Étapes

- [x] Étape 1 — Logique en pas fixe avec accumulateur (M · standard → Sonnet)
- [x] Étape 2 — Rendu interpolé (M · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Fréquence | 70 Hz dans les deux styles (2 × les tics de Doom) | Même comportement quel que soit le style ou l'écran ; RETRO garde 35 fps affichés (une frame tous les 2 pas) |
| Rattrapage | Au plus 0,2 s de logique par frame (14 pas) | Évite la spirale sur une machine lente ; au-delà le jeu ralentit (avant : dès 20 fps) |
| Interpolation | Position et balancement du joueur entre les deux derniers pas, en MODERN | Ce qui se voit le plus ; ennemis et projectiles non interpolés (au plus 14 ms de retard) |
| Souris | Appliquée à chaque frame affichée (`applyLook`) | Pas de latence ajoutée ; clavier et déplacements restent dans la logique |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location And A Copy Of HEAD Before The Change ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
rm -rf ../base && mkdir ../base && git -C /srv/dev/dukenutanix archive HEAD | tar -x -C ../base
```

`t13-step.js` enregistre les durées de pas passées à `update`, les positions du joueur reçues par le rendu GPU et
les frames RETRO dessinées, marche 3 s (W) puis injecte un mouvement de souris (`mouseDX = 100`).
Limite connue : sous SwiftShader, une frame MODERN dure plusieurs secondes ; le rapport temps de jeu / temps réel
n'est donc mesurable qu'en RETRO.

### Procédure de test

```bash
echo "=== Fixed Step In RETRO ==="
node run.js t13-step.js --style retro

echo "=== Fixed Step And Interpolation In MODERN ==="
node run.js t13-step.js --style modern

echo "=== Before The Change (HEAD Copy): Variable Step In MODERN ==="
node run.js t13-step.js --style modern --root $PWD/../base

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- après, dans les deux styles : `stepSizes` = [0.014286] (1/70 s), `timeOnGrid` vrai, `look.turned` = `look.expected` ;
- RETRO : `gameOverWall` entre 0.9 et 1.1 (le jeu suit le temps réel) ;
- MODERN : `drawnBackwards` = 0 (positions dessinées monotones en marchant) ;
- avant (copie HEAD), MODERN : `stepSizes` différent de [0.014286] (pas variable) ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Pas fixe RETRO | pas 1/70 s, temps sur la grille, jeu = temps réel, souris immédiate | [0.014286], oui, 1.0, 0.22 = 0.22 | ✅ PASS |
| 2026-10-22 | Pas fixe MODERN | pas 1/70 s, positions dessinées monotones, souris immédiate | [0.014286], 0 retour arrière, 0.22 = 0.22 | ✅ PASS |
| 2026-10-22 | Avant (copie HEAD) MODERN | pas variable | [0.05] | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #13
- ✅ Fait : logique à 70 Hz fixes dans les deux styles, joueur interpolé en MODERN, souris appliquée à chaque frame
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
