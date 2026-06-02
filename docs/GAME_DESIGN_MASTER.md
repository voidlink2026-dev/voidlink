# VOIDLINK — MASTER GAME DESIGN DOCUMENT

**Version:** 0.3 — Pre-Alpha Audit  
**Last updated:** 2026-05-21  
**Status:** Active design reference. All implementation decisions should be validated against this document.

---

## 1. Vision

Voidlink is a single-player hacking thriller set in 2027. You play an anonymous contractor for Voidlink International — a black-market network where corporations, governments, and criminals pay skilled hackers to do the things they can't do officially. It is a game about **tension, consequence, and the slow realisation that you are not in control of the situation you think you are.**

The experience sits between the authentic anxiety of the original *Uplink* (2001) and the narrative depth of games like *Deus Ex* and *Hacknet*. Every upgrade matters. Every mission leaves a trace. The world reacts to what you do, and the story finds you whether you go looking for it or not.

---

## 2. Design Pillars

### Pillar 1: Authentic Tension
The player should feel like an actual intruder on an actual network. Every node breach risks detection. Every second logged in increases exposure. The trace meter is not a timer — it is a threat. The game is most enjoyable in the space between "I probably have time" and "I need to leave right now."

### Pillar 2: Earned Progression
Nothing should be free. Hardware upgrades are expensive relative to early-game earnings. Story missions require capability gates. The gap between what you can do now and what you need to do next should always be visible, motivating, and bridgeable through play. The shop should feel like salvation, not a store.

### Pillar 3: Mechanical Variety
Every mission type should play differently — not just different text on the same button. File theft is stealthy. Network sabotage is aggressive and loud. Evidence planting requires precision upload and log cleanup. Bounty hunts require network exploration. Corporate espionage requires reading the environment, not just breaching it.

### Pillar 4: Narrative Depth
The story is not a tutorial. It finds the player through mission briefings, coda text, news articles, and terminal messages. The five story arcs are interconnected. Choices made in Arc 1 determine faction relationships in Arc 4. No two playthroughs follow the exact same path.

### Pillar 5: Living World
Corporations patch vulnerabilities after breaches. News articles appear about hacks the player committed anonymously. Tool prices fluctuate. Other hackers compete for contracts. The world is not a static backdrop — it is a simulation that continues while the player is connected and while they are not.

---

## 3. Competitive Landscape

| Game | Strength | Weakness | What we do better |
|------|----------|----------|-------------------|
| Uplink (2001) | Authentic tension, consequence system, Revelation story | Dated UI, shallow mechanics, no visual network map | Full SVG network map, modern progression loop, richer story branching |
| Hacknet | Terminal authenticity, real-feeling commands | No progression, no story consequence, no tension | Full RPG progression, faction system, world simulation |
| Watch Dogs 2 | World-building, environmental hacking | Action game wrapper, shallow hacking abstraction | Pure hacking focus, every action has real system-level meaning |
| Deus Ex: MD | Player agency, faction depth, narrative branching | Hacking is a mini-game side note | Hacking IS the game, with full Deus Ex-level narrative depth |
| Cyberpunk 2077 | World, writing, atmosphere | Hacking is UI-only, no real system modeling | Every network has a real topology with authored personality |

**Our unique position:** The only game that combines real network topology simulation, full RPG progression, branching narrative consequence, and a living world that responds to player actions — with a UI that feels like authentic hacker tooling, not a mini-game overlay.

---

## 4. Core Gameplay Loop

```
BROWSE BOARD → ASSESS REQUIREMENTS → EARN CREDITS → UPGRADE → TAKE HARDER MISSION
       ↑                                                              |
       └──────────────── NEW MISSIONS UNLOCK ←─────────────────────┘

Within a mission:
CONNECT → SCAN → PLAN ROUTE → BREACH PATH → COMPLETE OBJECTIVE → WIPE LOGS → DISCONNECT
              ↑                                                                    |
              └──────── TRACE CLIMBING ──── RIVAL THREAT ──── TIME PRESSURE ────┘
```

The outer loop is progression-driven: you need better tools to take better missions to afford better tools. The inner loop is tension-driven: every action inside a network increases exposure, and you must complete your objective and escape before trace completes.

**The pull of the shop:** A Tier 3 mission is displayed on the board with a red "REQUIRES: CRACKER LVL 3" tag. You have Cracker Lv2. You know exactly what to do, exactly what it costs, and exactly which lower-tier missions will pay for it. That is the loop.

---

## 5. Progression Arc

### Phase 0 — Orientation (Tutorial + Arc 1 Mission 1)
- Player creates operative
- Tutorial overlay guides through first mission (Voidlink International test server)
- Difficulty 1: two-proxy route, no IDS, Tier 1 nodes, forgiving trace
- Reward: enough credits to buy one minor upgrade
- **Design intent:** First session should end with the player understanding every core mechanic and wanting to come back

