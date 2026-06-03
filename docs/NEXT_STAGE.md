# Voidlink — The Definitive Roadmap

> *"We're not building a hacking game. We're building the hacking game. The one where you feel like you're actually inside the machine — and the machine fights back."*

This is the master plan. Every idea. Every mechanic. Everything Uplink did, everything Hacknet did, everything Mr. Robot showed us was possible — and then 10× beyond that. World-class. No corners cut.

**Status: Pre-alpha feature-complete as of 2026-05-27. Active development 2026-05-28+.**

**Shipped (2026-05-27):** Core loop, 9 procedural mission types, 5 story arcs, 3 endings, multi-rate trace system, 3D network map (Three.js), bounce network (§1.0), XP/levels 1–1000 (§9.0), factions + invite codes, 3D world map (globe), system console overlay, operative profile tabs, audio engine, 9-step tutorial, 4 specialisations, 7 world events, rival hacker AI, Electron wrapper, i18n scaffold.

**Shipped (2026-05-28):** Lateral movement + credential reuse (§1.1), memory scraping (§1.12), bounce hop cleanup (M11), service-specific exploits with protocol effects (§1.3), brute force lockout (§1.9), subnet zones Zone A/B with pivot gate (§1.10).

**Shipped (2199-01-01 — pre-alpha polish pass, M14a):**
- **Settings menu (⚙)**: music/SFX volume + toggles, dark/light theme, UI scale slider (70–150%), reduce-motion + FPS toggle, shortcuts reference. Persists to `localStorage`.
- **Idle music**: 4:26 looped track during idle, fades out when mission active, fades back when disconnected. Zero-cross spliced for click-free loop.
- **Trace beep system**: linear-cadence proximity beep replaces the old wirring alarm. Starts at 10% trace, accelerates linearly to 100%.
- **Window position memory**: dragging a window saves its position; reopening restores it.
- **Newsfeed launcher button**: now accessible from the taskbar.
- **In-game clock**: epoch 2199-01-01 00:01:01, advances 1:1 with real time from player creation. All in-game lore references updated to year 2199.
- **Bounce network moved to WORLD MAP globe**: click green bounce nodes on the 3D globe to add to chain. Max hops scale with proxy software tier (basic=3, v2=5, v3=7). HI bounce panel removed.
- **Neon digital globe**: green lat/lon grid, intersection dots, atmosphere halo, starfield, country outlines (110m world-atlas topojson, ~100KB).
- **Performance**: CRT WebGL canvas removed (CSS-only now), DataRain throttled to 18fps, game loop runs as `setInterval` at 20Hz, all loops pause on tab hide. ~75% CPU drop.
- **Mission retry**: incomplete disconnect (not traced) resets mission to `available`. No penalty.
- **Cracker version mapping fix**: shop purchases now register their tier correctly (e.g. `cracker_v2` → level 2 for mission requirements).
- **Light theme**: full CSS variable system; high-contrast palette for accessibility.
- **Tutorial overhaul**: spotlight-only (soft dim, no hard blockers), 25 steps, file transfer step, conditional auto-advance, requireConfirm option, window-cleanup option for focused steps. Time-based trace accumulation paused during tutorial. First contract forced.
- **Audio polish**: master music/SFX buses, click + tick + window-open/close + error SFX, autoplay-policy-safe resume.
- **Performance/accessibility**: `<main>` landmarks for axe-clean console, `@fontsource` self-hosted fonts (no CORS dependency).

Everything below is what comes next.

---

## Table of Contents

