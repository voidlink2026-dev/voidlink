# 4. Network & Simulation Engine – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 4.1 Procedural Network Generation | ✅ Done | 7 archetypes, mulberry32 seeded RNG, spanning tree + random edges, force-layout positions |
| 4.2 Realistic Protocols & Vulnerabilities | 🚧 Partial | Real CVE IDs on services, VULN badges, exploit crack method working; no active IDS behaviour, no firewall special mechanic |
| 4.3 AI-Driven Adversaries | 🚧 Partial | Rival hacker spawns, roams, boosts trace, intercept working; no corporation simulation or world AI |
| 4.4 Dynamic World Events | ⬜ Not started | `WorldState`, `Corporation`, `NewsArticle`, `WorldEvent` types fully designed — not yet running |

### Network Archetype Personality Design (To Implement)
Full specification in [GAME_DESIGN_MASTER.md §9](GAME_DESIGN_MASTER.md). Each archetype needs distinct behaviour beyond topology differences:

| Archetype | Key Characteristic | Unique Mechanic |
|---|---|---|
| `corporate_intranet` | Over-engineered, patchy | Moderate vulns, IDS 50% chance |
| `government_classified` | Redundant, security-obsessed | IDS always present, high traceSpeed, 1–2 active admins |
| `personal_gateway` | Minimal security | 3–5 nodes, forgiving trace — tutorial networks |
| `dark_web_node` | Paranoid, adversarial | Node labels hidden until scan; honeypot nodes possible |
| `cloud_infrastructure` | Ephemeral, auto-scaling | New nodes can appear mid-session; breached nodes can re-spawn |
| `legacy_mainframe` | Ancient, fragile | 1990s CVEs; modern tools inefficient but `cracker_adv` legacy exploits are trivial |
| `iot_mesh` | Enormous, flat | 15–25 nodes; breaching one reveals neighbour info (mesh leak) |

### Corporation World Simulation (To Build)
`WorldState` and `Corporation` types are ready. Build order:
1. News feed component on desktop — reads `WorldState.news`
2. Corporation patching: breached corp patches the CVE (3-day timer), raises traceSpeed
3. Market price fluctuation from world events
4. World events: global modifiers affecting trace speeds, prices, rival frequency

---

This guide covers the procedural, realistic, and AI-driven simulation backbone of Voidlink.

---

## 4.1. Procedural Network Generation
- Design algorithms for generating diverse, realistic networks (corporate, IoT, cloud, legacy)
- Parameterize for difficulty, size, and security
- Visualize networks with interactive maps and nodes

## 4.2. Realistic Protocols & Vulnerabilities
- Simulate real-world protocols (TCP/IP, SSH, HTTP/S, SMB, etc.)
- Model vulnerabilities: exploits, zero-days, misconfigurations
- Update vulnerability database dynamically

## 4.3. AI-Driven Adversaries & World Simulation
- Implement rival hacker AI with unique personalities and tactics
- Simulate evolving corporations, governments, and black markets
- Dynamic news feeds and world events that impact gameplay

## 4.4. Dynamic World Events
- Trigger events based on player actions, time, or AI
- Branching consequences and persistent world state

---

This guide ensures a deep, replayable, and emergent simulation core. Next: Multiplayer & Social Features, or request any section for immediate expansion!