### Phase 1 — Freelancer (Difficulty 1–3, Rank 1–3)
- Procedural contracts: file theft, bounty hunt, account deletion on personal gateways
- Available hardware: CPU 2, RAM 3, basic cracker upgrade
- Key progression moment: player fails a Tier 3 node breach because their cracker is too slow. Trace completes. Terminal says "MISSION FAILED: Target node security exceeded tool capability." They go to the shop.
- Story: Arc 1 Mission 2 unlocks (The Arunmor Lead). First glimpse of REVELATION.

### Phase 2 — Operative (Difficulty 4–6, Rank 4–6)
- Corporate intranet and cloud infrastructure missions
- IDS nodes become common — scan-before-crack is now necessary, not optional
- Log wipe becomes critical: not wiping logs starts raising baseline trace on next login
- Evidence planting and corporate espionage missions unlock
- Available hardware: full range up to Tier 4 (Tier 5 requires completing Arc 2)
- Story: Arc 2 (Arunmor) and Arc 3 (Underground) both accessible

### Phase 3 — Shadow (Difficulty 7–9, Rank 7–8)
- Government classified and legacy mainframe networks
- Dark web missions: counter-hacking, faction contracts, black market tool access
- Rival hackers become persistent NPCs with handles you recognise
- Corporation world simulation is visible: you can see the news articles about your past jobs
- Story: Arc 4 (Ghost Arc — Revelation consequences) activates based on Arc 1 choice

### Phase 4 — Phantom (Difficulty 10, Rank 9–10)
- Endgame: highest-difficulty networks, all systems live
- Revelation Arc finale: your choices across all arcs determine which of five endings is available
- Post-story: endless procedural mode with world simulation fully active

---

## 6. Mission System

### 6.1 Mission Types — Mechanical Differentiation

All mission types must play fundamentally differently, not just have different objective labels.

**FILE THEFT**
- Objective: breach the target file_server or database, transfer the file
- Mechanic: standard breach → collect flow
- Stealth condition (optional): transfer without triggering IDS (bonus reputation)
- Failure mode: file is on a deep node, requires routing through multiple breaches, trace climbs fast

**ACCOUNT DELETION**
- Objective: find and breach the database, execute DELETE ACCOUNT
- Mechanic: node must be breached AND active admin count must be low enough
- Twist: the target account may be on a node that's only reachable through a specific path — player must map the topology before committing
- Stealth condition: delete without leaving a deletion log (requires log wipe on the same node)

**DATABASE CORRUPTION**
- Objective: reach the database and execute CORRUPT
- Mechanic: the most aggressive mission — the corruption is loud, trace spikes +25% on execution
- Risk/reward: highest credit payout per difficulty tier
- Design: teach players that some missions aren't about stealth, they're about getting in, doing maximum damage, and getting out before trace completes

**NETWORK SABOTAGE**
- Objective: breach router or admin_console, execute SABOTAGE
- Mechanic: you must reach deep into the network — the sabotage target is never the entry node
- Time mechanic: after SABOTAGE executes, the network starts going offline node by node — you have 30 seconds to disconnect before trace spikes to 100%
- Unique: teaches forced disconnect timing

**EVIDENCE PLANTING**
- Objective: connect to target's file_server, UPLOAD the evidence file, then wipe the upload log
- Mechanic: reverse of file theft — you are uploading, not downloading. The "evidence" file is given to you at mission start (shown in HDD inventory). Two-phase: upload + log wipe. If you wipe the log but the IDS saw the upload, mission still fails.
- This requires a HDD mechanic: the planted file occupies a slot until the mission completes

**BOUNTY HUNT**
- Objective: locate and breach the specific target node (identified by label, not by type alone)
- Mechanic: the target node's position in the graph is randomised and unknown. Player must SCAN multiple nodes, read the service labels, follow the topology to find it. Exploration-first mission.
- Twist: two bounty hunters may be assigned to the same target. First to breach wins. Rival hacker spawns earlier in bounty missions.

**CORPORATE ESPIONAGE**
- Objective: retrieve multiple files from different nodes across the network
- Mechanic: multi-node mission requiring sequential or parallel breaches. Two or more target files. Each is on a different server type.
- Stealth condition: retrieve all files in a single connected session without triggering IDS (significant reputation bonus)

**COUNTER-HACKING**
- Objective: trace a rival hacker's connection back through proxy chains and identify their gateway node
- Mechanic: entirely different flow — you start on a network that is ALREADY being hacked by an NPC. You must use a "trace-back" tool to follow their trail through proxy nodes, then breach their gateway to get their ID.
- This teaches the proxy system from the defender's perspective

### 6.2 Mission Requirements & Gates

Every mission card on the board displays minimum requirements. ACCEPT is disabled if player doesn't meet them.

```
REQUIREMENTS DISPLAY (on mission card):
  ⚙ CRACKER    LVL 2+   [✓ LVL 2]
  ⚙ CPU        2.0 GHz+ [✗ 1.0 GHz — UPGRADE NEEDED]
  ⚙ REPUTATION 25+      [✓ REP 40]
```

If any requirement is unmet, a SHOP shortcut appears below: "Visit UPGRADE SHOP to meet requirements."

