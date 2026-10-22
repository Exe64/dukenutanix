---
plan:
  id: '19'
  name: 19-smoke-test-playwright.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/19-smoke-test-playwright.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Charger E1M1 en MODERN et en RETRO via `window.__duke`, jouer quelques secondes, échouer sur toute exception ; lancé en CI.
priority: medium
complexity: M
intent: null
depends_on: ['7']
blocks: []
labels: [tooling]
issue:
  id: 19
  url: https://github.com/Exe64/dukenutanix/issues/19
---

# [🧪] Plan #19 - Test de fumée navigateur (Playwright)

## Objectif

Aucun test ne lance le jeu. Le hook `window.__duke` existe déjà pour piloter le jeu.

## Périmètre

### Inclus
- Script Playwright (Chromium headless, WebGL logiciel)
- E1M1 en MODERN et RETRO, quelques secondes, `iddqd`, aucune erreur console
- Ajout au workflow CI (#7)

### Hors scope
- Tests visuels par capture d'écran

### Dépendances

- Dépend de : [`7-ci-validate-levels.md`](7-ci-validate-levels.md) (#7)

## Étapes

- [x] Étape 1 — Script Playwright basé sur `window.__duke` (M · standard → Sonnet)
- [x] Étape 2 — Intégration à la CI (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Dépendance | Playwright installé à la volée (`npm install --no-save`), pas de `package.json` | Le jeu reste sans dépendance ni étape de build |
| Scénario | E1M1 dans chaque style : marche, rotation, tir, pause ; échec sur toute erreur de page ou de console | Couvre le chargement, les deux renderers et la boucle de jeu |
| Audio | `--disable-audio-output` | Pas de carte son en CI : sinon une erreur WebAudio étrangère au jeu fait échouer le test |
| GPU | SwiftShader (WebGL logiciel) | Disponible partout ; MODERN y est lent (quelques fps) mais fonctionnel |

## Tests

### Prérequis pour les tests

```bash
echo "=== Playwright And Chromium Of The Local Machine (Chromium Libraries Extracted Locally) ==="
export NODE_PATH=/tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw/node_modules LD_LIBRARY_PATH=/tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/libs/root/usr/lib64 CHROMIUM=$HOME/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell

echo "=== Copy Of The Working Tree With An Exception Injected In The Game Loop ==="
rm -rf /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken19 && mkdir /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken19 && cp -r /srv/dev/dukenutanix/index.html /srv/dev/dukenutanix/js /srv/dev/dukenutanix/fonts /srv/dev/dukenutanix/docs /srv/dev/dukenutanix/tools /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken19/ && sed -i 's|^function update(dt) {|function update(dt) { if (L.time > 1) throw new Error("injected failure");|' /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken19/js/game.js
```

### Procédure de test

```bash
echo "=== Smoke Test On The Repository ==="
cd /srv/dev/dukenutanix && node tools/smoke-test.js; echo "exit=$?"

echo "=== Smoke Test Catches An Injected Error ==="
node /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken19/tools/smoke-test.js; echo "exit=$?"

echo "=== CI Workflow Is Valid ==="
python3 -c "import yaml; print(list(yaml.safe_load(open('/srv/dev/dukenutanix/.github/workflows/ci.yml'))['jobs']))"
```

**Résultats attendus :**
- dépôt : `modern OK` et `retro OK` (E1M1 joué, état paused), « Smoke test OK », `exit=0` ;
- copie cassée : au moins un style en `ERROR` avec « injected failure », « Smoke test failed », `exit=1` ;
- jobs CI : `['levels', 'smoke']`.
Le premier run GitHub du job `smoke` se fera au prochain push (Playwright y installe son Chromium et ses dépendances).

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Smoke test du dépôt | modern OK, retro OK, exit 0 | conforme (E1M1 joué 2.4 s / 3.5 s, paused) | ✅ PASS |
| 2026-10-22 | Smoke test sur une copie avec exception injectée | ERROR + injected failure, exit 1 | ERROR dans les deux styles, exit 1 | ✅ PASS |
| 2026-10-22 | Workflow CI | jobs levels et smoke | ['levels', 'smoke'] | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #19
- ✅ Fait : test de fumée navigateur (tools/smoke-test.js, Playwright) dans les deux styles, lancé en CI
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
