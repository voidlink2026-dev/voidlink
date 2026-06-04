# Voidlink — Completed Tasks Ledger

The full record of shipped work, in reverse-chronological order. Each row links to the milestone's design detail in [NEXT_STAGE.md](./NEXT_STAGE.md). This document is **append-only** — once a milestone ships, it lives here forever.

For the visual timeline, see [ROADMAP.md](./ROADMAP.md). For unshipped work, see [NEXT_STAGE.md](./NEXT_STAGE.md).

---

## 2199-01-01 (in-game) / 2026-06 (real)

Pre-alpha feature-complete sprint. All M14* and M15 work shipped in this window.

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M14h.8** | Docs consolidation — three-doc model (COMPLETE_TASKS / NEXT_STAGE / ROADMAP), removed ARCHIVE_roadmap_v1, ARCHIVE_readme_dev_guides, DEV_DOCS_INDEX, UPLINK_NG_OVERVIEW (~30KB of stale planning), added project-root CLAUDE.md with mandatory doc-upkeep + commit-style + multiplayer-last rules, README + PLAYTEST_WALKTHROUGH pointers updated, NEXT_STAGE milestone table trimmed to unshipped-only | ✅ |
| **M14h.7** | NetworkMap cyberpunk visual rework — UnrealBloomPass (0.55 strength, 0.4 radius, 0.22 threshold), ACESFilmic tone mapping, distant starfield (600 cyan points), cyan scan-grid plane 8 units below the graph, brightened edge material so the topology reads as a live data-link diagram | ✅ |
| **M14h.6** | Encrypted email inbox — replaces the phone/contacts concept. `EmailInbox` window (sidebar + reader), `inbox` store slice persisted as save v4, `sendInboxMessage()` API, seed inbox on first login, mission-accept dispatches an ENCRYPTED contract email auto-decrypted via DECRYPT WITH KEY, mock-PGP fingerprint badges, category colour-coding, star/delete/mark-all-read. Also: mission relay-hop gating (`minRelayHops` scaled D1=0 → D10=9) with on-card "Build a N-hop relay" hint | ✅ |
| **M14h.5** | Mid-game rebalance + plumbing batch: (1) trace divisor 20→28, per-hop reduction 0.7→0.65; (2) +PROXY/-PROXY buttons removed from HI — relay-chain length on WORLD MAP is the sole bounceCount source; (3) `getMaxRelayHops()` centralised in core, hop caps raised (basic=3, v2=6, v3=8, v4=10, v5=12); (4) sabotage briefing rewritten for router OR admin_console; (5) banking APRs inflated to game-time scale (Global 12%, Pacific 22%, Cayman 6%, Zurich 15%), new `notorietyPerHour` per bank, `player.notoriety` accrues from balance × hours, applied to mission baseRate at +0.10%/s per point; (6) login save-list staggered reveal with click SFX per card; (7) global world clock — `getWorldClockMs()`/`formatWorldClock()` anchored at real 2026-01-01 → game 2199-01-01 | ✅ |
| **M14h.4** | Signup email confirmation code (6-digit DARKNET RELAY one-time pass) + password reset flow (email lookup → code → new password). New `updatePassword` + `findSaveByEmail` persistence helpers. FORGOT link in existing-operative connect prompt | ✅ |
| **M14h.3** | Neon-Earth Data Globe background AND interactive WorldMap (UnrealBloomPass + real continent outlines from world-atlas TopoJSON + cyan/magenta palette + ACESFilmic tone mapping), tutorial auto-focuses spotlit windows, bounce→RELAY rename across HI/Taskbar/SystemConsole, node colour state YELLOW when scanned / GREEN when breached, 3-pulse intruder beep on rival hacker spawn | ✅ |
| **M14h.2** | Full window-layout persistence (v3 save schema), HACK TOOLS no longer requires active mission, WorldMap rotate-speed scales with zoom, Window onMove fires on resize too | ✅ |
| **M14h.1** | Sabotage trace rebalance (60s base + 15s/hop, lower spike), audio master bus + volume responsiveness, HI/Bounce Chain auto-open on desktop, dedicated BounceChainWindow, breach-acquired bounce nodes added to library, richer DTMF/handshake dial-up SFX | ✅ |
| **M14h** | Shop expansion — 2 new HW slots (GPU, Cooling), 3 new SW categories (Sniffer, MemScrape, Anti-Forensic), 5 tier extensions, 7 consumables with armed-flag effects (panic kit, zero-day pack, decoy log, false flag, rep tokens, cred pack) wired into crack speed / scan / heat / breach reveal | ✅ |
| **M14g** | Upgrade Shop → skill-tree graph UI (SVG node-link diagram, 10 columns, prereq edges, colour-coded states, side detail panel, LIST fallback) | ✅ |
| **M14o** | Choice missions — MissionChoice + pendingChoiceFromPhaseIndex state, full-screen MissionChoiceOverlay UI, BLACK HALO mission with TURN-vs-BURN fork (different faction consequences + skipped phase) | ✅ |
| **M14n** | Mission runtime events — procedural events (2–5 per contract) triggered by trace/time/breach, surface as on-screen toast banners (good/bad/neutral severity colours), real trace-rate modulation effects | ✅ |
| **M14m** | Multi-phase missions — MissionPhase state machine, phase progress UI in HI, PROJECT GHOST 3-phase example (OSINT → Breach → Decoy), per-phase rewards, news echoes after disconnect | ✅ |
| **M14f** | Exfiltration channels — 4 channels (Direct FTP / Encrypted Tunnel / DNS Tunneling / ICMP Exfil) with speed-vs-stealth tradeoffs + tool/spec gating, selector bar in Network Map | ✅ partial |
| **M14e** | Banking polish: sabotage → stock drop (-15%), MARKET CRASH world event (stocks crash, savings APR zeroed), loan defaulting (-50 REP + news article when principal > 5× liquid) | ✅ |
| **M14d** | UX & balance: mandatory log wipe + WIPE ALL button, OPEN WORLD MAP from HI, connection effect overlay (dial-tone + animated chain), clickable Corp/Gov/Underground targets with TARGET INTEL window, sabotage router injection, rep gating rebalanced | ✅ |
| **M14c** | Banking expansion: loans, Cr↔Darkcoin trading, equities (4 stocks), offshore banks (Cayman + Zurich), tabbed bank UI, market simulation | ✅ |
| **M14b** | Banking foundations: bank window, deposits/withdrawals, savings interest | ✅ |
| **M14a** | Pre-alpha polish: settings, neon globe, idle music, in-game clock, perf throttling, tutorial overhaul, light theme, mission retry, cracker fix | ✅ |
| **M15** | Privilege escalation + persistent backdoors — ESCALATE on breached nodes (needs CPU≥3 + Cracker v3+, +tier×2.5% trace), PLANT BACKDOOR after root, pre-breaches the node on future missions against the same corp via `backdoor_<corp>_<type>` flag. Traffic sniffing partially shipped via M14h Sniffer tools | ✅ partial |

