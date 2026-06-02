# 3. Core Gameplay Systems – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 3.1 Account Creation & Identity | ✅ Done | Handle/profile creation, localStorage persistence, save/load, profile window, tutorial overlay (9-step) |
| 3.2 Mission/Contract System | ✅ Done | 9 procedural types + 20 story missions; all types mechanically distinct; mission events wired; step guide UI added |
| 3.3 Hacking Mechanics | ✅ Done | Crack/Exploit, port scanner, log wipe, proxy bouncing, evidence planting, firewall bypasser all functional |
| 3.4 Trace/Risk System | ✅ Done | Multi-rate trace (base/alarm/IDS/admin/rival/world), TraceAmbient red vignette, alarm at 90%/97% |
| 3.5 Upgrades & Progression | ✅ Done | All HW stats affect gameplay; RAM gates concurrency; modem affects transfer; mission requirements enforced |

---

This guide details the creation of all core gameplay systems for Voidlink.

---

## 3.1. Account Creation & Identity Management
- Secure registration, login, and profile management
- Unique player IDs, avatars, and persistent profiles
- Cloud save and cross-device sync

## 3.2. Mission/Contract System

### Architecture — All Types Implemented
Each mission type plays **mechanically differently**. Full specification in [GAME_DESIGN_MASTER.md §6](GAME_DESIGN_MASTER.md).

| Mission Type | Unique Mechanic | Status |
|---|---|---|
| file_theft | Breach file_server → TRANSFER target file | ✅ Done — target file seeded on accept |
| account_deletion | Breach database → DELETE ACCOUNT; database guaranteed even on archetypes without one | ✅ Done — database node injected if missing |
| database_corruption | Breach database → CORRUPT; +IDS trace spike on execute | ✅ Done |
| network_sabotage | Breach router → SABOTAGE; 30s timed disconnect window | ✅ Done — timed escape enforced |
| evidence_planting | Breach file_server → UPLOAD fabricated file | ✅ Done — upload action, objective auto-completes |
| bounty_hunt | Explore topology; target endpoint labelled; breach to identify | ✅ Done — target node seeded on accept |
| corporate_espionage | Multi-objective intel exfil across file_server + mail_server | ✅ Done |
| counter_hacking | Intercept rival hacker via INTERCEPT action on their node | ✅ Done |
| story | Hand-authored networks, events, coda text, Arc flags | ✅ Done — 20 missions, 5 arcs, 3 endings |

### Mission Requirements
Contract cards display and enforce three requirements (cracker level, CPU speed, reputation). ACCEPT is disabled with a lock indicator if any requirement is not met. Requirements scale with difficulty tier per GAME_DESIGN_MASTER.md §6.2.

### Mission Events
`MissionEvent[]` is evaluated in the game loop for story missions:
- `trace_threshold`: fires when trace crosses the percent
- `time_elapsed`: fires at N seconds after mission start
- `node_breached`: fires when matching nodeType is breached
- `objective_complete`: fires when matching objective completes

Effects: `spawn_rival_hacker`, `raise_trace_speed`, `lock_node`, `set_flag`

### Mission Step Guide
The Hacking Interface now displays a 4-step contextual guide that always tells the player exactly what to do next based on live game state:
- **Step 1** — Breach the target node type
- **Step 2** — Execute the mission action (TRANSFER / DELETE ACCOUNT / CORRUPT / SABOTAGE / UPLOAD)
- **Step 3** — Cover your tracks (wipe all logs)
- **Step 4** — Ready to disconnect (all done)

## 3.3. Hacking Mechanics

### Tool Ecosystem — All Implemented
| Tool | Status | Notes |
|---|---|---|
| Password Cracker | ✅ Done | dictionary / exploit methods, level scaling, CPU speed affects duration |
| Port Scanner | ✅ Done | timed scan reveals services + CVEs, unlocks EXPLOIT method on matching nodes |
| Proxy (bounce) | ✅ Done | trace dampening × 0.85 per bounce, stackable to 3 |
| Log Deleter | ✅ Done | timed wipe per-node, cross-session consequence (heat flag per corp) |
| Firewall Bypasser | ✅ Done | reduces alarm rate spike when breaching firewall nodes |
| RAM concurrency | ✅ Done | simultaneous tool cap enforced by RAM slot count |
| Social Engineering | ⬜ Phase 2 | Planned — phishing on mail_server, bypasses crack entirely |
| Trace Wiper | ⬜ Phase 2 | Planned — emergency active tool, limited charges |

### Specialization Paths — All Implemented (Rank 5 Unlock)
- **GHOST**: −25% trace rate (base+alarm+IDS), +40% log wipe speed, 75% stealth disconnect
- **BRUTE**: +35% crack speed, −50% firewall alarm spike
- **SOCIAL**: +25% rewards, +50% faction standing changes, raised shop discount cap
- **ARCHITECT**: +1 RAM slot (3 concurrent tools), −15% shop prices, connections revealed on entry without scanning

## 3.4. Trace/Risk System — ✅ Fully Implemented

### Multi-Rate Architecture
Six additive components:
1. **Base rate** — always active while connected (scales with network difficulty)
2. **Alarm rate** — triggered when a firewall detects unusual traffic
3. **IDS rate** — triggered when an intrusion_detector node is breached
4. **Admin rate** — triggered when an active admin is on the network
5. **Rival rate** — triggered when a rival hacker is present (+50% effective)
6. **World event modifier** — positive or negative delta from active global events

`effectiveRate = (base + alarm + IDS + admin + rival + worldDelta) × (0.85^bounceCount)`

### Visual Feedback
- **TraceBar** in taskbar shows live rate (%/s) and level
- **TraceAmbient** overlay: inset red vignette grows from trace 30%; pulsing at 90%; critical at 97%
- **Warning banner**: "TRACE IMMINENT — DISCONNECT NOW" at 90%, "TRACE CRITICAL" at 97%
- **Audio alarm**: escalating tone synced to trace level

### Cross-Session Consequences
- Unwiped breach logs set a `heat_[corpId]` flag → next mission against that corp starts with +2%/s base rate
- Terminal warns: "PREVIOUS SESSION LOGS DETECTED — TRACE ELEVATED"
- If corporation detects breach they begin patching CVEs (3-min real-time window)

## 3.5. Upgrades & Progression — ✅ Fully Implemented

### Hardware Stats (All Affect Gameplay)
| Stat | Effect |
|---|---|
| CPU Speed | Divides crack/scan/wipe/upload duration |
| RAM Slots | Concurrent tool limit (2 default; Architect gets 3) |
| HDD Capacity | File storage cap |
| Modem Speed | File transfer speed (download/upload time) |
| Gateway Bandwidth | Affects connection quality; trace reduction modifier |

### Progression Curve
Starting credits: 500 Cr. Each tier of missions unlocks as reputation and hardware scale. The gap between current capability and desired mission is always visible on the mission card.

### Requirements Gate
Mission cards show locked state with cracker level / CPU / rep requirements. ACCEPT is disabled until all three are met.

---

*Full specification: [GAME_DESIGN_MASTER.md](GAME_DESIGN_MASTER.md)*