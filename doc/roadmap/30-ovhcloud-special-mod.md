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
- [ ] Étape 6 — Boss THE OVH FOUNDER : phase 1, transformation métalleux, guitare à éclairs, voix gutturale, bandeau, fin (L · reasoning → Opus)
- [ ] Étape 7 — Thème musical OVHcloud et 3 succès du mod (S · standard → Sonnet)
- [ ] 🧪 Tests — Rédiger et exécuter la procédure de test (avant-dernière étape, obligatoire)
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
```

### Procédure de test

```bash
```

**Résultats attendus :**

### Résultats joués et vérifiés

| Date | Test | Attendu | Observé | Verdict |
|------|------|---------|---------|---------|
