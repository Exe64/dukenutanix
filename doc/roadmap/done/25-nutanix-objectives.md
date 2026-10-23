---
plan:
  id: '25'
  name: 25-nutanix-objectives.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/25-nutanix-objectives.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Trois objectifs : live migration d'une VM à escorter, mise à jour LCM nœud par nœud, snapshots zombies.
priority: low
complexity: L
intent: null
depends_on: []
blocks: []
labels: [feature]
issue:
  id: 25
  url: https://github.com/Exe64/dukenutanix/issues/25
---

# [🧩] Plan #25 - Nouveaux objectifs Nutanix

## Objectif

Enrichir la rotation des 9 objectifs avec des mécaniques à thème Nutanix qui réutilisent l'existant (escorte, zones, défense).

## Périmètre

### Inclus
- `js/objectives.js` : 3 nouveaux objectifs
- `js/levelgen.js` : placement (`OBJ_NEEDS`), `js/levels.js` : rotation
- `tools/validate-levels.js` : contrôles

### Hors scope
- Nouveaux monstres dédiés

## Étapes

- [x] Étape 1 — Objectif live migration de VM, à escorter (M · standard → Sonnet)
- [x] Étape 2 — Objectif mise à jour LCM nœud par nœud (M · standard → Sonnet)
- [x] Étape 3 — Objectif snapshots zombies (M · standard → Sonnet)
- [x] Étape 4 — Placement levelgen et contrôle `validate-levels` (M · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Niveaux de campagne | E2M3 et E5M8 LCM, E3M7 snapshots, E4M2 migration ; parties à graine : liste d'objectifs élargie | Seules ces 4 cartes changent ; la rotation de `OBJECTIVE_TYPES` reste intacte |
| Sans nouvelle tuile | Nœuds LCM et hôte = racks existants choisis par `LevelGen.pickRacks` (partagé avec le validateur) ; ils deviennent des racks Nutanix (`7`) | Réutilise textures et maillages |
| VM | Palette de serveurs (`x`) mobile dans `L.decor` + entrée de `players` (ciblée par les ennemis, PV) ; avance de 1,3 case/s vers l'hôte quand le joueur est à moins de 5 cases ; cède le passage à un joueur sur sa route | Rendu et ciblage existants ; pas de collision du joueur avec la VM (limite connue) |
| Snapshots | 6 drones marqués `snap`, placés loin du départ | Monstre dédié hors scope |
| Repli | Partie à graine sans assez de racks → objectif evac | Jamais d'objectif impossible |
| Placement (phase 6, Q4) | Parties à graine + un niveau par épisode (épisodes 2 à 5) remplacé | La campagne reste presque inchangée ; `validate-levels` contrôle le résultat |
| Escorte (Q5) | VM qui suit un chemin, endommagée par les ennemis (PV comme la PROD DB de « defend »), reprise via les checkpoints (#6) | Réutilise l'existant |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t25-nutanix.js` (joueur invincible) : E2M3 (LCM : E sur le 2e nœud d'abord, puis les 4 dans l'ordre en maintenant E
4,6 s), E3M7 (snapshots : les 6 supprimés), E4M2 (migration : VM joueur et décor, attente sans escorte, escorte
jusqu'à un checkpoint, mort, restauration, escorte jusqu'à l'hôte ; puis VM détruite), et tirage des nouveaux
objectifs dans 177 niveaux à graine. `t25-view.js` : la VM vue de derrière, qui ne roule pas à travers un joueur
placé sur sa route, puis après escorte.

### Procédure de test

```bash
echo "=== Nutanix Objectives ==="
node run.js t25-nutanix.js --style retro
node run.js t25-view.js --style modern

echo "=== Levels (Campaign With The 4 Nutanix Levels, Seeded Sample) ==="
cd /srv/dev/dukenutanix && node tools/validate-levels.js | grep -E "E2M3|E3M7|E4M2|E5M8|Levels"

echo "=== Full Non Regression Suite (26 Scenarios) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw && node regress.js
```

**Résultats attendus :**
- LCM : 4 nœuds, message « LCM: upgrade the nodes in order, node 1 first. », puis `cur` 4, `done`, 4 tuiles Nutanix ;
- snapshots : 6 au total, 6 supprimés, `done` ;
- migration : VM dans `players` et `L.decor`, attend sans escorte, restaurée comme joueur après checkpoint, arrivée : `done`, hôte devenu Nutanix, VM retirée ; destruction : « MIGRATION FAILED… » ;
- parties à graine : `lcm`, `snapshots`, `migrate` tirés au moins une fois ;
- `t25-view` modern : `blockedTest.moved` = 0, `moved` vrai ; captures de la palette sans artefact ;
- validate-levels : E2M3 lcm, E3M7 snapshots, E4M2 migrate, E5M8 lcm, tous OK, `Levels OK` ;
- `regress.js` : « 26/26 scenarios passed ».

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | LCM (t25, E2M3) | ordre imposé, 4 nœuds mis à jour en maintenant E, devenus Nutanix | conforme | ✅ PASS |
| 2026-10-22 | Snapshots zombies (E3M7) | 6 supprimés, objectif terminé | conforme | ✅ PASS |
| 2026-10-22 | Migration à chaud (E4M2) | VM joueur + décor, attend sans escorte, checkpoint restauré, arrivée sur l'hôte, échec si détruite | conforme | ✅ PASS |
| 2026-10-22 | VM vue et collision (t25-view MODERN) | ne roule pas à travers le joueur, avance escortée, sans artefact | moved 0 / true | ✅ PASS |
| 2026-10-22 | Parties à graine | nouveaux objectifs tirés | lcm 9, snapshots 11, migrate 23 | ✅ PASS |
| 2026-10-22 | validate-levels | 4 niveaux Nutanix OK, Levels OK | conforme | ✅ PASS |
| 2026-10-22 | Non-régression complète (regress.js) | 26/26 | 26/26 PASS | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #25
- ✅ Fait : 3 objectifs Nutanix (mise à jour LCM, snapshots zombies, migration à chaud d'une VM) sur 4 niveaux de campagne et dans les parties à graine
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
