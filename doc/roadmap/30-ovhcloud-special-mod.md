---
plan:
  id: '30'
  name: 30-ovhcloud-special-mod.md
  link: https://github.com/Exe64/dukenutanix/blob/main/doc/roadmap/30-ovhcloud-special-mod.md
status: in-progress
date: 2026-11-02
description: >
  Mod événementiel « OVHCLOUD SPECIAL » : 5 niveaux dans des datacenters OVHcloud, monstres et missions dédiés, boss final THE OVH FOUNDER.
priority: high
complexity: XL
intent: null
depends_on: []
blocks: []
labels: [feature, gameplay]
scope:
  modules:
    - js/levels.js
    - js/levelgen.js
    - js/objectives.js
    - js/textures.js
    - js/game.js
    - js/audio.js
    - tools/validate-levels.js
issue:
  id: 30
  url: https://github.com/Exe64/dukenutanix/issues/30
---

# [☁️] Plan #30 - Mod OVHCLOUD SPECIAL

## Objectif

Une version du jeu pour un événement OVHcloud à venir : 5 niveaux dans des datacenters brandés OVHcloud,
lancés depuis le menu principal, avec des monstres et des missions dans l'esprit OVHcloud et un boss final
inspiré d'Octave Klaba (« THE OVH FOUNDER »). Le branding est validé par l'utilisateur, logo officiel fourni.

## Périmètre

