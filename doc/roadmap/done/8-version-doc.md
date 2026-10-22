---
plan:
  id: '8'
  name: 8-version-doc.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/done/8-version-doc.md
status: done
date: 2026-10-22
enriched: 2026-10-22
description: >
  Suivre `doc/` (plans de roadmap) dans git ; `graft/` est déjà ignoré.
priority: high
complexity: XS
intent: null
depends_on: []
blocks: []
labels: [tooling]
issue:
  id: 8
  url: https://github.com/Exe64/dukenutanix/issues/8
---

# [🙈] Plan #8 - Versionner doc/

## Objectif

`doc/` n'est pas suivi par git alors qu'il contient les plans. `graft/` est déjà dans `.gitignore` (fait par une autre session).

## Périmètre

### Inclus
- Ajout de `doc/` au dépôt
- Vérifier que `.gitignore` et `.ignore` couvrent bien `graft/`

### Hors scope
- Autres nettoyages du dépôt

## Étapes

- [x] Étape 1 — `doc/` suivi par git (XS · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test
- [x] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Périmètre | `doc/` suivi ; `doc/roadmap/.skill-config.yml` versionné | Les plans sont déjà commités ; la config du workflow (mode de tests…) doit suivre le dépôt |
| `.gitignore` / `.ignore` | Laissés à l'autre session | Modifications non commitées qui lui appartiennent |

## Tests

### Prérequis pour les tests

```bash
echo "=== Repository ==="
cd /srv/dev/dukenutanix
```

### Procédure de test

```bash
echo "=== Roadmap Plans And Config Tracked By Git ==="
git ls-files doc/roadmap | grep -c '\.md$' && git ls-files doc/roadmap/.skill-config.yml doc/roadmap/roadmap.md

echo "=== graft Is Ignored In The Working Tree ==="
mkdir -p graft && touch graft/.probe && git check-ignore -v graft/.probe; rm -f graft/.probe
```

**Résultats attendus :** au moins 27 plans `.md` suivis (dont `done/`), `.skill-config.yml` et `roadmap.md` listés ;
`git check-ignore` affiche une règle `.gitignore` qui couvre `graft/`.
Note : la règle `/graft/` du `.gitignore` est une modification non commitée de l'autre session (plan #1) ; elle sera
versionnée avec son commit.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-10-22 | Plans suivis par git | ≥ 27 .md | 28 | ✅ PASS |
| 2026-10-22 | Config et roadmap suivies | .skill-config.yml et roadmap.md listés | listés | ✅ PASS |
| 2026-10-22 | graft/ ignoré | règle .gitignore couvrant graft/ | .gitignore:7:/graft/ (modification de l'autre session, à commiter par elle) | ✅ PASS |

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #8
- ✅ Fait : doc/ versionné, avec la config du workflow ; graft/ ignoré via la modification de l'autre session
- ✅ Validation : tests finaux PASS (vérificateur indépendant), plan clôturé
