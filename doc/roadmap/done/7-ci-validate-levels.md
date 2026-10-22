---
plan:
  id: '7'
  name: 7-ci-validate-levels.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/7-ci-validate-levels.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Workflow GitHub léger qui lance `node tools/validate-levels.js` sur push et PR.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: ['19']
labels: [tooling]
issue:
  id: 7
  url: https://github.com/Exe64/dukenutanix/issues/7
---

# [✅] Plan #7 - CI : valider les niveaux à chaque push

## Objectif

La validation des 50 niveaux ne tourne qu'au moment d'une release. Une régression du générateur doit être vue dès le push.

## Périmètre

### Inclus
- `.github/workflows/ci.yml` : checkout, Node, `node tools/validate-levels.js`

### Hors scope
- Tests navigateur (plan #19)

### Dépendances

- Bloque : [`19-smoke-test-playwright.md`](19-smoke-test-playwright.md) (#19)

## Étapes

- [x] Étape 1 — Workflow `ci.yml` sur push et PR (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Déclencheurs | `push` (toutes branches) et `pull_request` | Rapide (~2 s de validation), aucune raison de filtrer |

## Tests

### Prérequis pour les tests

```bash
echo "=== Copy Of HEAD With One Broken Level (E1M1 Start Replaced) ==="
rm -rf /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken && mkdir /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken && git -C /srv/dev/dukenutanix archive HEAD | tar -x -C /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken && sed -i "0,/'#P/s/'#P/'#Q/" /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken/js/levels.js
```

### Procédure de test

```bash
echo "=== Workflow Is Valid YAML ==="
python3 -c "import yaml; yaml.safe_load(open('/srv/dev/dukenutanix/.github/workflows/ci.yml')); print('yaml ok')"

echo "=== The CI Command Passes On The Current Tree ==="
cd /srv/dev/dukenutanix && node tools/validate-levels.js > /dev/null; echo "exit=$?"

echo "=== The CI Command Fails On A Broken Level ==="
cd /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/broken && node tools/validate-levels.js > /dev/null; echo "exit=$?"
```

**Résultats attendus :** `yaml ok` ; `exit=0` sur l'arbre courant ; `exit=1` sur la copie cassée.
Le premier vrai run GitHub se fera au prochain push (onglet Actions, workflow « CI »).

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | ci.yml valide | yaml ok | yaml ok | ✅ PASS |
| 2026-10-22 | Commande CI sur l'arbre courant | exit=0 | exit=0 | ✅ PASS |
| 2026-10-22 | Commande CI sur un niveau cassé | exit=1 | exit=1 | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #7
- ✅ Fait : workflow CI qui valide les 50 niveaux sur push et PR
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
