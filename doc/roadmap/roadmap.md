# Roadmap Duke Nutanix

> Backlog actif. L'historique détaillé est archivé dans `_archives/`.
> Dernière mise à jour : 2026-10-22.

## Contexte

Backlog consolidé : plans nommés d'après leur issue GitHub (voir `doc/roadmap/`).
- « À faire » : travaux restants, triés par priorité.
- « Fait » : ce qui a été livré et validé.

La vision d'ensemble (multijoueur) est résumée dans [`ROADMAP.md`](../../ROADMAP.md) à la racine.

---

## À faire
### [Issue: #4] Son spatialisé (stéréo) [PRIORITÉ: HAUTE] [Complexité: S] 🟢

Plan : [`4-stereo-audio.md`](4-stereo-audio.md)

Ajouter un panoramique stéréo aux sons du monde pour entendre d'où viennent les monstres.

---

### [Issue: #5] Niveaux de difficulté [PRIORITÉ: HAUTE] [Complexité: M] 🟢

Plan : [`5-difficulty-levels.md`](5-difficulty-levels.md)

Choix de la difficulté au lancement d'une partie : densité d'ennemis et multiplicateur de dégâts, niveaux seedés inchangés.

---

### [Issue: #6] Checkpoints en cours de niveau [PRIORITÉ: HAUTE] [Complexité: M] 🟢

Plan : [`6-mid-level-checkpoints.md`](6-mid-level-checkpoints.md)

Snapshot automatique à chaque étape d'objectif, restauré à la mort au lieu de recommencer le niveau.

---

### [Issue: #7] CI : valider les niveaux à chaque push [PRIORITÉ: HAUTE] [Complexité: XS] 🟢

Plan : [`7-ci-validate-levels.md`](7-ci-validate-levels.md)

Workflow GitHub léger qui lance `node tools/validate-levels.js` sur push et PR.

---

### [Issue: #8] Versionner doc/ [PRIORITÉ: HAUTE] [Complexité: XS] 🟢

Plan : [`8-version-doc.md`](8-version-doc.md)

Suivre `doc/` (plans de roadmap) dans git ; `graft/` est déjà ignoré.

---

### [Issue: #9] Actions de release sur Node 24 [PRIORITÉ: HAUTE] [Complexité: XS] 🟢

Plan : [`9-release-actions-node24.md`](9-release-actions-node24.md)

Mettre à jour les actions de `release.yml` vers des versions qui tournent sur Node 24.

---

### [Issue: #1] RETRO : 3 frames d'attaque pour les monstres [PRIORITÉ: MOYENNE] [Complexité: M] 🟢

Plan : [`1-retro-attack-frames.md`](1-retro-attack-frames.md)

Préparation, coup/tir et retour pour tous les monstres qui attaquent, dans les 8 rotations RETRO.

---

### [Issue: #10] Réduire le coût du reflet du sol [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`10-reflection-cost.md`](10-reflection-cost.md)

Le reflet redessine toute la scène : le passer à demi-résolution et le sauter quand le sol n'est pas visible. **Dépend de** : #2.

---

### [Issue: #11] Rebake progressif de la lightmap [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`11-progressive-lightmap-bake.md`](11-progressive-lightmap-bake.md)

Mesurer `Light.bake` au rallumage d'un panneau électrique ; s'il saccade, l'étaler sur plusieurs frames. **Dépend de** : #2.

---

### [Issue: #12] Démarrage plus rapide : assets construits à la demande [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`12-lazy-asset-build.md`](12-lazy-asset-build.md)

Mesurer le démarrage et ne construire les armes RETRO qu'au premier passage en RETRO. **Dépend de** : #2.

---

### [Issue: #13] Logique en pas fixe pour les deux styles [PRIORITÉ: MOYENNE] [Complexité: M] 🟢

Plan : [`13-fixed-timestep.md`](13-fixed-timestep.md)

Logique à 60 Hz avec accumulateur en MODERN comme en RETRO, rendu interpolé ; prérequis du multijoueur.

---

### [Issue: #14] Manette et remappage des touches [PRIORITÉ: MOYENNE] [Complexité: M] 🟢

Plan : [`14-gamepad-remap.md`](14-gamepad-remap.md)

Support manette via l'API Gamepad et menu de remappage des touches sauvegardé localement.

---

### [Issue: #15] Visée libre en MODERN [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`15-modern-free-aim.md`](15-modern-free-aim.md)

En MODERN, utiliser le pitch de la caméra pour la visée (hitscan et projectiles) au lieu de l'auto-visée en hauteur.

---

### [Issue: #16] Options de confort et d'accessibilité [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`16-comfort-options.md`](16-comfort-options.md)

