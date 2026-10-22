---
plan:
  id: '6'
  name: 6-mid-level-checkpoints.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/6-mid-level-checkpoints.md
status: done
date: 2026-10-22
enriched: 2026-10-22
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

- [x] Étape 1 — Snapshot de l'état du niveau, de l'objectif et de l'inventaire (M · standard → Sonnet)
- [x] Étape 2 — Déclenchement à chaque étape d'objectif (S · standard → Sonnet)
- [x] Étape 3 — Restauration à la mort (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Copie de l'état | `structuredClone(L)` + copie de `P` et `INV` | Préserve les références internes (voleur dans `L.enemies`, portes dans `L.doors` et `L.doorList`) et les tableaux typés |
| Déclencheur | `Objectives.progress(L)` qui augmente (bandes, CRAC, panneaux, racks, disque, failover, uploads, objectif terminé) | Un seul point, sans modifier chaque objectif |
| Restauration | Rebake de la lightmap ; le rendu GPU détecte le nouveau `L` et se reconstruit | Les objectifs « power » changent l'éclairage |
| Minuteurs | Au moins 60 s rendues sur overheat, ransom, evac | Éviter un checkpoint impossible à jouer |
| Persistance | En mémoire uniquement | Hors scope (pas de checkpoint entre deux sessions) |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t6-checkpoint.js` (E1M1, objectif backup) : mort sans checkpoint ; prise d'une bande puis chargement dans la
bibliothèque (E) ; changements après le checkpoint (position, PV 40) ; mort ; RESTORE CHECKPOINT ; puis E1M3
(ransomware) avec un checkpoint pris à 10 s de la fin. L'animation de mort est écourtée (`P.deadT`) à cause du GPU logiciel.

### Procédure de test

```bash
echo "=== Checkpoints In RETRO ==="
node run.js t6-checkpoint.js --style retro

echo "=== Checkpoints In MODERN (GPU Rebuild On Restore) ==="
node run.js t6-checkpoint.js --style modern

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `deathWithoutCheckpoint` = RESTORE SNAPSHOT, MAIN MENU (comportement inchangé sans checkpoint) ;
- `saved.msgs` contient « CHECKPOINT SAVED », `stored` 1 ;
- `deathButtons` = RESTORE CHECKPOINT, RESTART LEVEL, MAIN MENU ; capture `t6-death.png` : RESTORE CHECKPOINT mis en avant ;
- `restored` : position, PV (100), `stored`, objets pris et ennemis identiques à `expected`, `dead` faux, message « CHECKPOINT RESTORED » ;
- `timed.leftAfterRestore` ≥ 59 (60 s rendues, moins le temps écoulé depuis) ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Sans checkpoint (t6, RETRO + MODERN) | RESTORE SNAPSHOT, MAIN MENU | identique | ✅ PASS |
| 2026-10-22 | Checkpoint à l'étape d'objectif | CHECKPOINT SAVED, 1 bande chargée | conforme dans les deux styles | ✅ PASS |
| 2026-10-22 | Écran de mort avec checkpoint | RESTORE CHECKPOINT (mis en avant), RESTART LEVEL, MAIN MENU | conforme, capture vérifiée | ✅ PASS |
| 2026-10-22 | Restauration | position, PV, objectif, objets, ennemis = état du checkpoint ; vivant | x 29.5 y 13.5, PV 100, stored 1, taken 1, 10 ennemis, dans les deux styles | ✅ PASS |
| 2026-10-22 | Minuteur restauré | ≥ 59 s | 59.77 (RETRO), 59.78 (MODERN) | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing, aucune erreur | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #6
- ✅ Fait : checkpoint en mémoire à chaque étape d'objectif, restauré après une mort (minuteurs d'au moins 60 s)
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
