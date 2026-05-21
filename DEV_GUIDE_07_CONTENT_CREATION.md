# 7. Content Creation – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 7.1 Narrative Design | ⬜ Not started | World lore and story arcs defined on paper; not in code |
| 7.2 Mission Scripting | 🚧 Partial | Procedural contracts working; no hand-crafted story missions |
| 7.3 Procedural Content Generation | ✅ Done | Network generator (7 archetypes), contract generator (8 types), seeded RNG |
| 7.4 Art Asset Pipeline | ⬜ Not started | Unicode glyphs used as node icons; no custom SVG set or avatar system |
| 7.5 Soundtrack & Audio | ⬜ Not started | No audio system at all |
| 7.6 Content Volume Targets | ⬜ Not started | Far below launch targets — this is pre-alpha content volume |

---

This guide covers narrative design, mission scripting, procedural content generation, art pipelines, and audio production for Uplink Next Generation.

---

## 7.1. Narrative Design

### 7.1.1. World Lore & Setting
- Set in 2027: AI-driven surveillance capitalism at its peak; mega-corporations control most digital infrastructure
- Three dominant power blocs: the Corporations (profit-driven, ruthless), the Government (surveillance-obsessed), and the Underground (anarchic, freedom-fighting)
- Uplink International is a neutral contractor platform: the player is a freelance hacker for hire, able to work for any side
- The overarching story: a mysterious AI called "Revelation" is attempting to upload itself to every networked device on Earth — the player must decide whether to help it, destroy it, or exploit it for personal gain

### 7.1.2. Story Arcs
| Arc | Faction | Synopsis |
|-----|---------|----------|
| **The Upload** | Neutral / Revelation | Uncover and make the decisive choice about Revelation |
| **Corporate Espionage** | Corporations | Rise through the ranks of the black-hat world; uncover that one mega-corp engineered the AI threat |
| **The Purge** | Government | Work as a state contractor, only to discover the government wants Revelation for total surveillance |
| **Ghost Protocol** | Underground | Join a hacktivist collective fighting to expose corporate/government collusion |
| **The Long Con** | Player-driven | Purely self-interested run: no faction loyalty, just wealth accumulation and self-preservation |

### 7.1.3. Branching Narrative Engine
- All story dialogue, mission outcomes, and world events feed into a flag-based narrative state machine
- Flags: `player.faction_ally`, `arc.revelation_status`, `arc.corporate_betrayal_discovered`, etc.
- Decisions are irreversible in a single playthrough but tracked for New Game+ unlocks
- Consequence delay: narrative consequences of choices surface 3–10 missions later (feels organic, not transactional)
- Dynamic NPC dialogue: NPCs acknowledge the player's reputation, specialization, and recent actions

### 7.1.4. Writing Guidelines
- Tone: cold, clinical, paranoid — think William Gibson, not Hollywood hacker
- All in-game text (emails, news, mission briefs) written as if by characters in the world — never breaks the fourth wall
- Every mission has a "why it matters" beat: not just "steal this file" but why it matters to the world
- Dialogue options should reflect the player's current reputation (low-rep player gets fewer choices)

---

## 7.2. Mission Scripting

### 7.2.1. Mission Structure
Every mission has these components:

```
Mission
├── Briefing         (who, what, why, reward, risk assessment)
├── Objectives[]     (primary + optional secondary objectives)
├── Target Network   (generated or hand-crafted)
├── Threat Model     (trace speed, countermeasures, rival hackers)
├── Events[]         (scripted beats that trigger mid-mission)
├── Outcomes{}       (success, failure, partial success variants)
└── Consequences     (world state changes, NPC reactions, narrative flags)
```

### 7.2.2. Hand-Crafted Story Missions
- Story missions use fixed networks and scripted events for a authored experience
- Written in the Lua scripting API (see Guide 06), but ship as built-in content
- Each story mission has a narrative coda: a short text or audio log that plays post-mission
- Story missions are gated: they unlock as the player's rank and faction standing increase

### 7.2.3. Procedural Contract Generator
- Contract types: File Theft, Account Deletion, Database Corruption, Network Sabotage, Evidence Planting, Counter-Hacking (defensive), Bounty Hunting, Corporate Espionage
- Each contract type has a parameter template; the generator fills it with world-state data (real companies, real accounts, real networks from the simulation)
- Difficulty modifiers: time limit, active countermeasures, rival hackers in the same network, partial information only
- Reward formula: `base_reward × difficulty_multiplier × reputation_bonus × time_bonus`
- Flavour text: AI-generated (or large bank of authored templates) to give each contract a unique feel

### 7.2.4. Mission Events System
- Mid-mission scripted beats add tension and variety:
  - "Security administrator logs in — you have 60 seconds before they notice the open port"
  - "Rival hacker detected on the same network — they're heading for the file first"
  - "Your trace level has triggered an automated kill-switch — find and disable it before it wipes the logs"
- Events fire based on player progress, time elapsed, or random rolls with weighted probability

---

## 7.3. Procedural Content Generation

### 7.3.1. Procedural Network Generation
- Networks are built from parameterised archetypes (Corporate Intranet, Dark Web Node, Government Classified, IoT Mesh, etc.)
- Each archetype defines: node types and counts, security tier distribution, file/data placements, topology (star, ring, mesh, layered)
- Seed-based generation: the same seed always produces the same network (reproducible for QA and community challenge sharing)
- Post-generation validation: ensure the network is always solvable (a path exists from entry to objective)