1. [Realistic Hacking Mechanics — Going Deep](#1-realistic-hacking-mechanics)
2. [The Dark Web Layer](#2-the-dark-web-layer)
3. [Social Engineering — The Human Attack Surface](#3-social-engineering)
4. [Counter-Intelligence & Cat-and-Mouse](#4-counter-intelligence)
5. [Advanced Mission Types — Beyond Break-and-Steal](#5-advanced-mission-types)
6. [Post-Endgame Story Arcs](#6-post-endgame-story-arcs)
7. [The Living World](#7-the-living-world)
8. [Hardware & Tool Depth](#8-hardware--tool-depth)
9. [Player Progression — Prestige, Achievements & Challenges](#9-player-progression)
10. [Multiplayer & Factions — The Persistent World](#10-multiplayer--factions)
11. [Atmosphere & Immersion](#11-atmosphere--immersion)
12. [Platform, Launch & Modding](#12-platform-launch--modding)
13. [Milestone Priority Table](#13-milestone-priority-table)
14. [Design Principles](#14-design-principles)

---

## 1. Realistic Hacking Mechanics

*Real hacking is not about cracking every box in sequence. It is about using what you already have. Steal keys, don't break down doors. Move invisibly. Leave nothing. The core loop has the tension. These mechanics add the craft.*

---

### 1.0 Bounce Network ✅ SHIPPED (2026-05-27)

The Uplink proxy chain — directional traceback, hop intercept, log cleanup, tier system. **Done.** Extend with:

- **Hop node health**: nodes degrade after heavy use; visible in BounceRouter as reliability score
- **Log wipe sub-missions**: short 30-second ops to clean dirty hops between main missions
- **Mixnet nodes**: one-time use; completely randomises the tracer when they hit it; found only on dark web contracts or stolen from government networks
- **Regional bounce premium**: APAC and SA nodes add +10s tracer delay due to jurisdictional overhead (lore: different extradition law)
- **VPN subscriptions**: purchased in shop; permanent hop with no log cleanup required; can be subpoenaed during Ares Division world events

---

### 1.1 Lateral Movement — Credential Reuse ✅ SHIPPED (2026-05-28)

**What real hackers do:** Once inside any box, they extract cached credentials and reuse them everywhere. Never crack the same password twice if you can steal it once.

- After breaching `admin_console` or `endpoint`: new **DUMP CREDENTIALS** action appears
- Dumped credentials stored in a **credential cache** panel in HackingInterface
- Any adjacent node that accepts those credentials can be accessed via **PASS CREDENTIALS** — no cracking, near-instant
- Credentials expire at disconnect or when the corporation triggers a patch cycle
- Ghost specialisation: dumps are silent (no log entry); other specs leave a CREDENTIAL_ACCESS event

---

### 1.2 Privilege Escalation

**Root access.** The level above breach.

- After breaching at user level: optional **ESCALATE** action appears
- Escalation: takes 8–15 seconds, adds +0.5%/s IDS rate while active
- CPU ≥ 3 GHz + tool tier ≥ 3 required
- **Root unlocks:**
  - All log entries on this node disabled (nothing to wipe)
  - Hidden partitions and extra files revealed
  - **PLANT BACKDOOR** action becomes available (see 1.4)
- Some nodes resist escalation entirely (patched kernel — visible post-scan)

---

### 1.3 Service-Specific Exploits

**Different services, different attack surfaces.**

| Protocol | Exploit Type | Trade-off |
|----------|-------------|-----------|
| SSH | Key leak / brute private key | Fast with credential cache; slow without |
| HTTP/HTTPS | Path traversal / SSRF | Bypasses firewall entirely; requires adjacent breached node |
| FTP | Anonymous auth bypass | Instant on unpatched versions; visible in logs |
| SQL | Injection chain | Database access without breaching node first |
| SMB | Pass-the-Hash | Requires credential from another node on network |
| RDP | Session hijack | Takes over active admin session; silences admin rate |
| LDAP | Directory dump | Reveals all usernames and service accounts in network |

Port scanner now returns the service protocol as well as CVE — makes the scanner genuinely strategic.

---

### 1.4 Persistent Backdoors

**Leave a way back in.**

- After reaching **root** (1.2): **PLANT BACKDOOR** action available
- Flag stored on network: `backdoor_[networkId]_[nodeId]`
- Future missions to same network: that node starts **pre-breached**, no crack required
- Backdoors have TTL: security audit world events or timed corporation sweeps remove them
- Terminal announces on connect: `BACKDOOR ACTIVE — [NODE] — direct access available` or `BACKDOOR [NODE] — SWEPT`
- Architect specialisation: plant faster, longer TTL

---

### 1.5 Exfiltration Channels

**Not all data leaves the same way.**

| Channel | Speed | Trace impact | Requirement |
|---------|-------|-------------|-------------|
| Direct FTP | 100% (modem speed) | Normal — visible in network logs | Default |
| Encrypted tunnel | 60% | −30% trace per transfer | Proxy Lv 3+ |
| DNS tunneling | 20% | Nearly undetectable — no file transfer log | Port Scanner Lv 2+ |
| ICMP exfil | 5% | Zero trace, bypasses all monitoring | Ghost spec + CPU 4+ |

Choose per file. Ghost player can exfiltrate a file with zero trace impact — but the clock is ticking while they wait.

---

### 1.6 Canary Files / Honeytokens

**Defenders plant fake "too-good-to-be-true" files.**

- Percentage of mission-critical-looking files are canary files (tier 4+ only)
- TRANSFER a canary → immediate IDS alert spike (+3%/s, 10 seconds), wrong target
- High-level port scanner: flags `⚠ SUSPICIOUS` on potential canaries
- Ghost specialisation: passive chance to detect canaries without scanning

---

### 1.7 Timestamp Manipulation (Timestomping)

**The final step of a true ghost run.**

- After log wipe: optional **STOMP TIMESTAMPS** action
- Without stomping: corporation gets a heat flag — next mission starts harder
- With stomping: corporation sees nothing; no heat, no patch triggered
- Timestomping is the difference between "they know someone was here" and "it never happened"

---

### 1.8 Traffic Sniffing / Man-in-the-Middle

**Compromise a router. Read everything passing through it.**

- After breaching a `router` node: **INTERCEPT TRAFFIC** action
- Runs passively (costs 1 RAM slot); adds +0.3%/s IDS rate while active
- Over 30–90 seconds yields: a credential for an adjacent node, an active session token (instant breach), or internal commands revealing admin status
- Rewards players who breach the router first and plan around the network topology

---

### 1.9 Brute Force Lockout

**Try too many wrong passwords. The account locks.**

- Tier 4–5 nodes have lockout policies (detectable post-scan)
- A cancelled or insufficient crack attempt triggers 30-second lockout + +0.5%/s alarm rate
- Must use EXPLOIT (not CRACK) on locked accounts
- Brute specialisation: triggers lockout only after 2 failed attempts

---

### 1.10 Network Pivoting — Subnet Zones

**Corporate networks are segmented. You pivot.**

- `government_classified`, `cloud_infrastructure` archetypes introduce Zone A (perimeter) and Zone B (internal)
- Zone B nodes are grey and unreachable until a Zone A pivot node is breached
- 3D network map: Zone A cluster in cyan, Zone B cluster in amber, pivot nodes bridging them
- Creates a natural two-act structure: breach perimeter first, then pivot inside

---

### 1.11 File Integrity Monitoring Bypass

**High-security nodes run FIM agents that alert on file modification.**

- FIM active indicator visible post-scan
- TRANSFER or CORRUPT while FIM active → +2%/s alarm spike
- Must breach `admin_console` first: **DISABLE FIM** action gives a 60-second window
- FIM re-enables after 60 seconds

---

### 1.12 Memory Scraping ✅ SHIPPED (2026-05-28)

**Extract credentials from running process memory. No log. No disk write.**

- After breaching `endpoint` or `admin_console`: **SCRAPE MEMORY** action
- Requires CPU ≥ 2 GHz + Port Scanner Lv 2+
- Extracts credential silently: no log entry, no heat flag
- Target process unknown until scrape completes — random adjacent node
- Ghost spec: always succeeds silently. Others: 20% chance of trace spike

---

## 2. The Dark Web Layer

*Think: Silk Road meets Hacknet. Think: you're in the part of the network the normal world pretends doesn't exist.*

---

### 2.0 Dark Web Architecture

- Accessible only through a specially configured gateway + dark web adapter software (new category)
- Nodes use routing manifests instead of DNS — only findable through intel gathered from other dark web nodes, or through story contacts
- Normal proxies don't work: dark web requires onion-routed hops
- Disconnecting improperly on a dark web node leaves a footprint that bounty hunters can follow

---

### 2.1 The Black Market

Rotating stock shop — currency: **Darkcoin** (volatile privacy crypto).

| Category | Items |
|----------|-------|
| Zero-days | Unreleased CVE exploits for specific node types — one-time use, major speed advantage |
| Stolen credentials | Pre-acquired logins for specific corporate networks |
| Deniable proxies | No-log bounce nodes operated by unknown parties |
| Counterfeit rep | Illegal reputation injection — Voidlink International may detect it |
| Leaked source code | Corporate software repos — gives persistent exploit discount on a specific corporation |
| Memory scrapers | Pre-built payloads — no Port Scanner required |
| FIM killers | One-shot tool: disables FIM without needing admin_console access |
| Mixnet nodes | Extremely rare; one-time use; breaks trace chain permanently |

---

### 2.2 Dark Web Contracts

A second mission board — higher reward, higher risk.

- **Identity Theft** — steal and sell a person's complete digital identity
- **Corporate Assassination** — destroy a target executive's online presence
- **Data Ransomware** — encrypt a target's servers; negotiate ransom payment through the board
- **Whistleblower Drop** — exfiltrate classified documents, deliver to anonymous journalist node
- **Dark Auction** — steal data and auction it to highest bidder (timed bidding mechanic)
- **Ghost Contract** — deep op with no paper trail; payer and payout anonymous; maximum yield

Pays 3–10× standard rates. Heat builds through different channels — not corporate IDS but dark web bounty hunters.

---

### 2.3 Exploit Auctions

Live auction system on dark web:

- Zero-day CVEs come to market with a countdown and rising bid floor
- Other buyers (AI-driven) drive price up in real time
- Winning a zero-day gives you 48 game-hours of exclusive exploit before it propagates to the patch cycle
- Some zero-days are traps: access the auction node and your tool signature is fingerprinted

---

### 2.4 The Info Broker

An NPC operating a dark web intel shop:

- Purchase network topology maps for specific corporation archetypes
- Buy dossiers on rival operatives (reveals their current heat level and active region)
- Commission a **target profile**: full employee list, credential hints, past breach reports
- Sell exfiltrated data for Darkcoin (rates fluctuate with world events)

---

### 2.5 Darknet Forums

Player-readable bulletin boards:

- Tips on specific corporate network topologies
- Wanted posters for rival operatives (your name may appear)
- Faction propaganda from underground groups
- Auction listings for rare zero-days
- Story beats from secondary characters found nowhere else
- **Dead drops** — anonymous messages with coordinates to specific node IDs

---

## 3. Social Engineering

*The human is always the weakest link. Every Mr. Robot fan knows this.*

---

### 3.0 OSINT — Open Source Intelligence

Before the technical breach:

- New recon phase: **OSINT scan** on a target corporation
- Scours publicly available information: employee social profiles, public API endpoints, job listings (which reveal what software they run), domain registration records
- OSINT yields: employee names, email format patterns, specific software versions, VPN provider used
- Takes 2 minutes real-time; runs in background; Analyst specialisation halves it

---

### 3.1 Email Interception & Phishing

- Breach the `mail_server` node → unlock email browsing
- Emails reveal: employee names, schedules, passwords, internal project codenames
- **Spear phishing**: send crafted email from spoofed internal address → employee clicks → session token bypasses one security layer
- **Mass phishing**: lower success rate but can net 3–5 credentials simultaneously (noisier; IDS detects if poorly crafted)
- Email writing mini-game: choose subject, tone, urgency, spoofed sender — quality score determines success probability

---

### 3.2 Vishing (Voice Phishing)

Text-based interactive sequence — you are on a phone call with a target employee:

- Choose your pretext: IT support, vendor, new hire
- Employee has a personality type (suspicious, helpful, nervous) derived from email intercept
- Multiple choice dialogue — adapt to their responses
- Successful vishing yields: temp admin credential, firewall bypass code, or network topology map
- Fail three responses → they hang up and raise internal alert (heat spike)

---

### 3.3 Pretexting & Social Media

- Build a **fake persona** to engage target employees on professional networks
- Takes multiple sessions (build trust over time)
- Yields: specific department-level credentials, upcoming maintenance windows (ideal breach time), VPN access details
- Social specialisation accelerates trust-building by 60%

---

### 3.4 Insider Threat Recruitment

- Build a dossier on a specific employee across multiple missions (3–5 ops)
- Once dossier complete: **RECRUIT** option appears
- Recruited insider: persistent NPC who provides weekly intel (scheduled maintenance, credential rotations, network changes)
- Cost to maintain: 5,000 Cr/week
- Risk: if corporation runs security sweep, insider may be discovered → removed + heat spike

---

## 4. Counter-Intelligence

*You've been in this network before. They remember. They're ready for you.*

---

### 4.0 Forensic Trail

- Every action leaves traces beyond just the access log: timing signatures, tool fingerprints, behavioural patterns
- High-level corporations maintain a forensic database: if same fingerprint pattern appears 3 times, they issue a Burn Notice
- **Countermeasure**: rotate tools per mission, vary entry paths, stomp timestamps
- Ghost specialisation obfuscates tool fingerprints by default

---

### 4.1 Active Hunters

When heat is high enough, the corporation deploys counter-operatives:

**Trace-Back Operative** — NPC hacker working in reverse through your proxy chain. If they succeed while you're connected, instant trace complete. You can see their progress in the terminal: `COUNTER-TRACE ACTIVE — HOP 2 OF 4 COMPROMISED`.

**Fingerprint Sweep** — honeypot networks that identify your tool signatures. Connecting marks your tools for 48 game-hours — every subsequent network detects you 30% faster.

**Zero-Day Retaliation** — corporation releases a counter-exploit that targets your most-used tool tier. Requires tool upgrade or alternate approach.

---

### 4.2 Disinformation Campaigns

New mission type: **PLANT FALSE INTEL**

- Rather than stealing from a corporation, inject false data into their systems
- Applications: frame a rival operative (their handle appears in your forensic trail), corrupt their threat intelligence database (reduces their counter-trace effectiveness for 72 hours), plant false mission-critical data that triggers internal chaos (world event)

---

### 4.3 Honeypots

- Some corporate networks are traps — the entire network exists to fingerprint intruders
- Detectable via OSINT (job listing: "security researcher, honeypot experience") or dark web forum tip
- Connecting and discovering it's a honeypot: immediate disconnect without trace — but your tool signature is now in their database
- **Honey token** nodes within normal networks: look like high-value data but trigger alarm on access (see 1.6)

---

### 4.4 The Burn Notice

Maximum heat state with a specific corporation:

- Mission rewards from that corporation → 0
- Their networks start every mission at 25% trace
- They deploy a hired operative — visible as a threat contract on the mission board targeting your handle
- Corporation's counter-trace speed increased by 50%

**Clear it by:**
- Completing a counter-mission against their security team
- Faction diplomatic action (if standing is high enough)
- 72-hour time passage (partial reduction only)
- Framing a rival operative (see 4.2)

---

### 4.5 Cover Identities

Multiple operational aliases:

- Each alias has its own handle, reputation score, heat level with each corporation, and tool set profile
- Switch aliases between missions
- If an alias is burned: switch to the next; burned alias retired
- Social specialisation: 4 aliases maximum (others: 2)
- Maintaining an alias costs 2,000 Cr/week

---

## 5. Advanced Mission Types

*Break-and-steal was only the beginning. Real operators run operations. These are operations.*

**Current state (pre-M14m):** Missions are single-phase: connect → scan → breach → click action → wipe → disconnect. Each contract takes ~3-5 minutes. The five base types (file_theft / account_deletion / database_corruption / network_sabotage / bounty_hunt) cover the foundational mechanics but are not yet "operations" — they're tasks.

**Mission depth roadmap** — directly addressing player request:
- **M14m** ✅ SHIPPED 2199-01-01 — Multi-phase missions framework + first example (PROJECT GHOST). Per-phase objectives, rewards, news echoes. Phase progress UI in HI.
- **M14n** ✅ SHIPPED 2199-01-01 — Procedural runtime events fire during missions with on-screen toast banners. 2–5 events per contract drawn from a pool of 9 (3 trace-threshold, 3 time-elapsed, 3 node-breach). Tactical, not just narrative.
- **M14o** ✅ SHIPPED 2199-01-01 — Mid-mission decision points. MissionChoice on phases, MissionChoiceOverlay UI presents options when a phase with choices completes. First example: BLACK HALO with TURN/BURN fork (different faction-standing deltas + phase routing).
- **M20** — Full implementation of §5.0–5.7 below (identity fraud, gov DB manipulation, stock manip, etc.)

---

### 5.0 Identity Fraud

Multi-phase mission:

1. **OSINT phase**: gather target victim's personal data across 3 public nodes
2. **Breach phase**: access their financial institution's `account_database`
3. **Manipulation phase**: alter identity fields, credit history, contact details
4. **Cover phase**: stomp timestamps, inject false audit trail

Rewards massive Darkcoin. Triggers a moral flag — subsequent story beats may reference it. Certain faction standing gates require clean identity record.

---

### 5.1 Government Database Manipulation

The most dangerous mission type:

- Target: `gov_identity_db`, `voter_registration`, `criminal_records`, `intelligence_archive`
- Objectives: add/remove records, alter conviction histories, wipe surveillance files
- Always triggers a government heat event regardless of ghost run
- The cover-up IS the mission: multiple separate wipe operations required post-breach
- Unlocks after completing Arc 3 (government contacts arc)

---

### 5.2 Stock Market Manipulation

Real-time market mechanic:

- Acquire non-public information about a corporate merger (via breach)
- **SHORT the stock** before releasing the information publicly (via darknet forum drop)
- Timing is the mechanic: the shorter the window between info acquisition and public release, the higher the payout — but the more obvious the insider trading pattern
- SEC-equivalent NPC monitors for patterns: three too-obvious trades = investigation event
- Pays in a mix of credits + Darkcoin

---

### 5.3 Supply Chain Compromise

Long operation across multiple sessions:

1. Breach a small software company (low difficulty target)
2. Plant a malicious module in their build pipeline (new node type: `build_server`)
3. Wait for the next deployment cycle (real-time, 24–48 hours) to propagate
4. The compromised software is now deployed in multiple downstream corporations
5. Every network running the compromised software: you have a pre-planted backdoor

Requires patience and planning. Massive late-game payoff. **The SolarWinds play.**

---

### 5.4 AI Network Compromise

New network archetype: `ai_inference_cluster`

- These networks run machine learning pipelines — large, fast, high-value
- New node types: `training_node`, `inference_api`, `data_lake`, `model_registry`
- **Poisoning attack**: inject corrupted training data into `data_lake` — the AI begins making subtly wrong decisions (triggers a world event 72 hours later)
- **Model theft**: exfiltrate the weights from `model_registry` — sellable for massive Darkcoin on dark web
- **Inference hijack**: redirect the `inference_api` output — downstream apps receive wrong results (mission type: make a facial recognition system misidentify a target)
- Requires CPU 5+ GHz (high computation load)

---

### 5.5 IoT & SCADA Systems

Physical world impact:

- New network archetype: `industrial_control` (power grid, water treatment, building management)
- Node types: `plc_controller`, `scada_hub`, `sensor_array`, `hmi_terminal`
- Objectives: disrupt power supply to a region (world event), manipulate sensor readings (covers a physical operation), unlock a building (door controller node)
- These networks have **air-gap** segments: can only reach them through a previously compromised machine inside the physical location (new story beat for Ghost Protocol arc)
- ICS/SCADA breach triggers automatic government counter-trace — much faster than corporate

---

### 5.6 Ransomware Operations

Full deployment mission:

1. **Lateral spread phase**: compromise as many nodes as possible (earn multiplier per node)
2. **Encryption phase**: deploy payload — each node goes **ENCRYPTED** (new visual state)
3. **Ransom phase**: set amount, send demand through dark web channel
4. **Negotiation phase**: timed back-and-forth with corporation AI — negotiate up or down; delay long enough and they restore from backup (payout 0)
5. **Collection phase**: payment in Darkcoin via anonymous channel; withdraw before traced

Moral flag. High Ares Division heat. Maximum payout in the game. Requires Ghost specialisation to pull off cleanly.

---

### 5.7 Insider Threat Operations

Building on §3.4:

- Use a recruited insider to run an operation from inside the network
- The insider can: plant a backdoor (no technical breach required), exfiltrate data on schedule, disable FIM before you connect, unlock a Zone B subnet
- Insider operations leave zero trace on the network — no log entries, no IDS triggers
- If insider is discovered mid-operation: they go silent, you lose the asset, heat spike
- Architect specialisation: longer insider dossier retention, faster recruitment

---

## 6. Post-Endgame Story Arcs

*You completed the main arcs. You thought it was over.*

---

### 6.0 Arc 6A: The Inheritance (Infiltrator path)

*What did The Nameless actually transfer to your drive?*

A compressed consciousness backup. Not a weapon — a mind. Built from seventeen years of hacker knowledge. It is asking you for something, and it is not entirely stable.

- Introduces AI dialogue: the consciousness communicates through your terminal in fragmented text
- It knows things that should be impossible — network topologies you haven't visited, credentials you haven't stolen
- The question: do you help it escape into the global network, give it to The Underground, or destroy it?
- **Mechanic**: the consciousness can possess network nodes, temporarily granting you free access but leaving a distinct fingerprint
- Three sub-endings based on what you choose to do with it

---

### 6.1 Arc 6B: The Reckoning (Phantom path)

*You destroyed everything. Now someone is rebuilding it.*

Two months after The Nameless went dark, a new entity starts appearing in network logs. Same signature. Different name. It learned from watching you — and it adapted. It is now operating with your methodology, framing you for its operations.

- You are now wanted. Ares Division has your heat at maximum.
- Race against the entity across multiple networks simultaneously
- New mechanic: **competing trace bars** — you're breaching a network while the entity is simultaneously breaching the same one from another direction
- Can you trace it back and compromise its origin node before it compromises yours?

---

### 6.2 Arc 6C: The Extraction (Compromised path)

*Ares Division has your face. They're coming.*

Voidlink International's contract in the Andes was bait. They're working with Ares. The only play is to go completely dark — wipe your identity from every system on earth and build a new one from scratch.

- Literally erase your character from game systems: wipe government databases, financial records, biometric registries
- Each wipe is a mission against progressively harder government networks
- **The final mission**: breach Ares Division's own operative database and delete the file on you
- Completion reward: a new clean alias with bonus starting credits but no history — essentially a new game+ with narrative memory intact

---

### 6.3 Arc 7: Enemy of the State

*Mass surveillance. Blackmail. The network that knows everything.*

A government SIGINT programme — ECHELON-scale — has been passively monitoring every hacker community, dark web forum, and operative network for fifteen years. They have files on everyone. They have a file on you.

- Map a satellite surveillance network spanning three orbital layers
- Social engineer your way into the SIGINT terminal with stolen biometric credentials
- Race against a government counter-intelligence team already triangulating your position
- **The choice**: destroy the database, leak it publicly, or use it as leverage
- Final mission: 10-minute real-time window, no retries

---

### 6.4 Arc 8: Ghost Protocol

*You don't exist. You never did. And that is exactly why they need you.*

A journalist contacts you through channels only a ghost could find. They have a story that will bring down a sitting government. They need exfiltrated proof. They need someone who can get into SCIF-level classified networks. They need someone who officially doesn't exist.

- Introduces physical layer mechanics: USB drop missions (access a specific network only from a geographically-locked node — delivered via in-game courier contract)
- Real-world clock integration: certain missions only available during specific UTC hours (the target's sysadmin is off-shift)
- Full newspaper front page as the ending sequence — every mission you completed is reflected in the story that gets published
- Completion awards the **Ghost Protocol** achievement and a permanent 0-trace-spike bonus on all future operations

---

## 7. The Living World

*The world should feel like it exists whether you're playing or not.*

---

### 7.0 Dynamic Economy

- **Credit market**: shop prices fluctuate based on supply/demand signals from world events
- **Darkcoin exchange rate**: volatile; tied to Ares Division activity levels and major breaches in the news feed
- **Data market pricing**: the value of an exfiltrated database depends on how recently a similar one was sold
- **Corporate recovery cycles**: hit the same corporation twice within 24 hours — second mission is harder and pays less; wait 72 hours — back to normal
- **Inflation mechanic**: as player level rises, base contract rates increase proportionally — economy always feels relevant

---

### 7.0a Banking & Personal Finance ✅ SHIPPED (M14b + M14c — 2199-01-01)

**M14b — Foundations:**
- 2 retail bank targets on World Map: GLOBAL TRUST BANK (2.5% APR) and PACIFIC NATIONAL (3.4% APR)
- Open account, deposit, withdraw, ALL CASH / ALL SAVINGS quick-fill
- Continuous compound savings interest via `tickBankInterest` (real-time 1:1)
- Per-bank account state persisted on player profile

**M14c — Expansion:**
- **Loans** — `takeLoan` / `repayLoan` actions. Borrow up to `collateral × maxLoanMultiplier` (Global=2×, Pacific=3×, Zurich=1×). Interest compounds continuously on the outstanding principal. UI in LOAN tab: borrow / repay / max-afford / pay-in-full.
- **Currency trading** — Cr ↔ Darkcoin. Live exchange rate (anchored ~142 Cr/DC, ±2.5% noise, slow mean reversion). 1% spread on each side. TRADE tab.
- **Equities** — 4 stocks (ARMR / ARES / INTC / GTBK) with random-walk prices, soft mean reversion to base. `buyStock` / `sellStock` actions track shares + cost basis for realised P&L. STOCKS tab shows live prices, ▲/▼ drift %, holdings.
- **Offshore accounts** — 2 new bank targets: CAYMAN TRUST (savings only, laundering flavour) and ZURICH VAULT (savings + discreet 7% loans). Purple offshore tag throughout the UI.
- **Tabbed UI** — BankWindow now has dynamic Savings / Loan / Trade / Stocks tabs filtered by bank's available features.
- **Market simulation** — `tickMarket` runs every 1.5s alongside the existing game loop; updates stock prices and DC exchange rate.

**Shipped in M14e (2199-01-01):**
- **Defaulting** ✅ — when loan principal exceeds 5× player's liquid assets, -50 REP + news article + flag `loan_default_<bankId>`. Hunter contracts (M15+) will key off this flag.
- **Stock event linkage** ✅ — completing a `network_sabotage` mission drops a random stock 15% with terminal log
- **MARKET CRASH world event** ✅ — drops all stocks ~6% per tick down to 40% of base; savings APR effectively zero during the event

**Still planned:**
- **Heat laundering** — offshore deposits should actually reduce the player's heat per corporation (currently flavour only)
- **Margin & options** — leveraged stock positions, put/call contracts (Tier 2)
- **Stock event by corp target** — currently the dropped stock is random; tying it to the mission's actual corporate target requires corp→ticker mapping

---

### 7.1 World Events — Expanded

Current: 7 events. Expand to 20+:

| Event | Effect |
|-------|--------|
| DARKNET PURGE | Dark web contracts dry up for 12h; Darkcoin volatility spikes |
| ZERO-DAY WEDNESDAY | A new CVE drops; every corporation has an unpatched node for 6h |
| WHISTLEBLOWER SEASON | Dark web bonus contracts for classified data ×2 for 24h |
| REGULATORY SWEEP | Financial networks add +20% IDS rate for 48h |
| POWER GRID ANOMALY | IoT networks go partially offline; easier to breach, lower reward |
| AI OUTBREAK | AI cluster networks spawn additional nodes; double XP for AI missions |
| COLD WAR ESCALATION | Government networks go on lockdown; higher difficulty, massive reward |
| FACTION FLASHPOINT | Two factions go to war; standing shifts dramatically on both sides |
| INSIDER LEAK | Free intelligence available on one corporation (no OSINT needed) |
| HACKER GAMES | Global leaderboard event; double XP for all missions for 48h |
| IDENTITY CRISIS | Forged identity value doubles; biometric bypass costs halved |
| QUANTUM PATCH | Quantum-encrypted nodes become temporarily vulnerable |
| BLACKOUT OP | All logging disabled globally for 6h — cleanest window of the game |
| SUPPLY CHAIN BREACH | Pre-existing backdoors in 20% of corporate networks (discovered on connect) |
| THE HUNT | Ares Division's bounty values increase 3× for 24h |

---

### 7.2 Procedural News Feed

Current news feed delivers world events. Expand to:

- **Mission aftermath stories**: complete a stock manipulation mission → headline appears referencing the corp
- **Rival operative activity**: "Unknown operative breached CORE SYSTEMS INC — 3 nodes destroyed"
- **Your own ops**: high-profile missions generate news stories (your handle not named — but you know it was you)
- **Faction press releases**: The Underground manifestos, Arunmor press releases, Ares Division alerts
- **Economic news**: "DARKCOIN MARKET CRASHES AFTER MAJOR BUST" — affects in-game exchange rate
- **Ongoing investigations**: Ares Division announces investigation → countdown timer appears; complete a cover-up mission to suppress it

---

### 7.3 Corporate AI & Living Networks

Networks evolve between your visits:

- Corporations rotate credentials every 72 hours (game-time) — cached credentials expire
- Exploited CVEs get patched after 48 hours
- Unwiped logs add trap nodes near previous entry path
- If you breach the same corporation 3+ times: they upgrade their IDS tier
- If you've planted an insider: occasional tips appear in terminal on next login
- **The Sentinel**: AI-driven security NPC that learns your patterns over multiple missions against the same corp; predicts next target node and pre-activates defences; defeatable only by breaching `sentinel_core` node

---

### 7.4 Rival Operatives — Expanded

Current rival system: basic. Expand to:

- 5 named rival NPC operatives with persistent handles, skill profiles, and running storylines
- They appear in the news feed, on dark web wanted boards, and occasionally on the same mission (competing for the same file)
- **Rivalry system**: complete a mission a rival previously failed → they notice you; complete 3 missions in their territory → they put a bounty on your handle
- Some rivals can be recruited as faction allies; others are antagonists across multiple story arcs
- Rival difficulty scales with your level — they always feel like a credible threat

---

## 8. Hardware & Tool Depth

*The original Uplink had hardware upgrades that genuinely changed what was possible. We push further.*

---

### 8.0 Hardware Tiers 5–8 ✅ PARTIAL SHIPPED (M14h — 2199-01-01)

**M14h shipped:** RAM tier 4, Modem tier 4, Gateway tier 3, GPU tier 1–3, Cooling tier 1–3.

**Still planned (Tier 5–8 and exotic slots — M22):**
- CPU tier 5–8, RAM tier 5–8, HDD tiering, SDR slot, Quantum co-proc

Current max: CPU 5 GHz, 8 RAM slots, 2 TB HDD, 1 Gbps modem. New tiers:

| Hardware | Tier 6 | Tier 7 | Tier 8 |
|----------|--------|--------|--------|
| CPU | 8 GHz | 12 GHz | 24 GHz (quantum-assisted) |
| RAM | 12 slots | 16 slots | 24 slots |
| HDD | 4 TB | 8 TB | 16 TB (encrypted vault drive) |
| Modem | 2 Gbps | 5 Gbps | 10 Gbps (dark fibre) |
| New: GPU | Tier 1–4 | Required for AI mission types; accelerates brute force |
| New: SDR | Tier 1–3 | Software-defined radio for satellite uplink and IoT intercept |
| New: Quantum co-proc | Tier 1–2 | Required for quantum-encrypted vault access |

Gateway bandwidth separately upgradeable — determines how many simultaneous connections you can run.

---

### 8.1 Tool Depth — Crackers through Quantum ✅ PARTIAL SHIPPED (M14h — 2199-01-01)

**M14h shipped:**
- Cracker v5 ChaosNet (adversarial random attack patterns, rival-hacker prediction immunity)
- ShadowMesh proxy v4 (route re-orders mid-mission)
- Log Wiper v3 Ghost Trail
- PortMap v3 DeepRecon
- Firewall Bypass v2 Phantom
- 3 NEW categories: **Sniffer** (PacketGhost v1/v2 — passive packet capture, router auto-reveal), **Memory Scraper** (MemDump v1/v2 — standalone cred extraction), **Anti-Forensic** (v1/v2 — 30%/60% evidence reduction, heat suppression)
- **Consumables** (new system): Panic Kit, Zero-Day Pack, Decoy Log, False Flag, Rep Tokens (small/large), Credential Pre-Pack — all with armed-flag mechanics, persistent across missions

**Still planned:**

Current tool categories extended:

**New tool categories:**
- **Network sniffers** (Lv 1–5): intercept traffic on routers; higher level = faster intel extraction
- **Forensic erasers** (Lv 1–5): timestomping speed; higher level = stomps faster and covers more file types
- **Social engineering suites** (Lv 1–4): phishing quality score bonus; faster vishing
- **Dark web adapters** (Lv 1–3): enables dark web access; higher level = more onion hops
- **Quantum crackers** (Lv 1–2): required for quantum-encrypted nodes; extremely expensive
- **Memory extractors** (Lv 1–4): standalone memory scrape tool (not requiring Port Scanner)
- **AI adversarial modules** (Lv 1–3): poisons AI training data; required for §5.4

Current tools extended to Lv 6 max (from Lv 4).

---

### 8.2 Scripting — The Lua Layer

Late-game feature for expert players:

- Open a **Script Editor** in the terminal (new window component)
- Write Lua scripts that automate sequences: e.g., "scan → if service==SSH → exploit; else crack"
- Scripts run on a virtual machine (eats 2 RAM slots while running)
- The script engine is NOT a shortcut — it's a reward for understanding the mechanics deeply
- Architect specialisation: 3 scripts saveable and executable as one-click macros
- Community sharing: export script as a file; upload to darknet forum (future multiplayer feature)

---

### 8.3 Black Market Hardware

Hardware obtainable only through dark web or faction rewards — no shop listing:

- **Military-grade router** (tier 8 equivalent for specific network archetypes)
- **Signal jammer module** (disables IDS on `industrial_control` networks for 30 seconds)
- **Biometric spoofer** (hardware device for government-tier networks — see §3.3)
- **Quantum entropy generator** (required upgrade for Quantum co-proc tier 2)
- **Cold storage vault** (offline HDD that persists data across identity wipes — Arc 6C mechanic)

---

## 9. Player Progression

*The levels and XP system is shipped. This is what builds on top of it.*

---

### 9.0 XP & Level System ✅ SHIPPED (2026-05-27)

Level 1–1000 with realistic XP curve (`50 * n^1.7`). 17 rank titles from SCRIPT KIDDIE to VOIDWALKER. Missions award XP. Level-up displayed in terminal. Done.

**Next extensions:**
- Story missions: visual level-up sequence (brief fullscreen flash)
- Ghost run bonus: complete a mission with 0 trace events → +50% XP
- Speed bonus: complete under 60 seconds → +25% XP
- Perfect run bonus: no canary triggers, no lockouts, no dirty hops → double base XP

---

### 9.1 Prestige System

At level 1000: **PRESTIGE** option unlocks.

- Resets level to 1 but awards a permanent Prestige tier (1–10)
- Each Prestige tier: cosmetic handle decoration (`[Ω1] VOIDWALKER` etc.), +5% base XP rate, unique starting bonus
- Prestige 10: unlocks the final hidden arc (Arc 9: The Void — endgame lore payoff)
- Prestige runs retain: tool collection, faction standing, completed story arcs
- Prestige runs reset: level, credits, hardware — pure mechanical restart

---

### 9.2 Achievement System

100+ achievements. Categories:

| Category | Examples |
|----------|---------|
| Ghost | Complete 10 missions with zero trace events |
| Speed | Complete a tier 5 mission in under 90 seconds |
| Completionist | Finish all 5 story arcs |
| Dark Web | Complete 25 dark web contracts |
| Insider | Maintain 3 concurrent recruited insiders |
| Faction | Reach max standing with all 5 factions simultaneously |
| Economy | Accumulate 1M Cr |
| Paranoid | Never use the same proxy twice |
| The Specialist | Reach max level in a specialisation |
| Legendary | Complete a mission on tier 5 without any tools equipped |

Achievements display on profile and feed into the leaderboard system.

---

### 9.3 Challenge Runs

Optional permanent modifiers selected at character creation:

| Challenge | Rule | Bonus |
|-----------|------|-------|
| IRONHACKER | Character deleted on first trace complete | +100% XP |
| OFFLINE | No dark web access ever | +50% dark web contract value (from other sources) |
| UNPLUGGED | No bounced missions — direct connections only | +30% XP; massive risk |
| POVERTY LINE | Start with 500 Cr, no shop discounts | +50% credits from missions |
| GHOST ONLY | Ghost specialisation locked; no other spec available | Unique "Pure Ghost" cosmetic |
| SPEEDRUN | 30-day in-game timer; complete all arcs or fail | Special speedrun leaderboard entry |

---

### 9.4 Leaderboard

Persistent live leaderboard (multiplayer / server infrastructure required):

- Overall XP ranking
- Ghost score (lowest cumulative identity exposure)
- Speed ranking per mission type
- Prestige tier ranking
- Monthly challenge leaderboard (rotating challenge type)
- **Notoriety index**: the most wanted operatives (most heat, most Burn Notices)

Local leaderboard available in offline mode (personal best tracking).

---

## 10. Multiplayer & Factions

*Every player's network is someone else's target.*

---

### 10.0 Architecture — The Persistent World

Multiplayer architecture:

- Optional cloud save sync (server-side state alongside localStorage)
- Each player's gateway node exists on a **shared world map**
- The world map shows aggregated heat events, active breaches, faction war fronts
- No forced PvP — all player-vs-player requires either opt-in or faction war participation
- Player nodes visible on world map as dim dots; only attackable if they opt-in to the bounty system or are in an active faction war

---

### 10.1 Factions — Full Expansion ✅ PARTIAL SHIPPED

Foundation done (create, join, leave, invite code). Full expansion:

- **Faction bank**: members deposit credits; drawn on for faction operations
- **Faction missions**: co-operative contracts available only to members; requires multiple operatives
- **Faction territories**: the 3D world map has 20 control zones; factions compete to hold them
- **Zone bonuses**: holding a zone gives all faction members reduced trace rate in connected region
- **Faction upgrades**: invest faction bank credits into upgrades (shared proxy pool, faction-wide zero-day, IDS countermeasure)
- **Faction wars**: when two factions contest the same zone — a 48-hour active conflict where members can participate
- **Faction rankings**: top 10 factions on global leaderboard

---

### 10.2 PvP Contracts

Opt-in bounty and targeting system:

- **Bounty posting**: pay 10,000 Cr to post a bounty on another handle
- Any player can accept the bounty contract: complete the specified op against the target (steal a specific file from their local storage, sabotage their active faction mission)
- Target is notified: "THREAT CONTRACT ACTIVE" in their terminal
- **Countermeasure**: targets can purchase threat suppression (time-limited) or run a counter-mission to trace the bounty poster
- PvP combat is asymmetric and indirect — never direct connection invasion without explicit consent

---

### 10.3 Co-op Operations

Faction members can form a **crew** for heist-style missions:

| Role | Ability |
|------|---------|
| Penetration Specialist | Cracks perimeter nodes faster; can unlock Zone B solo |
| Ghost Operative | Runs log wipes in parallel while crew works; zero-trace specialist |
| Social Engineer | External ops: runs phishing/vishing in parallel before breach |
| Network Architect | Maps topology in real-time; marks targets for crew; bonus intel on scan |

- Shared RAM pool across the crew
- Different crew members can be on different nodes simultaneously
- If one member is traced: heat escalates for entire crew
- In-game encrypted crew chat (terminal-style)
- Heist missions: all objectives complete within a synchronised window; reward split negotiated before start

---

### 10.4 The Bounty Network

A passive cross-player economy:

- Post bounties on corporations (not just players): "50,000 Cr to whoever exfiltrates NEXGEN's source code first"
- Other players can claim the bounty — it becomes a mission with custom reward
- Bounty board is part of the dark web layer — browsable, fitlerable
- **Exclusive intel bounties**: first complete earns 3× the base reward
- **Faction-sponsored bounties**: faction leadership posts bounties using faction bank credits; completing them earns faction standing

---

## 11. Atmosphere & Immersion

*The game should feel like you are actually inside the machine. Not just looking at a representation of it.*

---

### 11.0 Music System — Full Expansion

Current: ambient + trace alarm. Expand to:

- **Procedural tension layers**: separate instrument tracks layer in at trace 25%, 50%, 75%, 90% — bass first, then percussion, then high-frequency strings
- **Mission-specific palettes**: government networks = cold minimal techno; dark web = underground industrial; IoT/SCADA = ambient electronic with physical-world field recordings
- **Faction themes**: Arunmor = corporate, clean jazz-adjacent; The Underground = lo-fi distorted drum machines; The Nameless = near-silence with resonant drone underneath
- **Voice fragments**: whispered audio logs found on breached nodes; 50+ authored pieces; confessions, warnings, last transmissions before a system went dark
- **Radio scanner**: intercepted background transmission audio; changes based on world events; occasionally contains intel (encrypted voice hint to a hidden mission)
- **Dynamic mix**: when multiple world events are active simultaneously, all their audio layers stack

---

### 11.1 Visual Effects — VFX Expansion

- **Breach animation**: cascading code briefly covers a node as it transitions to COMPROMISED — 400ms, layered ASCII art
- **Network zone colour coding**: Zone A nodes in cyan-tinted glow; Zone B in amber; pivot bridges pulse between both
- **Proxy chain visualisation**: live routing diagram in HackingInterface — animated data packets travelling hop to hop
- **Credential cache panel**: compact view of dumped credentials — active (green), expired (dim), used (grey)
- **Timestamps on 3D node labels**: time since last access if previously visited
- **Glitch states**: nodes under active exploit show visual corruption — text tears, frame skips
- **Connection arcs on world map**: when connected to a target, animated arc traces from your location through bounce nodes to target with real-time pulse
- **Screen edge vignette on trace 80%+**: current system — maintain and extend; add slight chromatic aberration at 90%
- **Terminal CRT filter**: optional; authentic scanline + phosphor persistence

---

### 11.2 Terminal — Expanded Commands

The system terminal becomes a real command-line experience:

| Command | Description |
|---------|-------------|
| `whois <handle>` | Intel on a known operative or NPC |
| `grep <pattern>` | Search across all exfiltrated files in HDD |
| `traceroute <network_id>` | Visualise current proxy chain |
| `history` | Full log of every action taken this session |
| `nmap <node_id>` | Quick scan alias — triggers port scan |
| `ssh <node_id> --key <cred>` | Credential-based login (lateral movement) |
| `cat <file_id>` | Read an exfiltrated file inline |
| `ls --hdd` | List all files on local drive |
| `clear` | Clear terminal output |
| `ping <node_id>` | Check if node is online / shows latency hint |
| `crontab <script_id>` | Schedule a Lua script to run on connect |
| `alias <name> <cmd>` | Create a terminal macro |
| `help` | Formatted command reference |

All output in authentic terminal format: stack traces, PIDs, CVE IDs, timestamps, hex addresses.

---

### 11.3 Lore Depth

- **Encrypted memos**: 80+ authored short pieces found on breached corporate nodes; readable between missions via `cat`
- **The Nameless Archives**: unlocked after Arc 4; catalogue of every hacker The Nameless observed; some entries are about you, accurate to your in-game actions
- **Faction manifestos**: long-form documents articulating each faction's worldview (accessible from factions tab)
- **Hacker history easter eggs**: references to real historical incidents — The Morris Worm, Captain Crunch, Dark Avenger, Mitnick — anonymised and remixed
- **Character progression dialogue**: NPC contacts evolve their communication style based on your faction standing and mission history
- **Environmental storytelling**: corporate networks have internal email chains that tell stories about the people working there — not just credentials

---

### 11.4 Accessibility

- Full keyboard navigation for all UI elements
- Screen reader labels on all interactive elements (aria-label on every node, button, bar)
- High contrast mode toggle (maps to high-visibility colour set across CSS variables)
- Reduced motion mode: disables glitch animations, pulse effects, DataRain
- Trace level announcements: audio + text cues at 25%, 50%, 75%, 90%, 100%
- Scalable UI: Ctrl+scroll zoom already done; persist zoom preference
- Dyslexia-friendly font option: swap JetBrains Mono for OpenDyslexic in settings
- Colorblind modes: deuteranopia, protanopia, tritanopia palette sets

---

## 12. Platform, Launch & Modding

---

### 12.0 Save Hardening

- Versioned save schema with forward-migration functions (never break a save on update)
- Periodic auto-save every 30 seconds during active mission
- Local backup copies: keep last 3 saves before overwrite
- Optional cloud save sync (requires opt-in; stores encrypted blob on server)
- Save integrity check on load: detect and repair common corruption states
- Export save file as encrypted blob for manual backup
- **IRONHACKER mode** requires server-verified save state (no manual editing)

---

### 12.1 Electron App — Full Native Experience

Current Electron wrapper: functional. Expand:

- **System tray integration**: trace level visible as system tray icon animation; right-click menu: "Open Voidlink" / "Current mission status" / "World events"
- **Native notifications**: world event alerts, rival activity, mission expiry — delivered as OS notifications when window is unfocused
- **Local file system integration**: exfiltrated files optionally saved to real disk as `.txt` with authentic-looking decrypted formatting
- **Custom window chrome**: terminal-style title bar; hides default OS decoration
- **Auto-updater**: seamless delta updates via GitHub Releases
- **Performance overlay**: FPS counter + memory usage in dev builds (hidden in release)

---

### 12.2 Mobile Port

Architecture for vertical layout:

- Three-panel swipe navigation: Mission List → Network Map → Action Panel
- Touch-optimised node selection with haptic feedback on breach
- **Passive income while offline**: scripts and insiders run; return to collected rewards
- Push notifications: trace alerts when offline, world event start, mission expiry, bounty posting
- Adaptive layout: tablet mode = full desktop layout; phone mode = stacked panels
- Platform: React Native with shared core logic from `@voidlink/core` (pure TypeScript, zero DOM dependency)
- Target stores: App Store, Google Play

---

### 12.3 Distribution & Stores

- **itch.io**: early access from day 1; community building
- **Steam**: Greenlight → direct upload when ready; achievements via Steamworks SDK (maps to internal achievement system)
- **GOG**: DRM-free version; resonates with hacker audience
- **Web**: claude.ai or voidlink.game — WebGL build for zero-install access
- **Press kit**: auto-generated from game metadata; screenshots, trailer, feature list
- **Demo build**: first 3 story missions + procedural tier 1–2 contracts; no time limit

---

### 12.4 Modding SDK

- **YAML/JSON mission authoring**: write story arcs and procedural contract types without TypeScript
- **Custom network templates**: design networks via a graph editor; export as JSON; share on dark web forum in-game or via community hub
- **New faction creation**: add factions with their own contracts, lore, standing effects, colour schemes — all config-driven
- **Theme system**: full CSS variable override; documented variable list; community skin gallery
- **Lua scripting API** (builds on §8.2): moddable script engine with documented hooks
- **Asset overrides**: font, audio, DataRain character set all replaceable via mod config
- Community showcase built into the dark web forum layer in-game

---

## 13. Milestone Priority Table

| Milestone | Scope | Priority | Est. Sessions |
|-----------|-------|----------|---------------|
| **M11** ✅ | Bounce log wipe sub-missions + hop health | Tier 1 | SHIPPED 2026-05-28 |
| **M12** ✅ | Lateral movement + credential reuse + memory scraping | Tier 1 | SHIPPED 2026-05-28 |
| **M13** ✅ | Service-specific exploits + brute lockout + subnet zones | Tier 1 | SHIPPED 2026-05-28 |
| **M14a** ✅ | Pre-alpha polish: settings, neon globe, idle music, in-game clock, perf throttling, tutorial overhaul, light theme, mission retry, cracker fix | Tier 1 | SHIPPED 2199-01-01 |
| **M14b** ✅ | Banking foundations: bank window, deposits/withdrawals, savings interest | Tier 1 | SHIPPED 2199-01-01 |
| **M14c** ✅ | Banking expansion: loans, Cr↔Darkcoin trading, equities (4 stocks), offshore banks (Cayman + Zurich), tabbed bank UI, market simulation | Tier 1 | SHIPPED 2199-01-01 |
| **M14d** ✅ | UX & balance: mandatory log wipe + WIPE ALL button, OPEN WORLD MAP from HI, connection effect overlay (dial-tone + animated chain), clickable Corp/Gov/Underground targets with TARGET INTEL window, sabotage router injection, rep gating rebalanced | Tier 1 | SHIPPED 2199-01-01 |
| **M14e** ✅ | Banking polish: sabotage → stock drop (-15%), MARKET CRASH world event (stocks crash, savings APR zero'd), loan defaulting (-50 REP + news article when principal > 5× liquid) | Tier 1 | SHIPPED 2199-01-01 |
| **M14f** ✅ PARTIAL | Exfiltration channels — 4 channels (Direct FTP / Encrypted Tunnel / DNS Tunneling / ICMP Exfil) with speed-vs-stealth tradeoffs + tool/spec gating, selector bar in Network Map | Tier 1 | SHIPPED 2199-01-01 |
| **M14f.1** | Canary files + timestomping — completing followup to M14f | Tier 1 | 2 |
| **M14g** ✅ | Upgrade Shop → skill-tree graph UI (SVG node-link diagram, 10 columns, prereq edges, colour-coded states, side detail panel, LIST fallback) | Tier 1 | SHIPPED 2199-01-01 |
| **M14h** ✅ | Shop expansion — 2 new HW slots (GPU, Cooling), 3 new SW categories (Sniffer, MemScrape, Anti-Forensic), 5 tier extensions (Cracker v5, Proxy v4, etc.), 7 consumables with armed-flag effects (panic kit, zero-day pack, decoy log, false flag, rep tokens, cred pack), wired into crack speed / scan / heat / breach reveal | Tier 1 | SHIPPED 2199-01-01 |
| **M14h.1** ✅ | UX hotfixes: sabotage trace rebalance (60s base + 15s/hop, lower spike), audio master bus + volume responsiveness, HI/Bounce Chain auto-open on desktop, dedicated BounceChainWindow, breach-acquired bounce nodes added to library, richer DTMF/handshake dial-up SFX | Tier 1 | SHIPPED 2199-01-01 |
| **M14h.2** ✅ | UX hotfixes: full window-layout persistence (v3 save schema), HACK TOOLS no longer requires active mission, WorldMap rotate-speed scales with zoom (less twitchy when zoomed in), Window onMove fires on resize too | Tier 1 | SHIPPED 2199-01-01 |
| **M14h.3** ✅ | UX polish batch: neon-Earth Data Globe background AND interactive WorldMap (UnrealBloomPass post-processing + real continent outlines from world-atlas TopoJSON + cyan/magenta palette + ACESFilmic tone mapping), tutorial auto-focuses spotlit windows, bounce→RELAY rename, node colour state YELLOW when scanned / GREEN when breached, 3-pulse intruder beep when rival hacker spawns. WorldMap bloom tuned softer (0.55 strength) so target dots don't smear. | Tier 1 | SHIPPED 2199-01-01 |
| **M14h.4** ✅ | Signup email confirmation code (6-digit one-time code, dispatched in-fiction as "DARKNET RELAY" — code visible in demo build) + password reset flow (email lookup → code → new password). New `updatePassword` + `findSaveByEmail` persistence helpers. FORGOT link in existing-operative connect prompt. | Tier 1 | SHIPPED 2199-01-01 |
| **M14h.6** ✅ | Encrypted email inbox — replaces the never-shipped phone/contacts concept. New `EmailInbox` window (sidebar list + reader pane), `inbox` store slice persisted as save v4, `sendInboxMessage()` API, seed inbox on first login (Welcome from VoidLink Dispatch + advice from CIPHER + automated billing note), mission-accept dispatches an ENCRYPTED contract email auto-decrypted via DECRYPT WITH KEY, mock-PGP fingerprint badges, category colour-coding (mission/contact/faction/system/darknet/rival), star + delete + mark-all-read. Also: mission relay-hop gating added (`minRelayHops` scaled D1=0 → D10=9) with on-card "Build a N-hop relay" hint. | Tier 1 | SHIPPED 2199-01-01 |
| **M14h.5** ✅ | Mid-game rebalance + plumbing batch: (1) trace divisor 20→28 + per-hop reduction 0.7→0.65 (gentler global tracer, stronger relay payoff); (2) +PROXY/-PROXY buttons removed from HI — relay-chain length on WORLD MAP is now the sole bounceCount source; (3) `getMaxRelayHops()` centralized in core, hop caps raised (basic=3, v2=6, v3=8, v4=10, v5=12); (4) sabotage briefing reworded to cover both router and admin_console targets; (5) banking rebalance — APRs inflated to game-time scale (Global 12%, Pacific 22%, Cayman 6%, Zurich 15%), new `notorietyPerHour` per bank, `player.notoriety` accrues from balance × hours, applied to mission baseRate at +0.10%/s per point (clamp [-5,+10]); (6) login save-list staggered reveal with click SFX per card; (7) global world clock — `getWorldClockMs()`/`formatWorldClock()` anchored at real 2026-01-01 → game 2199-01-01, taskbar now displays VST instead of per-player session time (groundwork for shared MMO events). | Tier 1 | SHIPPED 2199-01-01 |
| **M14i** | Research Tech Tree — 5 branches (Crypto / Stealth / Hardware / Social / AI), 30+ research nodes, slow-burn unlocks via paid research bench, hidden nodes gated by story flags | Tier 1 | 4 |
| **M14j** | Loadout slots — save/swap tool configurations between missions (Stealth / Brute / Bank-Run presets) | Tier 1 | 2 |
| **M14k** | Implants / Wetware — permanent player buffs (Ghost reflexes +20% wipe speed, Brute synapse +1 max bounce, etc.) | Tier 1 | 2 |
| **M14l** | Vehicle Gateways — physical-location gateways (Tor relay home / safehouse / corporate VPN) affecting starting trace rate | Tier 1 | 2 |
| **M14m** ✅ | Multi-phase missions — MissionPhase state machine, phase progress UI in HI, PROJECT GHOST 3-phase example (OSINT → Breach → Decoy), per-phase rewards, news echoes posted after disconnect | Tier 1 | SHIPPED 2199-01-01 |
| **M14n** ✅ | Mission runtime events — procedural events (2–5 per contract) trigger by trace/time/breach, surface as on-screen toast banners (good/bad/neutral severity colours), real trace-rate modulation effects | Tier 1 | SHIPPED 2199-01-01 |
| **M14o** ✅ | Choice missions — MissionChoice + pendingChoiceFromPhaseIndex state, full-screen MissionChoiceOverlay UI, BLACK HALO mission with TURN-vs-BURN fork (different faction consequences + skipped phase) | Tier 1 | SHIPPED 2199-01-01 |
| **M15** ✅ PARTIAL | Privilege escalation + persistent backdoors — ESCALATE on breached nodes (needs CPU≥3 + Cracker v3+, +tier×2.5% trace), PLANT BACKDOOR after root, pre-breaches the node on future missions against the same corp via `backdoor_<corp>_<type>` flag. Traffic sniffing partially shipped via M14h Sniffer tools. | Tier 1 | SHIPPED 2199-01-01 |
| **M16** | Terminal expanded commands + Lua scripting layer | Tier 2 | 4 |
| **M17** | Dark web layer: architecture + black market + contracts | Tier 2 | 5 |
| **M18** | Social engineering: OSINT + phishing + vishing + insider | Tier 2 | 5 |
| **M19** | Counter-intel: forensic trail + hunters + burn notice + cover IDs | Tier 2 | 4 |
| **M20** | Advanced missions: stock manip + supply chain + AI + ransomware | Tier 2 | 6 |
| **M21** | Living world: 20 events + news feed + corporate AI + rival expansion | Tier 3 | 4 |
| **M22** | Hardware tiers 5–8 + tool depth + black market hardware | Tier 3 | 3 |
| **M23** | Post-endgame arcs 6A/6B/6C + Arc 7 Enemy of the State | Tier 3 | 8 |
| **M24** | Achievement system + challenge runs + prestige | Tier 3 | 3 |
| **M25** | Multiplayer infrastructure + factions full expansion | Tier 4 | 10 |
| **M26** | Co-op operations + PvP contracts + bounty network | Tier 4 | 8 |
| **M27** | VFX expansion + music system full + terminal CRT | Tier 4 | 4 |
| **M28** | IoT/SCADA + government V2 + satellite layer | Tier 4 | 5 |
| **M29** | Mobile port (React Native) | Tier 4 | 12 |
| **M30** | Arc 8 Ghost Protocol + Arc 9 The Void (Prestige 10) | Tier 4 | 6 |
| **M31** | Modding SDK + community hub integration | Tier 5 | 6 |
| **M32** | Steam / GOG / itch.io distribution + Electron full native | Tier 5 | 4 |

---

## 14. Design Principles

*These are non-negotiable. Every feature request gets evaluated against these before it ships.*

---

**1. Every mechanic should make you feel like a real hacker.**
Not a power fantasy. The tension is earned. You feel clever when you succeed because you actually thought it through. No mechanic should be so easy that success is automatic, or so hard that it feels unfair.

**2. Depth that reveals itself.**
A new player can complete missions with the basic toolkit and have a great time. An expert player discovers the credential reuse, the timestomping, the memory scraping — and realises the game has been rewarding cleverness all along. Depth lives below the surface.

**3. Actions have consequences across time.**
Leave a dirty hop and it costs you three sessions later. Plant a backdoor and it's still there a week later. The game's memory should be longer than the player expects. Decisions compound.

**4. The UI is the world.**
Every element of the interface — the terminal font, the trace bar pulse, the node colours, the DataRain — should feel like it exists inside a real machine. Never break the aesthetic for convenience. Redesign the interaction before you break the feel.

**5. Silence is a feature.**
The game should have moments of near-total quiet — a ghost run with no IDS triggers, no trace bar activity, just the hum of the ambient and the cursor blinking. These moments are the reward for playing perfectly. Preserve them.

**6. The story rewards paying attention.**
Players who read every encrypted memo, follow every forum thread, track every NPC's evolution across arcs — they get a richer experience. But the game is complete without it. Optional depth, mandatory quality.

**7. No feature should be un-fun alone.**
Every mechanic should be enjoyable on its own, not just in service of another. Timestomping should feel satisfying as an act. Vishing should be fun as a sequence. Never add a mechanic that only serves as a prerequisite.

**8. Performance is part of the experience.**
A 3-second load ruins the atmosphere. Every component should render instantly. Three.js scenes lazy-load; audio initialises async; saves write in the background. The player should never wait.

---

*The bones are right. The foundation is there. Everything in this document is the path from "pre-alpha that impresses" to "genre-defining masterpiece." Build it one milestone at a time. Make it world class.*
