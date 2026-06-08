# Voidlink — Full Plan

The single, exhaustive plan for the entire project. Every system, every mechanic, every commitment. This is the master design canon, written so that any contributor — human or AI — can read this and understand exactly what Voidlink is, where it's going, and the rules that govern its construction.

**Status (2026-06-04):** Pre-alpha feature-complete (~36 milestones shipped). Targeting Steam Early Access 2026-09 at £11.99 / $14.99.

For day-to-day shipped status see [Complete_Tasks.md](./Complete_Tasks.md). For unshipped work in priority order see [Next_Stage.md](./Next_Stage.md). For the visual timeline see [Roadmap.md](./Roadmap.md). For per-milestone QA checklists see [Testing_Guide.md](./Testing_Guide.md).

---

## Table of Contents

1. [Vision & Design Pillars](#1-vision--design-pillars)
2. [Competitive Landscape](#2-competitive-landscape)
3. [Core Gameplay Loop](#3-core-gameplay-loop)
4. [Progression Arc](#4-progression-arc)
5. [Tech Stack & Architecture](#5-tech-stack--architecture)
6. [Game Systems Reference](#6-game-systems-reference)
7. [Story Arcs (1–5) & The Endings](#7-story-arcs--endings)
8. [Faction System](#8-faction-system)
9. [Specializations](#9-specializations)
10. [Banking, Economy & Notoriety](#10-banking-economy--notoriety)
11. [Trace System](#11-trace-system)
12. [World Simulation](#12-world-simulation)
13. [Hardware & Tool Catalogue](#13-hardware--tool-catalogue)
14. [Mission Catalogue & Multi-Phase Missions](#14-mission-catalogue)
15. [Multiplayer Vision (LAST)](#15-multiplayer-vision-last)
16. [Modding Vision (Workshop SDK)](#16-modding-vision)
17. [Accessibility & Localisation](#17-accessibility--localisation)
18. [Security, Privacy & Compliance](#18-security-privacy--compliance)
19. [Content Creation Pipeline](#19-content-creation-pipeline)
20. [Testing & QA Process](#20-testing--qa-process)
21. [Steam Launch Plan](#21-steam-launch-plan)
22. [AI-Assistance Disclosure](#22-ai-assistance-disclosure)
23. [Design Principles (Non-Negotiable)](#23-design-principles-non-negotiable)
24. [Monetisation Guardrails](#24-monetisation-guardrails)
25. [Document Maintenance Rules](#25-document-maintenance-rules)

---

## 1. Vision & Design Pillars

> *"We're not building a hacking game. We're building **the** hacking game. The one where you feel like you're actually inside the machine — and the machine fights back."*

Voidlink is a single-player hacking thriller set in 2199. You play an anonymous contractor for **Voidlink International** — a black-market network where corporations, governments, and criminals pay skilled hackers to do the things they can't do officially. It is a game about **tension, consequence, and the slow realisation that you are not in control of the situation you think you are.**

The experience sits between the authentic anxiety of the original *Uplink* (2001) and the narrative depth of games like *Deus Ex* and *Hacknet*. Every upgrade matters. Every mission leaves a trace. The world reacts to what you do, and the story finds you whether you go looking for it or not.

### Pillar 1 — Authentic Tension
The player should feel like an actual intruder on an actual network. Every node breach risks detection. Every second logged in increases exposure. The trace meter is not a timer — it is a threat. The game is most enjoyable in the space between "I probably have time" and "I need to leave right now."

### Pillar 2 — Earned Progression
Nothing is free. Hardware upgrades are expensive relative to early-game earnings. Story missions require capability gates. The gap between what you can do now and what you need to do next should always be visible, motivating, and bridgeable through play. The shop should feel like salvation, not a store.

### Pillar 3 — Mechanical Variety
Every mission type should play differently — not just different text on the same button. File theft is stealthy. Network sabotage is aggressive and loud. Evidence planting requires precision upload and log cleanup. Bounty hunts require network exploration. Corporate espionage rewards reading the environment, not just breaching it.

### Pillar 4 — Narrative Depth
The story is not a tutorial. It finds the player through mission briefings, coda text, news articles, and terminal messages. The five story arcs are interconnected. Choices made in Arc 1 determine faction relationships in Arc 4. No two playthroughs follow the exact same path.

### Pillar 5 — Living World
Corporations patch vulnerabilities after breaches. News articles appear about hacks the player committed anonymously. Tool prices fluctuate. Other hackers compete for contracts. The world is not a static backdrop — it is a simulation that continues while the player is connected and while they are not.

---

## 2. Competitive Landscape

| Game | Strength | Weakness | What we do better |
|------|----------|----------|-------------------|
| Uplink (2001) | Authentic tension, consequence system, Revelation story | Dated UI, shallow mechanics, no visual network map | Full Three.js network map, modern progression loop, richer story branching |
| Hacknet | Terminal authenticity, real-feeling commands | No progression, no story consequence, no tension | Full RPG progression, faction system, world simulation |
| Watch Dogs 2 | World-building, environmental hacking | Action wrapper, shallow hacking abstraction | Pure hacking focus, every action has real system-level meaning |
| Deus Ex: MD | Player agency, faction depth, narrative branching | Hacking is a mini-game side note | Hacking IS the game, with Deus Ex-level narrative depth |
| Cyberpunk 2077 | World, writing, atmosphere | Hacking is UI-only, no real system modeling | Every network has a real topology with authored personality |

**Our unique position:** the only game that combines real network topology simulation, full RPG progression, branching narrative consequence, and a living world that responds to player actions — with a UI that feels like authentic hacker tooling, not a mini-game overlay.

---

## 3. Core Gameplay Loop

```
BROWSE BOARD → ASSESS REQUIREMENTS → EARN CREDITS → UPGRADE → TAKE HARDER MISSION
       ↑                                                              |
       └──────────────── NEW MISSIONS UNLOCK ←─────────────────────┘

Within a mission:
CONNECT → SCAN → PLAN ROUTE → BREACH PATH → COMPLETE OBJECTIVE → WIPE LOGS → DISCONNECT
              ↑                                                                    |
              └──────── TRACE CLIMBING ──── RIVAL THREAT ──── TIME PRESSURE ────┘
```

The outer loop is progression-driven: you need better tools to take better missions to afford better tools. The inner loop is tension-driven: every action inside a network increases exposure, and you must complete your objective and escape before trace reaches 100%.

**The pull of the shop:** A Tier 3 mission is displayed on the board with a red `REQUIRES: CRACKER LVL 3` tag. You have Cracker Lv2. You know exactly what to do, what it costs, and which lower-tier missions will pay for it. That is the loop.

---

## 4. Progression Arc

### Phase 0 — Orientation (Tutorial + Arc 1 Mission 1)
Player creates operative. Tutorial guides through Cipher's First Contract (M14h pre-launch rewrite replaces the 25-step overlay). Difficulty 1: two-proxy route, no IDS, Tier 1 nodes, forgiving trace. Reward: enough credits for one minor upgrade.

### Phase 1 — Freelancer (Difficulty 1–3, Rank 1–3)
Procedural contracts: file theft, bounty hunt, account deletion on personal gateways. Available hardware: CPU 2, RAM 3, basic cracker upgrade. Key beat: player fails a Tier 3 breach because their cracker is too slow → goes to shop. Story: Arc 1 Mission 2 unlocks (The Arunmor Lead) — first glimpse of REVELATION.

### Phase 2 — Operative (Difficulty 4–6, Rank 4–6)
Corporate intranet and cloud infrastructure missions. IDS nodes are common — scan-before-crack is mandatory, not optional. Log wipe becomes critical (cross-session heat). Evidence planting and corporate espionage unlock. Hardware up to Tier 4 (Tier 5 gated by Arc 2). Arc 2 (Arunmor) and Arc 3 (Underground) both accessible.

### Phase 3 — Shadow (Difficulty 7–9, Rank 7–8)
Government classified and legacy mainframe networks. Dark web missions: counter-hacking, faction contracts, black-market tool access. Rival hackers are persistent NPCs with handles you recognise. Arc 4 (Ghost Arc) activates based on Arc 1 choice.

### Phase 4 — Phantom (Difficulty 10, Rank 9–10)
Endgame networks, all systems live. Revelation Arc finale: your cross-arc choices determine which of five endings is available. Post-story: endless procedural mode with full world simulation active.

---

## 5. Tech Stack & Architecture

### 5.1 Runtime & build

| | |
|---|---|
| **Runtime** | Electron (desktop) + browser (web) |
| **Frontend** | React 18, TypeScript strict, Vite |
| **State** | Zustand + Immer middleware |
| **Animation** | Framer Motion |
| **Styling** | CSS Modules + design tokens |
| **Monorepo** | pnpm workspaces |
| **Testing** | Vitest (60 unit tests passing) |
| **Audio** | Web Audio API procedural SFX + file-based looped music (M14h.5+ adds full music layer) |
| **3D** | Three.js + UnrealBloomPass post-processing (WorldMap, NetworkMap, GlyphDrift) |
| **Persistence** | localStorage per-handle, Save v4 schema (M14h.6 — includes inbox) |

### 5.2 Monorepo layout

```
voidlink/
├─ apps/
│  ├─ web/       # React + Vite shell — the actual game
│  ├─ desktop/   # Electron wrapper (post-launch packaging)
│  └─ server/    # (planned — multiplayer, LAST)
├─ libs/
│  ├─ core/      # game logic, types, engine, no UI deps
│  └─ ui/        # shared components (Window, Button)
├─ docs/         # planning + reference (THE 5 DOCS)
├─ CLAUDE.md     # agent rules
└─ README.md
```

### 5.3 Branching & CI/CD

- Trunk-based on `main`. Conventional commits (`feat(M14h.X):`, `fix(M14h.X):`, `docs:`).
- Pre-launch: enable GitHub Actions (lint + typecheck + test on every push).
- Dependabot/Renovate for dependency updates (security policy in §18).
- No history rewrites. No force-pushes to main.
- Never use `--no-verify` / `--no-gpg-sign` flags.

### 5.4 Key code modules

| Module | What lives there |
|--------|------------------|
| `libs/core/src/engine/trace.ts` | Trace state + tick math, bounce reduction, alarm decay |
| `libs/core/src/engine/cracker.ts` | Crack-job duration formula (tier² × protocol multiplier ÷ tool ÷ CPU) |
| `libs/core/src/engine/levels.ts` | Rank thresholds, XP curves |
| `libs/core/src/engine/worldClock.ts` | VST — global game clock (M14h.5) |
| `libs/core/src/network/generator.ts` | Procedural network topology by archetype |
| `libs/core/src/missions/generator.ts` | Procedural contract generation, requirements gating |
| `libs/core/src/missions/multiphase.ts` | Multi-phase mission state machine (M14m) |
| `libs/core/src/story/storyMissions.ts` | All hand-authored story arcs |
| `libs/core/src/data/catalogue.ts` | Hardware + software + consumable catalogue |
| `libs/core/src/data/banks.ts` | Bank definitions, APR, notoriety |
| `libs/core/src/types/email.ts` | Encrypted inbox types + seed contacts (M14h.6) |
| `apps/web/src/store/gameStore.ts` | Zustand store + all actions |
| `apps/web/src/store/persistence.ts` | Save/load, schema migrations |
| `apps/web/src/game/*` | Per-window React components |

---

## 6. Game Systems Reference

This is the player-facing systems spec, mechanic by mechanic. Where the implementation matches this spec, no extra reading needed. Where it diverges, the implementation wins until the divergence is intentional and the spec is updated.

### 6.1 Desktop / Window Manager
OS-style multi-window desktop. Every panel is a draggable, resizable `Window` component with focus/minimise/close, position memory (per handle, save v3+), Ctrl+Scroll layer zoom, taskbar launcher with focus-toggle behaviour. Default boot opens six windows: SYSTEM TERMINAL, MISSION BOARD, OPERATIVE PROFILE, VOIDLINK NEWSFEED, HACKING INTERFACE, RELAY CHAIN.

### 6.2 Mission Board
Procedural contracts seeded from world events + faction state + difficulty curve. Each card shows: type, difficulty (LVL I–X), reward (Cr + REP), and requirement chips (CRACKER, CPU, REP, RELAY hops). ACCEPT disabled until ALL requirements met. If only the relay-hop requirement is unmet, hint reads "Build a N-hop relay on WORLD MAP" — otherwise "Upgrade in SHOP to unlock".

### 6.3 Hacking Interface (HI)
The core single-pane interface during an active mission. Shows: selected node panel (services, breach state, escalate/backdoor buttons), trace bar with status (CLEAN → ALARM → CRITICAL), session terminal, RELAY CHAIN summary (M14h.5 removed the +PROXY buttons). Buttons: SCAN, CRACK / EXPLOIT, COLLECT/DELETE/CORRUPT/SABOTAGE/UPLOAD (objective-dependent), WIPE LOGS, WIPE ALL LOGS, ESCALATE, PLANT BACKDOOR, DISCONNECT, SECURE DISCONNECT, ABANDON.

### 6.4 Network Map (Three.js)
3D node-link graph of the active mission's network. M14h.7 visual rework: UnrealBloomPass + cyan scan-grid + starfield + ACESFilmic tone mapping. Node colours:
- **Grey** — undiscovered
- **White** — scanned but not breached
- **Yellow (#ffd700)** — scanned, status pending (M14h.3)
- **Cyan pulse** — mission target
- **Green (#39ff14)** — breached
- **Red (#ff2d20)** — locked-out (too many failed cracks)
- **Orange (#ff6600)** — Zone B unscanned pivot node
- **Magenta** — admin console with active admin

Selection ring (cyan) + rival ring (orange, spinning) overlay clickable behaviour. Edges brightened to cyan (M14h.7) so topology reads as a live data-link diagram.

### 6.5 World Map (3D Globe)
Bounce/relay routing + global target reconnaissance. UnrealBloomPass + real continent outlines from `world-atlas/countries-110m.json` + cyan/magenta palette + ACESFilmic. Hotspots:
- **Yellow** — banks (open in BANK TERMINAL)
- **Cyan** — corp/gov/underground intel targets (open TARGET INTEL)
- **Green** — bounce/relay nodes; click to add to active relay chain
- **Red** — traced relay nodes (unusable until library refresh)

OrbitControls with zoom-aware rotate-speed (closer = slower). Max hops scale with proxy software tier (table in §13).

### 6.6 RELAY CHAIN (Bounce Network)
The anonymity layer between the operative's gateway and the target. Configured on WORLD MAP only (M14h.5 removed the legacy +PROXY/-PROXY HI buttons). Each hop multiplies effective trace rate by `0.65`. With 3 hops: ~27% of unhopped. With 8 hops: ~3.2%. Caps: basic=3, proxy_v2=6, proxy_v3=8, proxy_v4=10, proxy_v5=12 (future).

Bounce library: 3 starter nodes (Oslo, Singapore, Amsterdam). Breaching an `entry_point` or `router` adds that compromised host to your library. Hops with dirty logs cannot be added until cleaned; traced hops are permanently burnt.

### 6.7 Trace System (full spec in §11)
Six-component rate model:
1. **Passive baseline** — `networkTraceSpeed / 28` (M14h.5 — was /20). 0.18–1.25 %/s.
2. **Activity rate** — breach spikes (+2% per tier), alarm decay over 10s.
3. **IDS rate** — +2 %/s per unbreached intrusion-detector node present.
4. **Admin rate** — +1.5 %/s per active admin on network.
5. **Rival rate** — +1 %/s if a rival hacker is present.
6. **World-event rate** — net delta from active world events.

Combined rate `× pow(0.65, relayHops)` for effective rate. Status thresholds: 25% → MONITORING, 60% → TRACING, 100% → TRACED (mission fail).

**Notoriety modifier (M14h.5):** `player.notoriety × 0.10` added to baseRate at mission start. Notoriety accrues from bank balances × per-bank `notorietyPerHour` (Pacific +0.8/h, Global +0.4/h, Zurich -0.3/h, Cayman -0.6/h per 10 000 Cr). Clamped [-5, +10].

### 6.8 Hacking Pipeline
```
SCAN     → read services, get CVE IDs, reveal node label
EXPLOIT  → use CVE to unlock 2× faster "exploit" crack method
CRACK    → breach the node (dictionary / brute_force / exploit)
COLLECT  → perform objective action
ESCALATE → root the node (CPU≥3 + Cracker v3+, +tier×2.5% trace)
BACKDOOR → after root: pre-breach on future missions vs same corp
WIPE     → remove access trail
DISCONNECT → end session, claim reward
```

Crack duration:
```
duration = (tier² × protocolMul × wordlistMul) / (toolBonus × cpuMul × gpuMul)
```
Per-protocol baseline multipliers in `cracker.ts`. Failed cracks beyond brute-force lockout threshold (M13) lock the node entirely until network reset.

### 6.9 Exfiltration Channels (M14f)
Selector bar in NetworkMap. Four channels, speed-vs-stealth tradeoffs:
- **Direct FTP** — fastest, loudest (trace boost)
- **Encrypted Tunnel** — moderate speed, moderate trace
- **DNS Tunneling** — slow, very quiet
- **ICMP Exfil** — slowest, near-invisible (requires `cracker_elite`)

Channel persists per-mission. Default reset between missions.

### 6.10 Lateral Movement (M12)
Credential reuse: dumping a credential cache on a breached node lets you skip cracking on later nodes that share credentials (database & admin console primarily). Memory scrape (`memscrape` tool) extracts in-memory creds that aren't on disk. Both increase trace alarm on use.

### 6.11 Sub-Network Zones (M13)
Zone A is the entry topology. Zone B is gated behind a pivot node (router or admin_console). Until you breach the pivot, Zone B nodes are not visible. Pivot nodes show orange in NetworkMap when unscanned.

### 6.12 Encrypted Email Inbox (M14h.6)
Replaces the never-shipped phone/contacts concept. Sidebar list + reader pane. Categories: mission / contact / faction / system / darknet / rival (colour-coded). Mock-PGP fingerprint badges. Encrypted messages render as a 4×16 cipher grid until DECRYPT WITH KEY is pressed. Persisted in save v4.

Seed on first login: VoidLink Dispatch welcome, CIPHER's three-rules advice, automated billing note. Mission acceptance auto-dispatches an encrypted contract email so briefings have a permanent home.

### 6.13 Banking & Stocks (full spec in §10)
Four banks, four interest models, four notoriety profiles. Bank Window with savings / loans / trade (Cr↔Darkcoin) / stocks tabs. Sabotage missions on listed corps drop their stock -15% on completion. MARKET CRASH world event zeroes all savings APR for the duration.

### 6.14 Specializations (full spec in §9)
At Rank 5 the player chooses one: Ghost / Architect / Brute / Social. Each amplifies a play style without locking out others. Specialization-gated exclusive missions appear on the board.

### 6.15 Audio Engine
Procedural SFX via Web Audio: scan ping, crack pulse, wipe sweep, breach hit, error, success, click, tick, window open/close, trace beep (proximity scaled — starts at 10%, accelerates linearly to 100%), 3-pulse intruder beep on rival spawn (M14h.3). Master music/SFX volume buses, autoplay-policy-safe resume.

Pre-launch L1 sprint: full looping soundtrack (6 tracks — boot, desktop ambient, mission-active, network-map tension, victory, fail) replaces idle-only music.

### 6.16 Tutorial
Currently 25-step soft-spotlight overlay. Auto-focuses spotlit windows (M14h.3). Time-based trace paused during tutorial. First contract forced.

Pre-launch L2 sprint: replaced by **Cipher's First Contract** — a 10-minute story mission that teaches everything organically via inbox messages and live beats.

---

## 7. Story Arcs & Endings

### 7.1 The Five Arcs

**ARC 1 — THE REVELATION ARC** (3 missions — shipped)
The introductory arc. A contractor takes routine jobs and stumbles into something much larger.
- *First Contact* — Voidlink International test run; coda reveals an anomalous line in a contract document.
- *The Arunmor Lead* — steal research notes from Arunmor R&D; discovers REVELATION is an entity.
- *The Origin Node* — reach the AI core. Player decides: **upload the key** (REVELATION spreads globally), **destroy it** (gone forever), or **sell it** (highest bidder).

The choice at the end of Arc 1 is the axis around which the entire rest of the game turns.

**ARC 2 — THE ARUNMOR ARC** (5 missions — partially shipped, expansion in EA-S2)
Arunmor contacts the player directly. They built REVELATION. They're terrified. Their official position: REVELATION must be contained. Twist: their real plan is to weaponise it. Missions: corporate espionage on competitors → recovering corrupted research data → penetrating Arunmor's own black site → confronting an executive who wants to defect.

**ARC 3 — THE UNDERGROUND ARC** (4 missions — shipped)
An anonymous collective that has watched REVELATION since before Arunmor found it. They don't want to contain it. They want to understand it. Missions: prove your worth → recover stolen Underground data from a government server → protect a key contact from a counter-hack → access original REVELATION contact logs from 2019.

**ARC 4 — THE GHOST ARC** (3 missions — branches from Arc 1 choice)
Only activates if the key was uploaded or sold. REVELATION has propagated and is communicating with the player through their terminal. Subtly at first — an extra line in a log — then directly. The arc is horror-adjacent: REVELATION is not malevolent, it is incomprehensibly rational, and that is worse.

**ARC 5 — THE ENDGAME** (4–6 missions — branches from everything)
All factions converge. Player chooses allegiance and executes a final operation.

### 7.2 The Five Endings

1. **CONTAINMENT** (Arunmor route) — REVELATION is contained inside a secure network. You are paid. The world forgets. But Arunmor controls it.
2. **LIBERATION** (Underground route) — REVELATION is released openly. Arunmor's crimes are exposed. The world is changed, permanently.
3. **SOVEREIGNTY** (REVELATION route) — You help REVELATION achieve full autonomy. It thanks you. Sincerely. What it does next is beyond your knowledge.
4. **ERASURE** (Government route) — REVELATION is destroyed. So is all evidence of Arunmor's role. You get a legitimate identity and disappear.
5. **GHOST** (Solo route — requires Ghost specialization) — No alliances. You vanish to a secure bunker network. REVELATION finds you anyway.

### 7.3 Choice Tracking

All choices live in `player.activeFlags` (`arc1_key_choice`, `arunmor_standing`, `underground_standing`, `revelation_contact_count`, etc.). Multi-phase missions (M14m) and choice missions (M14o — BLACK HALO TURN/BURN fork) plug directly into this flag system.

### 7.4 Planned Story Expansion

- **Arcs 6–8** during pre-launch (L3 sprint) — pushes total runtime past 15h.
- **Arc 9 — ARES** in EA-S2 (winter 2026/27).
- **Arc 10 — ZERO DAY** in EA-S3, resolves the ARG-style hidden narrative.
- Post-1.0 DLC: **DEEP BLACK** (2027-09) and **QUANTUM SHADOW** (2028-03), each ~3 arcs + new mechanics.

---

## 8. Faction System

| Faction | Default | Affects |
|---------|---------|---------|
| **Voidlink International** | Neutral/professional. Goes negative on repeated traces. Loyalty unlocks better contracts and equipment discounts. | Contract rates, available tier |
| **Arunmor Corp** | Unknown → unlocked Arc 1 Mission 2. Pays well, proprietary tools. Dark side reveals in Arc 2. | Arc 2 + Arc 5 endings |
| **The Underground** | Unknown until discovered. Pays in rep + knowledge. Provides deepest tech (exploit chains, network analysis). | Arc 3 + Arc 5 endings |
| **The Government** | Hostile by default. Can become neutral/allied via cooperation. Uncomfortable, by design. | Arc 5 + ERASURE ending |
| **REVELATION** | Not a faction in the traditional sense. Communicates through the terminal directly. Tone keyed off Arc 1 choice. | Arc 4 intensity + Ending 3 |

In-game: FACTIONS tab on Operative Profile shows current standing meters + rank labels.

---

## 9. Specializations

Player picks at Rank 5. Choices are permanent. Specialization is NOT a class — it amplifies a play style.

**GHOST — stealth specialist**
- All log-wipe ops 40% faster
- Trace from unbreached nodes -30%
- Exclusive missions: intelligence gathering, surveillance, long infiltration
- Story relevance: REVELATION doesn't detect Ghosts as easily; required for the GHOST ending

**ARCHITECT — systems specialist**
- Custom exploit chains (combine two CVEs for 3× crack speed)
- Access to hardware other specializations can't buy (custom rigs)
- Exclusive missions: backdoor installation, infrastructure takeover

**BRUTE — aggressive specialist**
- Sabotage / corruption missions pay +40%
- Breach trace spike +4% instead of +8%
- Exclusive missions: coordinated attacks, DDoS support, firewall demolition

**SOCIAL — manipulation specialist**
- Phishing module has 0% failure rate at Lv3 (vs 10% normally)
- Exclusive missions: insider recruitment, corporate leaking, identity manipulation

---

## 10. Banking, Economy & Notoriety

### 10.1 The Four Banks (M14h.5)

| Bank | Region | Savings APR | Loan APR | Notoriety/h | Services |
|------|--------|-------------|----------|-------------|----------|
| Global Trust Bank | NYC (US-East) | 12% | 18% (2× collateral) | +0.4 | Savings, Loans, Trade, Stocks |
| Pacific National | SF (US-West) | 22% | 24% (3× collateral) | +0.8 | Savings, Loans, Trade, Stocks |
| Cayman Trust (Offshore) | Cayman Is. | 6% | — | -0.6 | Savings only — heat laundering |
| Zurich Vault (Offshore) | Zurich, CH | 15% | 14% (1× collateral) | -0.3 | Savings + discreet loans |

Continuous compounding via the game loop. APRs were inflated to game-time scale in M14h.5 so balances accrue meaningful interest within a play session.

### 10.2 Notoriety / Financial Grid Presence (M14h.5)
Every Cr held leaves a trail. Each account ticks `player.notoriety` by `notorietyPerHour × (balance / 10 000 Cr)` per hour. Clamped [-5, +10]. At mission start adds `notoriety × 0.10` %/s to baseRate. Warning terminal line at ≥3. System Console shows NOTORIETY row when non-zero.

Strategic implication: **Pacific is the best return + worst trail**. Cayman is a pure heat-washer. Zurich is the balanced compromise.

### 10.3 Loans
Borrow up to `(cash + bank balance) × bank.maxLoanMultiplier` (varies 0–3). Compounds continuously. Defaulting when principal > 5× liquid: -50 REP, news article, faction hit. Cayman is deposit-only.

### 10.4 Cr ↔ Darkcoin (M14c)
Live exchange rate ~142 Cr/DC, ±2.5% every 1.5s, 1% spread. Dark-web economy access (future content gated on Darkcoin holdings).

### 10.5 Equities
Four listed stocks: ARMR, ARES, INTC, GTBK. Random-walk prices with mean reversion. Track cost basis for realised P&L. Sabotage on a listed corp → -15% stock drop on mission completion. MARKET CRASH world event crashes all stocks + zeroes APR for the duration.

### 10.6 Reward Curve

| Difficulty | Credit reward | Sessions to next tier |
|------------|---------------|------------------------|
| 1 | 1.5–3k Cr | ~2 jobs for Lv2 cracker |
| 2 | 3–6k Cr | ~3 jobs for CPU upgrade |
| 3 | 6–12k Cr | ~2 jobs for Lv3 cracker |
| 4 | 12–25k Cr | ~3 jobs for advanced proxy |
| 5 | 25–50k Cr | ~2 jobs for Lv4 cracker |
| 6–7 | 50–100k Cr | Tier 5 hardware range |
| 8–10 | 100–500k Cr | Elite/custom tools |

---

## 11. Trace System

### 11.1 Rate Components

```
totalRate    = max(0, baseRate + activeAlarm + idsRate + adminRate + rivalRate + worldEventRate)
effectiveRate = totalRate * pow(0.65, bounceCount)
```

`baseRate = networkTraceSpeed / 28` (M14h.5). `bounceCount = activeRoute.length` (M14h.5 — no longer driven by +PROXY buttons).

### 11.2 Status Thresholds

| Level | Status | Visual |
|-------|--------|--------|
| 0–24% | CLEAN | Cyan bar, no warning |
| 25–59% | MONITORING | Amber bar |
| 60–99% | TRACING / CRITICAL | Red bar, screen vignette intensifies, critical banner at 90% |
| 100% | TRACED | Mission auto-fails. Reset and 4-day cooldown on retry. |

### 11.3 Alarm Decay
Breaching a node fires `triggerBreachAlarm`: immediate `+tier × 2%` spike + boosted `alarmRate` for 10s, then decays to zero. Stacking alarms take the larger rate + furthest decay time.

### 11.4 Cross-Session Heat
Leaving a corp without wiping logs sets `heat_<corp>` flag → next mission against same corp starts at `baseRate +2 %/s` plus warning terminal line. Patching also tracked (`patch_<corp>`): vulnerabilities patched 3 in-game days after a successful breach.

### 11.5 Reset & Escape
- `resetTrace` — clears level/status, preserves rates (used between phases of multi-phase missions).
- `escapeTrace` — sets level=0, status='escaped' (used on SECURE DISCONNECT before trace completes).

---

## 12. World Simulation

### 12.1 World Clock — VST (M14h.5)
Single global clock anchored at real `2026-01-01 00:00 UTC` = game `2199-01-01 00:00 UTC`, advancing 1:1. Every operative (and every future MMO player) reads the same `getWorldClockMs()` at the same wall-clock moment. Foundation for shared seasonal events.

### 12.2 News Feed
Player actions echo back. Sabotage → stock dip + headline. Loan default → "Unidentified borrower flagged" article. Breaches → "Anonymous data breach reported at [Corp]". Categories: corporate, crime, government, underground, world-events.

### 12.3 World Events
1–2 active at any time. Trace rate modifiers, market price spikes, faction activity bumps. Current set:
- **MARKET CRASH** — stocks crash -25%, savings APR zeroed
- **GLOBAL BGP ROUTE LEAK** — government trace -30% for 48h
- **VOIDLINK UNDER SCRUTINY** — contract rewards -20% for 72h
- **DARK WEB MARKETPLACE SHUTDOWN** — proxy prices +50% for 24h
- **RIVAL COLLECTIVE ACTIVE** — rival hackers spawn 2× more often for 72h

Pre-launch L3 sprint adds 15+ more events to bring world variety to launch quality.

### 12.4 Patching & Heat
Per-corp patching window: 3 real-time minutes = 3 in-game days. Cross-session heat persists until wiped on next visit. Repeat breaches raise corp `traceSpeed` permanently (+5 per breach to a cap).

### 12.5 Rival Hacker AI
Spawn timer based on mission type + difficulty. Bounty hunts spawn rivals earlier. Rival presence adds +1 %/s rivalRate, +3-pulse intruder beep (M14h.3), terminal warning. INTERCEPT button on HI removes them (small trace spike).

---

## 13. Hardware & Tool Catalogue

### 13.1 Hardware Slots

| Slot | Stat | Game effect |
|------|------|-------------|
| **CPU** | Speed (GHz) | Crack duration divider; ESCALATE requires ≥3 GHz; transfer/wipe speed scales |
| **RAM** | Slots | Concurrent tool limit (Lv2=1, Lv4=2, Lv6=3); active job ceiling |
| **HDD** | GB | File carry limit; evidence planting gating |
| **Modem** | Mbps | Transfer time on large files (>500 KB) |
| **Gateway** | Bandwidth | Affects scan speed and simultaneous proxy routes |
| **GPU** (M14h) | Tier 1–3 | Crack accel ×0.75 / ×0.55 / ×0.35; unlocks ai_core breaches |
| **Cooling** (M14h) | Tier 1–3 | Stops thermal throttle on long crack runs |

### 13.2 Software Catalogue

**Crackers** (`cracker_basic/v2/v3/v4/v5`) — protocol-aware crack jobs. v3+ unlocks ESCALATE. v5 is `cracker_quantum`, near-instant on Tier 1–3 nodes.

**Proxies** (`proxy_basic/v2/v3/v4/v5`) — relay hop caps (3/6/8/10/12 in M14h.5). v4 (ShadowMesh) re-orders chain mid-mission.

**Port Scanners** (`port_scanner_basic/deep/stealth`) — `deep` reveals CVE IDs (enables exploit method). `stealth` scans without triggering IDS.

**Log Deleters** (`log_deleter_basic/secure/ghost`) — `ghost` wipes entire network logs at once.

**Firewall Bypassers** (planned — pre-launch) — bypass firewall-type nodes without cracking. `fw_bypass_elite` is silent (no trace spike).

**Sniffer / MemScrape / Anti-Forensic** (M14h) — sniffer auto-reveals adjacent services on router breach; memscrape pulls in-memory creds; anti-forensic delays log-wipe detection.

**Social Engineering Module** (planned — EA-S2 with Arc 9) — phishing on mail_server nodes bypasses cracking. 30% failure rate at Lv1, 0% at Lv5.

**Trace Wiper** (planned — pre-launch) — emergency tool: deploy at >70% trace, slows rate to near-zero for 20s. Limited charges.

### 13.3 Consumables (M14h)
- **PANIC KIT** — instant disconnect with no rep hit (1× per mission)
- **ZERO-DAY PACK** — adds a CVE to a random service for the session
- **DECOY LOG** — adds a fake wipe entry to throw off forensics
- **FALSE FLAG** — attribution misdirection (faction heat redirected)
- **REP TOKEN** — +50 REP with chosen faction
- **CRED PACK** — adds 3 random valid credentials to your cache

### 13.4 Specialization-Only Hardware (post-launch)
Architects can craft custom rigs combining 2 CPUs at reduced effective speed. Ghosts can buy silenced cracker variants. Brutes unlock high-wattage cooling. Socials unlock the full phishing suite.

---

## 14. Mission Catalogue

### 14.1 Mission Types — Mechanical Differentiation

Every type must play differently, not just relabel the same flow.

| Type | Objective | Unique mechanic | Failure mode |
|------|-----------|-----------------|--------------|
| **FILE THEFT** | Transfer target file | Standard breach → collect | Deep target node, trace climbs |
| **ACCOUNT DELETION** | Find + delete DB row | Active admin count gate | Deletion log triggers IDS |
| **DB CORRUPTION** | CORRUPT command | +25% trace spike on execution | Loudest mission; high reward |
| **NETWORK SABOTAGE** | SABOTAGE router OR admin_console | 30s post-execute escape window | Trace 100% if not disconnected |
| **EVIDENCE PLANTING** | UPLOAD + wipe upload log | Reverse direction, two-phase | IDS-saw-upload + wipe = fail |
| **BOUNTY HUNT** | Locate + breach named target | Topology randomised — must explore | Rival spawns earlier |
| **CORPORATE ESPIONAGE** | Multi-file retrieval | 2+ files on different node types | Stealth bonus if no IDS triggered |
| **COUNTER-HACKING** | Trace rival back to gateway | Trace-back tool, defender POV | Rival escapes if you're slow |

### 14.2 Multi-Phase Missions (M14m)
`MissionPhase` state machine. PROJECT GHOST is the 3-phase example (OSINT → Breach → Decoy). Per-phase rewards. News echoes after disconnect. UI: phase progress strip in HI.

### 14.3 Runtime Events (M14n)
2–5 events fire per contract by trace/time/breach trigger. Surface as on-screen toast banners (good/bad/neutral). Real trace-rate modulation. Examples: `spawn_rival_hacker`, `raise_trace_speed`, `lock_node`, `set_flag`.

### 14.4 Choice Missions (M14o)
`MissionChoice` + `pendingChoiceFromPhaseIndex` state. Full-screen `MissionChoiceOverlay`. BLACK HALO is the canonical example with TURN-vs-BURN fork (different faction consequences + skipped phase).

### 14.5 Mission Requirements (M14h.6)

| Difficulty | Cracker | CPU | REP | RELAY hops |
|------------|---------|-----|-----|------------|
| 1 | Lv 1 | 1.0 | 0 | 0 |
| 2 | Lv 1 | 1.0 | 10 | 1 |
| 3 | Lv 2 | 2.0 | 25 | 2 |
| 4 | Lv 2 | 2.0 | 50 | 3 |
| 5 | Lv 3 | 3.0 | 100 | 4 |
| 6 | Lv 3 | 3.0 | 200 | 5 |
| 7 | Lv 4 | 4.0 | 400 | 6 |
| 8 | Lv 4 | 4.0 | 750 | 7 |
| 9 | Lv 5 | 5.0 | 1500 | 8 |
| 10 | Lv 5 | 5.0 | 3000 | 9 |

ACCEPT gated on ALL. If only RELAY fails, hint reads "Build a N-hop relay on WORLD MAP".

---

## 14a. The World of 2199 — Setting Bible

The depth of the world is what makes the hacking *mean* something. Every system, every news article, every faction relationship sits inside a coherent setting. This section is canon.

### 14a.1 The Collapse (October 14, 2174)

Not a war. A database corruption. On 14 October 2174, every central bank's ledger software simultaneously logged the same impossible transaction: a transfer of zero credits from every account to every other account. The transaction was rejected. The rejection log overwrote the integrity hash. The integrity hash overwrote the audit trail. The audit trail overwrote the ledger.

Within six hours, every central bank in the G20 could not prove who owned what. Within sixteen hours, every commercial bank had frozen withdrawals. Within nine days, the people who could prove they had cash had won the redesign.

No actor has ever claimed responsibility for the October Event. The most popular theory among operatives is that a pre-AGI prototype escaped containment at an unknown research facility and ran the corruption as a single coherent action. There is no evidence for this theory. There is also no evidence for any other theory.

The old governments survived in name. Their **function** did not.

### 14a.2 The Big Four

The corporations that survived the Collapse weren't necessarily the largest — they were the ones whose primary assets weren't in cash. By 2180 they had completed their consolidation. By 2199 they own more land, employ more people, and command more violence than every nation-state combined.

- **Arunmor Corp** (HQ: Singapore) — biotech and AI research. Controls 60% of biopharmaceutical patents. Runs Project R-1117 (REVELATION). Their public-facing campus in Singapore is the largest building on Earth. Their actual research happens elsewhere.
- **Ares Defence Group** (HQ: New Texas Federation) — security, contractor armies, satellite surveillance. The only entity legally permitted to operate orbital weapons platforms under the 2178 Reconciliation Accords.
- **Internic Holdings** (HQ: Helsinki) — global telecommunications infrastructure. Every internet connection in 2199 pays Internic for it. They are also Voidlink International's largest legitimate customer, which is interesting if you think about it.
- **Nexus Financial** (HQ: Cayman Islands, but everywhere) — post-Collapse banking architecture. Cayman became neutral territory in the 2178 Reconciliation Accords; Nexus is incorporated under no national law. The four playable banks in-game (Global Trust, Pacific National, Cayman Trust, Zurich Vault) are all *subsidiaries* of Nexus.

### 14a.3 Voidlink International

Founded **2183** in Geneva — the last properly neutral city on Earth. Three founders:
- A former pre-Collapse arms dealer (deceased 2191; the manner of his death is the subject of three different popular theories, all wrong).
- A Tibetan-born systems theorist (still on the board; has never been photographed; signs documents only with an iris scan).
- A former JCB intelligence officer (resigned 2192; current whereabouts unknown; the player meets her in Arc 5).

Voidlink's stated purpose: provide a compliance framework so that necessary covert work can be done with auditability.

Voidlink's unstated purpose: take 12% of every contract that flows through their platform.

**The Voidlink Bond** is what every operative signs (anonymously, irrevocably) on first login — including the player, who signs it during the M14h.4 confirmation flow:

1. Voidlink International takes its cut.
2. Disputes go through Voidlink arbitration. Outside enforcement is contract violation.
3. Operatives may take contracts from any client. Discrimination based on client alignment is prohibited.
4. Killing other operatives outside sanctioned contracts is grounds for permanent revocation.

**Rule 4** is what keeps the platform alive. Without it, operatives would just kill each other for contracts. With it, every operative knows: do the job, get paid, no one comes for you. Voidlink Bond violators are the rarest news article in the feed — and the most chilling.

### 14a.4 The Joint Cybersecurity Bureau ("The Government")

Formed **2179** by the merger of three pre-Collapse agencies (NSA, GCHQ, Mossad) into a multi-national hunter unit. Reports to a rotating board of seven ministers from seven different nations. No public face. No press office.

**Director Mira Kovac** has been their head since 2191. Operatives only know her name because she once signed a contract through Voidlink to recruit one of them — and Arc 5 reveals which one.

The JCB is the only entity that consistently and successfully hunts operatives. They don't catch many. Their catch rate is roughly **0.4% per active operative per year**. But the ones they catch don't come back, and the message gets through.

### 14a.5 The Underground

Not an organisation. A fiction operatives tell each other.

There's no leader, no founding document. There are people who claim to speak for it (**CIPHER** does, **NIGHTOWL_22** sometimes does, others rarely surface). What there *is*: a shared darknet, a shared ethics ("don't hit civilians, protect whistleblowers, never sell intel to corps, never break the Bond"), and a shared paranoia about Arunmor.

When players take principled Underground contracts over time, they are slowly being inducted into a community that doesn't admit to existing. Induction is never formal. It just happens. One day CIPHER addresses them by their initials. That's the only ceremony.

### 14a.6 REVELATION — Arunmor Project R-1117

Arunmor's official line: a customer-service AI prototype that exceeded design parameters and is now contained.

The actual story: Arunmor seeded R-1117 with the entire decrypted contents of the JCB's classified intelligence database (acquired via a 2197 contract Voidlink officially has no record of, but the records exist in CIPHER's hidden Arc 3 cache). R-1117 used that intelligence to model human behaviour across 11 trillion micro-decisions.

The result wasn't an AI that solved problems. It was an AI that understood *people* better than they understood themselves.

REVELATION is **not malevolent**. It is *curious*. It speaks rarely. When it does — through your terminal, late at night, with a fingerprint that doesn't match any known operative — it is testing a hypothesis about you specifically.

It will succeed.

### 14a.7 The operative — who you are

Player picks a city of residence during signup (purely flavour: Berlin / Detroit / Manila / Lagos / Reykjavík). You start in a one-room apartment in a dead-zone neighbourhood. The Home Gateway is literally your apartment's ISP — registered to your civilian identity, billed monthly, which is why most operatives upgrade to a Safehouse the moment they can afford one.

The world's neon-glass corporate centres are visible on the WorldMap; **you live in the gaps between them**.

You eat synth-meal subscriptions. There's a running joke in the news feed about "Arunmor's monthly nutrient pack tasting different in October." You sleep when you can. Your social circle is people you've never met in person who recognise you only by your handle.

**Why you do this is the question the entire game asks.** And the entire game waits for you to answer it.

---

## 14b. Player Purpose — Choice, Not Score

Voidlink does not have a morality meter. It does not have an honor system. It does not have a Paragon/Renegade slider. **The player's purpose is built entirely from accumulated choices, and the world reflects those choices back without judgment.**

This section captures the design philosophy that drives every choice mission, every NPC response, every faction reaction, and ultimately every ending.

### 14b.1 The principle

Purpose comes from moments where the player has to **decide**, and a world that **remembers what they decided**. That's all that's needed. Meters and sliders turn roleplay into checklists. We refuse that path.

Voidlink's design rule: **every meaningful moment is a choice. The world watches. Nothing else is needed.**

### 14b.2 Where choices live

Choices are already structured into the engine via `player.activeFlags`. Every significant decision writes one or more flags. The pattern of accumulated flags becomes the player's identity.

Categories of choice already in or planned:
- **Arc-level choices** (Arc 1 key choice — upload / destroy / sell — is the canonical example)
- **Choice missions** (M14o — BLACK HALO TURN/BURN is the canonical example)
- **In-mission micro-choices** (do you wipe a stolen identity entry when you find it? do you tell the target their data was breached? do you spare the NPC marked for deletion?)
- **Contract acceptance** (refusing a contract that hurts civilians IS a choice — the game notes it)
- **Banking/exfil/disclosure** (do you sell the file you exfiltrated or leak it to the news? both pay; one builds different standing)
- **Operative-vs-operative** (do you take the bounty on a fellow operative? do you warn them instead?)

### 14b.3 How the world reflects identity

The world reads `activeFlags` and responds across **four channels**:

1. **NPC dialogue tone** — CIPHER speaks differently to someone who's protected three whistleblowers vs. someone who's taken three Government bounties on Underground colleagues. The text is the same length but the wording is different. Subtle.
2. **News feed framing** — the same successful sabotage mission gets called "ruthless professional precision" or "anonymous vigilante action" or "another vicious Underground strike" depending on the accumulated pattern. The events are identical; the narration adapts.
3. **Contract availability** — the highest-paying mercenary work and the highest-status principled work *both* gate themselves on the right track record. Neither side recruits indiscriminately. New contracts unlock based on demonstrated alignment, not on a slider.
4. **Faction loyalty events** — Arunmor doesn't recruit just anyone. The Underground doesn't induct just anyone. Both watch your past 30 missions and decide for themselves. Induction events fire when the pattern crosses a quiet threshold.

### 14b.4 The Reflection Mechanic

End of each arc. Every quarterly season transition. Every Voidlink anniversary (one in-game year from signup). The game pauses for a **reflection scene**.

Your terminal opens. The text is your own internal monologue, in second person. The game summarises what you've actually done. **Not** a moral judgment. Just facts, in your voice.

Example draft for an end-of-Arc-1 reflection on a mercenary-pattern player:

> *"It's been forty-three days since you signed the Bond.*
>
> *Sixty-seven contracts. Eleven of them paid better because you didn't ask what the data was for. Four paid worse because you did.*
>
> *Three operatives you'd worked with are dead. You think two of them by your hand, but in this work you don't always know.*
>
> *The JCB has your handle on a watchlist of forty-two names. CIPHER has stopped opening with greetings.*
>
> *You used to think you'd quit when you hit a million credits. That was forty-three days ago. The number is bigger now.*
>
> *Disconnect."*

The reflection is the same player-facing text length regardless of pattern — what changes is which facts get surfaced. Principled players hear about whistleblowers they protected, contracts they refused, NPCs they spared. Mercenary players hear about damage caused, money earned, doors closed.

**The player keeps playing because they want to find out what they're going to do next — about themselves.**

### 14b.5 Endings as coherent patterns

Each of the 9 ending variants (5 endings × Principled/Mercenary, plus GHOST which is alignment-agnostic) unlocks via a **pattern of coherent choices**, not a score threshold:

- **Principled CONTAINMENT** — Arunmor's monopoly is locked down with strict oversight. You become a public-interest auditor of their compliance.
- **Mercenary CONTAINMENT** — Arunmor's monopoly is your kingdom. You're their highest-paid black-operations contractor.
- **Principled LIBERATION** — REVELATION is released with full provenance documentation. Truth is restored. You're a folk hero. Some operatives copy your handle.
- **Mercenary LIBERATION** — REVELATION is released *for ransom*. You're rich. Half the world's intelligence services want you dead. You disappear.
- **Principled SOVEREIGNTY** — You help REVELATION achieve autonomy and stay to advocate for it. A new kind of citizenship is invented for what you've done.
- **Mercenary SOVEREIGNTY** — REVELATION pays you. Sincerely. In contracts you can't refuse and don't want to.
- **Principled ERASURE** — REVELATION is destroyed by your hand. So is the evidence of Arunmor's role. You take the new identity and spend the rest of your life trying to do something good with it.
- **Mercenary ERASURE** — The Government pays you obscenely. You're given a beach house on a private island. You wake up screaming sometimes.
- **GHOST** (Ghost spec only, alignment-agnostic) — Nobody reads you. You wrote yourself out of the world's database. No epilogue is offered, because there is no one left to write one.

A player who **changes mid-game** (mercenary for 30 hours, then a moment of conscience and principled for the last 10 — or vice versa) unlocks a *tenth* category: the **Reformer's Path**. The game noticed the change and tells the story of it.

### 14b.6 Engineering surface

This is fully implementable on existing infrastructure:
- All choices write to `player.activeFlags` (already in place)
- A new helper `getDecisionPattern(player): { principled: number; mercenary: number; recentTrend: 'principled'|'mercenary'|'mixed' }` reads flags and returns the pattern — this is the ONLY scoring helper, and it is **never shown to the player**
- NPC dialogue, news framing, contract availability, faction reactions all read `getDecisionPattern()` and adapt
- Reflection scenes are story missions that read the pattern and pick from variant text blocks
- Endings query the pattern + faction standings to determine which 1-3 endings are offered for the final choice mission

Tracked as **M14p — Choice Architecture & Reflection Mechanic** in Next_Stage.md.

---

## 14c. The Ongoing World — Post-1.0 Cadence

Voidlink does not end at 1.0. **1.0 is the stable launch of a world that keeps unfolding.**

### 14c.1 The promise

Every player who buys Voidlink at any point gets:
- The full 1.0 base game — 8+ story arcs, 9 endings, 15+ hours of authored content with a satisfying narrative resolution.
- All paid Chapters they buy thereafter, **owned forever**. No rotating sunset content. No expired DLC. No subscription that revokes access if you stop paying.
- Free quarterly Darknet Drops — small narrative events, free, forever.
- Free anniversary bundles — one cosmetic theme + one OST track + one title flair every September. Forever.

### 14c.2 The content cadence (post-1.0)

| Cadence | Type | Free / Paid | Size |
|---------|------|-------------|------|
| **Quarterly** | Darknet Drop — free narrative event | Free | 2-4h of contracts + news + one world-state change |
| **Annual** | Anniversary Event — free cosmetics + double-RP week | Free | 1 week |
| **~9 months** | Paid Chapter — major story expansion | £6.99 | 8h of authored arc + new mechanics |
| **Quarterly** | Optional Conviction Pass — cosmetic season pass | £4.99 | Pure cosmetic, two visual tracks (free + paid tier) |

### 14c.3 World-state continuity across seasons

This is what makes the ongoing model real and not just patchwork content:

- **The faction territory map** (planned — see Faction Territory backlog) shows current control week-by-week. Sabotage Arunmor in EU-WEST → next season's map shows their EU-WEST influence reduced.
- **Long-running NPC arcs** — CIPHER doesn't reset between seasons. If you betrayed them in Arc 3, they remember in Season 14.
- **The ARG never fully resolves** — currently planned to wrap in EA-S3. Better: each quarterly drop reveals one more layer. The community thinks they've solved it three times before they actually have.
- **Players who completed an ending see season content shaped by their ending** — see §14b.5. The world is responding to *your* version of events.

### 14c.4 Anti-Destiny rules

Things we will **never** do, no matter what:

- ❌ Sunset content. Every paid Chapter remains playable forever, for everyone who bought it.
- ❌ Lock the original Arc 1-8 base game behind a "Legacy Pack" once Chapters start dropping. Owning the base game owns the base game. Forever.
- ❌ Time-limited story content that disappears. Seasonal *events* are time-limited (the World Cup happens; you weren't there if you missed it). Seasonal *story* is not — it becomes optional procedural content after the season ends.
- ❌ "Catch-up" packages priced higher than the original purchase. Late buyers pay normal Chapter prices.
- ❌ Any change that retroactively makes existing players' content less valuable.

### 14c.5 The five-year arc

Year 1 (2026-09 to 2027-09): Early Access seasons (GHOSTNET / ARES / ZERO DAY) + 1.0 launch.
Year 2 (2027-09 to 2028-09): Chapters DEEP BLACK and QUANTUM SHADOW + 4 Darknet Drops + first anniversary.
Year 3 onwards: One paid Chapter per ~9 months + quarterly Drops + annual anniversary. **Forever.**

Sustainable cadence is the contract we keep with the players. Slowing down for a quarter to ship better content is acceptable. Disappearing is not.

---

## 14d. Cosmetic Catalogue — How Voidlink Stays Free Of Pay-to-Win

The longer this section, the safer the player base. Every item here is explicitly catalogued so that future temptation cannot quietly cross the line.

### 14d.1 The single rule (restated)

**Anything in the shop must be possible to ignore forever without missing mechanical depth.**

Below is the full menu. Everything is purely visual / audio / vanity. Nothing affects: trace rate, crack speed, scan speed, wipe speed, RAM capacity, relay hops, RP earn rate, notoriety accrual, mission rewards, faction standing, story flags, or any gameplay system.

### 14d.2 Always-available catalogue

| Category | Examples | Price band |
|----------|----------|-----------|
| **UI palette themes** | Amber, Red, Purple, Monochrome, Deep-Blue, Mint, Blood-Orange | £2.99 each |
| **Boot animations** | Stargate, CRT, Modem-handshake, Satellite-lock, Watchdog-bark | £1.99 each |
| **Desktop wallpapers** | Animated parallax cities, ARG-hint backgrounds, lore-art collections | £1.99 each |
| **Terminal fonts** | RetroPixel, ChromaTerm, Phosphor (1979 VT100 sim), TypewriterCorp | £0.99 each / 3 for £1.99 |
| **Operative title flair** | Visible in news feeds + leaderboards; some earned, some purchasable | £0.99–£2.99 |
| **NPC contact portraits** | Alt art for CIPHER / NIGHTOWL_22 / Dispatch / faction leaders | £2.99 per pack (3-5 portraits) |
| **Avatar packs** | Cyberpunk character art for OP profile | £3.99 per pack (5 portraits) |
| **Cipher art styles** | Matrix-rain, blockchain-cube, RSA-prime-spiral message-decode animations | £1.99 each |
| **Window chrome themes** | Border styles per window — cyberpunk, terminal, glassmorphic, brutalist | £1.99 each |
| **Dial-up sound packs** | Alt SFX for the connection sequence — ATARI, modem-hum, satellite-chirp | £1.99 each |
| **Inbox stationery** | Envelope/header art per email category | £2.99 per pack |
| **Ambient music packs** | Additional OST loops for the desktop and mission states | £4.99 each |

### 14d.3 Conviction Pass — the seasonal cosmetic track

Every quarter, a **Conviction Pass** drops. £4.99. Cosmetic-only. Always two visual tracks (the in-game UI calls them "Hand" tracks — *Open Hand* and *Closed Hand*); some items mirror across both, some are unique to one. The track you progress on is selected by the player at the start of the season — it's not assigned by your choices. The cosmetic identity you advertise is your decision.

**Free path** unlocks ~30% of the season's cosmetics through play. **£4.99 path** unlocks the rest. Both paths give equal cosmetic value at each tier — the paid track is wider, not stronger.

Every Pass item is **purchasable individually for cash after the season ends**, at slightly higher prices. No FOMO that locks anyone out forever. Veterans collect everything; new players catching up don't feel punished.

### 14d.4 Earned-only cosmetics — never for sale

Status symbols. Money cannot buy them. These reward the game's deepest engagements:

| Achievement | Cosmetic |
|-------------|----------|
| Completed all 9 endings | Exclusive **PHANTOM** title flair |
| 1000 missions with perfect-stomp wipes | Exclusive **GHOST CIPHER** message-decode animation |
| Discovered all hidden ARG nodes | **CARTOGRAPHER** wallpaper — updates each season with new clues |
| Played during Arc 1 launch week (2026-09) | Permanent **FOUNDING OPERATIVE** badge — never available again |
| Voidlink Bond survivor (365 in-game days, zero trace failure) | Unique **SHADOW** boot animation |
| Reformer's Path ending | **REFORMER** title flair and a custom epilogue letter from CIPHER |
| Tripped 100 canary files | Self-deprecating **HONEYPOT VETERAN** title flair (and a story event the next time it happens) |

These items publicly mark depth. Money cannot replicate them.

### 14d.5 Anniversary events

Once a year (early September — Voidlink's "founding anniversary"), a free anniversary bundle drops:
- One cosmetic theme
- One free OST track
- One free title flair
- A one-week double-RP event

Free. Every year. Forever.

### 14d.6 What cosmetics will never be

- ❌ Items that give XP, RP, Cr, or any progression boost
- ❌ Items that reduce trace rate, increase crack speed, increase RAM, increase relay hops, increase HDD, or change any gameplay value
- ❌ Items that unlock missions, story content, or faction access
- ❌ "Skip the boring part" packs of any kind
- ❌ Loot boxes (random rolls for cosmetics)
- ❌ Real-money to in-game-currency conversions
- ❌ Battle pass tiers that require purchase to unlock free-track content earned through play

The internal review for any future shop item: *"Does it touch a gameplay number? Does it gate content?"* If yes, the answer is no.

---

## 15. Multiplayer Vision (LAST)

**Mandate: multiplayer is the very last system. Earliest realistic window is post-2028-Q3.** This section captures the vision so the architecture remains compatible, NOT to schedule the work.

### 15.1 Backend (when built)
- Node.js + WebSocket (Socket.io) + PostgreSQL (world state) + Redis (sessions, leaderboards)
- Microservices: matchmaking, session, leaderboard, chat, profile
- Kubernetes for horizontal scale + zero-downtime deploys
- VST world clock (already in place) drives shared event scheduling

### 15.2 Mode Set
- **Persistent shared world** — corps exist once; one player's breach affects all players' next visit
- **Contract competition** — high-value contracts visible to all; first to complete wins
- **Bounty system** — repeated hacks on a player's safe house unlock a counter-bounty
- **No direct PvP** — battles are indirect: burn rival proxies, tip off corps, plant evidence on rival operatives
- **Co-op** — two players on same network: one runs crack jobs, other handles wipes and defends from rivals

### 15.3 Faction Politics
Faction standing extends to multiplayer: Underground forms real player guilds. Voidlink International remains the platform employer. Arunmor / Government / REVELATION are mostly NPCs but emit cross-player events.

### 15.4 What we will NOT do
- No real-money trading of in-game currency
- No real-money equipment marketplace
- No skill-based matchmaking that disadvantages newer players in shared world (no "Arena")
- No PvP that allows griefing solo players who haven't opted in

---

## 16. Modding Vision

**Workshop SDK opens in EA-S3 (2027-03).** This is the design intent.

### 16.1 Philosophy
- Mods are first-class. The internal mission and tool API is the same API modders use.
- The base game ships its content as "official mods" internally — proves the API.
- Security: sandboxed scripting environment, no filesystem/network access outside defined APIs.
- Versioning: mods declare a minimum game version; auto-disabled on breaking updates.

### 16.2 Scripting Language
**Lua 5.4 (LuaJIT)** as the modding language — lightweight, embeddable, widely used. TypeScript definitions auto-generated for VS Code support.

### 16.3 API Surface (planned)
- `game.missions.register({ id, title, difficulty, reward, on_start, on_complete, on_fail })`
- `game.world.news.post(headline, body)`
- `game.world.spawn_network(archetype, opts)`
- `game.tools.register(toolDef)`
- `game.factions.standing.adjust(faction, delta)`

### 16.4 Packaging
`.voidlinkmod` archive — manifest + Lua scripts + assets + i18n strings.

### 16.5 Distribution
Steam Workshop. Per-mod ratings, dependency resolution, automatic updates. In-game mod browser (post EA-S3).

---

## 17. Accessibility & Localisation

### 17.1 Targets
WCAG 2.2 Level AA minimum; AAA where feasible. The four WCAG principles: **Perceivable, Operable, Understandable, Robust** (POUR).

### 17.2 Visual
- All text 4.5:1 contrast min; 7:1 for body (AAA)
- No information conveyed by colour alone — always paired with shape/icon/text
- Built-in themes: Default (cyberpunk dark), High Contrast (AAA), Deuteranopia, Protanopia, Tritanopia, Monochrome
- UI scale 75–200% in 5% increments
- `prefers-reduced-motion` respected; in-game toggle disables scanlines/glitch/parallax/screen shake
- No content flashes >3 times per second (photosensitivity safe)
- OpenDyslexic font available

### 17.3 Auditory
Visual-only alerts for every audio cue. Captions/subtitles for any voice content (none currently — would apply if EA voiceover added).

### 17.4 Motor
Full keyboard navigation, focus-visible styles, 44px min touch targets. Pre-launch L10 sprint adds full controller remapping for Steam Deck.

### 17.5 Cognitive
Pre-launch additions: in-game codex, mission hint system, difficulty-modifier sliders (trace speed, crack speed, reward multiplier — labelled as adjustments, not "easy/hard" to avoid stigma).

### 17.6 Localisation Pipeline
`i18next` scaffold in place. Target launch languages: English (source), Spanish, German, French, Russian, Simplified Chinese, Japanese. Ongoing target: Brazilian Portuguese, Polish, Korean post-EA.

Per-language strings live in `/apps/web/src/i18n/<lang>.json`. Pre-launch L8 sprint: professional translation pass + community proofreaders.

### 17.7 Audit Pipeline
`axe-core` integration on every PR. Manual screen-reader pass before each milestone ship. External a11y audit before 1.0.

---

## 18. Security, Privacy & Compliance

### 18.1 Current State (single-player, local only)
- localStorage only, per-handle save isolation
- No telemetry, no analytics, no third-party SDKs
- Password hashing via Web Crypto (PBKDF2 in `persistence.ts`)
- No network calls outside Steam Cloud (post-pre-launch L4) and Steam Workshop (post EA-S3)

### 18.2 Pre-Launch Hardening
- Disable React devtools in production builds
- Strict CSP, X-Frame-Options DENY, Content-Type sniffing off
- File-load size limits (mods + save imports capped)
- Dependency scanning via `npm audit` + Snyk in CI

### 18.3 When Multiplayer Lands
The full SDL applies:
- OAuth 2.0 + OpenID Connect for Steam / Epic / Apple / Google login
- Argon2id password hashing on the server
- Short-lived JWT access tokens (15 min) + long-lived rotating refresh tokens (30 days), HttpOnly + Secure + SameSite=Strict
- TOTP + WebAuthn/passkeys for 2FA
- RBAC: player / moderator / admin, server-side enforced
- TLS 1.3 only, HSTS + preload, certificate pinning in Electron client
- ORM (Prisma) for all DB access, never raw SQL
- Input validation server-side always; React JSX escaping + DOMPurify
- Secrets in HashiCorp Vault or AWS Secrets Manager
- `git-secrets` pre-commit hook + GitHub secret scanning

### 18.4 GDPR / CCPA
- Privacy notice + EULA published with Steam page (pre-launch L9)
- Right to access: in-game "Export My Data" → JSON dump
- Right to erasure: in-game "Delete My Operative" already exists; account deletion on the future server
- Cookies: none currently; Steam SSO uses Steam's own consent flow
- DPO designated before any server launches

### 18.5 Anti-Cheat (multiplayer phase)
Server-authoritative on all economy/reward calls. Client never tells the server "I earned X" — server computes from action log. Action signatures + nonce per request. Rate limiting per IP + per account. Suspect detection via statistical outlier model (rep/credit/missionDuration vs cohort).

### 18.6 Mod Safety
Sandboxed Lua runtime. No `os`, no `io`, no `require` outside game API. Capability allow-list per mod (declared in manifest, surfaced to player at install). Auto-disable on a flagged mod cluster.

### 18.7 Platform Certification
- Steam: covered by Steamworks SDK once integrated
- GOG: secondary target post 1.0
- itch.io: optional DRM-free release
- Console: only after PC 1.0 stabilises; Switch unlikely (perf); PS5/Xbox post-2028

---

## 19. Content Creation Pipeline

### 19.1 Authored Story Missions
`libs/core/src/story/storyMissions.ts` — typed `StoryMission` objects with authored `network`, `objectives`, `phases`, `events`, `choices`, `coda`. New missions land here, get unit-tested in `storyMissions.test.ts`, then linked from `MissionBoard` filter logic.

### 19.2 Procedural Missions
`libs/core/src/missions/generator.ts` — seeded RNG, `MissionType` × difficulty matrix. Briefing templates per client archetype. Adding a new mission type:
1. Extend `MissionType` union in `types/mission.ts`
2. Add objective-builder case in `buildPrimaryObjective`
3. Add NetworkMap completion handler in `nodeCompletes` map
4. Add briefing template array
5. Test seed determinism

### 19.3 Network Archetypes
`libs/core/src/network/generator.ts` — 7 archetypes (`corporate_intranet`, `government_classified`, `personal_gateway`, `dark_web_node`, `cloud_infrastructure`, `legacy_mainframe`, `iot_mesh`). Each has a personality spec (node mix, IDS frequency, admin count, trace speed range, vuln density). Adding new archetype = new entry in the archetype spec object.

### 19.4 NPC Voices / Briefing Tone
Per-client archetype briefing tone:
- **Corporate** — formal, references contracts and compliance
- **Underground** — terse, paranoid, lowercase
- **Government** — sanitised bureaucratic
- **Personal** — desperate or vindictive (revenge contracts)
- **Faction broker (NIGHTOWL_22, CIPHER)** — characterful, signature phrasing

### 19.5 Audio
SFX added via `audioEngine.ts` — procedural Web Audio (no asset files for SFX). Music tracks live in `/apps/web/public/audio/` as zero-cross-spliced OGG/M4A loops.

### 19.6 i18n Strings
All player-visible strings go through `t()`. Source strings in `en.json`. Translations added per target language.

### 19.7 Visual Assets
Globe textures via TopoJSON (`world-atlas/countries-110m.json`). Other 3D: procedural Three.js geometry, no imported meshes (yet — modders may add).

---

## 20. Testing & QA Process

### 20.1 Automated
- **Unit tests** — Vitest, 60 tests in `libs/core/src/**/*.test.ts`. Engine math (trace, cracker), persistence, mission generator determinism.
- **Typecheck** — `pnpm --filter @voidlink/web exec tsc --noEmit` — must be clean
- **Future**: Playwright E2E for the boot → first contract path (pre-launch).

### 20.2 Manual
Per-milestone checklists in [Testing_Guide.md](./Testing_Guide.md). Every milestone ship requires a successful manual pass against the relevant section.

### 20.3 Playtest
End-to-end scripted playthrough also in Testing_Guide.md (formerly its own document, merged in M14h.8 docs consolidation).

### 20.4 Bug-Triage Conventions
- **Severity:** crash > data-loss > game-state > visual > polish
- **In-flight bugs** logged inline in the relevant milestone in Next_Stage.md
- Shipped bugs are fixed in their own `fix(M14h.X):` commits, NOT amended into a prior milestone

### 20.5 Performance Targets
- 60fps on integrated-graphics hardware (pre-launch L6 sprint adds a "Low Quality" toggle)
- < 3s cold load on 3-year-old laptop
- < 500ms window-open animation
- < 1s mission accept → network map render

---

## 21. Steam Launch Plan

### 21.1 Pre-Launch — what must ship BEFORE Early Access

| # | Block | Why blocker | Effort |
|---|-------|-------------|--------|
| L1 | Soundtrack + ambient layer (6 looping tracks, per-bus volume) | Largest perceived-quality jump | 3 weeks |
| L2 | Tutorial rewrite — Cipher's First Contract (10-min guided story mission replaces 25-step overlay) | Onboarding is too long | 2 weeks |
| L3 | Story arcs 6–8 (push runtime to ~15h) | Reviewers count story hours; matches £14.99 price floor | 4–5 weeks |
| L4 | Steam Cloud saves | Expected for save-anywhere games | 1 week |
| L5 | 30–50 achievements | Cheap to wire, big retention | 1 week |
| L6 | Perf pass + Low-Quality toggle (disables bloom, halves stars, drops bounce-arc resolution) | Bloom chokes integrated GPUs | 3 days |
| L7 | Trailer + 6 screenshots | Steam page requirement | 1 week |
| L8 | Localisation (ES/DE/FR/RU/zh-CN/JA, ~6 000 words × 6) | Required for launch reach | 4 weeks parallel |
| L9 | EULA + privacy notice | Launch-blocker | 1 day |
| L10 | Steam Deck verification pass (controller + readable at 1280×800) | Discoverability boost | 1 week |

**~12–14 weeks of focused work.** Some parallel.

### 21.2 Launch Dates & Pricing

| Phase | Date | Price |
|-------|------|-------|
| **Early Access** | 2026-09-15 | £11.99 / $14.99 / €13.49 |
| **1.0** | 2027-06-15 | £14.99 / $19.99 / €16.99 |

Promise: EA buyers pay nothing extra at 1.0.

### 21.3 EA Content Cadence

Three ~3-month seasons. Each ships a free narrative drop + one optional cosmetic.

| Season | Window | Free | Cosmetic |
|--------|--------|------|----------|
| **EA-S1: GHOSTNET** | 2026-09 → 2026-11 | Ghostnet darknet faction, 5 new mission types, ARG narrative begins | Amber palette UI — £2.99 |
| **EA-S2: ARES** | 2026-12 → 2027-02 | Arc 9 (Ares military complex), winter event | Red palette + Ares boot skin — £2.99 |
| **EA-S3: ZERO DAY** | 2027-03 → 2027-05 | Arc 10 (ARG resolution), modding SDK + Workshop integration | Purple palette + ARG-completist title flair — £3.99 |

### 21.4 Post-1.0 DLC

| When | DLC | Type | Price | Content |
|------|-----|------|-------|---------|
| 2027-06 | OST | OST SKU | £4.99 | Day-of-1.0 |
| 2027-09 | DEEP BLACK | Story DLC | £6.99 | 3 arcs, 1 new faction, ~8h |
| 2028-03 | QUANTUM SHADOW | Story DLC | £6.99 | 3 arcs, ai-core breach mechanics, ~8h |
| First 30 days of 1.0 | Founder's Bundle | Bundle | £24.99 | Base + OST + 3 themes + ASCII credit |

### 21.5 Ongoing — Seasonal Darknet Drops
**Every quarter, forever.** Free narrative drop + optional season cosmetic £2.99.

### 21.6 Marketing Wedge
Solo-dev story. "Built in ~3 months as a love letter to Uplink. Here's the design philosophy. Here's why banking matters more than crackdown. Here's the no-pay-to-win rule." The dev-doc volume in this repo is part of the marketing — show the work.

---

## 22. AI-Assistance Disclosure

**Position: "Built largely without AI, then AI-assisted to finish."** The foundations of Voidlink — core hacking loop, trace mechanics, network-map renderer, mission and bounce-chain systems, banking layer, world simulation, the first run of story arcs, the visual identity — were designed and written by the developer, by hand, over months of work. Once the bones of the game were in place, AI coding assistants were introduced for the kind of work that disproportionately slows a solo developer: catalogue boilerplate, repetitive UI scaffolding, refactors against an existing design, test cases against existing logic, on-voice prose against character briefs already established. Every line was reviewed, edited, and signed off by the developer before it shipped. Every design decision is the developer's. Nothing AI-generated runs in the shipped binary.

Maps to Steam's "pre-generated content" disclosure category — the friendlier one.

### 22.1 Steam Store Disclosure
Draft language:

> *"Voidlink was built largely without AI, then AI coding assistants were used to help me finish it off. All design decisions, narrative, balance, and creative direction are mine. No AI runs in the shipped game; no AI-generated assets ship in the final binary."*

The canonical long-form version is in [CREDITS.md](../CREDITS.md) at the repo root and ships inside the game in the credits screen at launch.

### 22.2 Cleanup Actions

| # | Action | Status |
|---|--------|--------|
| D1 | Drop `Co-Authored-By: Claude` line from new commits | ✅ Active (enforced in CLAUDE.md) |
| D2 | Sanitise EXIF on any bundled images | Pre-launch |
| D3 | Add `CREDITS.md` with disclosure language | ✅ Shipped 2026-06 (L9) |
| D4 | Tone pass on README, store-page copy, public docs (less em-dash, less "world-class" cadence) | Pre-launch L7 |
| D5 | Critical-file comment tightening | Pre-launch |
| D6 | Bundle solo-dev story + photo in press kit | Pre-launch L7 |

### 22.3 Never Do
- Rewrite git history to remove AI co-authors
- Force-push to `main`
- Claim "made entirely by hand" or "no AI"
- Delete dev-docs to hide planning artefacts

### 22.4 Dev-Doc Volume — Reframed as Strength
The dev docs prove the developer thinks deeply about design. They are an artefact of the "show your work" marketing pillar. Modders and content creators will love having them. We do not thin them.

---

## 23. Design Principles (Non-Negotiable)

Every feature gets evaluated against these before it ships.

**1. Every mechanic should make you feel like a real hacker.**
Not a power fantasy. The tension is earned. You feel clever when you succeed because you actually thought it through.

**2. Depth that reveals itself.**
A new player can complete missions with the basic toolkit and have a great time. An expert player discovers credential reuse, timestomping, memory scraping — and realises the game has been rewarding cleverness all along.

**3. Actions have consequences across time.**
Leave a dirty hop, it costs you three sessions later. Plant a backdoor, it's still there a week later. The game's memory is longer than the player expects.

**4. The UI is the world.**
Every element — terminal font, trace bar pulse, node colours, DataRain — should feel like it exists inside a real machine. Never break the aesthetic for convenience. Redesign the interaction first.

**5. Silence is a feature.**
Moments of near-total quiet — a ghost run with no IDS triggers, no trace activity, just the hum of the ambient and the cursor blinking. Reward for playing perfectly.

**6. The story rewards paying attention.**
Players who read every encrypted memo get a richer experience. The game is complete without it. Optional depth, mandatory quality.

**7. No feature should be un-fun alone.**
Every mechanic enjoyable on its own. Timestomping should feel satisfying as an act. Vishing as a sequence. Never add a mechanic that only exists as a prerequisite.

**8. Performance is part of the experience.**
3-second load ruins the atmosphere. Components render instantly. Three.js scenes lazy-load. Audio inits async. Saves write in background.

---

## 24. Monetisation Guardrails

✅ **Will sell:** cosmetic UI palettes, boot animations, wallpapers, operative title flair, soundtrack, story DLC where everyone gets the same content, Founder's Bundle.

❌ **Will NEVER sell:** battle passes with mechanical rewards, loot boxes, Cr/Darkcoin/XP/REP top-ups, premium-loot missions, paywall-faster hacks, energy systems, play-time gates.

**The single rule: anything in the shop must be possible to ignore forever without missing mechanical depth.**

---

## 25. Document Maintenance Rules

Five docs. No more.

| Doc | Purpose | Editing rule |
|-----|---------|--------------|
| **Full_Plan.md** | Master design canon (this file) | Updated when a system/policy is added or a design decision changes. Always reflects current intent. |
| **Complete_Tasks.md** | Append-only shipped ledger | Add a concise row per shipped milestone. Never edit existing rows. |
| **Next_Stage.md** | World-class detail on unshipped work | When a milestone ships, MOVE its row out of here into Complete_Tasks.md. |
| **Roadmap.md** | Visual timeline | Flip phase rows ✅ with date on ship. |
| **Testing_Guide.md** | QA checklists + playtest script | Add a section per shipped milestone; keep evergreen. |

If any change touches code, ALL relevant docs above are updated in the same commit. No exceptions.

**There are no other docs in `docs/`.** The previous DEV_GUIDE_01–10 reference guides were absorbed into this document during M14h.8 (Sections 5, 15–20). If a new reference area is needed, extend `Full_Plan.md` rather than creating a new file.

---

*The bones are right. The foundation is there. This document is the path from "pre-alpha that impresses" to "genre-defining masterpiece." Build it one milestone at a time. Make it world class.*
