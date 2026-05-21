# Uplink Next Generation – Development Documentation Index

This index links every step-by-step guide for building Uplink Next Generation. All 10 guides are complete.

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
- World lore, setting (2027), and five story arcs
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

**Status:** All 10 guides complete. Codebase scaffolded and playable prototype running.

---

## Implementation Status

### Built & Working
| System | Files | Notes |
|--------|-------|-------|
| Monorepo scaffold | `pnpm-workspace.yaml`, root `package.json`, `tsconfig.base.json` | pnpm 11, TypeScript strict |
| Design tokens | `libs/ui/src/tokens/index.ts` | Colours, fonts, shadows, animation |
| Window component | `libs/ui/src/components/Window/` | Drag, focus, minimize, close, z-order |
| Terminal component | `libs/ui/src/components/Terminal/` | Output lines, live input, blinking cursor |
| TraceBar component | `libs/ui/src/components/TraceBar/` | Animated, status-coloured, reduced-motion safe |
| Button component | `libs/ui/src/components/Button/` | 4 variants, 3 sizes, loading state |
| Core types | `libs/core/src/types/` | Player, Network, Mission, Tools, World |
| Trace engine | `libs/core/src/engine/trace.ts` | Tick-based, proxy bounce multiplier |
| Crack engine | `libs/core/src/engine/cracker.ts` | Duration formula, level/CPU scaling |
| Network generator | `libs/core/src/network/generator.ts` | 7 archetypes, seeded RNG, spanning tree |
| Contract generator | `libs/core/src/missions/generator.ts` | 8 mission types, procedural briefings |
| Game store | `apps/web/src/store/gameStore.ts` | Zustand + immer; full game loop |
| Boot screen | `apps/web/src/screens/BootScreen/` | Animated startup sequence |
| Login screen | `apps/web/src/screens/LoginScreen/` | Handle input → creates player profile |
| Desktop screen | `apps/web/src/screens/DesktopScreen/` | Multi-window OS shell + game loop RAF |
| Taskbar | `apps/web/src/game/Taskbar/` | App launcher, open-window strip, trace/stats |
| Mission Board | `apps/web/src/game/MissionBoard/` | List, accept, active mission display |
| Network Map | `apps/web/src/game/NetworkMap/` | SVG node graph, click-to-select, node panel, breach/collect/objective actions |
| Hacking Interface | `apps/web/src/game/HackingInterface/` | Crack job, timed log wipe, proxy toggle, rival alert + intercept, disconnect flow |
| Welcome Terminal | `apps/web/src/game/WelcomeTerminal/` | Live command input, store log output |
| Mission Result | `apps/web/src/game/MissionResult/` | Animated success/fail overlay with rewards |
| Upgrade Shop | `apps/web/src/game/UpgradeShop/` | Hardware + software tabs, buy actions, rep lock, balance display |
| Profile Window | `apps/web/src/game/ProfileWindow/` | Identity, hardware stats, lifetime stats, installed software |
| Persistence | `apps/web/src/store/persistence.ts` | localStorage save/load v1, auto-save every 60s, continue/delete on login |
| Electron wrapper | `apps/desktop/src/` | main.js + preload.js, secure contextBridge |

### Recently Added
| Feature | Details |
|---------|---------|
| Mission types expanded | `account_deletion`, `database_corruption`, `network_sabotage` have in-network objective actions (DELETE ACCOUNT, CORRUPT DATABASE, SABOTAGE NODE); `bounty_hunt` auto-completes on entry_point breach |
| Log deletion mini-game | Timed wipe job (tier × 1.8s), blue progress bar, per-node state, terminal feedback |
| Rival hacker AI | Spawns 20-40s into mission, moves every ~6s, boosts trace +50%, rotating orange ring on NetworkMap, INTERCEPT button in HackingInterface |

### Next Up
- Port scanner service discovery (scan node → reveal services/vulnerabilities before cracking)
- Evidence planting flow (upload file to target file_server)
- Faction standings + reputation rewards per client
- Multiplayer lobby / shared mission board (Guide 07)
- News ticker with world events driven by completed missions