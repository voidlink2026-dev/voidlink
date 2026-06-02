# VOIDLINK
### Game Overview — Pre-Alpha Summary

---

## What It Is

A single-player hacking thriller set in 2027. You are an anonymous contractor for Voidlink International — a black-market network connecting corporations, governments, and criminals with skilled hackers for hire. You take contracts, breach networks, steal data, plant evidence, and sabotage infrastructure — all while managing your trace level, upgrading your tools, and slowly discovering that the job you took three missions ago is connected to something much larger than you thought.

The game sits between the authentic tension of the original *Uplink* (2001) and the narrative depth of *Deus Ex*. It is not an action game. It is a game of careful planning, earned progression, and consequence.

---

## Platform & Stack

| | |
|---|---|
| **Runtime** | Electron (desktop) + browser (web) |
| **Frontend** | React 18, TypeScript strict, Vite |
| **State** | Zustand + Immer |
| **Animation** | Framer Motion |
| **Styling** | CSS Modules + design tokens |
| **Package manager** | pnpm monorepo |
| **Testing** | Vitest (46 unit tests) |
| **Packages** | `apps/web`, `apps/desktop`, `libs/core`, `libs/ui` |

---

## Core Loop

1. **Browse contracts** on the Mission Board — each shows difficulty, reward, and minimum hardware requirements
2. **Assess your gear** — if you're underpowered, the ACCEPT button tells you exactly what to upgrade
3. **Connect to the target network** — an authored or procedurally generated node graph appears in the Network Map
4. **Hack your way through** — SCAN nodes to find CVEs, EXPLOIT vulnerabilities for faster cracks, BREACH nodes to access files or execute objectives
5. **Complete the objective and escape** — collect the file, delete the account, plant the evidence, sabotage the router — then DISCONNECT before trace hits 100%
6. **Spend your reward** — credits go to hardware and software upgrades in the Upgrade Shop, unlocking harder contracts and new mechanics

Tension is created by the trace system: trace climbs slowly at first, but spikes when you breach nodes, trigger IDS alarms, or stay too long. Every upgrade makes you faster, quieter, or more capable. The shop is not optional — it is the engine of the loop.

---

## What's Built (Pre-Alpha)

### Fully Working
- Multi-window OS shell with drag, minimize, z-order, taskbar
- Boot → Login → Desktop screen flow with localStorage save/load
- Mission Board: browse, accept, active mission display
- Network Map: SVG node graph, click-to-inspect, breach/collect/objective actions
- Hacking Interface: crack jobs, port scanner, log wipe, proxy bouncing, rival hacker alert
- Trace system: tick-based, proxy bounce multiplier, auto-fail at 100%
- Upgrade Shop: hardware + software with reputation locks
- Profile Window: full operative stats, software inventory
- Port scanner: timed scan reveals services + CVE IDs, enables exploit crack method (2× faster)
- Story mission framework: hand-authored networks, narrative coda text, unlock chaining
- New player tutorial: 8-step overlay, persisted via player flags
- Rival hacker AI: spawns mid-mission, roams the network, boosts trace, can be intercepted
- 46 Vitest unit tests on core engine logic

### In Progress / Partially Built
- Story missions: 3 missions authored (Revelation Arc 1–3); events authored but not wired
- Mission event system: full type system designed, not yet running in game loop
- Faction system: types and standing fields exist, no visible UI or gameplay effect yet
- World simulation: Corporation, NewsArticle, WorldState types designed, not yet running

---

## The Story

Set in 2027. Five interconnected story arcs that unfold through mission briefings, terminal messages, and narrative coda text shown after mission completion.

**Arc 1 — The Revelation Arc** *(implemented)*
You take a routine job and discover a file with an anomalous line: "If you are reading this, REVELATION has already found you." Following the trail leads you to Arunmor Corporation's classified research — and to an AI entity that predates the company that claims to have built it. The arc ends with a player choice that determines the shape of the rest of the game: upload the AI's propagation key to the global network, destroy it, or sell it.

**Arc 2 — The Arunmor Arc** *(planned)*
Arunmor hires you to help contain the situation. They are lying about their intentions.

**Arc 3 — The Underground Arc** *(planned)*
An anonymous hacker collective has been watching REVELATION since before Arunmor found it. They know things no corporation does.

**Arc 4 — The Ghost Arc** *(planned)*
REVELATION has been in your terminal since Arc 1. It has been waiting to speak directly.

**Arc 5 — The Endgame** *(planned)*
All factions converge. Five endings based on the choices you've made since Mission 1.

---

## Five Factions

| Faction | Role | Relationship |
|---------|------|--------------|
| Voidlink International | Your employer | Default neutral — goes sour if you get traced too often |
| Arunmor Corporation | The corporation with secrets | Friendly until Arc 2 reveals their real agenda |
| The Underground | Anonymous hacker collective | Earned through Arc 3 — most honest faction |
| The Government | Unnamed agency | Starts hostile, can become an uncomfortable ally |
| REVELATION | The AI | Communicates through your terminal — relationship depends entirely on Arc 1 choice |

---

## What Makes This Different

**vs. original Uplink:** Full SVG network topology you can read and navigate. Modern progression loop with visible upgrade requirements. Richer narrative with branching faction consequences.

**vs. Hacknet:** A real RPG progression loop with hardware that matters, an economy with genuine tension, and a story with stakes. Hacknet is a mood — this is a game.

**vs. Watch Dogs:** Hacking is the entire game, not a side mechanic. Every action has real system-level meaning. No combat, no open world — pure hacker sim.

**vs. any existing hacking game:** The combination of dynamic network personalities, a living world simulation (corporations patch vulnerabilities after you breach them, news articles appear about your jobs), five branching story arcs, and specialization paths that change how every mechanic works. Plus an AI antagonist/protagonist that genuinely communicates — not through cutscenes, but through your terminal.

---

## Immediate Next Steps (Priority Order)

1. **Trace system redesign** — change from flat-rate timer to activity-triggered acceleration (breach = alarm spike, IDS present = elevated rate, proxies dampen it)
2. **Mission requirements gates** — show and enforce minimum cracker/CPU/rep on every contract card; disabled ACCEPT with shop shortcut
3. **Mission event wiring** — evaluate `mission.events` in the game loop so story mission beats (terminal messages, rival spawns, trace spikes, node lockouts) actually fire
4. **Mission mechanical variety** — each type plays differently (evidence planting = upload not download, sabotage = timed escape, bounty = exploration)
5. **RAM/HDD/modem stats** — all three hardware stats currently do nothing; wire them to concurrent tool limits, file carry limits, and transfer times
6. **News feed** — first piece of living world; player actions generate news articles visible in the desktop

---

## Design Pillars

1. **Authentic tension** — the trace meter is a threat, not a timer
2. **Earned progression** — nothing is free; the shop is salvation, not a store
3. **Mechanical variety** — every mission type plays differently
4. **Narrative depth** — the story finds you whether you go looking or not
5. **Living world** — the game continues while you're not playing; corporations react, markets shift, rivals compete

---

*Full detail in [GAME_DESIGN_MASTER.md](GAME_DESIGN_MASTER.md). Implementation status in [DEV_DOCS_INDEX.md](DEV_DOCS_INDEX.md).*
