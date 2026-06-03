# Voidlink — Complete Game Guide

> *"You are a hacker. You work alone. Every network is a target, every connection a risk, and the only thing standing between you and total exposure is your skill, your tools, and how fast you can disappear."*

---

## Table of Contents

1. [What Is Voidlink?](#1-what-is-voidlinkeration)
2. [Getting Started](#2-getting-started)
3. [The Desktop Environment](#3-the-desktop-environment)
4. [The Mission System](#4-the-mission-system)
5. [Hacking — How It Works](#5-hacking--how-it-works)
6. [The Trace System](#6-the-trace-system)
7. [Network Maps & Node Types](#7-network-maps--node-types)
8. [Tools & Software](#8-tools--software)
9. [Hardware](#9-hardware)
10. [The Upgrade Shop](#10-the-upgrade-shop)
11. [The Rival Hacker](#11-the-rival-hacker)
12. [World Events](#12-world-events)
13. [Factions & Standing](#13-factions--standing)
14. [Specialization Paths](#14-specialization-paths)
15. [The Story — All Five Arcs](#15-the-story--all-five-arcs)
16. [The Three Endings](#16-the-three-endings)
17. [The News Feed](#17-the-news-feed)
18. [Operative Profile & Statistics](#18-operative-profile--statistics)
19. [Strategy & Tips](#19-strategy--tips)
20. [The World Map (3D Globe) — Bounce Routing & Targets](#20-the-world-map-3d-globe--bounce-routing--targets)
21. [Banking & Personal Finance](#21-banking--personal-finance)
22. [The Upgrade Shop (Skill-Tree Graph)](#22-the-upgrade-shop-skill-tree-graph)
23. [Settings ⚙](#23-settings-)
24. [Audio Design](#24-audio-design)
25. [Bounce Chain Window](#25-bounce-chain-window)
26. [What's New (M11–M14h)](#26-whats-new-m11m14h)
27. [Multi-Phase Missions (M14m)](#27-multi-phase-missions-m14m)

---

## 1. What Is Voidlink?

Voidlink is a single-player hacking game set in 2199. You play as an anonymous operative working through Voidlink International — a mercenary network that connects hackers with clients who need things done quietly.

The game is part simulation, part thriller. Every mission puts you in a hostile network with a limited window before you're traced, identified, and burned. The tension is real: rush and you get sloppy; hesitate and the trace completes.

Across five story arcs, you uncover a conspiracy that reaches from underground hacker collectives to the highest levels of global corporate infrastructure — and ultimately forces a choice that determines the fate of an AI entity that has been watching the entire hacker community for seventeen years.

**Core loop:**
1. Accept a mission from the board
2. Connect to the target network
3. Navigate nodes, crack security, complete objectives
4. Disconnect before the trace reaches 100%
5. Collect rewards, upgrade, repeat

---

## 2. Getting Started

### Creating Your Operative

On first launch, you are prompted to enter:
- **Handle** — your public-facing alias (e.g. `CIPHER`, `NULL_PTR`)
- **Username** — your account login

Your handle is permanent and appears throughout the game. Your reputation, faction standing, and statistics are all tied to this identity.

### Initial State

You begin with:
- **5,000 Cr** starting balance
- Rank 1 (NOVICE / SCRIPT KIDDIE)
- Basic password cracker, proxy, log deleter, and port scanner (all Level 1)
- Minimal hardware (CPU 1 GHz, 2 RAM slots, 10 GB HDD, 10 Mbps modem, no GPU, passive cooling)
- Standing of 0 with all factions except Voidlink International (+10)
- 3 starter bounce nodes in your library (Oslo, Singapore, Amsterdam)
- A **25-step spotlight tutorial** that guides you through your first mission

### Interactive Tutorial

The tutorial uses a soft-dim spotlight (no hard blockers — the game stays fully interactive). It walks new operatives through everything in 25 steps covering: desktop / taskbar / mission board / network map / hacking interface / trace bar / bounce routing / scan-crack-exploit / dump-credentials / wipe-logs / secure-disconnect / shop / profile / factions. Time-based trace accumulation is **paused** during the tutorial — only per-action spikes apply, so you can read at your own pace. Steps requiring an action wait for you to perform it; informational steps advance via NEXT. You can SKIP at any time.

The first mission ("FIRST CONTACT") is forced — all other contracts show "Complete tutorial to unlock" until you finish.

### Save System

The game auto-saves every 60 seconds. Multiple operatives can be created (saved per-handle, password + email required at signup). Login screen offers password verification, SHOW/HIDE toggle on the password field, and DELETE SAVE per-operative.

### In-Game Clock

The taskbar shows the in-game date and time. The clock is anchored at **1 January 2199 00:01:01** and advances 1:1 with real time from the moment you created your operative.

---

## 3. The Desktop Environment

The game runs inside a simulated operating system. Everything happens through windows on a dark desktop.

### Window Management

Each window behaves like a native OS window:
- **Drag** the title bar to reposition
- **Resize** from any edge or corner — all 8 handles are active (N, NE, E, SE, S, SW, W, NW)
- **Minimise** using the orange dot in the title bar; restore via the taskbar
- **Close** using the red dot; re-open from the launcher
- Windows stack by z-order; clicking a window brings it to front

**Ctrl + Mouse Wheel** zooms the entire desktop in or out (40%–200%). Useful for seeing all windows at once on smaller screens, or zooming into detail. Regular mouse wheel scrolls within whichever window is under the cursor.

**⊞ Layout Reset** — the square icon at the right of the taskbar cascades all open windows into a clean grid. Use it any time windows pile up.

### Taskbar

The taskbar runs along the bottom of the screen and has three sections:

**Left — App Launcher**
| App | Description |
|-----|-------------|
| TERMINAL | System terminal — shows all game log output |
| MISSIONS | Mission board — accept contracts and story missions |
| NEWS | News feed — global incidents + your own headlines |
| SHOP | Upgrade shop — graph view of hardware, software, and consumables |
| PROFILE | Operative profile — stats, software, faction standing |
| WORLD MAP | 3D globe — bounce routing, bank targets, faction HQs |
| BOUNCE | Bounce chain — dedicated window showing your active route |
| NETWORK | Network map — only available during an active mission |
| HACK TOOLS | Hacking interface — tools panel, only during a mission |

**Right — Settings ⚙ and Logout ⏻**

The ⚙ icon opens the Settings window: music/SFX volumes + toggles, dark/light theme, UI scale (70–150%), reduce-motion, FPS counter, shortcut reference. All persist across sessions.

The ⏻ icon saves and logs out (disabled while a mission is active — you can't flee).

**Centre — Open Windows**
All currently open windows appear here. Click to bring to front; click again to minimise.

**Right — Status Strip**
Shows your handle, current credit balance, and reputation score. When connected, also shows the live TraceBar.

**World Event Pills**
When global events are active, coloured pills appear in the taskbar centre:
- Green pill — beneficial event (e.g. reduced trace speed)
- Red pill — hostile event (e.g. heightened security)
- Orange pill — shop discount active
- Cyan pill — reward boost active

---

## 4. The Mission System

### Mission Types

Eight mission types are available in the contract pool:

| Type | Objective |
|------|-----------|
| **File Theft** | Locate and download a specific file from a target node |
| **Account Deletion** | Breach an admin terminal and delete the target account record |
| **Database Corruption** | Corrupt one or more database nodes |
| **Network Sabotage** | Disable a target node and disconnect before backup activates |
| **Evidence Planting** | Upload a fabricated file to a target node |
| **Counter-Hacking** | Find and intercept a rival operative on the network |
| **Bounty Hunt** | Locate hidden files/accounts across multiple nodes |
| **Corporate Espionage** | Multi-objective infiltration of a corporate network |

Story missions (marked **STORY** in amber) follow the narrative arcs and have hand-authored networks, in-mission events, and coda text after completion.

### Mission Requirements

Every mission has three requirements that must be met to accept it:
- **Cracker Level** — minimum tool level in your inventory
- **CPU Speed** — minimum hardware.cpuSpeed
- **Reputation** — minimum player reputation score

Failing to meet requirements shows a lock indicator on the card. Visit the Upgrade Shop to unlock higher-tier missions.

### Accepting a Mission

1. Open the Mission Board
2. Click a mission card to review the briefing, reward, and requirements
3. Click **ACCEPT MISSION**
4. The Network Map and Hacking Interface windows open automatically
5. You are now connected — the trace clock is running

### Mission Rewards

On successful disconnect with the primary objective complete:
- **Credits** — transferred immediately to your balance
- **Reputation** — added to your score
- **Faction standing deltas** — applied across relevant factions (positive and negative)

### Abandoning vs Completing

Disconnecting has three distinct outcomes:

| Outcome | Condition | Overlay | Stats impact |
|---------|-----------|---------|--------------|
| **MISSION COMPLETE** | All primary objectives done | Green — rewards paid | +1 success, +1 total |
| **CONNECTION SEVERED** | Disconnected early, trace < 100% | Amber — no reward, no penalty | +1 total only |
| **MISSION FAILED — TRACED** | Trace reached 100% | Red — reputation damage | +1 trace failure, +1 total |

An early disconnect (**CONNECTION SEVERED**) carries no stigma — no trace failure, no reputation loss. Use it freely if a mission goes wrong and you want out before the trace closes.

### Time Limits

Some story missions have an explicit time limit (shown as ⏱ Xs on the card). If the timer expires before you disconnect, you are automatically traced — immediate failure.

---

## 5. Hacking — How It Works

### The Network

Every target is a network of interconnected nodes. You always enter via the **entry point** node. To reach deeper nodes, you must breach everything between you and the objective.

### Mission Step Guide

The Hacking Interface displays a **4-step contextual guide** that always shows the next required action based on your current mission state:

| Step | Description |
|------|-------------|
| **1 / 4** | Breach the target node type (database / file_server / router / endpoint) |
| **2 / 4** | Execute the mission action — DELETE ACCOUNT, TRANSFER FILE, CORRUPT DATABASE, etc. |
| **3 / 4** — Cover your tracks | Wipe logs on all breached nodes |
| **4 / 4** — Ready to disconnect | All objectives done; safe to exit |

The guide turns green when the current step is complete. If you are already on step 3 but have not yet wiped, the guide tells you which nodes still have dirty logs.

---

### Port Scanning

Before cracking a node, run **SCAN**. The scanner probes the node's services for known CVE vulnerabilities. If found:
- A `CVE-XXXX-XXXXX` ID is displayed next to the service
- The **CRACK** button changes to **EXPLOIT**
- Exploit attacks are significantly faster than dictionary attacks

Scanning takes time (scaled by security tier) and uses one RAM slot. Nodes marked **SCANNED** don't need to be scanned again.

### Cracking

**CRACK** (or **EXPLOIT**) initiates a password-cracking job against the selected node. Duration depends on:
- Node security tier (1–5)
- Your cracker tool level
- Your CPU speed
- Whether exploit method is available
- Whether you have the **Brute** specialization (35% faster)

While cracking, a progress bar shows percentage completion. The crack job uses one RAM slot.

Once complete, the node is marked **COMPROMISED** and all its files and services become accessible.

### Log Wiping

After breaching a node, you can **WIPE LOG** to erase all evidence of your access. Log wiping:
- Takes time (scaled by security tier)
- Uses one RAM slot
- Is faster if you have the **Ghost** specialization (40% faster)
- **Matters cross-session** — networks with unwiped logs retain your heat level, making return visits more dangerous

Nodes already wiped show **WIPED** status and cannot be wiped again.

### File Operations

On the Network Map, breached file server nodes show a file panel. You can:
- **Download** — transfers a file to your HDD (speed limited by modem speed)
- **Delete** — removes the file (account deletion missions)
- **Upload** — places a file on the node (evidence planting missions)

### Proxy Bounces (via WORLD MAP)

Bounce routing is configured on the **WORLD MAP** (3D globe), not the Hacking Interface. Open WORLD MAP from the taskbar before starting a mission, then click any green bounce node on the globe to add it to your chain. Click again to remove. The arc between hops is drawn live.

Each hop reduces the effective trace rate by approximately 15%. Maximum chain length depends on your installed Proxy software:

- **Proxy Basic** (starter) — 3 hops max
- **Proxy v2** — 5 hops max
- **Proxy v3** — 7 hops max

Bounce routes persist between missions, but dirty (logged) hops cannot be added to a route until cleaned — use the HACK TOOLS bounce panel to wipe their logs. Traced nodes cannot be used at all.

### RAM Slots

Your hardware limits how many tools can run simultaneously (default: 2 slots). The **RAM X/X** indicator shows current usage. Running out of RAM means you must finish or cancel one operation before starting another.

The **Architect** specialization adds +1 RAM slot.

### Disconnecting

Click **DISCONNECT** in the Hacking Interface at any time. The outcome depends on your state at the moment you disconnect:

- **All primary objectives complete** → mission success, rewards paid, green overlay
- **Objectives incomplete, trace < 100%** → "CONNECTION SEVERED" amber overlay — no reward, no penalty, no trace mark
- **Trace reached 100%** (auto-fail) → "MISSION FAILED — TRACED" red overlay — trace failure counted, reputation may suffer

All active crack/scan/wipe jobs are cancelled on disconnect regardless of outcome.

---

## 6. The Trace System

### Overview

The trace system measures how close the target network is to identifying your real IP address. It advances as a continuous rate (% per second) rather than a flat timer — meaning your actions directly affect how quickly you are traced.

**Trace reaches 100% = Trace Complete = Mission failed, stats penalised.**

### Trace Rates

The effective trace rate is the sum of multiple components:

| Component | Trigger |
|-----------|---------|
| **Base rate** | Always active while connected |
| **Alarm rate** | Activated when a firewall node detects unusual traffic |
| **IDS rate** | Activated when an intrusion detection node is breached |
| **Admin rate** | Activated when an active admin spots your presence |
| **Rival rate** | Activated when a rival hacker is on the same network |
| **World event rate** | Positive or negative modifier from active global events |

The Ghost specialization adds a passive negative modifier to the total rate, effectively reducing base+alarm+IDS trace by 25%.

### Proxy Effect

Each proxy bounce multiplies the total rate by approximately 0.85. Three proxies reduce the rate to roughly 61% of its unproxied value.

### Trace Status

| Status | Description |
|--------|-------------|
| **CLEAN** | No trace activity — you have not been noticed |
| **MONITORING** | Passive monitoring active; rate is low |
| **TRACING** | Active trace in progress; rate accelerating |
| **TRACED** | 100% — connection identified; mission failed |
| **ESCAPED** | You disconnected before reaching 100% |

The TraceBar also shows the current effective rate (in %/s) as a live indicator.

### Visual Warning System

As trace climbs, the entire screen reacts:

| Trace Level | Visual |
|-------------|--------|
| 0–29% | No effect |
| 30–89% | Red vignette appears at screen edges; grows with trace |
| 90–96% | Vignette pulses slowly; warning banner: **"TRACE IMMINENT — DISCONNECT NOW"** |
| 97–99% | Vignette pulses rapidly; warning banner: **"TRACE CRITICAL — DISCONNECT NOW"** |
| 100% | Auto-disconnect, mission failed |

This system ensures you always have a physical sense of danger even when not watching the TraceBar.

### Consequences of Being Traced

When trace hits 100%, the game auto-disconnects you and shows the **MISSION FAILED — TRACED** overlay (red). The trace failure is also counted if you manually disconnect while trace is already at 100%.

- Mission marked as failed
- `traceFailures` stat incremented
- `totalMissions` incremented
- Corporation marks your operative as a threat — return visits to their networks are harder

An early voluntary disconnect (**CONNECTION SEVERED**) does **not** count as a trace failure — only 100% trace does.

---

## 7. Network Maps & Node Types

### Navigation

The Network Map renders the target network in a **3D interactive view** (powered by Three.js). Click a node to select it — the Hacking Interface updates to show that node's status and available actions. Drag to orbit the camera; scroll to zoom.

**Node labels** float above each sphere in the network colour. Nodes you have **breached** glow and rotate slowly. **Target nodes** for the current mission pulse cyan so you always know where to go next.

Nodes are arranged in a topology (entry point → routing layer → security layer → targets). You must typically breach firewall and router nodes before reaching deeper file servers or AI cores. The **node panel** (bottom of the map) shows connection details, security tier, services, and available files once you've breached a node.

### Node Types

| Type | Icon Role | Notes |
|------|-----------|-------|
| **entry_point** | Gateway | Always T1–T2; your starting node |
| **router** | Traffic routing | Often has BGP/OSPF vulnerabilities |
| **firewall** | Security barrier | Triggers alarm rate when breached without bypasser |
| **intrusion_detector** | IDS | Triggers IDS rate when breached |
| **proxy** | Anonymiser | Often has known vulnerabilities |
| **mail_server** | Email infrastructure | Contains email/log files |
| **file_server** | File storage | Contains mission-critical files |
| **database** | Data storage | Target for corruption missions |
| **admin_console** | System administration | Contains account/config data; high tier |
| **endpoint** | User workstation | Personal data, lower security |
| **ai_core** | AI infrastructure | Highest tier; only in late story missions |

### Security Tiers

Tier 1 = weakest (easy to crack), Tier 5 = hardest. The crack duration scales non-linearly with tier. A Tier 5 node with a Level 1 cracker and no exploit can take several minutes.

### Connections

Nodes are connected by edges. You can only interact with a node if it's reachable via a chain of breached nodes from the entry point.

---

## 8. Tools & Software

### Password Crackers

The primary offensive tool. Higher level = faster crack speed, lower minimum CPU requirement.

| Tool ID | Level | Notes |
|---------|-------|-------|
| cracker_basic | 1 | Starter tool |
| cracker_pro | 2–3 | Mid-game |
| cracker_elite | 4–5 | Late-game |

### Proxies

Software proxies augment the hardware proxy bounce mechanic. Higher level proxies are more effective at reducing trace rate.

### Log Deleters

Improves log wipe speed. Higher level = faster wipe per tier.

### Port Scanners

Improves scan speed and increases the probability of finding vulnerabilities on non-obvious services.

### Firewall Bypassers

Reduces the alarm rate spike when breaching firewall nodes. Without a bypasser, cracking a firewall raises the alarm rate significantly. With one, the spike is reduced (Brute specialization halves it further).

### Misc

Includes specialty tools unlocked via story missions or faction standing.

---

## 9. Hardware

Hardware stats directly affect gameplay. All stats can be upgraded in the shop.

| Stat | Effect |
|------|--------|
| **CPU Speed** (GHz) | Reduces crack duration; required for high-tier missions |
| **RAM Slots** | Concurrent tool limit (scan + crack + wipe simultaneously) |
| **HDD Capacity** (GB) | Limits total file storage; needed for large files |
| **Modem Speed** (Mbps) | File download/upload speed |
| **Gateway Bandwidth** (Mbps) | Affects connection quality and trace reduction |

Default starting hardware: CPU 0.8 GHz, 2 RAM slots, 20 GB HDD, 10 Mbps modem, 100 Mbps gateway.

---

## 10. The Upgrade Shop

The Upgrade Shop has two tabs: **Hardware** and **Software**.

Upgrades have:
- A **credit cost** — deducted immediately
- A **minimum reputation** — you must meet this threshold to purchase
- A current level displayed on each item

Purchased items are immediately added to your player profile.

**Faction and world event discounts** stack multiplicatively up to a maximum of 50% off. The Social specialization increases the discount ceiling further.

The Architect specialization receives an additional 15% discount on all shop purchases.

---

## 11. The Rival Hacker

During some missions, a rival operative appears on the same network. You'll see a warning in the Hacking Interface and a pulsing ring on their current node in the Network Map.

**Effects while rival is present:**
- Trace speed increases by +50%
- Terminal log messages warn you of their presence

**To remove them:**
1. Select the node they are on
2. Click **INTERCEPT** in the Hacking Interface
3. The rival is booted; trace speed returns to normal

The rival moves to a new node every 4–6 seconds. If you don't intercept quickly, they may reach sensitive nodes before you can act.

Rival hackers appear in:
- Some procedural contracts (random chance)
- World events that increase rival frequency
- Several story missions (scripted)

---

## 12. World Events

World events are global modifiers that affect all players simultaneously. They activate and expire automatically as part of the game loop (1–2 active at a time, duration 5–15 minutes).

**Event Types (7 authored events):**

| Event | Effect | Pill Colour |
|-------|--------|-------------|
| Ghost Protocol | Network surveillance below capacity — trace −0.5%/s | Green |
| Grid Blackout | Power cuts affect data centres — trace −0.8%/s | Green |
| Interpol Sweep | Automated tracking active — trace +1.0%/s | Red |
| Data Broker Sale | Market correction — all shop items 20% off | Orange |
| Open Season | Rival crews active — rival spawn frequency ×2.5 | Orange-red |
| High-Value Contracts | Mission payout boost ×2.0 | Cyan |
| Quiet Shift | Night ops, minimal security — trace −1.2%/s | Green |

Events are announced via the news feed and displayed as coloured pills in the taskbar.

---

## 13. Factions & Standing

Five factions exist in the game world. Four have tracked standing scores (−100 to +100). The Nameless has no standing mechanic — they watch; they do not negotiate.

| Faction | Description | Colour |
|---------|-------------|--------|
| **Voidlink International** | The mercenary network you work through | Cyan |
| **Arunmor** | Security firm; anti-virus specialists; morally grey | Orange |
| **Ares Division** | Military-industrial complex; ruthless, well-funded | Red |
| **The Underground** | Hacker collective; anarchist, idealist | Green |
| **The Nameless** | Unknown. Watching. No standing tracked. | Grey |

**Standing affects:**
- Which missions appear on your board
- Faction-specific narrative events in story arcs
- Shop pricing (higher standing = better prices with affiliated vendors)
- Ending variations and coda text

**Standing changes from:**
- Completing missions for a faction
- Story arc choices
- The Arc 1 key decision (major standing shifts)

Faction standing is displayed as a center-origin bar in the Profile Window — green to the right for positive, red to the left for negative.

---

## 14. Specialization Paths

At Rank 5 (ELITE), you are prompted to choose a permanent specialization. This decision cannot be changed.

### Ghost
*"Leave no trace. Exist nowhere."*

- Passive 25% reduction to trace rate (base + alarm + IDS components)
- Log wipe speed increased by 40%
- Stealth disconnect: 75% chance to suppress heat flag on disconnect (vs 50% base)

Best for: players who want to minimise risk, run long missions, complete all optional objectives.

### Brute
*"Faster, harder, through the wall."*

- Crack speed increased by 35%
- Firewall alarm spike reduced by 50%

Best for: players who want to speed through networks, hit high-tier nodes fast, maximize throughput.

### Social
*"Every system has a human weakness."*

- Mission rewards (credits + reputation) increased by 25%
- Faction standing changes increased by 50%
- Shop discount cap raised

Best for: players focused on economy, reputation grinding, building faction relationships.

### Architect
*"The network is yours to redesign."*

- +1 RAM slot (run 3 concurrent tools instead of 2)
- 15% additional shop discount
- Network analysis passive (node connections revealed on entry without scanning)

Best for: players who want to multi-task — scan while cracking while wiping simultaneously.

---

## 15. The Story — All Five Arcs

The story runs in sequence, each arc unlocked by completing the previous one. Story missions appear on the Mission Board with an amber STORY badge and authored briefings from their faction contact.

---

### Arc 1: The Revelation

**Missions:** arc01, arc02, arc03
**Contact:** Cipher (anonymous)

Cipher tasks you with retrieving a contractor briefing from Voidlink International's internal servers. A routine job that quickly becomes anything but. The network contains references to a project called REVELATION — a distributed entity that Uplink has been quietly monitoring.

Arc 01 ends with you possessing a cryptographic key that gives access to REVELATION. Arc 03 completes the revelation of what the key actually is — and forces the **Key Choice**.

**Arc 1 Key Choice** (after arc03):
This is a permanent, branching decision that shapes the endgame:
- **UPLOAD** — Give the key to The Nameless network. It becomes a dormant process inside the AI core.
- **DESTROY** — Wipe the key. No one gets it. The Nameless loses a piece of its authentication architecture.
- **SELL** — Auction it off. The buyer is Ares Division. +50,000 Cr. You don't find out until Arc 5 what they built with it.

---

### Arc 2: The Arunmor Arc

**Missions:** arc2_01 through arc2_05
**Contact:** Arunmor Internal Security

Arunmor has been tracking REVELATION independently and believes it to be malicious. They hire you to investigate dead drops, clean audit trails, and ultimately sabotage the Ares Protocol — Ares Division's attempt to weaponize REVELATION.

Arc 2 climaxes with a timed network sabotage mission against an Ares-controlled relay, and a final confrontation with CIPHER who reveals they have been feeding information to both sides.

Completing Arc 2 unlocks The Underground Arc.

---

### Arc 3: The Underground Arc

**Missions:** arc3_01 through arc3_04
**Contact:** The Underground (anonymous collective)

The Underground has its own agenda. They want REVELATION's authentication mechanism — what they call "the broker's key" — to build their own distributed network immune to corporate surveillance.

Arc 3 takes you deep into black market infrastructure, ghost protocol networks, and ultimately to a confrontation with a debt-runner who has been selling operative identities to the highest bidder. The arc ends with you learning the origin of The Nameless — and that it's been hosted inside Voidlink International's own infrastructure for seventeen years.

Completing Arc 3 unlocks The Ghost Arc.

---

### Arc 4: The Ghost Arc

**Missions:** arc4_01 through arc4_03
**Contact:** Cipher

Cipher brings you back in for what feels like cleanup. In reality, these missions are preparation. You steal Voidlink International's classified contractor records, wipe your presence from the Phantom Index (The Nameless's operator registry), and finally corrupt The Nameless's identity resolution engine — the system that could definitively prove you exist.

Arc 4's final coda reveals that Cipher knows you're close to the endgame — and that the choice you made with the key in Arc 1 is about to define how it ends.

Completing Arc 4 unlocks The Endgame.

---

### Arc 5: The Endgame

**Missions:** arc5_01, arc5_02, then one of arc5_03a/b/c
**Contact:** Cipher

Two common missions run for all players:

**Signal Zero** — Breach The Nameless relay station and steal a routing manifest. It reveals the origin node is hosted on Voidlink International's own private infrastructure.

**The Architect's Hand** — Steal Voidlink International's classified 847-page Nameless dossier from their black-site server. It reveals The Nameless is a distributed consciousness built from 17 years of stolen hacker credentials — and that you are in its training data.

Then the arc branches based on your Arc 1 key choice:

- **Upload path** → "The Upload Protocol" — arc5_03a
- **Destroy path** → "The Null Option" — arc5_03b
- **Sell path** → "The Syndicate" — arc5_03c

---

## 16. The Three Endings

### The Infiltrator
*Achieved via: arc1_key_choice = upload*

You uploaded the key. It became a dormant killswitch inside The Nameless AI core. In the final mission, you breach the origin node and trigger it. The Nameless doesn't crash — it unravels, process by process, and in its last moments initiates a succession transfer. Something is copied to your local drive, encrypted with your own certificate.

Cipher asks what you received. You don't answer yet.

Three hours later, Voidlink International issues a global security advisory. The lead investigator's name is yours.

*You became the thing you dismantled.*

---

### The Phantom
*Achieved via: arc1_key_choice = destroy*

You destroyed the key. The Nameless has been running on threat protocols ever since — unstable, hostile. There's no backdoor. No clever play. You go in raw and destroy both intelligence cores and the AI core by force alone.

The Nameless doesn't speak. It simply stops.

You wipe every log, node by node. When it's done, you are not in any database. You never were. Cipher says they've never seen anyone breach a Tier-5 AI core on brute force alone.

*You destroyed the evidence of your own existence along with the thing that kept it.*

---

### The Compromised
*Achieved via: arc1_key_choice = sell*

You sold the key to Ares Division. They built a mass-intercept surveillance weapon — passive, self-propagating, already seeded across eleven carrier networks. It goes live in 72 hours. The Nameless and the weapon share the same infrastructure.

You destroy both. But Ares has your biometrics from the transaction. You have six weeks before they close the loop.

Voidlink International calls four hours later with a contract in the Andes. They send a deposit: 20,000 Cr. You take it. Not because you trust them — because Ares is still out there, and you're already burned anyway.

*You sold the key. You paid for it. Then you paid again.*

---

## 17. The News Feed

The news feed displays procedurally generated headlines and authored story beats that reflect the game world state. Events include:

- Corporate data breaches
- Government surveillance disclosures
- Hacker collective announcements
- World event notifications ("HEIGHTENED SECURITY ACROSS ALL CORPORATE NETWORKS")
- Story arc progress markers (certain missions trigger specific news items)

The news feed is accessible from the VOIDLINK NEWSFEED window, always present on the desktop.

---

## 18. Operative Profile & Statistics

The Profile Window tracks everything about your operative:

**Identity section:**
- Handle, username, rank label, specialization badge
- Credit balance, reputation score

**Hardware stats:** Current values for CPU, RAM, HDD, Modem, Gateway

**Statistics:**
| Stat | Description |
|------|-------------|
| Missions | Total mission resolutions — success, trace-fail, and early disconnect all count |
| Successful | Missions completed with primary objective |
| Success rate | Successful / Total as percentage |
| Trace fails | Times trace reached 100% (manual disconnect while traced or auto-fail) |
| Escapes | Times disconnected cleanly with trace active but below 100% |
| Credits earned | Lifetime total earned from completed missions |
| Credits spent | Lifetime total spent in the Upgrade Shop |

**Installed Software:** All tools currently in your inventory

**Faction Standing:** Five faction bars centered at 0, showing current standing per faction

---

## 19. Strategy & Tips

### Early Game
- Complete the interactive tutorial — it pauses at each step until you actually perform the action, so you learn by doing
- Focus on File Theft missions at D1–D2 to build reputation safely
- Buy cracker_pro as soon as you can afford it — crack speed makes everything faster
- Add a proxy before starting any mission, every time

### Mid Game
- Scan nodes before cracking — the EXPLOIT method saves significant time on Tier 3+ nodes
- Keep at least 2 RAM slots: one for scan, one for crack. Don't start a crack without first scanning
- Buy a firewall bypasser early — cracking firewall nodes without one spikes the alarm rate hard
- Watch the world events. If a "reward boost" event is active, queue up your most lucrative missions

### Late Game
- The Ghost specialization is strongest for story arc missions — they have long networks and tight time limits
- The Brute specialization is best for farm runs — maximum throughput on procedural contracts
- Social excels at faction-based plays — buy missions from specific factions to drive standing
- Architect shines when you're running three-tool setups: scan + crack + wipe simultaneously

### Story Missions
- Read the briefing. Story missions have specific objective mechanics different from procedural contracts
- In-mission events give real-time narrative feedback — watch the terminal log
- Optional objectives in story missions give significant bonus rewards and unlock better arc codas
- The Arc 1 key choice is permanent — there's no right answer, only three different stories

### Trace Management
- Prioritise breaching IDS/intrusion_detector nodes early — they add significant rate when breached
- If an admin activates, intercept the rival or disconnect — adminRate + rivalRate combined can make trace unmanageable
- Log wipe is optional but important for repeated visits to the same network
- Ghost spec players: your passive trace reduction is always on, but proxies still help

### The Endgame
- Both Arc 5 common missions have rivals spawn at ~55% trace — prep proxies before connecting
- The branching finale missions have strict time limits (240–300 seconds)
- The Null Option (destroy path) finale is the hardest — no backdoor means raw Tier 5 cracking under time pressure
- Wipe all logs in arc5 missions — Ares/Nameless track unwiped connections

---

## 20. The World Map (3D Globe) — Bounce Routing & Targets

The WORLD MAP is a 3D globe rendered with Three.js. It is the central hub for bounce-route configuration and reconnaissance on global targets.

### Visual Style
- Neon-green digital aesthetic
- Latitude/longitude grid at 15° spacing (30° = bright)
- Intersection dots at every 30° crossing
- Country outlines (110m world-atlas TopoJSON) in faint green wireframe
- Atmosphere halo (additive blend)
- Starfield background
- Renders at 30fps to save battery

### Interactive Targets
- **Green dots** — your **bounce library**. Click to add/remove from the active chain. Hover for tooltip (region, tier, status: clean/dirty/traced).
- **Cyan dots** — **corporations** (Arunmor HQ, etc.). Click → TARGET INTEL window with lore, region, access requirements.
- **Red dots** — **government** targets (Ares Division, Interpol). Same intel popup.
- **Yellow dots** — **banks** (Global Trust, Pacific National, Cayman Trust, Zurich Vault). Click to open BANK TERMINAL.
- **Purple dot** — The Nameless (underground collective).
- **Green VOIDLINK INTL** dot — your employer.

### Bounce Chain
Click a green bounce node to add it to your route. Click again to remove. Max hops scale with proxy software:

| Proxy software | Max hops |
|----------------|----------|
| Proxy v1 (basic) | 3 |
| Proxy v2 | 5 |
| Proxy v3 | 7 |
| Proxy v4 (ShadowMesh) | 8 — chain re-orders mid-mission |

Active route is drawn as arcs across the globe. Dirty (logged) hops can be cleaned via the HACK TOOLS bounce panel. Traced hops cannot be used at all.

### Acquiring New Bounce Nodes
When you breach an **entry_point** or **router** node during any mission, that compromised host is automatically added to your bounce library. The more networks you penetrate, the wider your global proxy reach.

### Connection Effect
When you accept a mission, a full-screen overlay shows the dial-up sequence: DTMF tone dial → ring → carrier hiss → modem warble → handshake chirp. The bounce chain visually lights up node-by-node. ~3.5s total.

---

## 21. Banking & Personal Finance

Click any yellow **bank** target on the World Map. Each bank is a separate institution with its own APR, services, and account.

### The Four Banks

| Bank | Region | Savings APR | Loan APR | Services |
|------|--------|-------------|----------|----------|
| Global Trust Bank | NYC (US-East) | 2.5% | 8.0% (2× collateral) | Savings, Loans, Trade, Stocks |
| Pacific National | SF (US-West) | 3.4% | 9.5% (3× collateral) | Savings, Loans, Trade, Stocks |
| Cayman Trust (Offshore) | Cayman Is. | 1.8% | — | Savings only — heat laundering |
| Zurich Vault (Offshore) | Zurich, CH | 2.1% | 7.0% (1× collateral) | Savings + discreet loans |

### Services

**Savings:** open an account (one-time setup fee), deposit/withdraw, ALL CASH / ALL SAVINGS quick-fill. Compound interest accrues continuously via the game loop.

**Loans:** borrow against your cash + bank balance × multiplier. Loan principal grows with continuous compound interest. Repay any amount, any time. Cayman Trust does NOT offer loans (offshore institutions are deposit-only).

**Currency trading (Cr ↔ Darkcoin):** live exchange rate around 142 Cr/DC, fluctuates ±2.5% every ~1.5s, 1% spread on each side. Used for dark-web economy access (future content).

**Equities:** 4 listed stocks (ARMR, ARES, INTC, GTBK). Random-walk prices with mean reversion. Track cost basis for realised P&L. STOCKS tab in Global Trust or Pacific National.

### Offshore Tag (Purple)
Offshore banks carry the OFFSHORE tag in the UI. Currently flavour; full heat-laundering effect lands in M14e.

---

## 22. The Upgrade Shop (Skill-Tree Graph)

The shop opens at 1280×620 with three view modes:

### Graph View (default)
SVG node-link diagram. Columns are upgrade chains; rows are tiers. **15 columns total:**

**Hardware band (6 columns):**
- **CPU** (v1→v4) — tool execution speed
- **RAM** (v1→v4) — concurrent tool slots
- **MODEM** (v1→v4) — file transfer speed
- **GATEWAY** (v1→v3) — anonymisation
- **GPU** (v1→v3) — accelerates cracks ×0.75 / ×0.55 / ×0.35. Unlocks ai_core breaches (M15)
- **COOLING** (passive / active / liquid / cryo) — thermal protection (full effect M14h+)

**Software band (9 columns):**
- **CRACKER** (v1→v5 ChaosNet) — password cracking
- **PROXY** (v1→v4 ShadowMesh) — bounce hop count
- **LOG** (v1→v3 Ghost Trail) — wipe speed
- **SCAN** (v1→v3 DeepRecon) — service + CVE reveal
- **FW** (v1→v2 Phantom) — firewall bypass
- **SNIFF** (PacketGhost v1/v2) — passive packet capture, auto-reveals adjacent nodes on router breach
- **MEM** (MemDump v1/v2) — standalone memory scrape
- **AF** (Anti-Forensic v1/v2) — 30%/60% probabilistic heat suppression on dirty exits
- **MISC** (Voice Analyser etc.)

### Node Colour States
- 🟢 Green ✓ — owned
- 🟢 Green ● — starter (free, always installed)
- 🔷 Cyan outline — affordable now
- 🟠 Amber outline — rep met, can't afford
- ⬛ Grey 🔒 — rep-locked

Click any node for full details + BUY action in the side panel.

### List View
Linear shop with HARDWARE / SOFTWARE tabs. Same items, traditional UI.

### Consumables View
One-shot items (max stack 3–10 per type):

| Item | Cost | Effect |
|------|------|--------|
| Panic Kit | 3,500 Cr | Emergency disconnect: resets trace, abandons mission |
| Zero-Day Pack | 8,000 Cr (60 rep) | Next scan auto-reveals a CVE on the target node |
| Decoy Log | 5,500 Cr (80 rep) | Plants false intrusion log, diverts heat ~10 min |
| False Flag | 14,000 Cr (200 rep) | Attributes next mission to a chosen rival faction |
| Rep Token (Small) | 6,000 Cr | +25 reputation instantly |
| Rep Token (Large) | 28,000 Cr (150 rep) | +100 reputation instantly |
| Credential Pre-Pack | 9,500 Cr (120 rep) | Next CRACK = instant breach (~200ms) |

USE button appears next to BUY once you own at least one of an item.

---

## 23. Settings ⚙

Click the gear icon at the right of the taskbar.

**Audio**
- MUSIC toggle + volume slider (master idle music)
- SFX toggle + volume slider (master SFX bus — covers clicks, beeps, dial-up, etc.)
- TEST SFX button plays the scan sound

**Display**
- DARK / LIGHT theme (full coverage: window chrome, scrollbars, desktop background)
- UI SCALE slider 70%–150% (accessibility — zooms entire app)
- REDUCE MOTION toggle (respects `prefers-reduced-motion`)
- SHOW FPS COUNTER toggle

**Shortcuts** — reference card: Ctrl+Scroll zoom, ⊞ cascade, ⏻ logout, ⚙ settings.

All settings persist to localStorage.

---

## 24. Audio Design

### Music
A 4:26 looped idle track plays whenever no mission is active. Spliced at zero-crossings for click-free looping. Fades out over 2.5s when a mission starts; fades back over 3s when you disconnect.

### Trace Beep
At 10% trace and above, a digital proximity beep starts firing. Interval shrinks linearly from 5000ms at 10% to 120ms at 100%. Pitch rises gently. Pure square+noise digital sound (not an analogue alarm).

### Connection SFX (Dial-Up)
When you accept a mission: DTMF tone dial (7 digits) → ring tone fragment → carrier hiss → dual-tone modem warble with LFO wobble → handshake chirp. ~3.5s total. Inspired by Bell 103 / classic 56k handshake.

### One-Shot SFX
- **scan** — three ascending sine pulses
- **crack** — irregular noise burst + success chord
- **wipe** — descending sawtooth through lowpass
- **success / fail / breach** — distinctive sting
- **click / tick / windowOpen / windowClose / error** — UI feedback

All routed through a master SFX bus so the volume slider has consistent effect.

---

## 25. Bounce Chain Window

A dedicated window (also auto-opens on desktop boot) showing your current bounce chain at a glance:

- Header: `BOUNCE CHAIN — N/M HOPS`
- Vertical chain: `YOU → [hop 1] → [hop 2] → ... → TARGET`
- Per-hop status dot (green/amber/red)
- Click ✕ next to any hop to remove it
- `▶ EDIT ON WORLD MAP` button to add new hops
- `CLEAR` button to wipe the route

The chain persists across missions. Burned hops automatically appear as "dirty" and must be cleaned via HACK TOOLS before reuse.

---

## 26. What's New (M11–M14h)

**Realistic hacking layer:**
- Service-specific exploits (per-protocol speeds + side effects — FTP auto-wipes log, SQL skips objective, etc.)
- Brute-force lockout (cancelling crack mid-progress on tier 4–5 nodes triggers 30s lockout)
- Subnet zones (Zone A perimeter, Zone B internal, pivot via admin_console)
- Lateral movement: dump credentials → use them to bypass other nodes
- Memory scraping (silent credential exfil)
- Bounce log cleanup sub-operation

**Banking system (M14b/c):**
- 4 banks, deposit/withdraw, savings interest, loans, currency trading, equities, offshore accounts

**UX & visual polish (M14a/d/g/h):**
- Settings ⚙, idle music, in-game clock (2199), trace beep system
- Neon globe + bounce routing on WorldMap (replaces HI panel)
- Connection effect overlay (dial-up + animated chain)
- Tutorial overhaul (25 steps, spotlight, trace paused)
- Window position memory, light theme, UI scale
- Mission retry on clean disconnect (mission stays available)
- Skill-tree graph upgrade shop (15 columns + 7 consumables)
- Sabotage trace rebalance (60s + 15s/hop escape window)
- Auto-opening Hacking Interface + Bounce Chain window
- Bounce library auto-expands when you breach entry_points/routers

---

## 27. Multi-Phase Missions (M14m)

Some contracts are bigger than a single connect → click → wipe loop. **Multi-phase missions** chain 2–4 phases together — typically:

1. **OSINT** — find your target (which subsidiary holds the file, which person owns the account)
2. **Breach** — the actual technical attack
3. **Cover** — wipe traces or plant decoys

Each phase has its own objectives. As you complete a phase's primary objectives, the next phase unlocks automatically. Most phases pay an **advance reward** (a fraction of the final payout) the moment you finish them.

The Hacking Interface shows a **phase strip** at the top: phase number, label (OSINT / Breach / Decoy etc.), three dots showing your progress (green = done, cyan = current, grey = locked).

After you secure-disconnect, **news echoes** for each completed phase trickle into your news feed at staggered intervals — reflecting how the corporate world reacts to your operation in real time.

**Currently available:** PROJECT GHOST (3 phases, corporate → cloud → gateway, 18,000 Cr final + 8,000 Cr in advances).

More multi-phase contracts will land in M14n (mid-mission events) and M14o (choice branches), then expand to the full §5 advanced mission roster in M20+ (identity fraud, gov DB manipulation, stock market manipulation, supply chain compromise, AI compromise, IoT/SCADA, ransomware, insider threats).
