---
plan:
  id: '9'
  name: 9-release-actions-node24.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/9-release-actions-node24.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Mettre à jour les actions de `release.yml` vers des versions qui tournent sur Node 24.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: []
labels: [tooling]
issue:
  id: 9
  url: https://github.com/Exe64/dukenutanix/issues/9
---

# [⬆️] Plan #9 - Actions de release sur Node 24

## Objectif

Item de ROADMAP.md : les versions actuelles des actions GitHub vont être dépréciées avec le passage des runners à Node 24.

## Périmètre

### Inclus
- `.github/workflows/release.yml` : versions des actions (checkout, setup-node, cache, upload, tauri-action…)

### Hors scope
- Refonte du workflow

## Étapes

- [x] Étape 1 — Mise à jour des actions de `release.yml` (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Versions retenues | `checkout@v5`, `setup-node@v5`, `upload-artifact@v6`, `action-gh-release@v3` | Plus petite majeure en Node 24 pour chacune : moins de ruptures d'un coup |
| Inchangées | `tauri-action@v0`, `rust-cache@v2`, `rust-toolchain@stable` | Déjà en Node 24 (ou composite) |
| Rupture setup-node v5 (cache auto si `packageManager`) | Sans effet | Pas de `package.json` dans le dépôt |

## Tests

### Prérequis pour les tests

```bash
echo "=== Script Listing Each Action With The Runtime Declared In Its action.yml ==="
cat /tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/check-actions.sh
```

### Procédure de test

```bash
echo "=== Runtime Of Every Action Used By The Workflows ==="
/tmp/claude-1000/-srv-dev-dukenutanix/fa464578-cf0e-43e8-8bea-0d3448b70cba/scratchpad/check-actions.sh

echo "=== Workflows Are Valid YAML ==="
python3 -c "import yaml; [yaml.safe_load(open(f)) for f in ['/srv/dev/dukenutanix/.github/workflows/ci.yml','/srv/dev/dukenutanix/.github/workflows/release.yml']]; print('yaml ok')"
```

**Résultats attendus :** chaque action déclare `node24` (ou `composite` pour `dtolnay/rust-toolchain`) ; `yaml ok`.
Contrôle complémentaire après push : Actions › Release › Run workflow sans version (build de test) doit réussir sans avertissement de dépréciation Node 20.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Runtime des actions (check-actions.sh) | node24 partout (composite toléré pour rust-toolchain) | checkout@v5, setup-node@v5, upload-artifact@v6, action-gh-release@v3, rust-cache@v2, tauri-action@v0 : node24 ; rust-toolchain : composite | ✅ PASS |
| 2026-10-22 | Workflows valides | yaml ok | yaml ok | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #9
- ✅ Fait : actions de release.yml passées sur des versions Node 24
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
