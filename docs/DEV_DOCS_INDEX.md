# Voidlink – Development Documentation Index

**Last updated:** 2199-01-01 · **Current shipping milestone:** M14b (banking foundations)

This index links every step-by-step guide for building Voidlink, plus the live shipping/planning docs.

**Read these first:**
- 📋 [NEXT_STAGE.md](NEXT_STAGE.md) — what's shipped, what's next, milestone roadmap
- 📖 [GAME_GUIDE.md](GAME_GUIDE.md) — player-facing guide to all mechanics
- 🎨 [GAME_DESIGN_MASTER.md](GAME_DESIGN_MASTER.md) — design principles, system specs
- 🔍 [UPLINK_NG_OVERVIEW.md](UPLINK_NG_OVERVIEW.md) — pre-alpha summary, what's built
- ✅ [TESTING_GUIDE.md](TESTING_GUIDE.md) — manual QA checklists (run after each milestone)

**Dev guides** (`DEV_GUIDE_01` → `DEV_GUIDE_10` below) are stable architectural references — not updated per-milestone.

---

## [1. Project Setup & Tooling](DEV_GUIDE_01_PROJECT_SETUP.md)
- Environment setup (Node.js, TypeScript, React, WebAssembly, Electron/Capacitor)
- Repository structure & conventions (monorepo with pnpm workspaces)
- CI/CD pipeline configuration
- Coding standards, linting, and security baseline
- Issue tracking & project management

## [2. UI/UX Foundation](DEV_GUIDE_02_UI_UX_FOUNDATION.md)
- Design system & style guide (cyberpunk aesthetic, CSS custom properties)
- Window manager & multi-window UI (drag, snap, minimize, maximize)
- Responsive layouts & accessibility
- Animation & VFX framework (Framer Motion / GSAP, reduced-motion support)
- Theming & customization (dark, high-contrast, colorblind, dyslexia-friendly)

## [3. Core Gameplay Systems](DEV_GUIDE_03_CORE_GAMEPLAY.md)
- Account creation & identity management
- Mission/contract system (procedural + hand-crafted)
- Hacking mechanics (network scanning, cracking, file ops, log deletion)
- Trace/risk system with escalating countermeasures
- Upgrades & progression (hardware, software, skill trees)
- Reputation, economy, and meta-progression

## [4. Network & Simulation Engine](DEV_GUIDE_04_NETWORK_SIM_ENGINE.md)
- Procedural network generation (corporate, IoT, cloud, legacy, dark web)
- Realistic protocols & vulnerabilities
- AI-driven adversaries & world simulation
- Dynamic world events & news feeds

## [5. Multiplayer & Social Features](DEV_GUIDE_05_MULTIPLAYER_SOCIAL.md)
- Persistent shared world (server-authoritative, regional shards)
- PvP contracts, bounty system, and faction wars
- Co-op missions with role-based objectives
- Matchmaking, lobbies, leaderboards, and tournaments
- In-game chat, communities, moderation, and mentorship programme
- Community content browser & curation

## [6. Modding & Extensibility](DEV_GUIDE_06_MODDING_EXTENSIBILITY.md)
- Lua scripting API (missions, tools, networks, UI, world events)
- Sandboxed runtime with resource budgets
- Mod package format (.uplinkmod) and manifest spec
- UI skin system (CSS variable overrides + asset replacement)
- Distribution: in-game browser, Steam Workshop, web mod portal
- Developer SDK: VS Code extension, CLI, hot-reload dev server

## [7. Content Creation](DEV_GUIDE_07_CONTENT_CREATION.md)
- World lore, setting (2199), and five story arcs
- Branching narrative engine (flag-based state machine)
- Mission scripting structure and the procedural contract generator
- Procedural network, email, and news feed generation
- Art asset pipeline (SVG icons, network visualisation, avatar system)
- Soundtrack direction (dark ambient/IDM), dynamic music layering, SFX design
- Launch content volume targets

## [8. Accessibility & Localisation](DEV_GUIDE_08_ACCESSIBILITY_LOCALISATION.md)
- WCAG 2.2 AA/AAA visual, auditory, motor, and cognitive accessibility
- Screen reader support (NVDA, JAWS, VoiceOver, TalkBack) + ARIA architecture
- Full keyboard navigation, remappable controls, input assistance
- Localisation pipeline: react-i18next, Lokalise TMS, 8 languages at launch
- RTL support, text expansion handling, cultural localisation
- Automated accessibility testing (axe-core in CI)

## [9. Security, Privacy & Compliance](DEV_GUIDE_09_SECURITY_PRIVACY_COMPLIANCE.md)
- Secure Development Lifecycle: SAST, dependency scanning, pen testing
- Authentication (OAuth 2.0 + OIDC), session management, MFA/passkeys
- Server-authoritative anti-cheat + ML behavioural analysis
- Mod sandboxing and code scanning
- Privacy-first data minimisation and player privacy controls
- GDPR, CCPA, COPPA compliance; platform certifications (Steam, macOS, Microsoft)
- Infrastructure hardening, secrets management, incident response