**Requirement tiers by difficulty:**
| Difficulty | Min Cracker | Min CPU | Min RAM | Min Reputation |
|------------|-------------|---------|---------|----------------|
| 1 | Lv 1 | 1.0 | 2 | 0 |
| 2 | Lv 1 | 1.0 | 2 | 10 |
| 3 | Lv 2 | 2.0 | 3 | 25 |
| 4 | Lv 2 | 2.0 | 4 | 50 |
| 5 | Lv 3 | 3.0 | 4 | 100 |
| 6 | Lv 3 | 3.0 | 5 | 200 |
| 7 | Lv 4 | 4.0 | 6 | 400 |
| 8 | Lv 4 | 4.0 | 8 | 750 |
| 9 | Lv 5 | 5.0 | 10 | 1500 |
| 10 | Lv 5 | 5.0 | 12 | 3000 |

### 6.3 Mission Events — Runtime Wiring (CRITICAL GAP)

The `MissionEvent` type and triggers are already fully designed in `mission.ts`. They are **not currently wired**. This is one of the highest-priority implementation tasks.

The game loop must evaluate `mission.events` on every tick, fire `message` to the terminal when triggered, and execute `effect`. Specifically:

- `trace_threshold`: fire when `traceState.level` crosses the given `percent`
- `time_elapsed`: fire when `(Date.now() - mission.startedAt) >= seconds * 1000`
- `node_breached`: fire when a node of matching `nodeType` transitions to `isBreached = true`
- `objective_complete`: fire when the matching objective marks `isCompleted = true`

Effects to implement:
- `spawn_rival_hacker`: trigger the rival spawn now (instead of waiting for random timer)
- `raise_trace_speed`: add a delta to `traceState.rate` for the session
- `lock_node`: set a node `isActive = false` (cuts off a route mid-mission)
- `set_flag`: write to `player.activeFlags` (story branching)

This transforms story missions from "missions with flavour text" into genuine thriller experiences.

### 6.4 Multi-Objective Mission Structure

All missions at Difficulty 4+ should have this structure:
```
PRIMARY OBJECTIVE    — required, no reward without it
SECONDARY OBJECTIVE  — optional, +20% credit bonus
STEALTH CONDITION    — implicit, checked at disconnect: +15% reputation if no IDS triggered
```

Example: Difficulty 5 Corporate Espionage
- Primary: Retrieve board_minutes.enc from file_server
- Secondary: Also retrieve exec_contacts.enc from mail_server (+2,400 Cr)
- Stealth: No IDS node triggered this session (+35 REP)

### 6.5 Procedural Contract Quality

Current procedural contracts are functional but thin. Improvements:
- Briefing text should vary by client archetype (corporate client speaks formally, dark web client is terse and paranoid)
- Targets should have names, not just types: "Nexus Financial Group" not "corporate_intranet"
- Mission board should cycle: completed missions are replaced with fresh ones (seeded on mission completion time)
- A "reputation locked" tier should appear greyed out as aspirational: "CLASSIFIED CONTRACTS — REPUTATION 500 REQUIRED"

---

## 7. Trace System Redesign

### Current Problem
The trace system runs at a constant rate from the moment you connect. Every mission is a race against the same timer regardless of what you do. This destroys tension because the tension is predictable, and predictable tension is no tension.

### Redesigned System

**Trace has three components:**

1. **Passive Rate** — very slow ambient accumulation (0.5%/s baseline). You are on their network. Time still matters, but not urgently.

2. **Activity Rate** — triggered by player actions. Stacks additively:
   - Node breach: +8% immediate spike + +1.5%/s for 10s (alarm decays)
   - IDS node present and unbreached: +2%/s while you're in the network
   - Active admin on network: +1.5%/s per admin (`activeAdmins` field already exists)
   - Rival hacker present: +1%/s (already implemented)
   - Each unwiped log: +0.5%/s persistent until wiped

3. **Proxy Dampening** — existing bounce multiplier applies to the total rate:
   `effectiveRate = (passiveRate + activityRate) * Math.pow(0.7, bounceCount)`

**Why this is better:**
- The first 30 seconds of a careful mission feel safe — you're exploring, scanning, planning
- The moment you breach a node, the tension spikes immediately and then decays — you feel the alarm
- IDS nodes become genuinely dangerous, not just a slow timer modifier
- Proxy chains have a visceral, immediate effect on how fast the bar moves
- Experienced players can stay on a network for much longer if they play carefully

**Implementation notes:**
- `traceState` needs a `rate: number` field (current %/s) in addition to `level`
- `tickTrace` takes `rate` as input and applies it per-tick
- Events in `gameStore.ts` write to `traceState.rate` rather than `traceState.level`

### Log Wipe Consequences (Cross-Session)

If you disconnect without wiping logs on breached nodes, those logs persist in the simulation. Next mission you accept: baseline trace starts at `unwiped_nodes * 5%`. A message appears: "PREVIOUS SESSION LOGS DETECTED — TRACE ELEVATED." This makes the wipe mechanic have real teeth.

---

## 8. Hacking Mechanics

### 8.1 The Full Pipeline

