---
plan:
  id: '14'
  name: 14-gamepad-remap.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/14-gamepad-remap.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Support manette via l'API Gamepad et menu de remappage des touches sauvegardé localement.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 14
  url: https://github.com/Exe64/dukenutanix/issues/14
---

# [🎮] Plan #14 - Manette et remappage des touches

## Objectif

Pas de manette ni de remappage. L'API Gamepad suffit, sans dépendance ; utile pour l'app desktop (Steam Deck, salon).

## Périmètre

### Inclus
- Lecture de `navigator.getGamepads()` dans la boucle, zone morte, visée au stick
- Navigation des menus à la manette
- Menu de remappage clavier, stocké dans `localStorage`

### Hors scope
- Vibrations
- Configurations par manette

## Étapes

- [x] Étape 1 — Manette via l'API Gamepad (M · standard → Sonnet)
- [x] Étape 2 — Menu de remappage des touches, sauvegardé localement (M · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Touches | `KeyboardEvent.code` par action (`binds`), sauvegardé dans `dukenutanix.keys` | Positions physiques : ZQSD sur AZERTY sans réglage ; Échap, N, G, T, V, F3 restent fixes |
| Remappage | Une touche par action après remappage, bouton « DEFAULT KEYS » | Simple ; les défauts gardent leurs doubles touches (flèches, Shift gauche/droite…) |
| Manette | API Gamepad (mapping standard), lue à chaque frame, zone morte 0,2 | Aucune dépendance ; visée au stick appliquée par frame comme la souris (#13) |
| Menus à la manette | D-pad pour le focus, A pour valider, Start / B pour reprendre ; `button:focus` stylé | Le focus programmatique doit être visible |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t14-input.js` : pause, CONTROLS, remappe « Forward » sur I, vérifie le libellé, la sauvegarde, que W n'avance plus et
que I avance, recharge la page (persistance), remet les touches par défaut ; puis simule une manette standard
(`navigator.getGamepads`) : stick gauche en avant + stick droit + RT pendant 0,9 s, Start, deux fois D-pad bas, A.

### Procédure de test

```bash
echo "=== Remapping And Simulated Gamepad ==="
node run.js t14-input.js --style retro

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `waiting` = « PRESS A KEY... », `forwardLabel` = « I », `saved` et `afterReload` = [KeyI] ;
- `wMovesAfterRemap` faux, `iMovesAfterRemap` vrai ;
- `padMoves`, `padTurns`, `padFires` vrais ; `startPauses` = paused ; `focused` = RESTART LEVEL ; `afterA` = briefing ;
- capture `t14-controls.png` : écran CONTROLS lisible, 10 actions, Forward sur I, boutons DEFAULT KEYS et BACK visibles ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Remappage (t14) | PRESS A KEY..., Forward = I, sauvegardé, conservé après rechargement | conforme | ✅ PASS |
| 2026-10-22 | Effet du remappage | W n'avance plus, I avance | false / true | ✅ PASS |
| 2026-10-22 | Manette simulée en jeu | déplacement, rotation, tir | true / true / true | ✅ PASS |
| 2026-10-22 | Manette dans les menus | Start = pause, D-pad bas ×2 = RESTART LEVEL, A = briefing | conforme | ✅ PASS |
| 2026-10-22 | Écran CONTROLS | lisible, tient dans la fenêtre | conforme (chevauchement des lignes d'aide corrigé ensuite, recontrôlé) | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #14
- ✅ Fait : manette (API Gamepad, jeu et menus) et remappage des touches depuis la pause, sauvegardé
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
