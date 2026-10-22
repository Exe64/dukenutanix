---
plan:
  id: '12'
  name: 12-lazy-asset-build.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/12-lazy-asset-build.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Mesurer le démarrage et ne construire les armes RETRO qu'au premier passage en RETRO.
priority: medium
complexity: S
intent: null
depends_on: ['2']
blocks: []
labels: [perf]
issue:
  id: 12
  url: https://github.com/Exe64/dukenutanix/issues/12
---

# [⏱️] Plan #12 - Démarrage plus rapide : assets construits à la demande

## Objectif

`boot()` génère tout au démarrage : textures 512 px, normal maps, mipmaps, 3 jeux d'armes, monstres 3D. Construire à la demande ce qui n'est pas utilisé par le style actif.

## Périmètre

### Inclus
- Mesure du temps de `boot()` par poste
- Armes RETRO (et autres assets propres à un style) construites au premier passage dans ce style

### Hors scope
- Cache IndexedDB des assets générés (à réévaluer après mesure)

### Dépendances

- Dépend de : [`2-perf-overlay.md`](2-perf-overlay.md) (#2)

## Étapes

- [x] Étape 1 — Mesure du temps de démarrage (XS · standard → Sonnet)
- [x] Étape 2 — Armes RETRO construites au premier passage en RETRO (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Mesure du démarrage (SwiftShader) | `buildAssets` ~8 s (commun aux deux styles), init GPU ~9 s, armes HD 2-5 s, armes RETRO ~1 s, maillages 3D < 0,3 s | Seules les armes et les maillages 3D sont propres à un style |
| Construction différée | Armes RETRO, armes HD, maillages 3D des armes et des monstres construits au premier usage du style (`setStyle`) | Changement local, aucun autre appelant |
| Gain mesuré | RETRO 9,2 → 7,0 s (−24 %) ; MODERN 15,9 → 15,7 s (≈ −2 %) | Le gros du démarrage MODERN (`buildAssets` partagé, textures GPU) reste à traiter ailleurs, après mesure sur vrai matériel (#22) |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location And A Copy Of HEAD Before The Change ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
rm -rf ../base && mkdir ../base && git -C /srv/dev/dukenutanix archive HEAD | tar -x -C ../base
```

`t12-boot.js` mesure le temps entre la navigation et l'écran titre (`performance.now()`), note les assets d'armes
construits, puis joue E1M1, bascule deux fois de style (T) en marchant et relève l'état final avec une capture.

### Procédure de test

```bash
echo "=== RETRO Start: After, Then Before ==="
node run.js t12-boot.js --style retro
node run.js t12-boot.js --style retro --root $PWD/../base

echo "=== MODERN Start: After, Then Before ==="
node run.js t12-boot.js --style modern
node run.js t12-boot.js --style modern --root $PWD/../base

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- départ RETRO (après) : `built0` = retro seul (`hi`, `w3d`, `m3d` faux) ; `bootMs` nettement inférieur à celui de la copie HEAD ;
- départ MODERN (après) : `built0` sans `retro` ; `bootMs` du même ordre que HEAD (gain faible) ;
- après les deux bascules : tout est construit, `weapon` correspond au style final (`retro` → retro, `modern` → hi) ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Démarrage RETRO | armes RETRO seules construites, boot < HEAD -10 % | 9168 → 6812 ms (-25.7 %) | ✅ PASS |
| 2026-10-22 | Démarrage MODERN | pas d'armes RETRO, boot ≤ HEAD +10 % | 15867 → 15319 ms (-3.5 %) | ✅ PASS |
| 2026-10-22 | Bascules de style (T) | assets manquants construits, arme du style final | conforme dans les deux sens | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing, aucune erreur | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #12
- ✅ Fait : armes et maillages 3D construits au premier usage de leur style (démarrage RETRO -26 %, MODERN -3 %)
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
