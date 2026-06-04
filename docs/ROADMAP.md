# Voidlink — Full Roadmap

Single source of truth for **where we started**, **what's done**, **what's next**, and **when**.

For per-milestone implementation detail, see [NEXT_STAGE.md](./NEXT_STAGE.md).
For the launch monetisation strategy, see [§15 of NEXT_STAGE.md](./NEXT_STAGE.md#15-steam-launch-plan).

---

## Legend

- ✅ **Shipped** — code merged, tests pass, in `main`
- 🚧 **In progress** — actively being built
- 🎯 **Planned** — has a target window
- 💭 **Future / opportunistic** — on the list, no target

---

## At a glance

```
 2026                                                            2027                                          2028
 ──────────────────────────────────────────────────────────────  ─────────────────────────────────────────────  ───────
 May─┬─Jun─┬─Jul─┬─Aug─┬─Sep─┬─Oct─┬─Nov─┬─Dec─┬─Jan─┬─Feb─┬─Mar─┬─Apr─┬─May─┬─Jun─┬─Jul─┬─Aug─┬─Sep─┬─Oct─┬─Nov─ Mar ...
 │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │
 │────│────│────│────│ Pre-Launch polish  │ Early Access ←─────────────────── 1.0 launch ──── DLC #1 ── DLC #2
 │ Pre-Alpha (M-series, M14*, M15)        │ (EA-S1 / EA-S2 / EA-S3)             │
 ✅ ────────────────────── ◀ TODAY (2026-06-04)                                  │
                                          ▲                                     ▲
                                          2026-09 EA launch (£11.99)           2027-06 1.0 (£14.99)
```

---

## Phase 0 — Foundations (Apr–May 2026) ✅

Monorepo bootstrap, build pipeline, design docs.

| What | When |
|------|------|
| pnpm workspaces + Vite + React 18 + TS strict | 2026-04 |
| `@voidlink/core` engine package extracted | 2026-04 |
| Initial design master (`GAME_DESIGN_MASTER.md`) | 2026-04 |
| Dev guides (10 documents covering setup → testing) | 2026-04 |
| Three.js scaffolding (network map + world map) | 2026-05 |
| Zustand + immer store | 2026-05 |
| Save/load + per-handle persistence | 2026-05 |

---

## Phase 1 — Pre-Alpha (May–Jun 2026) ✅ FEATURE COMPLETE

All foundational gameplay shipped. 60/60 tests passing as of M14h.6.

### Core mechanics ✅

| Milestone | What | Shipped |
|-----------|------|---------|
| M01–M10 | Boot → login → tutorial → first crack → mission → trace → upgrade loop | 2026-05-27 |
| M11 | Bounce log wipe + hop health | 2026-05-28 |
| M12 | Lateral movement + credential reuse + memory scraping | 2026-05-28 |
| M13 | Service-specific exploits + brute lockout + subnet zones | 2026-05-28 |

### Polish + economy (M14 series) ✅

| Milestone | What | Shipped |
|-----------|------|---------|
| M14a | Pre-alpha polish (settings, neon globe, idle music, in-game clock, perf throttle, tutorial overhaul) | 2199-01-01 |
| M14b | Banking foundations (deposits/withdrawals/savings) | 2199-01-01 |
| M14c | Banking expansion (loans, Cr↔Darkcoin, 4 stocks, offshore banks) | 2199-01-01 |
| M14d | UX & balance (log wipe, connection effect, intel windows, sabotage router) | 2199-01-01 |
| M14e | Sabotage→stock drop, MARKET CRASH event, loan defaulting | 2199-01-01 |
| M14f | Exfiltration channels (4 modes, speed-vs-stealth) | 2199-01-01 |
| M14g | Upgrade Shop → skill-tree SVG graph UI | 2199-01-01 |
| M14h | Shop expansion (GPU/Cooling, Sniffer/MemScrape/Anti-Forensic, tier extensions, 7 consumables) | 2199-01-01 |
| M14h.1–.2 | Sabotage trace rebalance, audio master bus, dedicated Bounce/Relay window, layout persistence | 2199-01-01 |
| M14h.3 | Neon-Earth globes (bloom + continents), tutorial auto-focus, bounce→RELAY rename, scan/breach colours, intruder beep | 2199-01-01 |
| M14h.4 | Signup email confirmation + password reset | 2199-01-01 |
| M14h.5 | Trace+banking rebalance, +PROXY removal, world clock (VST) | 2199-01-01 |
| M14h.6 | Encrypted email inbox + mission relay-hop gating | 2199-01-01 |

### Narrative + advanced mechanics ✅

| Milestone | What | Shipped |
|-----------|------|---------|
| M14m | Multi-phase missions (PROJECT GHOST 3-phase) | 2199-01-01 |
| M14n | Mission runtime events (procedural toasts) | 2199-01-01 |
| M14o | Choice missions (BLACK HALO TURN/BURN fork) | 2199-01-01 |
| M15 | Privilege escalation + persistent backdoors | 2199-01-01 (partial) |

### Story arcs ✅ (5 complete)

- Arc 1 — REVELATION (Arunmor, choice ending)
- Arc 2 — UNDERGROUND (Cipher introduction)
- Arc 3 — ARES initial encounter
- Arc 4 — NIGHTOWL freelance
- Arc 5 — VOIDLINK INTERNATIONAL meta-arc

### What was deliberately deferred

- Multiplayer (user mandate: LAST)
- Real audio music layer (planned for pre-launch L1)
- M14i (Research tree), M14j (Loadouts), M14k (Implants), M14l (Vehicle gateways) — backlog
- M16–M29 — Tier 2–4 backlog in NEXT_STAGE.md

---

## Phase 2 — Pre-Launch Polish (Jun–Aug 2026) 🚧

Goal: **Steam Early Access ready by 2026-09**. See [§15.1 NEXT_STAGE.md](./NEXT_STAGE.md#151-pre-launch--what-must-ship-before-early-access).

### Sprint plan (~12 weeks of focused work)

| Sprint | Weeks | Block | Output |
|--------|-------|-------|--------|
| **S1** | 2026-06-W1 → 2026-06-W3 | **L1 Audio** | 6 looping tracks (boot/desktop/mission/network/victory/fail), per-bus volume |
| **S2** | 2026-06-W3 → 2026-07-W1 | **L2 Tutorial rewrite** | Cipher's First Contract — guided story mission replaces 25-step overlay |
| **S3** | 2026-07-W1 → 2026-08-W1 | **L3 Story arcs 6–8** | 3 new arcs, ~6–7h of content; pushes total runtime to ~15h |
| **S4** | 2026-07-W3 → 2026-08-W1 | **L4 Steam Cloud + L5 Achievements** | Steamworks integration, 30–50 achievements wired to existing flag system |
| **S5** | 2026-08-W1 → 2026-08-W2 | **L6 Perf + L10 Steam Deck** | "Low quality" toggle, controller mapping, 1280×800 readability |
| **S6** | 2026-06-W2 → 2026-08-W3 (parallel) | **L8 Localisation** | ES/DE/FR/RU/zh-CN/JA — ~6 000 words each |
| **S7** | 2026-08-W2 → 2026-08-W4 | **L7 Trailer + L9 EULA** | 60–90s trailer, 6 hero screenshots, store page copy, legal templates |

### Risk register

| Risk | Mitigation |
|------|------------|
| Music licensing/composer slips | Start S1 first; have a backup royalty-free fallback |
| Story arcs underestimate writing time | Each arc has a writing-budget; cut scope before slipping the date |
| Localisation quality varies | Community proofreader pass after professional translation |
| Steam Deck perf below 30fps | Hard requirement — if not met, ship without Deck Verified badge and fix in EA-S1 |
| **AI-assistance backlash** | Honest disclosure on Steam store + CREDITS.md + press kit. Lead with the human-developer story. See [§16 NEXT_STAGE.md](./NEXT_STAGE.md#16-ai-assistance-disclosure--pre-launch-cleanup-plan) for the full cleanup checklist (D1–D6) |

---

## Phase 3 — Early Access launch (2026-09) 🎯

**Date: 2026-09-15 (target)**
**Price: £11.99 / $14.99 / €13.49**
**Promise: +£3 on 1.0, EA buyers pay nothing extra**

Day-1 checklist:
- Store page live (8 languages)
- Trailer + 6 screenshots + 2 GIFs
- Launch discount: -10% for first week
- Press kit to indie outlets (Rock Paper Shotgun, PC Gamer, Bytesized)
- Reddit r/uplink + r/hackernews soft launch
- Discord server open
- Roadmap published on Steam community

---

## Phase 4 — Early Access seasons (2026-09 → 2027-06)

Three ~3-month seasons. Each is a **free narrative drop** plus one **paid cosmetic** (purely optional).

### EA-S1 — GHOSTNET (2026-09 → 2026-11) 🎯

- **Free:** Ghostnet darknet faction, 5 new mission types, ARG-style hidden narrative begins
- **Paid (optional):** Amber palette UI theme — £2.99
- **Backend work:** M17 (dark web layer foundations)

### EA-S2 — ARES (2026-12 → 2027-02) 🎯

- **Free:** Story arc 9 — Ares military complex, winter event (2 weeks)
- **Paid (optional):** Red palette + Ares boot skin — £2.99
- **Backend work:** M18 (social engineering — OSINT/phishing/vishing)

### EA-S3 — ZERO DAY (2027-03 → 2027-05) 🎯

- **Free:** Story arc 10 (final arc resolves ARG), modding SDK opens, Steam Workshop integration
- **Paid (optional):** Purple palette + ARG-completist title flair — £3.99
- **Backend work:** M14i (Research tree), M19 (counter-intel)

---

## Phase 5 — 1.0 Launch (2027-06) 🎯

**Date: 2027-06-15 (target)**
**Price: £14.99 / $19.99 / €16.99**

Day-1:
- Soundtrack released as separate SKU (£4.99)
- Founder's Bundle live for 30 days only (£24.99 — base + OST + 3 themes + ASCII credit)
- Steam Deck Verified badge active
- Launch trailer (new cut emphasising story closure)
- All 8 official languages polished
- Press review embargo lifts 24h pre-launch

---

## Phase 6 — Post-1.0 (2027-07 onwards)

### Confirmed paid DLC

| When | DLC | Type | Price | Content |
|------|-----|------|-------|---------|
| 2027-09 | DEEP BLACK | Story DLC | £6.99 | 3 new arcs, 1 new faction, ~8h |
| 2028-03 | QUANTUM SHADOW | Story DLC | £6.99 | 3 new arcs, ai-core breach mechanics, ~8h |

### Ongoing — Seasonal Darknet Drops

**Every quarter, forever.** One-off contracts + news + small narrative event. Free. Optional season cosmetic skin £2.99.

### World-class polish (opportunistic)

- Full ARG resolution (begins EA-S1, resolves EA-S3)
- Lock-picking-style minigame for ai_core breaches
- Steam Workshop modding SDK refinement
- Twitch integration — viewer-voted choice missions
- Procedural cross-mission consequences (sabotage → stock dip → recovery contract appears 24h later)
- Console ports — only after PC 1.0 stabilises 💭
- Mobile port (React Native) — explored after console, M29 in backlog 💭

### Multiplayer — LAST 💭

Per user mandate, multiplayer is the very last system. Earliest realistic window is **post 2028-Q3**, after both story DLCs ship and the world clock infrastructure proves out via shared seasonal events. Tracked as M25–M26 in backlog. **Will not be considered until requested explicitly.**

---

## Always-on monetisation guardrails

These do not change. Ever.

✅ **Can sell:** cosmetic themes, boot animations, wallpapers, title flair, soundtrack, story DLC where everyone gets the same content, founder's bundle.

❌ **Will never sell:** battle passes with mechanical rewards, loot boxes, Cr/Darkcoin/XP/REP top-ups, premium-loot missions, paywall-faster hacks, energy systems, play-time gates.

**The rule:** anything in the shop must be possible to ignore forever without missing mechanical depth.

---

## Tracking this document

- Update **after every shipped milestone** — move row to ✅, add date.
- Update **when a target date moves** — note the reason inline.
- Pre-launch sprints (S1–S7) get weekly status notes from 2026-06 onwards.
- One version of truth lives here; NEXT_STAGE.md holds the implementation detail.
