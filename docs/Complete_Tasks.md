# Voidlink — Complete Tasks

Append-only ledger of shipped work, newest first. Brief enough to scan, detailed enough to recognise what changed.

For unshipped work see [Next_Stage.md](./Next_Stage.md). For the timeline see [Roadmap.md](./Roadmap.md). For the master plan see [Full_Plan.md](./Full_Plan.md).

---

## 2026-06 — Pre-launch consolidation sprint

- **M14f.1 — Canary files + timestomping.** IDS-protected data nodes (`file_server`, `database`, `mail_server`) now seed canary "honeypot" files at `tier × 10%` chance. Touching a canary auto-trips: +25% trace, +3%/s alarm for 15s, persistent `heat_<corp>` flag for the next mission. Detection requires `port_scanner_stealth`, `port_scanner_v3`, or `sniffer_v2` — otherwise canaries look like ordinary files. Two new tools added: `timestomper_v1` (Chrono Stomper, 4500 Cr, 30 REP) and `timestomper_v2` (Ghost Clock, 18 000 Cr, 180 REP). Without a stomper, even a clean wipe leaves a temporal fingerprint that raises cross-session heat on the corp; with one, every wiped node is also timestomped and clean-exit truly clears the flag.
- **M14h.8 — Docs consolidation (full 5-doc model).** Every planning, reference, and QA doc absorbed into exactly five files in `docs/`: `Full_Plan.md` (master plan + every system spec + multiplayer/modding/security/launch + AI disclosure + monetisation), `Complete_Tasks.md` (this ledger), `Next_Stage.md` (forward-looking only, world-class detail), `Roadmap.md` (visual timeline), `Testing_Guide.md` (per-milestone checklists + 19-phase end-to-end playtest). Removed: GAME_GUIDE, GAME_DESIGN_MASTER, PLAYTEST_WALKTHROUGH, all DEV_GUIDE_01-10, UPLINK_NG_OVERVIEW, DEV_DOCS_INDEX, ARCHIVE_*. README + CLAUDE.md updated to the 5-doc model.
- **M14h.7 — NetworkMap cyberpunk visual rework.** UnrealBloomPass (0.55 strength), ACESFilmic tone mapping, 600-point cyan starfield, scan-grid plane 8u below the graph, edges brightened to cyan so the topology reads as a live data-link diagram. Raycaster click logic untouched.
- **M14h.6 — Encrypted email inbox + mission relay-hop gating.** New `EmailInbox` window (sidebar + reader), `inbox` save-v4 store slice, mock-PGP fingerprints, encrypted-with-cipher-grid messages, mission-accept auto-dispatches contract email, INBOX taskbar launcher. Mission `minRelayHops` scaled D1=0 → D10=9 with "Build a N-hop relay on WORLD MAP" hint.
- **M14h.5 — Mid-game rebalance + plumbing.** Trace divisor 20→28, per-hop reduction 0.7→0.65, +PROXY/-PROXY HI buttons removed (route is the only bounceCount source), `getMaxRelayHops()` centralised (caps 3/6/8/10/12), sabotage briefing reworded for router OR admin_console, banking APRs inflated (Global 12% / Pacific 22% / Cayman 6% / Zurich 15%), `notorietyPerHour` per bank, `player.notoriety` accrues from balance × hours and adds +0.10 %/s to baseRate at mission start, login save-list staggered reveal + click SFX, global world clock VST anchored at real 2026-01-01 → game 2199-01-01.
- **M14h.4 — Signup email confirmation + password reset.** 6-digit DARKNET RELAY one-time code (visible in demo build), FORGOT link in operative-connect prompt, new `updatePassword` + `findSaveByEmail` persistence helpers.
- **M14h.3 — Neon-Earth Data Globes + UX polish.** UnrealBloomPass + real continent outlines from `world-atlas/countries-110m.json` + cyan/magenta palette on both GlyphDrift background and interactive WorldMap. Tutorial auto-focuses spotlit windows. `bounce → RELAY` rename across HI/Taskbar/SystemConsole. Node colour state: yellow when scanned, green when breached. 3-pulse intruder beep on rival hacker spawn. WorldMap bloom softened to 0.55 strength so target dots don't smear.
- **M14h.2 — Layout persistence + UX hotfixes.** Save v3 schema persists `activeWindows`, `windowLastPositions`, `windowZCounter`. HACK TOOLS no longer requires an active mission. WorldMap rotate-speed scales with zoom. Window `onMove` fires on resize too.
- **M14h.1 — Sabotage rebalance + dial-up SFX.** Sabotage trace rebalance (60s base + 15s/hop, lower spike). Audio master bus + volume responsiveness. HI/Bounce-Chain auto-open on desktop. Dedicated `BounceChainWindow`. Breach-acquired bounces added to library. Richer DTMF/handshake dial-up SFX.
- **M14h — Shop expansion.** 2 new HW slots (GPU, Cooling). 3 new SW categories (Sniffer, MemScrape, Anti-Forensic). 5 tier extensions (Cracker v5, Proxy v4, etc.). 7 consumables with armed-flag effects (panic kit, zero-day pack, decoy log, false flag, rep tokens, cred pack) wired into crack speed / scan / heat / breach reveal.
- **M14g — Skill-tree Shop.** Upgrade Shop redesigned as SVG node-link graph (10 columns, prereq edges, colour-coded states, side detail panel, LIST fallback).
- **M14o — Choice missions.** `MissionChoice` + `pendingChoiceFromPhaseIndex` state, full-screen `MissionChoiceOverlay`, BLACK HALO mission with TURN-vs-BURN fork (different faction consequences + skipped phase).
- **M14n — Mission runtime events.** 2–5 procedural events per contract trigger on trace/time/breach, surface as toast banners (good/bad/neutral colours), real trace-rate modulation effects.
- **M14m — Multi-phase missions.** `MissionPhase` state machine, phase progress UI in HI, PROJECT GHOST 3-phase example (OSINT → Breach → Decoy), per-phase rewards, news echoes after disconnect.
- **M14f — Exfiltration channels.** 4 channels (Direct FTP / Encrypted Tunnel / DNS Tunneling / ICMP Exfil) with speed-vs-stealth tradeoffs + tool/spec gating, selector bar in NetworkMap. Partial (canary files + timestomping deferred to M14f.1).
- **M14e — Banking polish.** Sabotage → -15% stock drop on listed corps. MARKET CRASH world event (stocks crash, savings APR zeroed). Loan defaulting (-50 REP + news article when principal > 5× liquid).
- **M14d — UX & balance.** Mandatory log wipe + WIPE ALL button. OPEN WORLD MAP from HI. Connection-effect overlay (dial-tone + animated chain). Clickable Corp/Gov/Underground targets with TARGET INTEL window. Sabotage router injection. Rep gating rebalanced.
- **M14c — Banking expansion.** Loans. Cr↔Darkcoin trading. Equities (ARMR / ARES / INTC / GTBK). Offshore banks (Cayman + Zurich). Tabbed bank UI. Market simulation.
- **M14b — Banking foundations.** Bank window, deposits/withdrawals, savings interest.
- **M14a — Pre-alpha polish.** Settings menu (⚙) with music/SFX/UI-scale/reduce-motion/FPS toggles. Idle music with mission-active fade. Trace beep proximity system. Window position memory. In-game clock (epoch 2199-01-01). Bounce network moved to WORLD MAP globe. Neon digital globe with country outlines. Game loop perf throttle (~75% CPU drop). Mission retry on incomplete disconnect. Cracker version mapping fix. Light theme with full CSS variable system. Tutorial overhaul to 25-step spotlight (no hard blockers). Audio polish (master buses, click/tick/window-open/close/error SFX, autoplay-policy-safe resume). Accessibility (`<main>` landmarks, `@fontsource` self-hosted fonts).
- **M15 — Privilege escalation + persistent backdoors.** ESCALATE on breached nodes (requires CPU≥3 + Cracker v3+, +tier×2.5% trace). PLANT BACKDOOR after root, pre-breaches the node on future missions against the same corp via `backdoor_<corp>_<type>` flag. Traffic-sniffer partial via M14h Sniffer tools.

