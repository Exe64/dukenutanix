---
plan:
  id: '25'
  name: 25-nutanix-objectives.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/25-nutanix-objectives.md
status: active
date: 2026-10-22
description: >
  Trois objectifs : live migration d'une VM à escorter, mise à jour LCM nœud par nœud, snapshots zombies.
priority: low
complexity: L
intent: null
depends_on: []
blocks: []
labels: [feature]
issue:
  id: 25
  url: https://github.com/Exe64/dukenutanix/issues/25
---

# [🧩] Plan #25 - Nouveaux objectifs Nutanix

## Objectif

Enrichir la rotation des 9 objectifs avec des mécaniques à thème Nutanix qui réutilisent l'existant (escorte, zones, défense).

## Périmètre

### Inclus
- `js/objectives.js` : 3 nouveaux objectifs
- `js/levelgen.js` : placement (`OBJ_NEEDS`), `js/levels.js` : rotation
- `tools/validate-levels.js` : contrôles

### Hors scope
- Nouveaux monstres dédiés

## Étapes

- [ ] Étape 1 — Objectif live migration de VM, à escorter (M · standard → Sonnet)
- [ ] Étape 2 — Objectif mise à jour LCM nœud par nœud (M · standard → Sonnet)
- [ ] Étape 3 — Objectif snapshots zombies (M · standard → Sonnet)
- [ ] Étape 4 — Placement levelgen et contrôle `validate-levels` (M · standard → Sonnet)
- [ ] 🧪 Tests — Rédiger et exécuter la procédure de test
- [ ] ✅ Validation — Vérifier les résultats des tests et clôturer

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|

## Tests

### Prérequis pour les tests

```bash
(à rédiger à l'étape 🧪 Tests)
```

### Procédure de test

```bash
(à rédiger à l'étape 🧪 Tests)
```

**Résultats attendus :** à définir à l'étape 🧪 Tests.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|

## Journal de session

### Session 2026-10-22
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #25
- 📋 Prochain : étape 1
