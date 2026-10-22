---
plan:
  id: '5'
  name: 5-difficulty-levels.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/5-difficulty-levels.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Choix de la difficulté au lancement d'une partie : densité d'ennemis et multiplicateur de dégâts, niveaux seedés inchangés.
priority: high
complexity: M
intent: null
depends_on: []
blocks: []
labels: [gameplay]
issue:
  id: 5
  url: https://github.com/Exe64/dukenutanix/issues/5
---

# [🎚️] Plan #5 - Niveaux de difficulté

## Objectif

Le joueur ne peut pas choisir la difficulté. À la manière de Doom, filtrer des ennemis au chargement et appliquer un multiplicateur de dégâts, sans toucher aux cartes seedées.

## Périmètre

### Inclus
- Menu : choix parmi 4 niveaux au lancement d'une nouvelle partie, stocké dans la sauvegarde
- `js/game.js` `loadLevel` : filtrage déterministe des ennemis, multiplicateur de dégâts reçus
- `tools/validate-levels.js` : contrôle par difficulté (mini-boss et boss toujours présents)

### Hors scope
- Difficulté adaptative en cours de partie
- Changement de difficulté en cours de campagne

## Étapes

- [x] Étape 1 — Choix de la difficulté au lancement, stocké dans la sauvegarde (S · standard → Sonnet)
- [x] Étape 2 — Filtrage des ennemis et multiplicateur de dégâts dans `loadLevel` (M · standard → Sonnet)
- [x] Étape 3 — `validate-levels` par difficulté (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Niveaux | INTERN (60 % des ennemis, dégâts ×0.5), SYSADMIN (80 %, ×0.75), ON-CALL (100 %, ×1), ROOT (100 %, ×1.5) | À la Doom : moins de monstres et de dégâts en facile ; ROOT durcit par les dégâts faute de monstres en plus sur la carte |
| Filtrage | Déterministe par cellule (même hachage que `L.variant`), seulement b d o t m | Cartes seedées inchangées ; boss, mini-boss et voleur toujours présents |
| Partage | `SKILLS` et `keepEnemy` dans `levels.js` | Utilisés par le jeu et par `validate-levels` |
| Choix | Au NEW GAME, sauvegardé ; CONTINUE et la sélection de niveau reprennent la difficulté sauvegardée | Pas de changement en cours de campagne (hors scope) |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t5-skill.js` passe par le menu NEW GAME, choisit INTERN, ON-CALL puis ROOT, relève le texte du briefing, le
nombre d'ennemis d'E1M1, les PV perdus pour 20 points de dégâts (sans armure) et la difficulté sauvegardée ;
il vérifie aussi que CONTINUE restaure la difficulté sauvegardée.

### Procédure de test

```bash
echo "=== Difficulty Menu, Enemies, Damage, Save ==="
node run.js t5-skill.js --style retro

echo "=== Levels Valid With Enemies Left On The Easiest Difficulty ==="
cd /srv/dev/dukenutanix && node tools/validate-levels.js | sed -n '1p;$p'

echo "=== Non Regression Smoke In Both Styles ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw && node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `buttons` = INTERN, SYSADMIN, ON-CALL, ROOT ; capture `t5-skill-menu.png` : 4 boutons avec leur description, ON-CALL en avant ;
- INTERN : briefing « Difficulty: INTERN », 6 ennemis sur E1M1, 10 PV perdus, `savedSkill` 0 ;
- `continued` = 0 ;
- ON-CALL : 10 ennemis, 20 PV perdus, `savedSkill` 2 ; ROOT : 10 ennemis, 30 PV perdus, `savedSkill` 3 ;
- `validate-levels` : E1M1 « enemies 10 ( 6 intern) », `Levels OK` ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Menu de difficulté (t5-skill) | 4 boutons avec description, ON-CALL en avant | INTERN, SYSADMIN, ON-CALL, ROOT ; ON-CALL en rouge et plus grand | ✅ PASS |
| 2026-10-22 | INTERN | briefing INTERN, 6 ennemis E1M1, 10 PV perdus sur 20, sauvegarde 0 | conforme | ✅ PASS |
| 2026-10-22 | CONTINUE | restaure la difficulté sauvegardée | 0 | ✅ PASS |
| 2026-10-22 | ON-CALL / ROOT | 10 ennemis ; 20 / 30 PV perdus ; sauvegarde 2 / 3 | conforme | ✅ PASS |
| 2026-10-22 | validate-levels | E1M1 enemies 10 (6 intern), Levels OK | conforme (769 ms) | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing, aucune erreur | ok, E1M1 playing, errors [] | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #5
- ✅ Fait : 4 niveaux de difficulté choisis au NEW GAME (ennemis filtrés, dégâts ajustés), sauvegardés, contrôlés par validate-levels
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
