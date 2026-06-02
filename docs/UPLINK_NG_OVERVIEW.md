# VOIDLINK
### Game Overview — Pre-Alpha Summary

---

## What It Is

A single-player hacking thriller set in 2199. You are an anonymous contractor for Voidlink International — a black-market network connecting corporations, governments, and criminals with skilled hackers for hire. You take contracts, breach networks, steal data, plant evidence, and sabotage infrastructure — all while managing your trace level, upgrading your tools, and slowly discovering that the job you took three missions ago is connected to something much larger than you thought.

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
| **Testing** | Vitest (60 unit tests) |
| **Audio** | Web Audio API procedural SFX + file-based looped music |
| **3D** | Three.js — Network Map + World Map globe |
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
- Multi-window OS shell — drag, resize, minimize, z-order, taskbar, window-position memory
- Boot → Login (password + email + per-handle save) → Desktop with persistent session
- Settings menu (⚙) — music/SFX volume + toggles, dark/light theme, UI scale 70–150%, reduce-motion, shortcuts reference
- Mission Board: 5 mission types, story + procedural contracts, requirements gating
- Network Map (Three.js 3D): node graph, click-to-inspect, scan/crack/exploit/wipe actions
- Hacking Interface: scan, crack/exploit per-protocol with side-effects, log wipe, credential cache (dump/scrape/use), brute force lockout, subnet zones
- Trace system: multi-rate (base + IDS + admin + rival + world events), proxy bounce multiplier, auto-fail at 100%, digital proximity beep audio
- Upgrade Shop: hardware tiers + cracker/proxy/firewall/log-deleter/port-scanner software with reputation + price locks
- Profile Window: stats, hardware/software, XP/level, faction standings, faction founding
- Story mission framework: 5 arcs, 3 endings, hand-authored networks, narrative coda
- Tutorial (25 steps): spotlight + soft dim, conditional auto-advance, requireConfirm option, trace paused during tutorial, forces first contract
- Rival hacker AI: spawns mid-mission, roams the network, boosts trace, can be intercepted
- World Map (Three.js globe): neon green digital aesthetic, lat/lon grid, country outlines (110m world-atlas), atmosphere halo, starfield
- Bounce network on globe: click green nodes to chain, max hops scale with proxy software (basic=3, v2=5, v3=7)
- Banking: 2 institutions (Global Trust, Pacific National), open account, deposit/withdraw, compound savings interest (continuous accrual)
- In-game clock: epoch 2199-01-01 00:01:01, advances 1:1 with real time
- Idle music: 4:26 looped track, fades out on mission, fades back on disconnect
- Procedural SFX: scan, crack, wipe, success, fail, breach, click, tick, window-open/close, error
- World events: 7 active events affecting trace/economy
- 60 Vitest unit tests on core engine logic (100% passing)
- Performance: game loop at 20Hz, DataRain throttled to 18fps, pauses on tab hide — ~75% idle CPU reduction
- Accessibility: `<main>` landmarks (axe-clean), self-hosted fonts, focus-visible outlines, reduced-motion respect

### In Progress / Partially Built
- Banking expansion (M14c): loans, currency trading, equities, offshore accounts
- Exfiltration channels (M14d): speed vs stealth file-transfer trade-offs
- Privilege escalation + persistent backdoors (M15)
- Dark web layer (M17): architecture exists, content not yet built
- Mobile layout (M29)
- Multiplayer infrastructure (M25)

---

## The Story

Set in 2199. Five interconnected story arcs that unfold through mission briefings, terminal messages, and narrative coda text shown after mission completion.

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