## [10. Testing, QA & Launch](DEV_GUIDE_10_TESTING_QA_LAUNCH.md)
- Testing pyramid: Vitest unit → Supertest integration → Playwright E2E
- Performance (k6, Lighthouse CI), accessibility (axe-playwright), security (OWASP ZAP) automation
- Manual exploratory testing, platform matrix, regression sign-off
- Community testing: closed alpha (500 users) → open beta (50K users) → creator preview
- Full launch checklist (technical, content, store, community)
- Bug severity triage (P0–P4), hotfix policy, post-launch patch cadence
- Success KPIs and privacy-first analytics stack

---

**Status:** Pre-alpha — currently on M14b (banking foundations shipped). Next: M14c (banking expansion).

**Quick links:** [Game Guide](GAME_GUIDE.md) · [Next Stage](NEXT_STAGE.md) · [Design Master](GAME_DESIGN_MASTER.md) · [Overview](UPLINK_NG_OVERVIEW.md) · [Testing Guide](TESTING_GUIDE.md)

---

## Implementation Status — Pre-Alpha Feature Complete

### Core Engine & UI
| System | Files | Status |
|--------|-------|--------|
| Monorepo scaffold | `pnpm-workspace.yaml`, `tsconfig.base.json` | ✅ |
| Design tokens | `libs/ui/src/tokens/index.ts` | ✅ |
| Window component | `libs/ui/src/components/Window/` | ✅ Drag (title-bar only), resize (all 8 edges/corners), focus, minimize, close, z-order, scroll |
| Terminal component | `libs/ui/src/components/Terminal/` | ✅ Live input, blinking cursor |
| TraceBar component | `libs/ui/src/components/TraceBar/` | ✅ Animated, role="meter", reduced-motion |
| Button component | `libs/ui/src/components/Button/` | ✅ 4 variants, aria-busy |
| Core types | `libs/core/src/types/` | ✅ Player, Network, Mission, Tools, World |
| Unit tests | `libs/core/src/**/*.test.ts` | ✅ 60 tests, 100% pass |

### Game Loop & State
| System | Files | Status |
|--------|-------|--------|
| Game store | `apps/web/src/store/gameStore.ts` | ✅ Zustand + immer, full game loop; missionResult: success/fail/abandoned |
| Persistence | `apps/web/src/store/persistence.ts` | ✅ localStorage, auto-save 60s |
| Boot / Login / Desktop screens | `apps/web/src/screens/` | ✅ Full flow |
| Taskbar | `apps/web/src/game/Taskbar/` | ✅ Launcher, windows, world events |
| Welcome Terminal | `apps/web/src/game/WelcomeTerminal/` | ✅ |
| New player tutorial | `apps/web/src/game/Tutorial/` | ✅ 8-step overlay, pip progress, action-gated steps (polls game state, auto-advances) |
| Electron wrapper | `apps/desktop/src/` | ✅ contextBridge, secure IPC |

### Hacking Systems
| System | Files | Status |
|--------|-------|--------|
| Trace engine | `libs/core/src/engine/trace.ts` | ✅ Rate-based: base/alarm/IDS/admin/rival/world rates |
| Crack engine | `libs/core/src/engine/cracker.ts` | ✅ Duration formula, exploit/dictionary methods |
| Network generator | `libs/core/src/network/generator.ts` | ✅ 7 archetypes, seeded RNG |
| Contract generator | `libs/core/src/missions/generator.ts` | ✅ 9 mission types, procedural briefings, db injection |
| Network Map | `apps/web/src/game/NetworkMap/` | ✅ Three.js 3D, node labels (sprites), target pulsing cyan, breached nodes rotate, lazy-loaded |
| Hacking Interface | `apps/web/src/game/HackingInterface/` | ✅ Scan, Crack/Exploit, Wipe, Proxy, RAM slots, 4-step mission guide |
| Mission Board | `apps/web/src/game/MissionBoard/` | ✅ Requirements gates, story badge |
| Mission Result | `apps/web/src/game/MissionResult/` | ✅ Rewards, coda, Arc 1 key choice; 3 states: success (green) / abandoned (amber) / traced (red) |
| Upgrade Shop | `apps/web/src/game/UpgradeShop/` | ✅ HW + SW tabs, rep lock, event discount |
| Profile Window | `apps/web/src/game/ProfileWindow/` | ✅ Identity, HW, stats, software, factions; scrollbar-gutter fix |
| New player tutorial | `apps/web/src/game/Tutorial/` | ✅ 9-step overlay (was 8), pip progress, action-gated |
| TraceAmbient | `apps/web/src/components/TraceAmbient/` | ✅ Red vignette scales with trace; pulses at 90%/97%; critical banner |
| CRT Overlay | `apps/web/src/components/CRTOverlay/` | ✅ WebGL post-process scanlines, reads trace via window.__voidlinkStore |
| DataRain | `apps/web/src/components/DataRain/` | ✅ Canvas matrix rain on desktop layer |

