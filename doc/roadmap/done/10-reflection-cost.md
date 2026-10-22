---
plan:
  id: '10'
  name: 10-reflection-cost.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/10-reflection-cost.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Le reflet redessine toute la scène : le passer à demi-résolution et le sauter quand le sol n'est pas visible.
priority: medium
complexity: S
intent: null
depends_on: ['2']
blocks: []
labels: [perf]
issue:
  id: 10
  url: https://github.com/Exe64/dukenutanix/issues/10
---

# [🪞] Plan #10 - Réduire le coût du reflet du sol

## Objectif

En HIGH, la passe de reflet (`js/gl.js`, `render`) redessine monde, objets, monstres et sprites : le coût de rendu est à peu près doublé. C'est probablement le plus gros levier GPU.

## Périmètre

### Inclus
- Mesure avant/après avec l'overlay (#2)
- FBO de reflet à demi-résolution
- Passe sautée quand le pitch regarde vers le haut (sol hors champ)

### Hors scope
- Reflets en screen space (SSR)

### Dépendances

- Dépend de : [`2-perf-overlay.md`](2-perf-overlay.md) (#2)

## Étapes

- [x] Étape 1 — Mesure du coût du reflet (XS · standard → Sonnet)
- [x] Étape 2 — Reflet à demi-résolution, sauté quand le sol est hors champ (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Demi-résolution | Déjà en place (`resizeBuffers` : `rw = w >> 1`) | La revue l'avait manqué ; rien à changer |
| Saut de la passe | Quand `tan(pitch) ≥ TAN_H × bh / bw` | Exact : le rayon le plus bas du frustum pointe alors au-dessus de l'horizon (les coins aussi, `r` est horizontal) |
| Portée du gain | Seulement en regardant vers le haut (au-delà d'environ 21° en 16:9) | Le coût à l'horizontale est inchangé ; à revoir avec des mesures sur vrai matériel (#22) |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location And A Copy Of HEAD Before The Change ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
rm -rf ../base && mkdir ../base && git -C /srv/dev/dukenutanix archive HEAD | tar -x -C ../base
```

`t10-refl.js` (MODERN HIGH, E1M1) relève les draw calls de l'overlay F3 (#2) à pitch 0, juste sous la limite
(`atan(TAN_H × bh / bw)` − 0,03) et à 0,6 (pitch maximal), avec une capture pour chacun.

### Procédure de test

```bash
echo "=== Draw Calls After The Change ==="
node run.js t10-refl.js --style modern

echo "=== Draw Calls Before The Change (HEAD Copy) ==="
node run.js t10-refl.js --style modern --root $PWD/../base

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- après : `flat.draws` = `below.draws` (reflet conservé tant que le sol peut être visible) et `up.draws` nettement plus bas ;
- avant : `flat.draws` = `up.draws` (le reflet était toujours dessiné) et égal au `flat.draws` d'après (pas de régression à l'horizontale) ;
- capture `t10-up.png` : plafond et haut des murs, ni sol ni artefact ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Draw calls avant (copie HEAD) | reflet toujours dessiné : flat = up | 169 = 169 | ✅ PASS |
| 2026-10-22 | Draw calls après | flat = below, up nettement plus bas | 169 / 169 / 93 (-45 %) | ✅ PASS |
| 2026-10-22 | Pas de régression à l'horizontale | flat après = flat avant | 169 = 169 | ✅ PASS |
| 2026-10-22 | Capture vers le haut | plafond, pas de sol, pas d'artefact | conforme | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing, aucune erreur | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #10
- ✅ Fait : passe de reflet sautée quand le sol est hors champ (la demi-résolution existait déjà)
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