### Inclus
- **Accès** : entrée « OVHCLOUD SPECIAL » au menu principal ; meilleurs temps, sauvegarde et 3 succès propres au mod ; campagne Nutanix intacte.
- **Habillage** : racks et murs bleu OVHcloud (#000E9C), logo redessiné en tracés canvas d'après la référence (murs, écrans, écran titre), tuyaux de watercooling ; racks à migrer « Nutanix on OVHcloud ».
- **Monstres** (remplacent les 5 de base, stats proches) :

  | Monstre | Remplace | Particularité |
  |---|---|---|
  | Mouette de Gravelines | bug (mêlée rapide) | pique en vol |
  | Blob de watercooling | troll (mêlée lourde) | se divise en 2 petites flaques à sa mort |
  | Caméra Mirai | bot (rafale) | rafales de paquets |
  | Ticket zombie | spammer (éventail) | lance des « +1 » / « any update? » |
  | Abuse report | drone (volant) | orbes |
  | THE 1 TBPS (mini-boss, niveau 3) | — | dégâts réduits tant que les 2 bornes VAC du niveau ne sont pas activées |

- **Missions** : remplacement de HDD (`hotswap`), backup sur bande LTO (`backup`), démarrage du groupe électrogène (`power`) ; nouvelles : **ajout de RAM** (barrettes à insérer dans 3 serveurs d'une rangée) et **fuite de watercooling** (3 vannes à fermer avant l'inondation, minuteur).
- **Niveaux** :

  | # | Niveau | Construction | Mission |
  |---|---|---|---|
  | 1 | RBX : atelier d'assemblage | généré (seed fixe) | remplacement de HDD |
  | 2 | GRA : d'après le plan d'implantation réel (GRA1 salles G1xx + piscine + salle HT, GRA2 G2xx + Room 0 + mezzanine, GRA3.x rangées, GRA4 longues allées, cours avec tour de refroidissement et GE) | dessiné à la main | fuite de watercooling |
  | 3 | vRack : cœur réseau | généré | ajout de RAM + mini-boss THE 1 TBPS |
  | 4 | Bare Metal | généré | backup LTO (minuté) |
  | 5 | Le QG | arène dessinée à la main | GE, puis le boss |

- **Boss final « THE OVH FOUNDER »** (ressemblance d'après les photos de référence : cheveux châtains courts, lunettes rectangulaires sombres, visage rond, barbe de quelques jours, blazer marine sur t-shirt noir, chino beige) :
  - Phase 1 : méca à watercooling, jets d'eau glacée, sbires.
  - À 0 PV : invulnérable, **se transforme en métalleux** (cheveux longs, t-shirt noir, guitare électrique) dont la guitare **lance des éclairs**, yeux rouges qui brillent, crie « **YOU HAVE NO POWER HERE** » d'une voix gutturale (bandeau à l'écran) ; puis l'écran de fin du mod.

### Hors scope
- Aucune référence à l'incendie de SBG (2021).
- Pas de nouvelle arme, pas de mode multijoueur pour le mod.
- Les photos de référence ne sont pas versionnées.

## Étapes

- [x] Étape 1 — Squelette du mod : entrée de menu, épisode à 5 niveaux, sauvegarde et meilleurs temps séparés, écran de fin, `validate-levels` (M · standard → Sonnet)
- [x] Étape 2 — Habillage OVHcloud : textures bleues, logo en tracés canvas, watercooling, racks « Nutanix on OVHcloud » (M · standard → Sonnet)
- [x] Étape 3 — Monstres du mod (5 + mini-boss THE 1 TBPS et bornes VAC), RETRO 8 rotations + 3 frames d'attaque, MODERN (L · reasoning → Opus)
- [x] Étape 4 — Missions : habillages HDD / LTO / GE, nouveaux objectifs RAM et fuite de watercooling (L · reasoning → Opus)
- [x] Étape 5 — Niveaux : RBX, vRack, Bare Metal générés ; GRA d'après le plan ; arène du QG (L · reasoning → Opus)
- [x] Étape 6 — Boss THE OVH FOUNDER : phase 1, transformation métalleux, guitare à éclairs, voix gutturale, bandeau, fin (L · reasoning → Opus)
- [x] Étape 7 — Thème musical OVHcloud et 3 succès du mod (S · standard → Sonnet)
- [x] 🧪 Tests — Rédiger et exécuter la procédure de test (avant-dernière étape, obligatoire)
- [ ] ✅ Validation — Vérifier les résultats des tests et clôturer (dernière étape, obligatoire)

## Décisions techniques

| Décision | Choix retenu | Justification |
|----------|-------------|---------------|
| Logo | Redessiné en tracés canvas d'après la référence | Les PNG fournis n'ont pas d'alpha ; tous les assets du jeu sont procéduraux |
| Monstres | Nouveaux dessins sur les slots de stats existants (+ comportements blob / VAC) | Équilibrage connu, peu de logique nouvelle |
| Voix gutturale | `speechSynthesis` (pitch 0, débit lent) superposée à un grognement WebAudio distordu ; grognement seul si la synthèse vocale manque (WebKitGTK) | Pas d'asset audio, marche dans le navigateur et Tauri |
| Phase 2 du boss | Invulnérable ~12 s sous les éclairs, puis écran de fin ; une mort pendant la phase 2 mène aussi à l'écran de fin | « Impossible de le tuer » ; la fin arrive dans tous les cas |
| Nom affiché | « THE OVH FOUNDER » | Choix de l'utilisateur |
| SBG 2021 | Exclu | Incident réel avec pertes clients, déplacé pour un événement de la marque |

## Tests

### Prérequis pour les tests

```bash
# Node 22 + Playwright (pas une dépendance du jeu, installé à côté) avec son Chromium
npm install --no-save playwright && npx playwright install chromium
# sur EL10 sans root : LD_LIBRARY_PATH vers les libs extraites des RPM, NODE_PATH vers ce node_modules
```

### Procédure de test

```bash
node tools/validate-levels.js   # les 50 niveaux de la campagne, les 5 du mod, 72 niveaux de run
node tools/smoke-test.js        # E1M1 joué dans les deux styles
# Scénario de bout en bout (script Playwright jetable, Chromium headless swiftshader,
# piloté par window.__duke), dans MODERN puis RETRO, localStorage vidé :
#  1. menu principal -> OVHCLOUD SPECIAL -> NEW GAME -> niveau d'accès par défaut -> briefing RBX -> ENTER
#  2. RBX, GRA, VRACK, BARE METAL, HQ (actions.play(50..54)) : niveau chargé, objectif initialisé,
#     capture d'écran, aucune erreur de page ni de console
#  3. VRACK : 100 de dégâts à THE 1 TBPS avant puis après l'activation des 2 bornes VAC
#  4. HQ : démarrer les 3 GE, amener le boss à 0 PV, frapper encore, le faire tirer,
#     raccourcir le finale -> écran de fin
#  5. retour au menu principal -> NEW GAME -> E1M1 de la campagne, avancer 1 s
```

**Résultats attendus :**
- `validate-levels` : RBX `hotswap`, GRA `leak`, VRACK `ram`, BARE METAL `backup`, HQ `power` OK, « Levels OK » ; empreinte des niveaux de la campagne inchangée.
- `smoke-test` : « Smoke test OK » dans les deux styles.
- Menu du mod avec le logo OVHcloud ; chaque niveau a `mod: 'ovh'`, l'épisode 5 et le thème musical `ovh`.
- Objectifs : RBX serveur + HDD de rechange ; GRA 3 vannes et minuteur ; VRACK 3 serveurs `%`, 3 kits RAM, 2 bornes VAC et THE 1 TBPS ; BARE METAL bandes LTO, bibliothèque et minuteur ; HQ 3 GE et le boss `founder`.
- VRACK : THE 1 TBPS ne prend que 10 % des dégâts tant que les 2 VAC sont éteintes, 100 % après.
- HQ : à 0 PV le boss devient `metal`, garde ses PV sous les coups, tire des éclairs, bandeau « YOU HAVE NO POWER HERE », thème `metal`, terminal REBOOT verrouillé ; à la fin du finale, écran « UPTIME RESTORED » avec retour au menu du mod.
- E1M1 : épisode 0, ni mod ni murs OVHcloud, thème de la campagne, inventaire de départ.

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
| 2026-11-02 | `validate-levels` | 55 niveaux + 72 de run OK | RBX 32x23 11 ennemis, GRA 48x34 23, VRACK 44x32 32, BARE METAL 51x37 42, HQ 40x30 11 ; « Levels OK (1727 ms) » ; empreinte campagne `03468c15…` identique à l'étape 5 | ✅ |
| 2026-11-02 | `smoke-test` | E1M1 jouable dans les deux styles | modern 2.6 s, retro 3.69 s, « Smoke test OK » | ✅ |
| 2026-11-02 | Menu OVHCLOUD SPECIAL (MODERN, RETRO) | logo, titre, NEW GAME -> briefing RBX | logo OVHcloud, « GOES TO THE CLOUD », briefing « RBX : ASSEMBLY WORKSHOP » | ✅ |
| 2026-11-02 | Chargement des 5 niveaux (MODERN, RETRO) | mod `ovh`, épisode 5, bon objectif, 0 erreur | RBX `hotswap`, GRA `leak`, VRACK `ram`, BARE METAL `backup`, HQ `power` ; thème `ovh` ; 0 erreur de page ou de console | ✅ |
| 2026-11-02 | Objectifs initialisés (MODERN, RETRO) | voir résultats attendus | RBX serveur + HDD ; GRA 3 vannes, 4:59 ; VRACK 3 serveurs, 3 kits, 2 VAC, mini-boss présent ; BARE METAL 5 bandes, bibliothèque, 5:00 ; HQ 3 GE, boss `founder` | ✅ |
| 2026-11-02 | VRACK, bouclier de THE 1 TBPS (MODERN, RETRO) | 10 puis 100 PV perdus | 10 PV avant les VAC, 100 PV après (2/2 actives) ; HUD « VAC terminals 0/2 on, then destroy THE 1 TBPS » avant | ✅ |
| 2026-11-02 | HQ, boss phase 2 (MODERN, RETRO) | `metal` invulnérable, éclairs, bandeau, REBOOT verrouillé | 3/3 GE ; `metal` à 2400 PV, inchangés après 2 coups de 99999 ; tirs `lightning` ; bandeau « YOU HAVE NO POWER HERE » ; finale 12 s ; REBOOT verrouillé ; thème `metal` (vérifié en RETRO) | ✅ |
| 2026-11-02 | HQ, écran de fin (MODERN, RETRO) | « UPTIME RESTORED », retour au menu du mod | « UPTIME RESTORED / THE CLOUD IS SAFE », bouton MAIN MENU vers le menu du mod, succès WELCOME TO THE CLOUD et I HAVE THE POWER | ✅ |
| 2026-11-02 | Campagne E1M1 après le mod (MODERN, RETRO) | démarrage normal | E1M1, épisode 0, pas de mod, murs de la campagne, thème `ep0`, 60 munitions et armes 1-2, sauvegarde de la campagne écrite, 0 erreur | ✅ |
| 2026-11-02 | Captures d'écran (20) | rendu correct | logos OVHcloud, racks bleus, monstres et boss lisibles dans les deux styles ; en RETRO, les messages empilés en haut à gauche chevauchent la barre du boss juste après le 3e GE (mise en page partagée avec la campagne, non modifiée) | ✅ |
| À faire | Écoute (humain) | thèmes `ovh` et `metal`, grognement et voix « YOU HAVE NO POWER HERE » | non testable : le navigateur de test n'a pas de sortie audio | ⏳ |
| À faire | Ressenti sur un vrai écran (humain) | fluidité, lisibilité, équilibrage des 5 niveaux et du combat à 2400 PV | non testable : Chromium headless en rendu logiciel (~5 images/s) ; aucun niveau joué de bout en bout | ⏳ |
| 2026-11-03 | Menu du mod → difficulté (humain, puis Playwright MODERN/RETRO × gfx high/low, avec sauvegarde campagne) | briefing RBX | Chez l'utilisateur, l'écran de difficulté restait affiché. Le headless passe dans les 4 configurations. Cause reproduite : un `textures.js` antérieur au mod resté dans le cache du navigateur (http.server n'envoie pas de Cache-Control). Ctrl+F5 corrige, confirmé par l'utilisateur. | ✅ |
| 2026-11-03 | Easter eggs `iddad` (god mode) et `comegetsome` (arsenal complet), en plus de `iddqd`/`idkfa` | même effet que les codes d'origine | tampon des codes porté de 8 à 12 caractères (`comegetsome` en fait 11) ; syntaxe OK | ⏳ à tester en jeu |
