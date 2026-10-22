---
plan:
  id: '21'
  name: 21-custom-seed.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/21-custom-seed.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Saisir une graine dans le menu pour jouer et partager une carte précise.
priority: medium
complexity: XS
intent: null
depends_on: ['20']
blocks: []
labels: [feature]
issue:
  id: 21
  url: https://github.com/Exe64/dukenutanix/issues/21
---

# [🌱] Plan #21 - Saisie d'une graine personnalisée

## Objectif

Permettre aux joueurs de s'échanger des cartes générées en partageant une graine.

## Périmètre

### Inclus
- Champ de saisie dans le menu du mode graine (#20)

### Hors scope
- Éditeur de niveau

### Dépendances

- Dépend de : [`20-daily-seed-endless.md`](20-daily-seed-endless.md) (#20)

## Étapes

- [x] Étape 1 — Saisie d'une graine dans le menu (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Format | Nombre jusqu'à 9 chiffres tel quel, tout autre texte haché (casse ignorée) | On peut partager un mot ; même résultat quelle que soit la casse |
| Partage | Graine affichée dans le menu pause pendant une partie | Pour la retrouver et la transmettre |
| Clavier | Les touches tapées dans le champ ne passent pas par les raccourcis du jeu ; Entrée lance | Espace, flèches, etc. restent utilisables dans le champ |

## Tests

### Prérequis pour les tests

```bash
echo "=== Test Harness Location (Playwright + Headless Chromium With SwiftShader) ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/pw
```

`t21-seed.js` : CUSTOM SEED depuis l'écran titre, saisie au clavier de « 424242 », « nutanix rocks » et « NUTANIX ROCKS »
(Entrée), empreinte de la carte jouée ; la même graine numérique via le chemin des parties (`startRun`) ; texte du menu pause.

### Procédure de test

```bash
echo "=== Custom Seed ==="
node run.js t21-seed.js --style retro

echo "=== Non Regression Smoke ==="
node run.js smoke.js --style modern && node run.js smoke.js --style retro
```

**Résultats attendus :**
- `num.seed` = 424242 ; `word.seed` = `word2.seed` et `word.map` = `word2.map` (casse ignorée) ; `word.map` ≠ `num.map` ;
- `sameAsNum` vrai ; `pauseText` contient « Run seed: 424242 » ;
- capture `t21-custom.png` : titre CUSTOM SEED, champ de saisie avec le texte, boutons PLAY et BACK ;
- `"ok": true` et `"errors": []` partout.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Saisie d'une graine (t21) | nombre tel quel, mot haché sans tenir compte de la casse, cartes différentes | 424242 ; « nutanix rocks » = « NUTANIX ROCKS » = 379777296 | ✅ PASS |
| 2026-10-22 | Cohérence avec les parties | même graine = même carte ; graine affichée dans la pause | true ; « Run seed: 424242 » | ✅ PASS |
| 2026-10-22 | Écran CUSTOM SEED | titre, champ, PLAY, BACK | conforme | ✅ PASS |
| 2026-10-22 | Non-régression smoke MODERN + RETRO | ok, playing | ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #21
- ✅ Fait : saisie d'une graine (nombre ou mot) depuis l'écran titre, graine affichée dans la pause
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