---

## 2026-05-28

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M13** | Service-specific exploits + brute lockout + subnet zones | ✅ |
| **M12** | Lateral movement + credential reuse + memory scraping | ✅ |
| **M11** | Bounce log wipe sub-missions + hop health | ✅ |

---

## 2026-05-27

| Milestone | Scope | Status |
|-----------|-------|--------|
| **XP & Level System** | Player levelling curve, XP per mission, rank thresholds | ✅ |

---

## 2026-04 → 2026-05 (Foundations + M01–M10)

The initial pre-alpha sprint that took the project from empty repo to playable hacking loop. Detail in commit history.

| Block | Scope | Status |
|-------|-------|--------|
| Foundations | pnpm workspaces + Vite + React 18 + TS strict, `@voidlink/core` engine package, Three.js scaffolding, Zustand + immer store, save/load per-handle | ✅ |
| Story Arcs 1–5 | REVELATION (Arunmor), UNDERGROUND (Cipher), ARES initial encounter, NIGHTOWL freelance, VOIDLINK INTERNATIONAL meta-arc — all 5 with branching | ✅ |
| Mechanics M01–M10 | Boot → login → tutorial → first crack → mission → trace → upgrade loop, faction system foundations, world map foundations | ✅ |
| i18n + accessibility | Full i18n scaffold, axe-core integration, keyboard navigation, reduced-motion respect | ✅ |
| Audio engine | SFX engine, dial-up sequence, scan/crack/wipe/breach/error/success effects, trace beeps with proximity scaling | ✅ |

---

## Process notes — keep this doc up to date

Every time a milestone ships:

1. Add a row at the **top** of the current month's section (or open a new month if needed)
2. Move the corresponding row out of `NEXT_STAGE.md` so that doc only ever describes unshipped work
3. Update `ROADMAP.md` Phase tables to flip 🚧/🎯 → ✅ with the date

If the workflow is interrupted, this doc is the source of truth for what was actually delivered. Reconcile NEXT_STAGE.md against it, not the other way round.
