---
plan:
  id: '27'
  name: 27-deathmatch.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/27-deathmatch.md
status: active
date: 2026-10-22
description: >
  Mode multijoueur séparé (2 à 8 joueurs) : arènes, réapparition des objets, scoreboard, relais pour codes de salle.
priority: low
complexity: XL
intent: null
depends_on: ['18']
blocks: []
labels: [feature]
issue:
  id: 27
  url: https://github.com/Exe64/dukenutanix/issues/27
---

# [⚔️] Plan #27 - Deathmatch et team deathmatch

## Objectif

Item principal de ROADMAP.md : un mode multijoueur à côté de la campagne.

## Périmètre

### Inclus
- Arènes construites à partir des tuiles, points de spawn, objets qui réapparaissent
- FFA et équipes, limite de frags et de temps, scoreboard (Tab), fil des frags
- Relais à code de salle de 4 lettres (Cloudflare Worker ou serveur)

### Hors scope
- Matchmaking public
- Serveur TURN payant (à évaluer)

### Dépendances

- Dépend de : [`18-players-list-refactor.md`](18-players-list-refactor.md) (#18)

## Étapes

- [ ] Étape 1 — Arènes et réapparition des objets (M · standard → Sonnet)
- [ ] Étape 2 — Deathmatch et team deathmatch, scoreboard, fil des frags (L · reasoning → Opus)
- [ ] Étape 3 — Relais pour les codes de salle (M · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #27
- 📋 Prochain : étape 1