### Mechanics (All Implemented)
| Mechanic | Status |
|----------|--------|
| Trace system (multi-rate: base/alarm/IDS/admin/rival/world) | ✅ |
| TraceAmbient red vignette (30%→pulse at 90%→critical at 97%) | ✅ |
| CRTOverlay (WebGL scanlines, reads store via window.__voidlinkStore) | ✅ |
| DataRain (canvas matrix rain on desktop) | ✅ |
| Mission requirements gates | ✅ |
| Mission event wiring (in-mission narrative) | ✅ |
| Mission step guide (4-step contextual UI in HackingInterface) | ✅ |
| Database node injection for account_deletion/database_corruption | ✅ |
| creditsEarned / creditsSpent stats | ✅ |
| Evidence planting (upload mechanic) | ✅ |
| Network sabotage (timed escape) | ✅ |
| Bounty hunt (target node seeded on accept) | ✅ |
| Multi-objective structure | ✅ |
| RAM slots (concurrent tools limit) | ✅ |
| Modem speed (file transfer speed) | ✅ |
| Firewall bypasser (firewall spike reduction) | ✅ |
| News feed (procedural per-mission-type + world event + authored) | ✅ |
| Log wipe cross-session consequence (heat flag per corp) | ✅ |
| Corporation patching (3-min real-time window) | ✅ |
| Faction standing (4 tracked + The Nameless, score bars) | ✅ |
| World events (7 authored events, taskbar pills) | ✅ |
| Rival hacker AI (spawn, move, intercept) | ✅ |
| Port scanner (CVE reveal, EXPLOIT method, faster than dictionary) | ✅ |
| Specialization paths (Ghost/Brute/Social/Architect — Rank 5) | ✅ |
| Arc 1 key choice (upload/destroy/sell — permanent) | ✅ |
| Audio system (Web Audio API, procedural synthesis, trace alarm) | ✅ |
| i18n scaffolding (react-i18next, en translations) | ✅ |
| Accessibility (axe-core, ARIA, focus management) | ✅ |
| Abandoned vs Traced mission result distinction | ✅ amber / red overlays |
| Interactive tutorial (9-step, action-gated, polls game state) | ✅ |
| Ctrl+scroll desktop zoom (40%–200%, windowLayer scale) | ✅ |
| Window layout reset (⊞ button cascades all open windows) | ✅ |
| Window resize — all 8 edges/corners, motionValue position | ✅ |
| Scrollbar gutter (scrollbar-gutter: stable, no overlap on any window) | ✅ |
| Three.js NetworkMap (lazy-loaded, imperative, OrbitControls) | ✅ |
| 3D node labels (CanvasTexture sprites), target pulse, breach rotation | ✅ |

### Story Content
| Arc | Missions | Status |
|-----|----------|--------|
| Arc 1: The Revelation | 3 missions (arc01–arc03) | ✅ Unlocks key choice |
| Arc 2: The Arunmor Arc | 5 missions (arc2_01–arc2_05) | ✅ |
| Arc 3: The Underground Arc | 4 missions (arc3_01–arc3_04) | ✅ |
| Arc 4: The Ghost Arc | 3 missions (arc4_01–arc4_03) | ✅ |
| Arc 5: The Endgame | 5 missions (arc5_01–arc5_03c) | ✅ Three endings: Infiltrator / Phantom / Compromised |

### Milestones Completed
| Milestone | Focus | Status |
|-----------|-------|--------|
| M1–M10 | Core loop, mission variety, story arcs, audio, i18n/a11y, 3D, atmosphere | ✅ Shipped 2026-05-26 |
| M11 | Bounce log wipe sub-missions + hop health | ✅ Shipped 2026-05-28 |
| M12 | Lateral movement + credential reuse + memory scraping | ✅ Shipped 2026-05-28 |
| M13 | Service-specific exploits + brute lockout + subnet zones (Zone A/B + pivot gate) | ✅ Shipped 2026-05-28 |
| M14a | Pre-alpha polish: settings, neon globe, idle music, in-game clock, tutorial overhaul, light theme, perf throttling, mission retry, cracker fix, window memory | ✅ Shipped 2199-01-01 |
| M14b | Banking foundations: bank window, deposits/withdrawals, compound savings interest | ✅ Shipped 2199-01-01 |
| **M14c** | **Banking expansion: loans, currency trading, equities, offshore accounts** | ⬜ Next (NEXT_STAGE §7.0a) |
| M14d | Exfiltration channels + canary files + timestomping | ⬜ Tier 1 |
| M15 | Privilege escalation + persistent backdoors + traffic sniffing | ⬜ Tier 1 |
| M16+ | Dark web, social engineering, advanced missions, multiplayer, post-endgame arcs | ⬜ See [NEXT_STAGE.md §13](NEXT_STAGE.md#13-milestone-priority-table) |

For the full prioritised roadmap of M14c → M32, see the milestone table in [NEXT_STAGE.md §13](NEXT_STAGE.md#13-milestone-priority-table).