---
plan:
  id: '17'
  name: 17-level-records.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/17-level-records.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Temps de référence par niveau, meilleur temps et rang enregistrés et affichés en fin de niveau.
priority: medium
complexity: S
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 17
  url: https://github.com/Exe64/dukenutanix/issues/17
---

# [🏆] Plan #17 - Temps de référence, records et rang

## Objectif

La sauvegarde ne garde que `maxLevel`. Un temps de référence, un record et un rang donnent de la rejouabilité.

## Périmètre

### Inclus
- Temps de référence par niveau (`js/levels.js`)
- Meilleur temps, kills/secrets dans la sauvegarde
- Rang sur l'écran de fin et dans la sélection de niveau

### Hors scope
- Classements en ligne

## Étapes

- [x] Étape 1 — Temps de référence par niveau (XS · standard → Sonnet)
- [x] Étape 2 — Meilleur temps et rang dans la sauvegarde et l'écran de fin (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Temps de référence | `90 s + surface / 6`, arrondi à 15 s (3:30 à 8:00) dans `getLevel` | Déterministe, proportionnel à la taille de la carte ; à ajuster à la main si besoin |
| Rang | S / A / B / C : un point par critère (temps de référence, 100 % ennemis, 100 % secrets) | Simple et lisible, inspiré des stats de Doom |
| Sauvegarde | `records[idx] = {time, rank}` dans la sauvegarde, meilleur temps et meilleur rang gardés séparément | Un mauvais passage n'efface rien |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t17-records.js` termine E1M1 trois fois via `completeLevel()` : en 1:40 sans ennemi tué, en 5:00 sans ennemi tué,
puis en 0:50 avec tous les ennemis (E1M1 n'a pas de secret) ; relève le tableau de fin et le record sauvegardé,
puis ouvre la sélection de niveau.

### Procédure de test

```bash
echo "=== Par Time, Best Time And Rank ==="
node run.js t17-records.js --style retro

echo "=== Non Regression ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro && cd /srv/dev/dukenutanix && node tools/validate-levels.js | tail -1
```

**Résultats attendus :**
- `par` = 225 (PAR 3:45) ;
- 1re fin : TIME « 1:40 BEST! », BEST 1:40, RANK A, record {time 100, rank A} ;
- 2e fin : TIME 5:00 sans BEST!, BEST 1:40, RANK B, record inchangé {100, A} ;
- 3e fin : TIME « 0:50 BEST! », RANK S, record {50, S} ;
- sélection : bouton 1-1 « 1-1S », info-bulle « … best 0:50, rank S » ; captures lisibles, grille régulière ;
- `"ok": true`, `"errors": []`, `Levels OK`.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Fins de niveau (t17) | 1:40 BEST! rang A ; 5:00 rang B sans écraser ; 0:50 BEST! rang S | conforme, records {100, A} puis {50, S} | ✅ PASS |
| 2026-10-22 | Sélection de niveau | 1-1S, info-bulle best 0:50 rank S, grille régulière | conforme | ✅ PASS |
| 2026-10-22 | Non-régression (1re vérification) | smoke MODERN + RETRO, Levels OK | smoke MODERN bloqué 31 min (deux Chromium SwiftShader en parallèle sur la machine), le reste non exécuté | ❌ FAIL |
| 2026-10-22 | Non-régression (2e vérification, seul sur la machine) | smoke MODERN + RETRO, Levels OK | ok / ok / Levels OK (678 ms) | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #17
- ✅ Fait : temps de référence par niveau, meilleur temps et rang (S/A/B/C) à l'écran de fin et dans la sélection
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