Réglage du champ de vision, balancement de caméra désactivable, mode « effets réduits » (flashes, aberration, grain).

---

### [Issue: #17] Temps de référence, records et rang [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`17-level-records.md`](17-level-records.md)

Temps de référence par niveau, meilleur temps et rang enregistrés et affichés en fin de niveau.

---

### [Issue: #18] Liste de joueurs (fondation multijoueur) [PRIORITÉ: MOYENNE] [Complexité: L] 🟢

Plan : [`18-players-list-refactor.md`](18-players-list-refactor.md)

Transformer `P` et `INV` en liste de joueurs, testée avec des bots locaux ; fondation du coop et du deathmatch. **Dépend de** : #13.

---

### [Issue: #19] Test de fumée navigateur (Playwright) [PRIORITÉ: MOYENNE] [Complexité: M] 🟢

Plan : [`19-smoke-test-playwright.md`](19-smoke-test-playwright.md)

Charger E1M1 en MODERN et en RETRO via `window.__duke`, jouer quelques secondes, échouer sur toute exception ; lancé en CI. **Dépend de** : #7.

---

### [Issue: #20] Graine du jour et mode infini [PRIORITÉ: MOYENNE] [Complexité: M] 🟢

Plan : [`20-daily-seed-endless.md`](20-daily-seed-endless.md)

Niveaux générés à partir d'une graine hors campagne : une graine par date et un enchaînement infini, avec scores locaux.

---

### [Issue: #21] Saisie d'une graine personnalisée [PRIORITÉ: MOYENNE] [Complexité: XS] 🟢

Plan : [`21-custom-seed.md`](21-custom-seed.md)

Saisir une graine dans le menu pour jouer et partager une carte précise. **Dépend de** : #20.

---

### [Issue: #22] Mesurer MODERN sur du vrai matériel [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`22-modern-real-hw-benchmark.md`](22-modern-real-hw-benchmark.md)

Mesurer le chargement et les fps sur plusieurs machines réelles et consigner les résultats. **Dépend de** : #2.

---

### [Issue: #23] Musique procédurale [PRIORITÉ: BASSE] [Complexité: L] 🟢

Plan : [`23-procedural-music.md`](23-procedural-music.md)

Séquenceur Web Audio façon tracker, un thème par épisode et un thème de boss, sans fichier audio.

---

### [Issue: #24] Succès [PRIORITÉ: BASSE] [Complexité: S] 🟢

Plan : [`24-achievements.md`](24-achievements.md)

Succès stockés localement (migrations, boss sans dégâts, secrets…) avec notification en jeu.

---

### [Issue: #25] Nouveaux objectifs Nutanix [PRIORITÉ: BASSE] [Complexité: L] 🟢

Plan : [`25-nutanix-objectives.md`](25-nutanix-objectives.md)

Trois objectifs : live migration d'une VM à escorter, mise à jour LCM nœud par nœud, snapshots zombies.

---

### [Issue: #26] Campagne en coop à 2 [PRIORITÉ: BASSE] [Complexité: XL] 🟢

Plan : [`26-coop-2p.md`](26-coop-2p.md)

Coop à 2 sur la campagne via WebRTC (hôte autoritaire), avant le deathmatch. **Dépend de** : #18.

---

### [Issue: #27] Deathmatch et team deathmatch [PRIORITÉ: BASSE] [Complexité: XL] 🟢

Plan : [`27-deathmatch.md`](27-deathmatch.md)

Mode multijoueur séparé (2 à 8 joueurs) : arènes, réapparition des objets, scoreboard, relais pour codes de salle. **Dépend de** : #18.

---

### [Issue: #28] Signature de code des apps desktop [PRIORITÉ: BASSE] [Complexité: M] 🟢

Plan : [`28-code-signing.md`](28-code-signing.md)

Apple Developer ID avec notarisation et certificat Windows dans le workflow de release.

---

## Fait

### Plans livrés (2026-10-22 → 2026-10-22)
- **[Issue: #2] `#2` — Overlay de performance (F3)** (2026-10-22) 🔵 — overlay F3 (FPS, temps de frame et CPU, draw calls, sprites, durée des bakes CPU et GPU), mémorisé
  [`2-perf-overlay.md`](done/2-perf-overlay.md)
- **[Issue: #3] `#3` — Portes GPU : reconstruire seulement quand elles bougent** (2026-10-22) 🔵 — mesh des portes GPU reconstruit seulement quand une porte bouge (signature des d.open)
  [`3-doors-dirty-flag.md`](done/3-doors-dirty-flag.md)

---

## Archivé
