# Voidlink — Roadmap

The single visual timeline of the entire project. Where we started, what's done, what's coming, and when.

For per-milestone implementation detail see [Next_Stage.md](./Next_Stage.md). For the shipped ledger see [Complete_Tasks.md](./Complete_Tasks.md). For the master design canon see [Full_Plan.md](./Full_Plan.md).

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
 │ Pre-Alpha (M01–M14h.8, M15)             │ Pre-Launch  │ Early Access ───────────────────── 1.0 ─── DLC #1 ── DLC #2
 ✅ ───────────────────────── ◀ TODAY (2026-06-04)                                                │
                                          ▲                                                       ▲
                                          2026-09 EA launch (£11.99)                          2027-06 1.0 (£14.99)
```

---

## Phase 0 — Foundations (Apr–May 2026) ✅

Monorepo bootstrap, build pipeline, initial design canon.

| What | When |
|------|------|
| pnpm workspaces + Vite + React 18 + TS strict | 2026-04 |
| `@voidlink/core` engine package extracted | 2026-04 |
| Three.js scaffolding (NetworkMap, WorldMap) | 2026-05 |
| Zustand + immer store | 2026-05 |
| Per-handle save/load | 2026-05 |
| Initial design canon (since consolidated into Full_Plan.md) | 2026-04 |

---

## Phase 1 — Pre-Alpha (May–Jun 2026) ✅ FEATURE COMPLETE

All foundational gameplay shipped. 60/60 tests passing as of M14h.8. See [Complete_Tasks.md](./Complete_Tasks.md) for the full ledger.

### Core mechanics ✅

| Milestone | What | Shipped |
|-----------|------|---------|
| M01–M10 | Boot → login → tutorial → first crack → mission → trace → upgrade loop | 2026-05-27 |
| M11 | Bounce log-wipe sub-missions + hop health | 2026-05-28 |
| M12 | Lateral movement + credential reuse + memory scraping | 2026-05-28 |
| M13 | Service-specific exploits + brute lockout + subnet zones | 2026-05-28 |
| M15 | Privilege escalation + persistent backdoors | 2026-06 |

### Polish, economy, story (M14 series) ✅

| Milestone | What | Shipped |
|-----------|------|---------|
| M14a–c | Pre-alpha polish + banking foundations + banking expansion | 2026-06 |
| M14d–e | UX & balance + banking polish (sabotage→stock, MARKET CRASH, defaults) | 2026-06 |
| M14f–g | Exfiltration channels + skill-tree Shop UI | 2026-06 |
| M14h | Shop expansion (GPU/Cooling, 3 new SW categories, 7 consumables) | 2026-06 |
| M14h.1–h.2 | Sabotage rebalance, dial-up SFX, layout persistence | 2026-06 |
| M14h.3 | Neon-Earth globes, RELAY rename, scan/breach colours, intruder beep | 2026-06 |
| M14h.4 | Signup confirmation + password reset | 2026-06 |
| M14h.5 | Trace + banking rebalance, +PROXY removal, world clock (VST) | 2026-06 |
| M14h.6 | Encrypted email inbox + mission relay-hop gating | 2026-06 |
| M14h.7 | NetworkMap cyberpunk visual rework | 2026-06 |
| M14h.8 | Docs consolidation into the 5-doc model | 2026-06 |
| M14m | Multi-phase missions (PROJECT GHOST 3-phase) | 2026-06 |
| M14n | Mission runtime events (procedural toasts) | 2026-06 |
| M14o | Choice missions (BLACK HALO TURN/BURN) | 2026-06 |

### Story arcs ✅ (5 complete)
- Arc 1 — REVELATION (Arunmor)
- Arc 2 — ARUNMOR partial
- Arc 3 — UNDERGROUND (Cipher)
- Arc 4 — GHOST (branched on Arc 1 choice)
- Arc 5 — ENDGAME with 5 endings (CONTAINMENT / LIBERATION / SOVEREIGNTY / ERASURE / GHOST)

### Deliberately deferred

- Multiplayer (mandate: LAST)
- Full music score (L1 in pre-launch)
- M14f.1, M14i, M14j, M14k, M14l (Tier 1 backlog)
- M16–M30 (Tier 2–4 backlog)

---

## Phase 2 — Pre-Launch Polish (Jun–Aug 2026) 🚧 (largely shipped — see sprint table below)

Goal: **Steam Early Access ready by 2026-09-15.** See [Next_Stage.md §1](./Next_Stage.md#1-pre-launch-sprints-l1l10) for full per-sprint detail.

### Sprint plan (~14–16 weeks)

**Rule:** L2 (tutorial rewrite) is the **last** gameplay-touching sprint. Any new mechanic, mission type, or UI surface ships *before* the tutorial is rewritten, so the tutorial only ever teaches the actually-final game.

| Sprint | Window | Block | Status |
|--------|--------|-------|--------|
| **S1**  | 2026-06-W1 → 2026-06-W3 | **L1 Audio** — 6 looping tracks + per-bus volume | 🎯 Needs composer |
| **S2**  | 2026-06-W3 → 2026-07-W2 | **Backlog mechanics close-out** (M14f.1, M14j–l, M14i) | ✅ Shipped 2026-06 |
| **S2b** | 2026-07-W2 → 2026-07-W3 | **L11 Choice Architecture & Reflection Mechanic (M14p)** — all 4 passes | ✅ Shipped 2026-06 |
| **S2c** | 2026-07-W3 → 2026-08-W1 | **M14q Lore Exposure Layer** — prologue, Codex, essays, environmental flavour, splash cards | ✅ Shipped 2026-06 |
| **S3**  | 2026-08-W1 → 2026-08-W3 | **L3 Story arcs 6–8** — DEAD DROP, THE QUIET WAR, LIGHTHOUSE | ✅ Shipped 2026-06 |
| **S3b** | added mid-sprint 2026-06 | **M14r/s/t** — diegetic onboarding rebuild, Collaborator Axis, NPC tone shifts | ✅ Shipped 2026-06 |
| **S4**  | 2026-07-W4 → 2026-08-W2 | **L4 Cloud Saves (Railway-Postgres) + L5 Achievements** | ✅ L5 shipped 2026-06 · L4 outstanding |
| **S5**  | 2026-08-W2 → 2026-08-W3 | **L6 Perf + L10 Steam Deck** — bundle code-split, Low-Quality toggle | ✅ L6 shipped 2026-06 · L10 needs hardware |
| **S6**  | 2026-06-W2 → 2026-08-W4 (parallel) | **L8 Localisation** — ES / DE / FR / RU / zh-CN / JA | 🎯 Scaffolded; needs translators |
| **S7**  | 2026-08-W3 → 2026-08-W4 | **L2 Tutorial rewrite** — Cipher's First Contract | ✅ Shipped 2026-06 |
| **S8**  | 2026-08-W4 → 2026-09-W1 | **L7 Trailer / press kit + L9 EULA + CREDITS** | ✅ L9 shipped 2026-06 · L7 outstanding |

**As of 2026-06-08: 9 of 12 sub-sprints shipped — ~14 weeks ahead of plan on the narrative/polish track.** Remaining work is mostly external dependencies: composer (L1), translators (L8), trailer & store-page production (L7), Steam Deck hardware (L10). Plus L4 Cloud Saves which is codeable and specced in DEPLOYMENT.md Phase B.

**Sprint S2b added** in response to the deep-narrative pivot of 2026-06 — the Choice Architecture & Reflection Mechanic (M14p) is now a pre-launch deliverable because the lore, ongoing-world model, and ending fan-out all depend on it.

### Risk register

| Risk | Mitigation |
|------|------------|
| Music licensing/composer slips | Start S1 first; royalty-free fallback ready |
| Story arcs underestimate writing time | Per-arc writing budget; cut scope before slipping the date |
| Localisation quality varies | Community proofreader pass after professional translation |
| Steam Deck perf below 30fps | Hard requirement — ship without Deck Verified if not met; patch in EA-S1 |
| **AI-assistance backlash** | Honest disclosure on Steam store + CREDITS.md + press kit. See [Full_Plan §22](./Full_Plan.md#22-ai-assistance-disclosure) |

---

## Phase 3 — Early Access launch (2026-09) 🎯

**Date:** 2026-09-15 (target)
**Price:** £11.99 / $14.99 / €13.49
**Promise:** +£3 on 1.0; EA buyers pay nothing extra at 1.0

Day-1 checklist:
- Store page live (8 languages)
- Trailer + 6 screenshots + 2 GIFs
- Launch discount: -10% for first week
- Press kit to indie outlets (Rock Paper Shotgun, PC Gamer, Bytesized)
- Reddit r/uplink + r/hackernews soft launch
- Discord server open
- Roadmap published on Steam Community

---

## Phase 4 — Early Access seasons (2026-09 → 2027-06) 🎯

Three ~3-month seasons. Each is a **free narrative drop** plus one **paid cosmetic**.

### EA-S1 — GHOSTNET (2026-09 → 2026-11)
- **Free:** Ghostnet darknet faction, 5 new mission types, ARG-style hidden narrative begins
- **Paid (optional):** Amber palette UI theme — £2.99
- **Backend work:** M17 (dark web foundations)

### EA-S2 — ARES (2026-12 → 2027-02)
- **Free:** Story arc 9 — Ares military complex, winter event (2 weeks)
- **Paid (optional):** Red palette + Ares boot skin — £2.99
- **Backend work:** M18 (social engineering — OSINT/phishing/vishing)

### EA-S3 — ZERO DAY (2027-03 → 2027-05)
- **Free:** Story arc 10 (final arc, resolves ARG), modding SDK + Steam Workshop integration
- **Paid (optional):** Purple palette + ARG-completist title flair — £3.99
- **Backend work:** M14i (Research tree), M19 (counter-intel)

---

## Phase 5 — 1.0 Launch (2027-06) 🎯

**Date:** 2027-06-15 (target)
**Price:** £14.99 / $19.99 / €16.99

Day-1:
- Soundtrack released as separate SKU (£4.99)
- Founder's Bundle live for 30 days only (£24.99 — base + OST + 3 themes + ASCII credit)
- Steam Deck Verified badge active
- Launch trailer (new cut emphasising story closure)
- All 8 launch languages polished
- Press review embargo lifts 24h pre-launch

---

## Phase 5b — Infrastructure (live now, scales with the game)

A parallel infrastructure track that runs alongside the gameplay sprints. Pre-existing Railway connection used.

| Phase | When | What |
|-------|------|------|
| **A — Static hosting** | Live as of 2026-06 | Railway hosts the built Vite static bundle. No backend, no DB. Players load the URL, saves stay in their browser. ~£5/month |
| **B — Cloud Saves** | Pre-EA launch (S4) | Small Node/Hono API + Postgres + magic-link auth on Railway. Replaces (or supplements) Steam Cloud for sync across devices. ~£15/month at small scale |
| **C — Multiplayer Backend** | Post-1.0, post-EA-S3 (2028+) | Full backend: WebSockets + Postgres + Redis. Persistent shared world. Contract competition. Bounty network. Co-op. **Per the "multiplayer LAST" mandate — does not start before 2028.** ~£200+/month at scale |

The Phase B schema is designed to be Phase C-compatible — the `users` and `saves` tables map cleanly to multiplayer operative records. No throwaway architecture.

---

## Phase 6 — The Ongoing World (2027-07 →) 🎯 / 💭

**Voidlink does not end at 1.0.** 1.0 is the stable launch of a world that keeps unfolding. This phase is open-ended — measured in years, not months.

### The cadence commitment

| Cadence | Type | Free / Paid | Size |
|---------|------|-------------|------|
| **Quarterly** | Darknet Drop — free narrative event | Free | 2-4h of contracts + news + one world-state change |
| **Annual** | Anniversary Event — free cosmetic + double-RP week | Free | 1 week |
| **~9 months** | Paid Chapter — major story expansion | £6.99 | 8h of authored arc + new mechanics |
| **Quarterly** | Conviction Pass — cosmetic season pass | £4.99 (optional) | Pure cosmetic, two visual tracks |

### Confirmed paid Chapters

| When | Chapter | Price | Content |
|------|---------|-------|---------|
| 2027-09 | DEEP BLACK | £6.99 | 3 new arcs, 1 new faction, ~8h |
| 2028-03 | QUANTUM SHADOW | £6.99 | 3 new arcs, ai-core breach mechanics, ~8h |
| 2028-Q4 | TBD | £6.99 | TBD |
| 2029-Q3 | TBD | £6.99 | TBD |

(Chapters slated approximately every 9 months. Slowing for quality is acceptable; disappearing is not.)

### Ending-driven seasonal content

Each player's ending choice shapes future seasonal content. The world *remembers* what you did:

- **Principled LIBERATION** → news articles cite your handle. T+2 seasons: Truth & Reconciliation contract.
- **Mercenary SOVEREIGNTY** → REVELATION keeps sending you contracts. Forever. They get stranger.
- **Mercenary ERASURE** → quarterly drops contain an anonymous email from your new bank. Someone is trying to find you.
- *(Other endings have their own ongoing threads — see [Full_Plan.md §14b.5](./Full_Plan.md#14b-player-purpose--choice-not-score) for the full set.)*

### Anti-Destiny rules (non-negotiable)

- ❌ No sunset content. Every paid Chapter remains playable forever, for everyone who bought it.
- ❌ The base game stays the base game. Forever. No "Legacy Pack" repackaging.
- ❌ Seasonal *events* are time-limited (you weren't there if you missed it). Seasonal *story* is not — it becomes optional procedural content after the season.
- ❌ No catch-up packages priced higher than the original purchase.

### World-class polish (opportunistic) 💭

- Full ARG resolution (begins EA-S1, continues across multiple post-launch seasons)
- Lock-picking-style minigame for ai_core breaches
- Steam Workshop modding SDK refinement
- Twitch integration — viewer-voted choice missions
- Procedural cross-mission consequences (sabotage → stock dip → recovery contract 24h later)
- Console ports — only after PC 1.0 stabilises
- Mobile port (React Native) — explored after console; M29 in backlog
- **Cinematic treatment** 💭 — animated shorts of the REVELATION arc resolution; faction reveal cinematics; "Voidlink Anthology" web series concept. Tracked as future opportunistic work; no schedule.

### Multiplayer — LAST 💭

Per user mandate, multiplayer is the very last system. Earliest realistic window is **post-2028-Q3**, after both story DLCs ship and the world clock infrastructure proves out via shared seasonal events. Tracked as M25–M26 in backlog. **Will not be considered until requested explicitly.**

---

## Always-on monetisation guardrails

These do not change. Ever.

✅ **Can sell:** cosmetic themes, boot animations, wallpapers, title flair, soundtrack, story DLC where everyone gets the same content, founder's bundle.

❌ **Will NEVER sell:** battle passes with mechanical rewards, loot boxes, Cr/Darkcoin/XP/REP top-ups, premium-loot missions, paywall-faster hacks, energy systems, play-time gates.

**The rule:** anything in the shop must be possible to ignore forever without missing mechanical depth.

---

## Maintenance

- Update **after every shipped milestone** — flip 🚧/🎯 → ✅, add date, move row from `Next_Stage.md` → `Complete_Tasks.md`.
- Update **when a target date moves** — note the reason inline.
- Pre-launch sprints (S1–S7) get weekly status notes from 2026-06 onwards.