---

## 2026-05-28

- **M13 — Service-specific exploits + brute lockout + subnet zones.** Protocol-aware crack durations, per-service vulnerabilities. Brute-force lockout: after N failed cracks a node locks until network reset. Subnet zones Zone A / Zone B with pivot-node gating; pivots show orange when unscanned.
- **M12 — Lateral movement + credential reuse + memory scraping.** Dump credentials on breach; reuse them to skip cracks on connected nodes sharing creds. `memscrape` tool pulls in-memory creds.
- **M11 — Bounce log wipe sub-missions + hop health.** Per-hop log-status (clean / dirty / traced). Dedicated wipe sub-missions to clean dirty hops in the bounce library.

---

## 2026-05-27 — Initial pre-alpha sprint

- **XP & Level System.** Rank 1–1000 curve, XP per mission, rank thresholds, level-up notifications.
- **M01–M10 — Core hacking loop.** Boot → login → tutorial → first crack → mission → trace → upgrade loop. 9 procedural mission types. Multi-rate trace system. 3D NetworkMap (Three.js). Bounce network foundations. 3D WorldMap globe. System Console overlay. Operative Profile tabs. 4 specialisations. 7 world events. Rival hacker AI. Electron wrapper. i18n scaffold.
- **Story Arcs 1–5 (initial cut).** REVELATION (Arunmor) → UNDERGROUND (Cipher) → ARES initial encounter → NIGHTOWL freelance → VOIDLINK INTERNATIONAL meta-arc. Five endings authored (CONTAINMENT / LIBERATION / SOVEREIGNTY / ERASURE / GHOST).
- **i18n + accessibility scaffold.** `i18next`. axe-core integration. Keyboard navigation. `prefers-reduced-motion` respect.
- **Audio engine.** SFX engine. Dial-up sequence (DTMF + handshake). Scan / crack / wipe / breach / error / success effects. Trace beep with proximity scaling.

---

## 2026-04 → 2026-05 — Foundations

- **Monorepo bootstrap.** pnpm workspaces + Vite + React 18 + TS strict. `@voidlink/core` engine package extracted, no UI dependencies.
- **Three.js scaffolding.** NetworkMap + WorldMap initial cuts.
- **Zustand + Immer store.** All game state in one store, immutable updates via Immer.
- **Save/load.** Per-handle localStorage persistence with auto-save every 60s.
- **Design docs.** Initial master design + per-system dev guides (since consolidated into `Full_Plan.md`).
