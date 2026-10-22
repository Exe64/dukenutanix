---
plan:
  id: '20'
  name: 20-daily-seed-endless.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/20-daily-seed-endless.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Niveaux générés à partir d'une graine hors campagne : une graine par date et un enchaînement infini, avec scores locaux.
priority: medium
complexity: M
intent: null
depends_on: []
blocks: ['21']
labels: [feature]
issue:
  id: 20
  url: https://github.com/Exe64/dukenutanix/issues/20
---

# [🎲] Plan #20 - Graine du jour et mode infini

## Objectif

Le générateur est déjà seedé : une graine aléatoire donne des niveaux à l'infini, une graine par date permet de comparer ses scores.

## Périmètre

### Inclus
- Mode « graine du jour » (graine = date) et « infini » (difficulté croissante)
- Paramètres de génération (épisode, objectif) dérivés de la graine
- Scores locaux par graine

### Hors scope
- Classement en ligne
- Saisie d'une graine (#21)

### Dépendances

- Bloque : [`21-custom-seed.md`](21-custom-seed.md) (#21)

## Étapes

- [x] Étape 1 — Niveaux générés hors campagne à partir d'une graine (M · standard → Sonnet)
- [x] Étape 2 — Graine du jour et scores locaux (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Génération | `seedLevel(seed, depth)` : spec d'un niveau de campagne choisi selon la profondeur (3 niveaux par palier, sans arène de boss), graine et objectif tirés de la graine de la partie | Réutilise générateur, objectifs et équilibrage existants |
| Règles | Une vie : la mort termine la partie ; inventaire conservé ; difficulté ON-CALL ; checkpoints conservés | Esprit « run » ; pas de sauvegarde de campagne touchée |
| Scores | Meilleure profondeur par graine dans `dukenutanix.runs` | Classement en ligne hors scope |
| Cache des portes GPU (#3) | Comparé à l'objet niveau plutôt qu'à `L.idx` | En mode partie tous les niveaux ont l'index 0 : le maillage d'une profondeur aurait pu resservir à la suivante |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t20-runs.js` : boutons de l'écran titre, DAILY RUN, profondeur 1 (graine = date), fin de niveau avec un inventaire
marqué (77 cage nuts), profondeur 2, mort, RUN OVER, RETRY (même carte), ENDLESS (autre graine), retour à la campagne.

### Procédure de test

```bash
echo "=== Seeded Runs In RETRO And MODERN ==="
node run.js t20-runs.js --style retro
node run.js t20-runs.js --style modern

echo "=== Generated Levels Valid (Campaign And Seeded Sample) ==="
cd /srv/dev/dukenutanix && node tools/validate-levels.js | tail -2

echo "=== Non Regression: Doors Cache And Smoke ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw && node run.js t3-doors.js --style modern && node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `titleButtons` = DAILY RUN, ENDLESS RUN ; `dailySeed.seed` = `dailySeed.expected` ; `daily1.title` commence par « DEPTH 1 » ;
- `cleared.next` vrai ; `depth2` = {depth 2, nuts 77} ; `map2` ≠ `map1` ;
- `over.title` = RUN OVER, boutons RETRY THIS SEED / MAIN MENU, `runs` = {<graine du jour>: 1}, `campaignSave` null ;
- `retryMapSame` vrai ; `endless.daily` faux et `endless.seed` ≠ graine du jour ; `campaignRun` null ;
- validate-levels : « 72 seeded run levels checked » et « Levels OK » ;
- t3-doors : `idleUploads` 0, `closedAgain` closed ; `"ok": true`, `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Parties à graine (t20, RETRO + MODERN) | boutons, graine du jour = date, profondeur 2 avec inventaire conservé, RUN OVER, retry identique, endless autre graine, retour campagne | conforme dans les deux styles | ✅ PASS |
| 2026-10-22 | validate-levels | 72 niveaux à graine + Levels OK | conforme (1750 ms) | ✅ PASS |
| 2026-10-22 | Non-régression portes (t3, 1re vérification) | idleUploads 0, ouverture, refermeture | timeout : l'attente de l'état « mi-ouvert » est ratée quand une frame SwiftShader fait 14 pas de logique (#13) ; porte bien ouverte (open 1) | ❌ FAIL (test) |
| 2026-10-22 | Non-régression portes (t3, attente mi-ouverture retirée) | idleUploads 0, ouverture, refermeture | 0 / 6 / closed, captures conformes | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #20
- ✅ Fait : parties à graine : graine du jour et mode infini, une vie, inventaire conservé, meilleure profondeur par graine
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
