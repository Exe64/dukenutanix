---
plan:
  id: '24'
  name: 24-achievements.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/24-achievements.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Succès stockés localement (migrations, boss sans dégâts, secrets…) avec notification en jeu.
priority: low
complexity: S
intent: null
depends_on: []
blocks: []
labels: [feature]
issue:
  id: 24
  url: https://github.com/Exe64/dukenutanix/issues/24
---

# [🏅] Plan #24 - Succès

## Objectif

Donner de la rejouabilité et mettre en avant le bonus des migrations Nutanix.

## Périmètre

### Inclus
- Liste de succès (5/5 migrations sur un épisode, boss sans dégâts, tous les secrets…)
- Stockage local, notification, page dans le menu

### Hors scope
- Succès Steam

## Étapes

- [x] Étape 1 — Succès stockés localement, avec notification (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Liste | 10 succès (migrations, secrets, ennemis, temps de référence, rang S, boss sans dégât, ROOT, profondeur 5, 25 migrations et 10 écrasements cumulés) | Mettent en avant les mécaniques propres au jeu (migrations, parties à graine, difficulté) |
| Stockage | `dukenutanix.achievements` : date de déblocage par succès + compteurs cumulés | Local, comme le reste ; succès Steam hors scope |
| Annonce | Message + jingle en jeu ; liste « ACHIEVEMENT UNLOCKED » sur l'écran de fin | Les messages ne sont plus visibles une fois le niveau terminé |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t24-ach.js` part d'un profil vierge et termine des niveaux via `completeLevel()` avec un état préparé : E1M1
(toutes les migrations, tous les ennemis, sous le temps de référence) deux fois, E1M10 avec un dégât, E1M5 sans dégât,
E1M3 avec son secret trouvé, E1M2 en ROOT ; puis incrémente les compteurs (25 migrations, 10 écrasements) et termine
la profondeur 5 d'une partie à graine.

### Procédure de test

```bash
echo "=== Achievements ==="
node run.js t24-ach.js --style retro

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `start` = « ACHIEVEMENTS 0/10 » ; `e1m1` = FULL MIGRATION, ZERO BUGS, SLA MET, FIVE NINES ; `e1m1Again` vide ;
- `bossHurt` vide ; `miniClean` = UNTOUCHABLE ; `secrets` = ARCHAEOLOGIST ; `root` = ROOT ACCESS ;
- `counters` contient cloudNative et stomper ; `deep` = DEEP DIVE ; `end` = « ACHIEVEMENTS 10/10 » ;
- captures : écran de fin avec les 4 succès groupés sous les stats ; écran ACHIEVEMENTS avec 10 lignes datées ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Déblocages par niveau (t24) | 4 succès sur E1M1, aucun en double, UNTOUCHABLE seulement sans dégât, ARCHAEOLOGIST, ROOT ACCESS | conforme | ✅ PASS |
| 2026-10-22 | Compteurs et parties | CLOUD NATIVE, GARBAGE COLLECTOR, DEEP DIVE | conforme | ✅ PASS |
| 2026-10-22 | Écrans | fin de niveau avec succès groupés ; ACHIEVEMENTS 10/10 datés | conforme | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #24
- ✅ Fait : 10 succès stockés localement, annoncés en jeu et sur l'écran de fin, listés depuis l'écran titre
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