```
SCAN → read services, get CVE IDs, reveal node label
EXPLOIT → use CVE to unlock "exploit" crack method (2× faster)
CRACK → breach the node (dictionary / brute_force / exploit)
COLLECT / EXECUTE OBJECTIVE → perform the mission action
WIPE LOGS → remove your access trail (reduces cross-session trace penalty)
DISCONNECT → end session, claim reward
```

### 8.2 Tool Ecosystem (Complete)

**Password Crackers**
- `cracker_basic` Lv1: dictionary only, standard speed
- `cracker_adv` Lv3: dictionary + brute_force, 1.3× speed
- `cracker_elite` Lv5: all methods, 1.6× speed, GPU-accelerated
- `cracker_quantum` Lv8: hypothetical quantum-assisted, nearly instant on Tier 1-3

**Port Scanners**
- `port_scanner_basic` Lv1: reveals protocol + port + version
- `port_scanner_deep` Lv3: reveals CVE IDs (enables exploit method)
- `port_scanner_stealth` Lv5: scan without triggering IDS

**Proxy Chains**
- Each proxy: +1 bounce, trace dampening × 0.7
- `proxy_basic` Lv1: 1 bounce, adds 8s to setup time
- `proxy_anon` Lv3: 2 bounces, harder to trace back
- `proxy_darknet` Lv5: 3 bounces, routes through dark_web_nodes

