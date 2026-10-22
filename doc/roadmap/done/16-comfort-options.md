---
plan:
  id: '16'
  name: 16-comfort-options.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/16-comfort-options.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Réglage du champ de vision, balancement de caméra désactivable, mode « effets réduits » (flashes, aberration, grain).
priority: medium
complexity: S
intent: null
depends_on: []
blocks: []
labels: [accessibility]
issue:
  id: 16
  url: https://github.com/Exe64/dukenutanix/issues/16
---

# [♿] Plan #16 - Options de confort et d'accessibilité

## Objectif

`PLANE` est fixé à 0.8 (environ 77°), le balancement est permanent et les flashes, l'aberration chromatique et le grain ne se coupent pas : à rendre réglable, notamment pour la photosensibilité.

## Périmètre

### Inclus
- Curseur de FOV dans la pause (MODERN)
- Interrupteur du balancement de caméra
- Mode effets réduits : flashes de palette, aberration chromatique, grain, secousses

### Hors scope
- Daltonisme
- Sous-titres (existent déjà)

## Étapes

- [x] Étape 1 — Réglage du champ de vision (S · standard → Sonnet)
- [x] Étape 2 — Balancement de caméra désactivable (XS · standard → Sonnet)
- [x] Étape 3 — Mode effets réduits : flashes, aberration, grain (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Réglages | Objet `Comfort` (fov, bob, reduced) sauvegardé dans `dukenutanix.comfort`, boutons et curseur dans la pause | Un seul endroit, lu par les trois renderers |
| Champ de vision | 65–110° en MODERN GPU (`GLR.setFov` → `TAN_H`) | RETRO garde les 90° de Doom ; le rendu logiciel garde 77° |
| Effets réduits | Pas de flashes de palette RETRO, de voiles rouge / jaune / alarme, de secousse, de glitch de dégâts, d'aberration ni de grain | Photosensibilité ; la flèche de direction des dégâts et le visage du HUD restent comme indices |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t16-comfort.js` : coup reçu + secousse avec effets complets, puis bascule HEAD BOB et EFFECTS dans la pause, même coup
avec effets réduits (partie figée à mi-flash pour des captures comparables), marche avec balancement coupé, champ de
vision à 65 puis 110 (MODERN GPU), enfin rechargement de la page.

### Procédure de test

```bash
echo "=== Comfort Options In RETRO ==="
node run.js t16-comfort.js --style retro

echo "=== Comfort Options In MODERN (Field Of View) ==="
node run.js t16-comfort.js --style modern

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `shakeFull` > 0.5, `shakeReduced` = 0 ; `labels0` = HEAD BOB: ON / EFFECTS: FULL, `labels1` = HEAD BOB: OFF / EFFECTS: REDUCED ; `bobAmt` = 0 ;
- `fov` présent seulement en MODERN ; `saved` et `afterReload` identiques (bob faux, reduced vrai ; fov 110 en MODERN) ;
- captures `t16-hurt-full-*.png` teintées de rouge (palette RETRO, voile + glitch MODERN), `t16-hurt-reduced-*.png` sans teinte ;
  `t16-fov110.png` montre nettement plus de la pièce que `t16-fov65.png` ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Bascules de la pause (t16, RETRO + MODERN) | HEAD BOB ON→OFF, EFFECTS FULL→REDUCED | conforme | ✅ PASS |
| 2026-10-22 | Secousse et balancement | secousse > 0.5 puis 0 ; balancement 0 | 0.7 / 0.68 puis 0 ; 0 | ✅ PASS |
| 2026-10-22 | Champ de vision | curseur en MODERN seulement, 65° vs 110° visiblement différents | conforme | ✅ PASS |
| 2026-10-22 | Sauvegarde | réglages identiques après rechargement | conforme (fov 77 RETRO, 110 MODERN) | ✅ PASS |
| 2026-10-22 | Captures des dégâts | rouge avec effets complets, normal avec effets réduits | conforme dans les deux styles | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #16
- ✅ Fait : options de confort dans la pause : champ de vision (MODERN), balancement, effets réduits (photosensibilité), sauvegardées
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
