---
plan:
  id: '15'
  name: 15-modern-free-aim.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/15-modern-free-aim.md
status: done
date: 2026-10-22
enriched: 2026-10-22
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

- [x] Étape 1 — Visée au réticule avec le pitch, hitscan et projectiles (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Portée | MODERN avec rendu GPU uniquement (seul à avoir un pitch) ; RETRO et rendu logiciel inchangés | Cohérent avec ce que le joueur voit |
| Tir instantané | Hauteur du rayon `0.5 + tan(pitch) × d`, arrêt au sol / plafond, cible touchée si dans sa hauteur (± 0,08) | Hauteurs tirées de `ETYPES` (`z`, `scale`) ; barils 0–0.6 |
| Projectiles | Départ à hauteur d'œil avec `vz`, impact sol / plafond, recouvrement vertical des cibles (± 0,1) | Disque dur : la pente s'ajoute à son arc |
| Option | Bouton « AIM: FREE / AUTO » dans la pause, mémorisé | Garde l'auto-visée de Doom pour qui la préfère |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t15-aim.js` (E1M1, invincibilité activée) place une cible figée à 3 cases dans l'axe, puis appelle `hitscan` avec différents
pitchs, types de cible (bug : hauteur 0–0.7 ; drone : 0.35–0.95) et modes (free / auto) ; tire ensuite une
cage nut (projectile) à plat et vers le haut ; enfin bascule le bouton AIM de la pause.

### Procédure de test

```bash
echo "=== Free Aim In MODERN On The GPU ==="
node run.js t15-aim.js --style modern

echo "=== RETRO Keeps Automatic Aiming ==="
node run.js t15-aim.js --style retro

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- MODERN : `level` vrai, `up` faux, `low` vrai, `droneLow` faux, `upAuto` vrai ; `projLevel` aimed + hit ; `projUp` aimed, pas de hit, `z` > 0.6 ;
  `aimButton` : `AIM: FREE` → `AIM: AUTO`, `saved` = auto ;
- RETRO : tous les tirs touchent (`level`, `up`, `low`, `droneLow`, `upAuto`, `projLevel.hit`, `projUp.hit` vrais), `aimButton` null ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Tir instantané MODERN (t15) | à plat touche, vers le haut manque, bas touche un bug, bas manque un drone, AUTO touche | true / false / true / false / true | ✅ PASS |
| 2026-10-22 | Projectiles MODERN | à plat : touche ; vers le haut : plafond, z > 0.6 | hit ; pas de hit, z 0.89 | ✅ PASS |
| 2026-10-22 | Bouton AIM | FREE → AUTO, sauvegardé | conforme | ✅ PASS |
| 2026-10-22 | RETRO inchangé | tous les tirs touchent, pas de bouton AIM | conforme | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing | ok | ✅ PASS |
| 2026-10-22 | Note | verdict du vérificateur | rapport ouvert par « FAIL » puis corrigé en PASS par le vérificateur ; valeurs relues une à une : toutes conformes | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #15
- ✅ Fait : visée libre en MODERN GPU (tir instantané et projectiles suivent le pitch), option AIM: AUTO dans la pause
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