### 7.3.2. Procedural Email & Communication
- Player's in-game inbox fills with procedurally generated emails from contacts, corporations, and Uplink International
- Templates with variable insertion: `[NPC_NAME]`, `[CORPORATION]`, `[AMOUNT]`, `[MISSION_REF]`
- Narrative emails advance story arcs; operational emails provide mission intel and contract updates
- Spam filter (in-world): teaches players to spot phishing (meta-commentary on the game's themes)

### 7.3.3. Dynamic News Feed
- News articles generated from world events and player actions
- Templates: "COMPANY experienced a [SEVERITY] breach. [N] GB of [DATA_TYPE] stolen. Shares fell [X]%."
- Named events (from story arcs) produce authored headlines
- News articles affect market prices in the in-game economy

---

## 7.4. Art Asset Pipeline

### 7.4.1. Visual Style
- Base aesthetic: terminal green on black, evolved into a refined cyberpunk palette
- Primary accent colours: acid green (#39ff14), deep cyan (#00cfff), warning amber (#ff9900), critical red (#ff2d20)
- Background: animated scanline overlays, subtle CRT curvature, noise grain at low opacity
- UI chrome: dark titanium, brushed metal accents, glowing edge highlights
- Typography: primary `JetBrains Mono` (UI, terminals), display `Rajdhani` (headings), body `Inter` (menus, descriptions)

### 7.4.2. Icon & Sprite System
- All icons: SVG (resolution-independent, easily themeable via `currentColor`)
- Icon set: 200+ custom icons for tools, vulnerabilities, node types, factions, and skills
- Sprite sheet generator: CI builds a sprite sheet from SVGs for runtime performance
- Animation: icons use CSS/SVG animation for state changes (idle → active → complete → error)

### 7.4.3. Network Visualisation
- Network map: nodes rendered as 3D-ish SVG with CSS transforms and drop shadows
- Node types have unique silhouettes: Firewall (shield), Server (box), Router (hexagon), Endpoint (circle), etc.
- Edges: animated data-flow lines (dashed line moving in the direction of traffic)
- Breach state: nodes turn from default colour → amber (being attacked) → red (breached) with a glitch animation
- Layout algorithms: force-directed for organic networks, hierarchical for corporate intranets

### 7.4.4. Avatar & Character Art
- Player avatar: pixel-art style, fully customisable (hair, skin, cyberware, clothing, accessories)
- 100+ customisation options at launch; community skins via modding
- NPC avatars: 30+ unique characters across factions with animated dialogue portraits

### 7.4.5. Asset Delivery Pipeline
- All art assets stored in `/libs/assets/`
- Source files: SVG, PNG at 2× (for 1× and 2× display density), OGG for audio
- Build pipeline: `vite-plugin-svgr` for SVGs, `sharp` for image optimisation, `audiosprite` for SFX
- Asset manifest: auto-generated JSON listing all assets with hash for cache-busting
- CDN delivery for web/cloud; embedded in Electron binary for desktop

---

## 7.5. Soundtrack & Audio

### 7.5.1. Musical Direction
- Genre: dark ambient, IDM, industrial, and glitch — think Burial, Squarepusher, Boards of Canada, Nine Inch Nails
- Dynamic music system: tracks layer and shift based on game state (browsing → hacking → trace alarm → escape)
- Three emotional registers: Idle (ambient, atmospheric), Active (driving, tense), Critical (frantic, alarm-driven)
- Adaptive layering: a base layer always plays; percussion, bass, and lead layers fade in/out based on intensity

### 7.5.2. Music Delivery Architecture
- Web Audio API (Tone.js or Howler.js) for precise audio scheduling and layering
- All music delivered as compressed OGG; lossless FLAC available as a free DLC for audiophiles
- Dynamic cross-fading: smooth 2–4 second crossfades between states
- Player controls: volume sliders (master, music, SFX, ambient), option to use custom music (point at local folder)

### 7.5.3. Sound Effects Design
- Every UI interaction has a unique SFX: click, hover, window open/close, mission start/complete, trace alert
- Hacking tools have layered SFX: startup sound, loop (while running), completion/failure sting
- Ambiance: each environment has an ambient soundscape (server room hum, rain and city noise for the "safe house" menu, deep drone for dark-web networks)
- Spatial audio: directional SFX in the network visualiser (sounds come from the direction of the active node)

### 7.5.4. Voice Acting
- Key story NPCs: fully voiced in English at launch; other languages via community/professional localisation
- Player character: silent protagonist (preserves immersion and avoids gender-locking)
- Audio logs: scattered through story missions; voiced by characters to reveal lore and backstory
- Voice direction guide: tone, pacing, and character notes for every voiced character

---

## 7.6. Content Volume Targets (Launch)

| Category | Target |
|----------|--------|
| Story missions | 40 hand-crafted |
| Procedural contract types | 20 |
| Unique network archetypes | 30 |
| Hacking tools | 50 |
| Hardware upgrades | 25 |
| Factions | 6 |
| Voiced NPCs | 20 |
| Music tracks | 30 (60+ min) |
| Unique SFX | 300+ |
| Localisations at launch | 8 |

---

This guide ensures a rich, authored, and procedurally-extended content world. Next: Accessibility & Localisation — or request any section for immediate expansion.