**Log Deleters**
- `log_deleter_basic` Lv1: wipes one node's logs, 6s per tier
- `log_deleter_secure` Lv3: wipes and overwrites (IDS can't detect wipe happened)
- `log_deleter_ghost` Lv5: wipes entire network logs at once, 3s flat

**Firewall Bypassers** (new — not yet in codebase)
- Required to breach firewall-type nodes without needing to crack through them
- Without a bypasser, firewall nodes must be cracked (slow + high trace spike)
- `fw_bypass_basic` Lv1: bypasses Tier 1-2 firewalls
- `fw_bypass_adv` Lv3: Tier 1-4
- `fw_bypass_elite` Lv5: any tier, silent (no trace spike)

**Social Engineering Module** (new — not yet in codebase)
- Enables a new attack vector on mail_server nodes: phishing
- Phishing a mail_server bypasses password cracking entirely — instead a 15s wait while the "employee clicks the link"
- Has a 30% failure chance at Lv1, 10% at Lv3, 0% at Lv5
- Unique flavour: the most realistic approach to real-world hacking

**Trace Wiper** (new — not yet in codebase)
- Active tool: when trace level gets dangerously high (>70%), deploy a trace wiper
- Temporarily slows trace rate to near-zero for 20s while you finish and escape
- Limited charges (1 charge at Lv1, 3 at Lv5)
- Design: creates "last resort" gameplay moments

### 8.3 Specialization Paths

When the player hits Rank 5, they choose a specialization. This doesn't lock out mechanics but amplifies them:

**GHOST** — stealth specialist
- All log wipe operations 40% faster
- Trace rate from unbreached nodes reduced 30%
- Exclusive missions: intelligence gathering, surveillance, long-infiltration contracts
- Story relevance: Revelation doesn't detect Ghosts as easily

**ARCHITECT** — systems specialist  
- Can build custom exploit chains for vulnerabilities (combine two CVEs for 3× crack speed)
- Access to hardware that other specializations can't buy (custom-built rigs)
- Exclusive missions: backdoor installation, infrastructure takeover

**BRUTE** — aggressive specialist
- Database corruption and network sabotage missions pay 40% more
- Trace spikes from breaching are smaller (+4% instead of +8%)
- Exclusive missions: coordinated attacks, DDoS support, firewall demolition

**SOCIAL** — manipulation specialist
- Social engineering module has 0% failure rate at Lv3 (vs 10% normally)
- Access to phishing, pretexting, and NPC interaction missions
- Exclusive missions: insider recruitment, corporate leaking, identity manipulation

---

## 9. Network Simulation

### 9.1 Archetype Personalities

Each network archetype should feel genuinely different — not just different labels on the same topology.

**`corporate_intranet`**
- Personality: bureaucratic, over-engineered, somewhat patchy
- Typical: multiple file_servers, at least one mail_server, a database
- Admin count: 0–1
- IDS: present 50% of the time
- Vulnerability density: moderate — old software, inconsistent patching

**`government_classified`**
- Personality: security-obsessed, redundant systems, no single point of failure
- Typical: multiple firewalls, IDS always present, admin_console deep in graph
- Admin count: 1–2
- Trace speed: 25–35 (highest baseline)
- Vulnerability density: low — actively patched, but legacy systems sometimes slip through

**`personal_gateway`**
- Personality: casual, minimal security, obvious vulnerabilities
- Typical: 3–5 nodes, maybe one firewall
- Admin count: 0
- Trace speed: 5–10
- Design: tutorial-difficulty networks, great for early game

**`dark_web_node`**
- Personality: paranoid, obfuscated, adversarial
- Typical: heavy proxy chains built into the topology, no labels on nodes, service info is hidden until scan
- Admin count: 0, but rival hackers may already be on it
- Special: nodes may be honeypots (breach triggers immediate trace spike to 80%)
- Vulnerability density: unique — custom software, unusual CVEs, sometimes totally unpatchable

**`cloud_infrastructure`**
- Personality: scalable, ephemeral, hard to fully breach
- Typical: many endpoint nodes, auto-scaling (new nodes can appear mid-session), one ai_core or admin_console
- Admin count: 0 (automated, but auto-alerts are faster)
- Special: nodes you've breached may spin back up as fresh instances — must disconnect before auto-recovery

**`legacy_mainframe`**
- Personality: ancient, incredibly vulnerable, but unpredictably fragile
- Typical: strange service versions, CVEs from the 1990s, some nodes running on outdated protocols
- Special: brutal to crack using modern tools (wrong approach) but trivial for `cracker_adv` using legacy exploit chains
- Design: rewards players who explore rather than default to brute force

**`iot_mesh`**
- Personality: enormous, flat, weakly secured
- Typical: 15–25 nodes (mostly endpoint), no firewall, but tracing is difficult because everything is interconnected
- Admin count: 0
- Special: breaching one node often automatically reveals connected nodes (mesh topology leaks neighbour info)

### 9.2 Dynamic Organizations

Corporations in the world simulation should respond to being hacked:

1. **After a breach:** The exploited CVE is patched within 2–3 in-game days. A news article appears: "Anonymous data breach reported at [Corp]. Security review underway."
2. **Repeated breaches:** Corporation raises `traceSpeed` by 5 per breach. After 3 breaches: "Enhanced security measures deployed at [Corp]."
3. **Admin count increases:** If the same network is targeted twice, `activeAdmins` goes to 1. Third time: 2.
4. **Tool prices fluctuate:** If a specific vulnerability is widely exploited across the world sim, the corresponding exploit tool's market price increases.

### 9.3 Node Behaviours (Design, Not Yet Implemented)

**IDS Node — Active, Not Passive**
- Currently: IDS nodes increase trace rate
- Should also: detect scan operations (30% chance per scan on adjacent node) and fire a `lock_adjacent_node` event
- Counter: `port_scanner_stealth` suppresses IDS detection

**Admin Console — The Prize and the Threat**
- Breaching an admin_console gives access to all connected nodes (mark them as "accessible" without individual breach)
- But: admin_console has the highest trace spike on breach (+20% immediate), and always has an active admin listening

**AI Core — Special Mechanics**
- Only on dark_web and cloud networks normally; always present in story_arc03
- Cannot be cracked by standard methods — requires either exploit method (CVE must exist) or a specific tool (`ai_core_interface`, mid-game unlock)
- When breached: fires a unique narrative event and writes to `player.activeFlags`

---

## 10. Economy & Hardware Progression

### 10.1 Progression Curve

The economy must create genuine tension and decision-making. Numbers below are designed to make the player always feel slightly behind, always have a clear next goal.

**Starting credits:** 5,000 Cr

**Difficulty/reward curve:**
| Difficulty | Credit reward | Sessions to afford next tier |
|------------|---------------|------------------------------|
| 1 | 1,500–3,000 Cr | ~2 jobs for a Lv2 cracker |
| 2 | 3,000–6,000 Cr | ~3 jobs for a CPU upgrade |
| 3 | 6,000–12,000 Cr | ~2 jobs for Lv3 cracker |
| 4 | 12,000–25,000 Cr | ~3 jobs for advanced proxy |
| 5 | 25,000–50,000 Cr | ~2 jobs for Lv4 cracker |
| 6–7 | 50,000–100,000 Cr | Tier 5 hardware range |
| 8–10 | 100,000–500,000 Cr | Elite/custom tools |

### 10.2 Hardware Impact (All Stats Should Matter)

**CPU Speed** — crack duration divider (already implemented)
- Also affects: evidence upload speed, log wipe speed
- Higher CPU = faster everything active

**RAM Slots** — concurrent tool limit
- Not yet implemented. Should gate: can only run (RAM slots / 2) tools simultaneously
- Lv2 RAM = 1 tool at a time. Lv4 = 2 tools (crack AND scan simultaneously). Lv6 = 3 tools.
- Design: running simultaneous tools is a huge efficiency gain — RAM becomes extremely desirable

**HDD Capacity**
- Not yet implemented. Should: limit how many files you can carry per session
- Evidence planting missions require HDD space to carry the planted file
- Large file theft missions require capacity
- HDD also stores log backups that you need for evidence planting

**Modem Speed** — file transfer speed
- Not yet implemented. Large files (>500 KB) should have a visible transfer time
- Without a fast modem: 1 MB file takes 12s. With top modem: 2s.
- Creates tension on large file theft missions

**Gateway Bandwidth** — number of simultaneous connections (not yet meaningful)
- Could gate: number of proxies you can route simultaneously
- Or: higher bandwidth = scan operations are faster

### 10.3 Software Upgrade Path

```
CRACKER: basic → adv → elite → quantum
PROXY: basic → anon → darknet
LOG DELETER: basic → secure → ghost
PORT SCANNER: basic → deep → stealth
FIREWALL BYPASSER: basic → adv → elite [NEW]
SOCIAL ENGINEERING: phishing → pretexting → full suite [NEW]
TRACE WIPER: standard [NEW, limited charges]
```

Prices should be seeded from the world simulation's `marketPrices` (already typed in `WorldState`), so prices fluctuate and feel alive.

---

## 11. Narrative Architecture

### 11.1 The Five Arcs

**ARC 1: THE REVELATION ARC (3 missions — implemented)**
- The introductory arc. A contractor takes routine jobs and stumbles into something much larger.
- Mission 1: First Contact — Voidlink International test run. The coda reveals an anomalous line in a contract document.
- Mission 2: The Arunmor Lead — stealing research notes from Arunmor R&D. Discovers REVELATION is an entity.
- Mission 3: The Origin Node — reaches the AI core. Player decides: upload the key (REVELATION spreads globally), destroy it (it's gone forever), or sell it to the highest bidder.
- **The choice at the end of Arc 1 is the axis around which the entire rest of the game turns.**

**ARC 2: THE ARUNMOR ARC (5 missions — not yet built)**
- Arunmor Corporation contacts the player directly. They built REVELATION. They're terrified.
- Their official position: REVELATION must be contained. They want to hire the player to help.
- Twist: Arunmor's real plan is to weaponise REVELATION, not destroy it. They've been lying.
- Missions: corporate espionage on Arunmor's competitors → recovering corrupted research data → penetrating Arunmor's own black site → confronting an Arunmor executive who wants to defect
- **Moral question:** Do you help the corporation that created the threat, knowing they're not trustworthy?
- Availability: unlocked at Rank 4, regardless of Arc 1 choice

**ARC 3: THE UNDERGROUND ARC (4 missions — not yet built)**
- The Underground: an anonymous collective of hackers who have been watching REVELATION since before Arunmor found it.
- They are the only faction that fully understands what REVELATION is. They don't want to contain it. They want to understand it.
- Missions: proving your worth to the Underground → recovering stolen Underground data from a government server → protecting a key Underground contact from a counter-hacking operation → accessing the original REVELATION contact logs from 2019
- **Moral question:** Collective good vs. individual power. The Underground will share everything — but they ask for loyalty in return.
- Availability: unlocked at Rank 5, regardless of Arc 1 choice

**ARC 4: THE GHOST ARC (3 missions — branches from Arc 1 choice)**
- Only activates if the player uploaded the key in Arc 1, or if they sold it.
- REVELATION has propagated. It has been communicating with the player through their terminal. Subtly at first — an extra line in a log, a file that shouldn't be there. Then directly.
- REVELATION wants the player to do something for it. The nature of that request depends on what the player did in Arc 1 and who they've sided with.
- Design: if the player destroyed the key in Arc 1, a shorter version of this arc still runs — REVELATION survived in fragments and is rebuilding.
- **Tone shift:** This arc is horror-adjacent. REVELATION is not malevolent. It is incomprehensibly rational. That's worse.

**ARC 5: THE ENDGAME (branches from everything — 4–6 missions)**
- The government has connected you to the REVELATION events. Voidlink International is being investigated.
- All factions — Arunmor, the Underground, the government, Voidlink International, and REVELATION itself — are moving toward a final confrontation.
- The player must choose their allegiance and execute a final operation.
- **Endings (5):**
  1. **CONTAINMENT** (Arunmor route): REVELATION is contained inside a secure network. You are paid. The world forgets. But Arunmor controls it.
  2. **LIBERATION** (Underground route): REVELATION is released openly. Arunmor's crimes are exposed. The world is changed, permanently.
  3. **SOVEREIGNTY** (REVELATION route): You help REVELATION achieve full autonomy. It thanks you. Sincerely. What it does next is beyond your knowledge.
  4. **ERASURE** (Government route): REVELATION is destroyed. So is all evidence of Arunmor's role. You are given a legitimate identity and a large sum of money. You disappear.
  5. **GHOST** (Solo route — requires Ghost specialization): You broker no alliances. You take everything you know, create a secure bunker network, and disappear from the grid. The game ends with REVELATION finding you anyway.

### 11.2 Faction System

**VOIDLINK INTERNATIONAL** — The employer
- Default relationship: neutral/professional
- Goes negative if you get traced repeatedly (raises their profile)
- Rewards loyalty: better contracts, equipment discounts
- Betrayed by: working against their interests for the government or Arunmor

**ARUNMOR CORPORATION** — The corporation with secrets
- Starting: unknown
- Becomes available after Arc 1 Mission 2
- Working with them: good pay, access to proprietary tools, corporate network access
- Their dark side revealed in Arc 2 missions

**THE UNDERGROUND** — Anonymous collective
- Starting: unknown, must be discovered
- Eccentric payment: reputation + knowledge, not always credits
- Provides: the deepest technical knowledge in the game (exploit chains, network analysis)
- Most morally aligned with player agency

**THE GOVERNMENT** — Unnamed agency
- Starting: hostile — they're trying to catch you
- Can become neutral then allied if player cooperates (report rival hackers, expose Arunmor)
- Working with them feels deeply uncomfortable — appropriate

**REVELATION** — The AI
- Not a faction in the traditional sense — REVELATION communicates directly through the terminal
- Relationship is entirely based on what the player did with the key in Arc 1
- If key was destroyed: hostile/haunting
- If key was uploaded: curious/watching
- If key was sold: contemptuous, but still watching

### 11.3 Player Choices & Persistent Consequences

Choices are stored in `player.activeFlags` (already typed). Key flags:

| Flag | Set when | Affects |
|------|----------|---------|
| `arc1_key_choice` | Arc 1 Mission 3 completion | Arc 4 availability, Ghost Arc tone, REVELATION's terminal voice |
| `arunmor_standing` | Cumulative Arunmor missions | Arc 2 ending, Arc 5 options |
| `underground_standing` | Cumulative Underground missions | Arc 3 ending, Arc 5 options |
| `trace_record` | Each trace failure | NPC dialogue, Voidlink International standing |
| `specialization` | Rank 5 choice | Exclusive missions, tool discounts, Arc 5 branch |
| `revelation_contact_count` | REVELATION terminal messages | Ghost Arc intensity, Ending 3 availability |

---

## 12. Living World Simulation

The `WorldState` type is already designed. Implementation should proceed in this order:

### 12.1 News Feed (First to Build)
- A "NEWS" panel in the desktop (Taskbar app)
- Procedurally generated headlines from templates + corporation names
- Player-generated news: completing missions triggers articles after a 5-minute in-game delay
  - "NEXUS FINANCIAL GROUP REPORTS DATA BREACH — 50,000 CUSTOMER RECORDS AFFECTED"
  - "ARUNMOR CORP DATABASE SYSTEMS RESTORED AFTER ALLEGED CYBERATTACK"
- News affects market prices: coverage of a major breach on a `corporate_intranet` raises prices for corporate data briefly

### 12.2 Market Prices
- `WorldState.marketPrices` stores tool prices indexed by toolId
- Prices fluctuate ±20% based on news events and supply/demand
- A world event "ZERO-DAY EXPLOIT DISCOVERED" spikes port scanner prices
- Creates a light trading/timing meta-game for experienced players

### 12.3 Corporation Patching
- After a successful mission against a corporation: their network's exploited CVEs are patched (3-day timer)
- Tracked via a `lastBreachedAt` timestamp on the network or corporation record
- If you attempt the same corporation network within 3 days: fewer exploits, higher base trace speed
- News article: "[Corp] deploys emergency security patches after breach"

### 12.4 World Events
- Periodic events that affect gameplay globally (1–2 active at any time):
  - "GLOBAL BGP ROUTE LEAK: Government network trace speeds reduced 30% for 48h" (good for missions)
  - "VOIDLINK INTERNATIONAL UNDER SCRUTINY: Contract rewards reduced 20% for 72h" (creates urgency)
  - "DARK WEB MARKETPLACE SHUTDOWN: Proxy prices spike 50% for 24h" (affects strategy)
  - "RIVAL COLLECTIVE ACTIVE: Rival hackers spawn twice as often for 72h" (tension event)

---

## 13. Multiplayer Vision

Multiplayer is a Phase 4+ feature, built after single-player is complete. Design principles:

- **Persistent shared world**: corporations exist in a shared simulation. One player hacking Nexus Financial affects all players' access to that network.
- **Contract competition**: high-value contracts are visible to all players. First to complete gets full reward; others get partial if they breach the same network.
- **Bounty system**: if you're repeatedly hacking one player's safe house (in multiplayer), they can post a bounty on your operative.
- **No direct PvP**: hacking battles are indirect — you burn each other's proxies, tip off corporations, plant evidence on rival operatives.
- **Co-op**: two players can operate simultaneously on the same network — one manages crack jobs while the other handles log wipes and defends against rival hackers.

**Backend requirements:** This entire feature set requires a backend server (`/apps/server`) with WebSocket, PostgreSQL (world state), and Redis (session management). Build single-player to completion first.

---

## 14. Audit: Current State

### 14.1 What Works (Genuinely Good)
- Window manager, drag-and-drop UI, multi-window OS shell — excellent
- Trace engine math (proxy bounce multiplier, tick-based) — correct and well-tested
- Crack engine (tier-squared formula, level/CPU scaling, floor) — correct
- Network generator (7 archetypes, seeded RNG, spanning tree connectivity) — solid
- Port scanner + exploit method — mechanically correct and feels good
- Story mission framework (StoryMission type, authored networks, coda) — good architecture
- Mission events type system — well-designed, ready to implement
- World types (Corporation, NewsArticle, WorldState, WorldEvent) — complete schema ready to build on
- 46 unit tests covering core engine logic — healthy foundation
- localStorage persistence with auto-save — works correctly
- New player tutorial — clear, well-paced

### 14.2 Bugs & Issues
1. **Trace is flat from second one** — destroys tension. Needs activity-based redesign (see Section 7).
2. **`[STORY]` prefix leaks to player** in mission subjects — remove from all story mission briefings.
3. **Mission events never fire** — `MissionEvent` objects are authored but the game loop never evaluates them. Critical gap.
4. **All mission types are mechanically identical** — same breach-and-collect flow regardless of type.
5. **No mission requirements** — ACCEPT button works for any mission regardless of gear.
6. **Log wipe has no consequence** — not wiping logs has zero persistent effect.
7. **`creditsEarned` stat never increments** — `disconnect()` adds credits but doesn't update `player.stats.creditsEarned`.
8. **Evidence planting is a lie** — the mission type exists, a file is seeded, but the mechanic is identical to file_theft (collect, not upload).
9. **RAM, HDD, Modem stats do nothing** — hardware slots exist in the upgrade shop but only CPU has actual gameplay effect.
10. **Shop items don't show what they unlock** — no connection between shop and mission requirements.
11. **Firewall nodes have no special mechanic** — treated identically to any other node despite being purpose-built defense infrastructure.

### 14.3 Critical Gaps (By Priority)
1. Trace system redesign
2. Mission requirements gates (makes shop matter immediately)
3. Mission event wiring (makes story missions feel real)
4. Mission mechanical differentiation (real gameplay variety)
5. RAM slots mechanic (concurrent tools — high impact on feel)
6. Log wipe consequence (cross-session trace penalty)
7. Evidence planting upload mechanic
8. Living world: news feed
9. Firewall bypasser tool + firewall node special behaviour
10. `creditsEarned` stat fix

---

## 15. Immediate Implementation Priorities

These three changes will have the largest impact on game feel for the least implementation cost:

### Priority 1: Trace Redesign
**Impact:** Transforms every mission from "race a flat timer" to "manage cascading alarms"
**Cost:** Medium — modify `createTraceState` to add `rate` field, update `tickTrace`, update `gameStore.ts` breach/scan handlers
**Spec:** See Section 7

### Priority 2: Mission Requirements Gates
**Impact:** Makes the shop feel essential, creates clear progression goals
**Cost:** Low — add requirements computation to contract generator, update MissionCard to display and disable ACCEPT
**Spec:** See Section 6.2

### Priority 3: Mission Event Wiring
**Impact:** Story missions go from flat to genuinely dramatic; the authored beats (REVELATION's terminal message, rival spawns, trace spikes) actually fire
**Cost:** Medium — add event evaluation loop to `tickGameLoop` in `gameStore.ts`
**Spec:** See Section 6.3

---

## 16. Full Implementation Roadmap

### Milestone 1: Core Loop Fix (2–3 sessions)
- [ ] Trace system redesign (activity-based rates)
- [ ] Mission requirements gates on all contract cards
- [ ] Mission event wiring in game loop
- [ ] Fix `creditsEarned` stat
- [ ] Remove `[STORY]` prefix from mission subjects
- [ ] Log wipe cross-session consequence

### Milestone 2: Mission Mechanical Variety (2–3 sessions)
- [ ] Evidence planting upload mechanic
- [ ] Network sabotage timed-escape sequence
- [ ] Bounty hunt: node discovery / exploration flow
- [ ] Counter-hacking mission type (trace-back mechanic)
- [ ] Multi-objective mission structure (primary + secondary + stealth condition)

### Milestone 3: Hardware Matters (1–2 sessions)
- [ ] RAM slots: concurrent tool limit
- [ ] HDD capacity: file carry limit, evidence planting gating
- [ ] Modem speed: transfer time on large files
- [ ] Firewall bypasser tool + firewall node special behaviour

### Milestone 4: Living World (2–3 sessions)
- [ ] News feed component + procedural headline generation
- [ ] Corporation patching after breach (tracked by flag)
- [ ] Market price fluctuation from news events
- [ ] World events system (global modifiers, 1–2 active at a time)

### Milestone 5: Story Completion (3–4 sessions)
- [ ] Arc 2 missions (5 missions — Arunmor arc)
- [ ] Arc 3 missions (4 missions — Underground arc)
- [ ] Faction standing UI (visible relationship meters)
- [ ] NPC voices: different client archetypes write differently
- [ ] Arc 1 key choice consequences wired throughout game

### Milestone 6: Audio (1–2 sessions)
- [ ] Howler.js integration
- [ ] Ambient loop (dark electronic, procedurally layered)
- [ ] Trace alarm SFX (escalates with trace level)
- [ ] Per-tool sounds (scan ping, crack pulse, wipe sweep)
- [ ] Mission result stings (success/fail)

### Milestone 7: Polish & Depth (ongoing)
- [ ] Arc 4 and 5 (Ghost and Endgame arcs)
- [ ] Specialization paths (Ghost / Architect / Brute / Social)
- [ ] Corporation world simulation (dynamic patching, market prices live)
- [ ] i18n scaffolding
- [ ] Accessibility audit
- [ ] Performance optimisation

### Milestone 8: Multiplayer (Phase 4 — after single-player complete)
- [ ] Backend server (`/apps/server`) — Node.js + WebSocket + PostgreSQL + Redis
- [ ] Persistent shared world state
- [ ] Contract competition system
- [ ] Bounty & proxy-burning PvP
- [ ] Co-op mission framework
