# Roadmap Duke Nutanix

> Backlog actif. L'historique détaillé est archivé dans `_archives/`.
> Dernière mise à jour : 2026-11-02.

## Contexte

Backlog consolidé : plans nommés d'après leur issue GitHub (voir `doc/roadmap/`).
- « À faire » : travaux restants, triés par priorité.
- « Fait » : ce qui a été livré et validé.

La vision d'ensemble (multijoueur) est résumée dans [`ROADMAP.md`](../../ROADMAP.md) à la racine.

---

## À faire
### [Issue: #30] Mod OVHCLOUD SPECIAL [PRIORITÉ: HAUTE] [Complexité: XL] 🟢

Plan : [`30-ovhcloud-special-mod.md`](30-ovhcloud-special-mod.md)

5 niveaux dans des datacenters OVHcloud (dont GRA d'après le plan réel), monstres et missions dédiés, boss THE OVH FOUNDER qui passe en métalleux invincible.

---

### [Issue: #22] Mesurer MODERN sur du vrai matériel [PRIORITÉ: MOYENNE] [Complexité: S] 🟢

Plan : [`22-modern-real-hw-benchmark.md`](22-modern-real-hw-benchmark.md)

Mesurer le chargement et les fps sur plusieurs machines réelles et consigner les résultats. **Dépend de** : #2.

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

### Plans livrés (2026-10-22 → 2026-11-02)
- **[Issue: #29] `#29` — Avatar du HUD d'après la vraie tête** (2026-11-02) 🔵 — `drawFace` en pixel-art d'après la photo de l'auteur (cheveux et barbe noirs, lunettes miroir bleues), fond bleu ardoise, humeurs conservées
  [`29-hud-avatar-real-face.md`](done/29-hud-avatar-real-face.md)
- **[Issue: #1] `#1` — RETRO : 3 frames d'attaque pour les monstres** (2026-11-02) 🔵 — préparation, coup/tir et retour dans les 8 rotations RETRO, frame choisie selon les minuteurs d'attaque ; MODERN inchangé
  [`1-retro-attack-frames.md`](done/1-retro-attack-frames.md)
- **[Issue: #2] `#2` — Overlay de performance (F3)** (2026-10-22) 🔵 — overlay F3 (FPS, temps de frame et CPU, draw calls, sprites, durée des bakes CPU et GPU), mémorisé
  [`2-perf-overlay.md`](done/2-perf-overlay.md)
- **[Issue: #3] `#3` — Portes GPU : reconstruire seulement quand elles bougent** (2026-10-22) 🔵 — mesh des portes GPU reconstruit seulement quand une porte bouge (signature des d.open)
  [`3-doors-dirty-flag.md`](done/3-doors-dirty-flag.md)
- **[Issue: #7] `#7` — CI : valider les niveaux à chaque push** (2026-10-22) 🔵 — workflow CI qui valide les 50 niveaux sur push et PR
  [`7-ci-validate-levels.md`](done/7-ci-validate-levels.md)
- **[Issue: #9] `#9` — Actions de release sur Node 24** (2026-10-22) 🔵 — actions de release.yml passées sur des versions Node 24
  [`9-release-actions-node24.md`](done/9-release-actions-node24.md)
- **[Issue: #4] `#4` — Son spatialisé (stéréo)** (2026-10-22) 🔵 — panoramique stéréo des sons du monde selon le côté d'où ils viennent
  [`4-stereo-audio.md`](done/4-stereo-audio.md)
- **[Issue: #5] `#5` — Niveaux de difficulté** (2026-10-22) 🔵 — 4 niveaux de difficulté choisis au NEW GAME (ennemis filtrés, dégâts ajustés), sauvegardés, contrôlés par validate-levels
  [`5-difficulty-levels.md`](done/5-difficulty-levels.md)
- **[Issue: #8] `#8` — Versionner doc/** (2026-10-22) 🔵 — doc/ versionné, avec la config du workflow ; graft/ ignoré via la modification de l'autre session
  [`8-version-doc.md`](done/8-version-doc.md)
- **[Issue: #6] `#6` — Checkpoints en cours de niveau** (2026-10-22) 🔵 — checkpoint en mémoire à chaque étape d'objectif, restauré après une mort (minuteurs d'au moins 60 s)
  [`6-mid-level-checkpoints.md`](done/6-mid-level-checkpoints.md)
- **[Issue: #10] `#10` — Réduire le coût du reflet du sol** (2026-10-22) 🔵 — passe de reflet sautée quand le sol est hors champ (la demi-résolution existait déjà)
  [`10-reflection-cost.md`](done/10-reflection-cost.md)
- **[Issue: #11] `#11` — Rebake progressif de la lightmap** (2026-10-22) 🔵 — rebake GPU de la lightmap étalé sur plusieurs frames au rallumage d'un panneau (frame bloquée : 211 → 28 ms)
  [`11-progressive-lightmap-bake.md`](done/11-progressive-lightmap-bake.md)
- **[Issue: #12] `#12` — Démarrage plus rapide : assets construits à la demande** (2026-10-22) 🔵 — armes et maillages 3D construits au premier usage de leur style (démarrage RETRO -26 %, MODERN -3 %)
  [`12-lazy-asset-build.md`](done/12-lazy-asset-build.md)
- **[Issue: #13] `#13` — Logique en pas fixe pour les deux styles** (2026-10-22) 🔵 — logique à 70 Hz fixes dans les deux styles, joueur interpolé en MODERN, souris appliquée à chaque frame
  [`13-fixed-timestep.md`](done/13-fixed-timestep.md)
- **[Issue: #14] `#14` — Manette et remappage des touches** (2026-10-22) 🔵 — manette (API Gamepad, jeu et menus) et remappage des touches depuis la pause, sauvegardé
  [`14-gamepad-remap.md`](done/14-gamepad-remap.md)
- **[Issue: #15] `#15` — Visée libre en MODERN** (2026-10-22) 🔵 — visée libre en MODERN GPU (tir instantané et projectiles suivent le pitch), option AIM: AUTO dans la pause
  [`15-modern-free-aim.md`](done/15-modern-free-aim.md)
- **[Issue: #16] `#16` — Options de confort et d'accessibilité** (2026-10-22) 🔵 — options de confort dans la pause : champ de vision (MODERN), balancement, effets réduits (photosensibilité), sauvegardées
  [`16-comfort-options.md`](done/16-comfort-options.md)
- **[Issue: #17] `#17` — Temps de référence, records et rang** (2026-10-22) 🔵 — temps de référence par niveau, meilleur temps et rang (S/A/B/C) à l'écran de fin et dans la sélection
  [`17-level-records.md`](done/17-level-records.md)
- **[Issue: #19] `#19` — Test de fumée navigateur (Playwright)** (2026-10-22) 🔵 — test de fumée navigateur (tools/smoke-test.js, Playwright) dans les deux styles, lancé en CI
  [`19-smoke-test-playwright.md`](done/19-smoke-test-playwright.md)
- **[Issue: #20] `#20` — Graine du jour et mode infini** (2026-10-22) 🔵 — parties à graine : graine du jour et mode infini, une vie, inventaire conservé, meilleure profondeur par graine
  [`20-daily-seed-endless.md`](done/20-daily-seed-endless.md)
- **[Issue: #21] `#21` — Saisie d'une graine personnalisée** (2026-10-22) 🔵 — saisie d'une graine (nombre ou mot) depuis l'écran titre, graine affichée dans la pause
  [`21-custom-seed.md`](done/21-custom-seed.md)
- **[Issue: #24] `#24` — Succès** (2026-10-22) 🔵 — 10 succès stockés localement, annoncés en jeu et sur l'écran de fin, listés depuis l'écran titre
  [`24-achievements.md`](done/24-achievements.md)
- **[Issue: #18] `#18` — Liste de joueurs (fondation multijoueur)** (2026-10-22) 🔵 — liste de joueurs (P/INV alias du joueur local), IA ciblant le joueur le plus proche, dégâts et projectiles pour tous, bots de test
  [`18-players-list-refactor.md`](done/18-players-list-refactor.md)
- **[Issue: #23] `#23` — Musique procédurale** (2026-10-22) 🔵 — musique procédurale façon tracker : un thème par épisode et un thème de boss, volume et bouton dans la pause
  [`23-procedural-music.md`](done/23-procedural-music.md)
- **[Issue: #25] `#25` — Nouveaux objectifs Nutanix** (2026-10-22) 🔵 — 3 objectifs Nutanix (mise à jour LCM, snapshots zombies, migration à chaud d'une VM) sur 4 niveaux de campagne et dans les parties à graine
  [`25-nutanix-objectives.md`](done/25-nutanix-objectives.md)

---

## Archivé
