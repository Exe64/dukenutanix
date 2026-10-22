---
plan:
  id: '12'
  name: 12-lazy-asset-build.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/12-lazy-asset-build.md
status: active
date: 2026-10-22
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

- [ ] Étape 1 — Mesure du temps de démarrage (XS · standard → Sonnet)
- [ ] Étape 2 — Armes RETRO construites au premier passage en RETRO (S · standard → Sonnet)
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
- ✅ Fait : plan créé à partir de la revue de code et de ROADMAP.md, issue #12
- 📋 Prochain : étape 1
