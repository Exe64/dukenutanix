---
plan:
  id: '1'
  name: 1-retro-attack-frames.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/1-retro-attack-frames.md
status: active
date: 2026-10-22
description: >
  RETRO : 3 frames d'attaque (préparation, coup/tir, retour) pour tous les monstres qui attaquent, dans les 8 rotations.
priority: medium
complexity: M
intent: null
scope:
  modules:
    - js/textures.js
    - js/game.js
    - ROADMAP.md
issue:
  id: 1
  url: https://github.com/Exe64/dukenutanix/issues/1
---

# [🎞️] Plan #1 - RETRO Attack Frames

## Objectif

En RETRO, un monstre affiche une seule frame d'attaque pendant toute l'attaque. On passe à 3 frames
(préparation, coup ou tir, retour), comme dans Doom, pour que les attaques se lisent.

## Périmètre

### Inclus
- Tous les monstres qui attaquent : bug, drone, bot, troll, spammer, les 5 boss (`drawBoss`), les 5 mini-boss.
- Les 8 rotations RETRO (`buildRotations`) et la frame de face (`buildEnemySprites`).
- Choix de la frame selon l'état de l'attaque dans `collectSprites` (`js/game.js`).
- Vérification à l'œil des 35 fps sur un vrai écran 60 Hz (test uniquement).
- Retrait de l'item correspondant de `ROADMAP.md`.

### Hors scope
- Le style MODERN : modèles 3D inchangés ; les rotations haute définition et le repli 2D gardent une seule frame (« coup »).
- Le voleur de données (n'attaque jamais).
- Le timing des dégâts et de l'IA : la logique de jeu ne change pas.
- Les animations de l'arme du joueur.

## Étapes

- [ ] Étape 1 — `js/textures.js` : `atk` devient une pose (0 aucune, 1 préparation, 2 coup, 3 retour) dans les fonctions de dessin ; `atk: [3 frames]` dans `buildEnemySprites` / `buildRotations` ; MODERN garde la frame « coup » (M · standard → Sonnet)
- [ ] Étape 2 — `js/game.js` : choisir la frame d'attaque selon `e.timer`, `e.shotT`, `e.shots` dans `collectSprites` (S · standard → Sonnet)
- [ ] Étape 3 — Retirer l'item de `ROADMAP.md` (XS · standard → Sonnet)
- [ ] 🧪 Tests — Rédiger et exécuter la procédure de test (avant-dernière étape, obligatoire)
- [ ] ✅ Validation — Vérifier les résultats des tests et clôturer (dernière étape, obligatoire)

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Nombre de frames | 3 : préparation, coup/tir, retour | Comme Doom ; coûte 8×2 sprites de plus par type de monstre |
| Monstres concernés | Tous ceux qui attaquent (base, boss, mini-boss) | Les fonctions de dessin partagent la même signature |
| Timing | Calé sur l'action : la frame de tir à chaque tir d'une rafale, mêlée découpée sur 0,45 s | L'attaque se lit au moment où elle part |
| Dégâts de mêlée | Restent immédiats | Changement purement visuel, équilibrage inchangé |
| 35 fps | Vérifié à l'œil pendant les tests, pas de code sauf saccades constatées | Rien n'indique de problème à ce jour |

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

## Journal de session

### Session 2026-10-22
- ✅ Fait : cadrage, création de l'issue #1 et du plan
- 📋 Prochain : étape 1
