---
plan:
  id: '18'
  name: 18-players-list-refactor.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/18-players-list-refactor.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Transformer `P` et `INV` en liste de joueurs, testée avec des bots locaux ; fondation du coop et du deathmatch.
priority: medium
complexity: L
intent: null
depends_on: ['13']
blocks: ['26', '27']
labels: [tooling]
issue:
  id: 18
  url: https://github.com/Exe64/dukenutanix/issues/18
---

# [👥] Plan #18 - Liste de joueurs (fondation multijoueur)

## Objectif

Le jeu suppose un joueur unique (`P`, `INV` globaux dans `js/game.js`, ~2000 lignes). ROADMAP.md prévoit d'en faire une liste avant tout réseau.

## Périmètre

### Inclus
- `P`/`INV` → `players[]` avec un joueur local
- IA ennemie : cible = joueur le plus proche visible ; flow field multi-sources
- Bots locaux pour tester
- Rendu : autres joueurs en modèle 3D (MODERN) et sprites 8 rotations (RETRO)

### Hors scope
- Réseau (#26, #27)

### Dépendances

- Dépend de : [`13-fixed-timestep.md`](13-fixed-timestep.md) (#13)
- Bloque : [`26-coop-2p.md`](26-coop-2p.md) (#26)
- Bloque : [`27-deathmatch.md`](27-deathmatch.md) (#27)

## Étapes

- [x] Étape 1 — `P` et `INV` deviennent une liste de joueurs (L · reasoning → Opus)
- [x] Étape 2 — Bots locaux pour tester (M · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Ampleur (phase 6, Q1) | `P` et `INV` restent les alias du joueur local (`players[0]`) ; seuls ciblage IA, dégâts, projectiles, flow field et rendu des autres joueurs deviennent multi-joueurs | Diff réduit, solo identique par construction |
| Bots (Q2) | Outil de test uniquement (`window.__duke.addBot()`) | Sert à tester le multijoueur, pas une fonctionnalité de jeu |
| Tests (Q3) | Tous les scénarios existants + smoke, plus un scénario bot ciblé et blessé par les ennemis | Non-régression large |
| Retour arrière (Q4) | Un commit, annulable par `git revert` | — |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t18-bot.js` (E1M1, joueur invincible) : un bot à 3 cases devant le joueur, un bug à 1,2 case du bot, les autres
ennemis retirés ; relève la cible de l'ennemi, les PV du bot, de l'ennemi et du joueur, puis tue le bot et vérifie que
l'ennemi se retourne vers le joueur. `regress.js` rejoue tous les scénarios des plans précédents un par un (jamais
deux navigateurs à la fois) avec leurs attendus principaux, plus `t18-bot.js` dans les deux styles.

### Procédure de test

```bash
echo "=== Full Non Regression Suite (23 Scenarios) ==="
node regress.js

echo "=== Levels And Repository Smoke Test ==="
cd /srv/dev/dukenutanix && node tools/validate-levels.js | tail -1
```

**Résultats attendus :**
- `regress.js` : 23 lignes PASS, « 23/23 scenarios passed », exit 0 ;
- `t18-bot` : `players` 2, cible de l'ennemi = bot, PV du bot ou de l'ennemi en baisse, PV du joueur à 100 ; après la mort du bot, cible = joueur ;
- captures `t18-bot-modern.png` et `t18-bot-retro.png` : le bot (silhouette de l'admin en noir) devant le joueur, aux prises avec le bug ;
- `Levels OK`.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Bot de test (t18, RETRO + MODERN) | ennemi ciblant le bot, combat, joueur intact ; après la mort du bot, cible = joueur | conforme dans les deux styles | ✅ PASS |
| 2026-10-22 | Rendu des autres joueurs | silhouette de l'admin devant le joueur | conforme (3D en MODERN, sprite en RETRO) | ✅ PASS |
| 2026-10-22 | Non-régression complète (regress.js) | 23/23 scénarios des plans précédents | 23/23 PASS | ✅ PASS |
| 2026-10-22 | validate-levels | Levels OK | Levels OK (1593 ms) | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #18
- ✅ Fait : liste de joueurs (P/INV alias du joueur local), IA ciblant le joueur le plus proche, dégâts et projectiles pour tous, bots de test
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
