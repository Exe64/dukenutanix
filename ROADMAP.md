# Roadmap

The backlog now lives in [`doc/roadmap/roadmap.md`](doc/roadmap/roadmap.md): one plan per item, each linked to its
GitHub issue, sorted by priority.

## Vision: multiplayer

A separate mode next to the campaign (which stays single player), built in three steps:

1. **Players list** ([#18](doc/roadmap/18-players-list-refactor.md)): the game assumes a single player (`P`, `INV` in
   `js/game.js`); turn them into a list of players, tested locally with bots. Needs the fixed timestep
   ([#13](doc/roadmap/13-fixed-timestep.md)).
2. **Coop for 2** ([#26](doc/roadmap/26-coop-2p.md)): the campaign over WebRTC, the host running the game and sending
   its state about 20 times per second, the other player sending inputs and interpolating.
3. **Deathmatch and team deathmatch** ([#27](doc/roadmap/27-deathmatch.md)): 2 to 8 players, arenas built from the
   datacenter tiles, respawning pickups, scoreboard, kill feed, and a small relay giving 4-letter room codes.

Limits to keep in mind: some strict NATs need a TURN relay (bandwidth, possibly a cost); WebRTC is fine in browsers
and in the desktop app on Windows and macOS, uncertain in the Linux app (WebKitGTK).
