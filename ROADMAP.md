# Roadmap

Ideas kept for later, roughly in order of interest.

## Multiplayer: deathmatch and team deathmatch

A separate mode, next to the campaign (which stays single player).

- **Modes**: free-for-all deathmatch, and team deathmatch (two teams of admins, colored shirts and HUD markers).
- **Maps**: arenas built from the datacenter tiles (rack rows, cold aisles, CRAC units, doors), with spawn points
  and weapon and ammo pickups that come back after a delay. Some of the 50 levels can be adapted.
- **Players**: 2 to 8. The other admins drawn as an animated 3D model in MODERN and as 8-rotation sprites in RETRO.
- **Network**: peer to peer over WebRTC, the host running the game and sending its state about 20 times per second,
  the others sending their inputs and interpolating what they receive. To meet, first copy-paste connection codes,
  then a small relay giving a 4-letter room code (a free Cloudflare Worker, or a server of our own).
- **Rules**: frag limit and time limit, scoreboard (Tab), respawn after a few seconds, a kill feed with the admin's
  one-liners, the Nutanix migration of racks as a side objective in team mode.
- **Code**: the game assumes a single player (`P`, `INV` in `js/game.js`): first turn them into a list of players,
  tested locally with bots, then add the network.
- **Limits to keep in mind**: some strict NATs need a TURN relay (bandwidth, possibly a cost); WebRTC is fine in
  browsers and in the desktop app on Windows and macOS, uncertain in the Linux app (WebKitGTK).

## Other items

- Bump the GitHub Actions in the release workflow to versions that run on Node 24.
- RETRO: attack animations with 2 to 4 frames (one today); 35 fps to check on a real 60 Hz screen.
- MODERN: measure the loading time and frame rate on real hardware (the 512 px textures, parallax and 3D
  monsters were only checked in a software GPU).
- Code signing of the desktop apps (Apple Developer ID, a Windows code signing certificate).
