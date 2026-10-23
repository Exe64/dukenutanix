---
plan:
  id: '26'
  name: 26-coop-2p.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/26-coop-2p.md
status: active
date: 2026-10-22
description: >
  Coop à 2 sur la campagne via WebRTC (hôte autoritaire), avant le deathmatch.
priority: low
complexity: XL
intent: null
depends_on: ['18']
blocks: []
labels: [feature]
issue:
  id: 26
  url: https://github.com/Exe64/dukenutanix/issues/26
---

# [🤝] Plan #26 - Campagne en coop à 2

## Objectif

La coop réutilise la campagne et teste le réseau sur un mode moins exigeant que le PvP.

## Périmètre

### Inclus
- WebRTC pair à pair, l'hôte fait tourner le jeu et diffuse l'état ~20 fois/s
- Connexion par codes copiés-collés
- Règles coop : objectifs partagés, réapparition

### Hors scope
- Relais / codes de salle (#27)
- Plus de 2 joueurs

### Dépendances

- Dépend de : [`18-players-list-refactor.md`](18-players-list-refactor.md) (#18)

## Étapes

- [ ] Étape 1 — Réseau WebRTC hôte vers client (L · reasoning → Opus)
- [ ] Étape 2 — Campagne en coop à 2 (L · reasoning → Opus)
- [ ] 🧪 Tests — Rédiger et exécuter la procédure de test
- [ ] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Autorité | L'hôte fait tourner le niveau ; l'invité ne simule que son admin (déplacement, ramassage local) et envoie pose, tirs, actions, ramassages, soins à 20 Hz | Simple et sans divergence de la simulation |
| Instantanés | 20 Hz : ennemis, projectiles, effets, portes, objets pris, tuiles modifiées, barils, ligne d'objectif, badges, compteurs, PV de l'invité | JSON compact (2 décimales) |
| Tirs de l'invité | Tirés par l'hôte depuis l'admin de l'invité (`shoot(w, from, a)` extrait de `fire`) ; corps à corps : ennemi le plus proche devant | Même balistique que le solo |
| Actions | `actOnCell` extrait de `useAction` : l'invité ouvre portes et passages, actionne objectifs et terminal via l'hôte | Un seul code pour les deux |
| Morts | Réapparition au départ après 3 s (hôte et invité) ; un échec d'objectif termine le niveau ; pas de checkpoints en coop | Coop sans écran de mort bloquant |
| Déconnexion | `pagehide` ferme le canal ; état de connexion surveillé | L'autre côté est prévenu tout de suite |
| Revue adversariale (workflow) | 3 angles (désynchronisation, cycle de vie, entrées non fiables) + réfutation : 24 défauts confirmés, tous corrigés (écrasement, soins, objets lâchés, batteries, VM, minuteur, messages, maintien de E, échec et départ de l'hôte, coupures réseau brèves, annulation, validation des messages, rôles) | Couverts par `t26-fixes.js` |
| Seconde revue (workflow) | 16 défauts confirmés sur le diff des corrections, tous corrigés : messages partagés (événements du monde, relayés) ou personnels (retours d'action), soins liés au ramassage accepté, fontaine via l'hôte, pas de tir ni d'action pendant la pause de l'hôte, minuteur de réapparition seulement en jeu, victoire finale pour l'invité, réparation arrêtée au départ de l'invité, erreurs de connexion exactes, code d'offre invalide sans effet de bord | Couverts par `t26-fixes.js` |
| Limites connues | Armure de l'invité ignorée ; lumière de l'invité non recalculée (objectif power) ; sons des actions de l'invité joués chez l'hôte | Documentées dans le README |
| Ordre (phase 6, Q1) | Coop d'abord, le deathmatch (#27) réutilise sa couche réseau | — |
| Mise en relation (Q2) | Codes copiés-collés (offre / réponse WebRTC complètes, sans trickle), aucun serveur | Testable de bout en bout en local (deux pages Chromium) |
| Limites (Q4) | Pas de relais TURN (certains NAT stricts bloqueront) ; WebRTC incertain dans l'app Linux (WebKitGTK) ; tests en local seulement | Documentées dans le README |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t26-coop.js` ouvre deux contextes de navigateur isolés (hôte et invité), échange les codes par les champs texte comme
deux joueurs, entre dans E1M1 des deux côtés, puis vérifie : positions croisées, tir de l'invité exécuté par l'hôte,
dégâts, mort et réapparition de l'invité, porte ouverte et objet ramassé par l'invité via l'hôte, passage au niveau
suivant, départ de l'invité. Limite : connexion sur la même machine seulement (pas de vraie traversée de NAT testée).

### Procédure de test

```bash
echo "=== Coop End To End In RETRO And MODERN ==="
node t26-coop.js --style retro
node t26-coop.js --style modern

echo "=== Review Fixes: Stomp, Drops, Batteries, Hold E, Refused Door, Failure, Host Leaving ==="
node t26-fixes.js --style retro
node t26-fixes.js --style modern

echo "=== Full Non Regression Suite (fire and useAction were refactored) ==="
node regress.js
```

**Résultats attendus :**
- `connected` : hôte et invité en E1M1, 2 joueurs chacun ; `poses` : vrai / vrai ;
- `shot` : PV de l'ennemi < 500, identiques chez l'invité ; `hurt` ≤ 70 ; `respawn` : 100 PV, à `start2`, playing ;
- `door` « opened on both », `item` « taken on the host » ; `nextLevel` : E1M2 des deux côtés, 2 joueurs chez l'invité ;
- `left` : 1 joueur, message « The other admin left the session » ;
- captures : l'hôte voit l'admin de l'invité, l'invité voit l'admin de l'hôte ;
- `t26-fixes` : écrasement par l'invité tué sur l'hôte (`hostState` dying), objet lâché vu et pris via l'hôte,
  batterie détruite qui ne bloque plus l'invité (`guestBlock` 0), refus de porte affiché chez l'invité seulement,
  réparation d'un CRAC en maintenant E chez l'invité (`fixedOnHost` 1, vue par l'invité), « Power restored » déclenché par
  l'invité affiché des deux côtés, médikit de l'invité soigné une seule fois (75 / 75), aucun tir dépensé pendant la pause
  de l'hôte (`spent` 0), écran d'échec chez l'invité, « SESSION CLOSED » quand l'hôte part ;
- `regress.js` : « 26/26 scenarios passed ».

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #26
- 📋 Prochain : étape 1
