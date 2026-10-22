---
plan:
  id: '3'
  name: 3-doors-dirty-flag.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/3-doors-dirty-flag.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  `buildDoors` recrée et réenvoie le mesh des portes à chaque frame ; le faire seulement quand un `d.open` change.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: []
labels: [perf]
issue:
  id: 3
  url: https://github.com/Exe64/dukenutanix/issues/3
---

# [🚪] Plan #3 - Portes GPU : reconstruire seulement quand elles bougent

## Objectif

`buildDoors` (`js/gl.js:918-960`) vide les tableaux, recrée un `Float32Array`/`Uint32Array` et appelle `bufferData` à chaque frame, même portes immobiles : allocations et upload inutiles.

## Périmètre

### Inclus
- `js/gl.js` `buildDoors` : signature des `d.open` (et `d.glPush`), sortie anticipée si inchangée, comme `updateCells`
- Forcer la reconstruction au changement de niveau

### Hors scope
- Refonte du rendu des portes

## Étapes

- [x] Étape 1 — Signature des portes, reconstruction seulement si elle change (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Détection du mouvement | Signature texte de `d.open` (3 décimales) + index du niveau | Même approche que `updateCells`, aucune nouvelle structure |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t3-doors.js` compte les appels `bufferData` (WebGL) pendant 2 s d'immobilité, puis place le joueur devant la
porte simple la plus proche d'E1M1, l'ouvre (E), attend l'ouverture complète puis la refermeture (minuteur
raccourci à cause du GPU logiciel) et prend des captures. `../base` est une copie de `HEAD` avant le changement.

### Procédure de test

```bash
echo "=== Door Uploads After The Change ==="
node run.js t3-doors.js --style modern

echo "=== Non Regression Smoke In Both Styles ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `t3-doors.js` : `"ok": true`, `idleUploads` = 0 (aucun envoi quand rien ne bouge), `uploadsWhileOpening` > 0,
  `closedAgain` = `"closed"` ;
- `t3-open.png` : porte ouverte (on voit la pièce derrière) ; `t3-closed.png` : panneau de porte fermé dans son cadre ;
- smoke : `"ok": true` dans les deux styles.
- Référence avant changement (copie de `HEAD`) : `idleUploads` = 2 sur la même fenêtre (2 envois par frame).

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Envois GPU immobile (t3-doors) | idleUploads = 0 | 0 (HEAD avant changement : 2 sur la même fenêtre) | ✅ PASS |
| 2026-10-22 | Ouverture de porte (t3-doors) | uploadsWhileOpening > 0, porte ouverte rendue | 24 envois, passage ouvert visible | ✅ PASS |
| 2026-10-22 | Refermeture (t3-doors) | closedAgain = closed, panneau fermé rendu | closed, panneau dans son cadre | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing, aucune erreur | ok, E1M1 playing, errors [] | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #3
- ✅ Fait : mesh des portes GPU reconstruit seulement quand une porte bouge (signature des d.open)
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
