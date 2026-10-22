---
plan:
  id: '26'
  name: 26-coop-2p.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/26-coop-2p.md
status: active
date: 2026-10-22
description: >
  Coop à 2 sur la campagne via WebRTC (hôte autoritaire), avant le deathmatch.
priority: low
complexity: XL
intent: null
depends_on: ['18']
blocks: []
labels: [feature]
issue:
  id: 26
  url: https://github.com/Exe64/dukenutanix/issues/26
---

# [🤝] Plan #26 - Campagne en coop à 2

## Objectif

La coop réutilise la campagne et teste le réseau sur un mode moins exigeant que le PvP.

## Périmètre

### Inclus
- WebRTC pair à pair, l'hôte fait tourner le jeu et diffuse l'état ~20 fois/s
- Connexion par codes copiés-collés
- Règles coop : objectifs partagés, réapparition

### Hors scope
- Relais / codes de salle (#27)
- Plus de 2 joueurs

### Dépendances

- Dépend de : [`18-players-list-refactor.md`](18-players-list-refactor.md) (#18)

## Étapes

- [ ] Étape 1 — Réseau WebRTC hôte vers client (L · reasoning → Opus)
- [ ] Étape 2 — Campagne en coop à 2 (L · reasoning → Opus)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #26
- 📋 Prochain : étape 1
