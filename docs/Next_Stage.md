# Voidlink — Next Stage

Forward-looking only. Every item here is unshipped work, scoped in **world-class detail** so any contributor can pick it up and execute without further design. When an item ships, its row **moves out of this file** into [Complete_Tasks.md](./Complete_Tasks.md).

For the timeline view see [Roadmap.md](./Roadmap.md). For the master design canon see [Full_Plan.md](./Full_Plan.md). For QA checklists see [Testing_Guide.md](./Testing_Guide.md).

**Current focus: Pre-Launch sprints L1–L10** (Steam Early Access target 2026-09-15).

### Sprint ordering rule

**L2 (Tutorial rewrite) ships LAST among gameplay-affecting work.** Any new mechanic, mission type, or UI surface that the player needs to learn must land before the tutorial is rewritten — otherwise the tutorial teaches yesterday's game. Audio (L1), Steam Cloud (L4), achievements (L5), perf (L6), localisation (L8), trailer (L7), EULA (L9), and Steam Deck (L10) all *can* happen alongside; **L2 happens last in the queue, locked only when no further mechanics are due to ship before EA**.

---

## Table of Contents

1. [Pre-Launch Sprints (L1–L10)](#1-pre-launch-sprints-l1l10)
1.b [Polish & Stand-Out Sprints (P1–P10, T1–T10, M1–M7)](#1b--polish--stand-out-sprints-promoted-from-ideasmd)
2. [Backlog — Tier 1 (small, additive, pre-EA-friendly)](#2-backlog--tier-1-small-additive-pre-ea-friendly)
3. [Backlog — Tier 2 (EA-season content)](#3-backlog--tier-2-ea-season-content)
4. [Backlog — Tier 3 (post-1.0 / DLC)](#4-backlog--tier-3-post-10--dlc)
5. [Backlog — Tier 4 (after PC 1.0 stabilises)](#5-backlog--tier-4-after-pc-10-stabilises)
6. [Multiplayer (LAST)](#6-multiplayer-last)

---

## 1. Pre-Launch Sprints (L1–L10)

These are launch-blockers. Order is the recommended sequence; some run in parallel. Effort estimates assume one focused developer.

### L1 — Soundtrack + ambient music layer 🎯
**Window:** 2026-06-W1 → 2026-06-W3 (3 weeks)
**Effort:** 3 weeks — licensing/contracting + engine wire-up
**Status:** Not started

**Scope.** Replace the single idle-music loop with a full 6-track adaptive score:
1. **boot.ogg** — 2:00 looped, sparse synth pad + distant glitch ticks. Plays from BIOS screen through login.
2. **desktop.ogg** — 5:00 looped, ambient cyberpunk pad with subtle modulation. Plays whenever the player is on the desktop with no active mission.
3. **mission_active.ogg** — 4:00 looped, layered low pulse + analog warmth. Plays during a connected mission, trace < 60%.
4. **mission_critical.ogg** — 3:00 looped, the previous track's percussion layer plus added arpeggiated tension. Auto-crossfade in when trace ≥ 60%, crossfade back out when trace ≤ 50% (hysteresis).
5. **victory.ogg** — 0:30 one-shot, plays on SECURE DISCONNECT + reward overlay.
6. **fail.ogg** — 0:30 one-shot, plays on TRACED / mission fail.

**Tech.**
- Add `MusicEngine` module separate from `AudioEngine`. Loop crossfade via two `<audio>` elements that ping-pong.
- Per-bus volume sliders already exist in Settings — wire each track to the music bus.
- Adaptive switching driven by `traceState.level` crossings + game-state transitions.
- All tracks: 44.1 kHz, OGG Vorbis q5 + M4A AAC fallback for Safari. Zero-cross spliced for click-free loops.
- Total budget: ≤ 25 MB additional asset weight.

**Procurement.** Either:
- Contract a composer (PocketGeek, Pixelpump, etc. — £1.5–2.5k for the package); OR
- Royalty-free package from Pond5/AudioJungle (£300–600) as the backup if the contractor slips.

**Acceptance criteria.**
- All 6 tracks integrated and audible at their intended moments
- Crossfade between mission/critical is inaudible (no pops, no double-bass overlap)
- Settings → music master + per-track-bus volume works
- Tracks pause when tab hides (perf)
- Save survives mid-track and resumes seamlessly

---

---

### L2 — Tutorial rewrite: "Cipher's First Contract" 🎯
**Window:** 2026-08-W2 → 2026-08-W3 (deliberately LAST among gameplay-touching sprints)
**Effort:** 2 weeks
**Status:** Deferred until all gameplay/mechanic work is complete
**Why last:** The tutorial must teach the *final* game — any mechanic shipped after L2 would invalidate the tutorial. L2 unlocks only when no further mechanic/mission/UI change is queued before EA.

**Scope.** Replace the 25-step soft-spotlight overlay with a 10–12-minute first-mission story experience that teaches every core mechanic organically. Inspired by *Hitman 2*'s tutorial and *Half-Life: Alyx*'s opening.

**Beats:**
1. **Inbox seeds an unread email from CIPHER** (`category: contact`, encrypted). Player decrypts it. CIPHER explains: they're vouching for the player to Voidlink International. To get the contract activated, the player needs to complete one supervised job.
2. **CIPHER walks them through the desktop** — short, character-flavoured terminal messages narrate. "Open MISSION BOARD. You'll see one contract there. Mine." Spotlight follows naturally.
3. **First contract: FILE THEFT @ Universal Microsystems** — 4-node network, no IDS, deliberately forgiving. CIPHER comments live as the player progresses ("nice scan", "you've got 30 seconds — finish the crack").
4. **First failure is recoverable** — if the player times out, CIPHER says "that one's on me, I picked too tight a window. Try again." (Mission re-arms.)
5. **Wipe + disconnect** — CIPHER teaches the wipe-then-disconnect order.
6. **Reward arrives in inbox** as a `mission` email from VoidLink Dispatch, confirming the operative is activated. CIPHER's last message: "Welcome to the deck. You're on your own now."

**Tech.**
- New `TutorialMission` type extending `StoryMission` with phases that wait on player actions instead of NEXT clicks
- `CipherComms` overlay component (small bottom-right terminal-style chat window) — emits one line per player action
- Hooks into existing `inbox` slice for the email beats
- Disable trace tick during the very first crack only (so a first-time player who reads slowly doesn't get traced before they understand)
- Old 25-step `TutorialOverlay` component remains as the fallback "review the basics" launcher (from Settings → Help)

**Acceptance criteria.**
- Brand-new operative reaches MISSION COMPLETE without ever consulting external help
- Cipher's lines are characterful, never generic ("good luck operative")
- Inbox emails persist after tutorial — they're part of the canonical save
- Re-running the tutorial from Settings works without breaking save state

---

---

### L4 — Steam Cloud saves 🎯
**Window:** 2026-07-W3 → 2026-08-W1 (1 week)
**Effort:** 1 week
**Status:** Not started

**Scope.** Bridge the existing per-handle localStorage save model into Steam's cloud sync.

**Tech.**
- Steamworks SDK integration via `steamworks.js` (Electron) — Electron build only initially; web build skipped
- `persistence.ts` gains a `syncTarget: 'local' | 'cloud'` flag
- Save write path: write local + (if cloud) write to Steam Cloud via `SteamRemoteStorage`
- Save read path: prefer cloud if both exist + cloud is newer; conflict UI if both newer than each other
- Migration: existing localStorage saves auto-uploaded on first cloud-enabled boot
- Settings → "Steam Cloud" toggle with conflict-resolution policy (newer wins / always ask)

**Acceptance criteria.**
- Save on Machine A → load on Machine B → continuity preserved (player, missions, networks, inbox, world events)
- Cloud quota usage < 1 MB per save
- Offline mode degrades gracefully (saves locally, syncs on next online boot)
- Conflict UI is honest ("local has 12 more missions; cloud has 8 more missions; pick one")

---

### L5.1 — Save Integrity & Steam Achievement Trust 🚧
**Window:** added 2026-06 in response to the pre-launch audit. ~3 days.
**Status:** In progress — added after the user flagged that single-player saves are trivially editable and that achievements unlocked by JSON-editing would devalue Steam achievements for honest players.

**Scope.** Voidlink's commitment to fairness (no pay-to-win, ever) extends to *earned* outcomes.

1. **HMAC-signed local saves.** Append a hex `_integrity` field containing `HMAC-SHA256(saveBody, BUILD_SECRET)`. On load, recompute. Tampered saves load with a one-time warning *"This save appears modified. Steam achievements have been disabled for this character."* — keep playing, no public unlock-side-effects.
2. **Recompute-on-unlock for Steam.** When `evaluateAchievements()` returns a new id, the future Steamworks SDK call is gated behind a *second* check that recomputes `ACHIEVEMENTS.find(a => a.id === id).check(player)` against current player state. Forged flags don't fire on Steam.
3. **Cloud-save validation (lands with L4).** Server-side sanity checks on uploaded saves: credit balance vs `stats.creditsEarned`; achievement flags whose `check()` fails get stripped; faction standings within range; `notoriety` within `[-5, +10]`. Failed saves open read-only.
4. **No DRM theatre.** No always-online, no kernel-level anti-cheat, no Denuvo. Protecting earned outcomes, not gating gameplay.

**Tech.**
- `libs/core/src/engine/saveIntegrity.ts` — pure `signSave` / `verifySave`. Web Crypto for HMAC.
- `BUILD_SECRET` injected at build time via `vite.config.ts` env.
- `apps/web/src/store/persistence.ts` — sign on write, verify on load. On verify-fail set `activeFlags.save_tampered_at`.
- `apps/web/src/store/gameStore.ts` — achievement-unlock loop respects `save_tampered_at`; flag is written locally but not queued for Steam.

**Acceptance criteria.**
- Clean save loads silently; tampered save loads with warning + flag
- Forging `achievement_collaborator_ending` in JSON does NOT enter the Steam unlock queue
- Tests: sign+verify round-trip; verify-fail on mutated body; gate-recompute matches catalogue
- Warning is single, dismissable, non-blocking

---

### L7 — Trailer + 6 screenshots + EULA + press kit 🎯
**Window:** 2026-08-W2 → 2026-08-W4 (1 week)
**Effort:** 1 week
**Status:** Not started

**Scope.** Everything Steam requires to fill in the store page.

**Trailer (60–90s):**
1. (0–5s) cold open: black screen, terminal cursor blinks once, "VOIDLINK BIOS v2.1.0 — © 2199" appears
2. (5–15s) boot → login → "Welcome back, CIPHER" (or similar handle) → desktop
3. (15–30s) mission accept → dial-up connection animation → first crack
4. (30–45s) network map highlights: zoom on a node, breach, trace bar climbs
5. (45–55s) WorldMap orbit, relay chain building, intel windows opening
6. (55–70s) story choice overlay flashes (BLACK HALO TURN/BURN)
7. (70–85s) montage: bank window, news feed, inbox, an achievement pop
8. (85–90s) logo + tagline + EA release date

Music: track from L1 mission-active set, brief tease only.

**Screenshots:**
1. Hero: full desktop with mission active, multiple windows open
2. NetworkMap mid-mission, trace at 50%
3. WorldMap with 8-hop relay chain
4. Story choice overlay (BLACK HALO)
5. Encrypted inbox with CIPHER's first email
6. Bank window with stocks tab open

**EULA / Privacy notice:** template-based, drafted from a standard indie EULA. Privacy notice covers Steam Cloud usage + Workshop (when active).

**Press kit:** zip containing high-res logo, key art, 8 screenshots, GIFs, fact sheet, dev bio + photo, AI disclosure paragraph (per [Full_Plan §22](./Full_Plan.md#22-ai-assistance-disclosure)).

**Acceptance criteria.**
- Trailer cuts cleanly, music levels balanced (-14 LUFS broadcast standard)
- Screenshots are PNG, ≥ 1920×1080
- Press kit zips to < 50 MB
- EULA reviewed for completeness (no IP claims overreach)

---

### L8 — Localisation (top 6) 🎯
**Window:** 2026-06-W2 → 2026-08-W3 (parallel, 4 weeks active work)
**Effort:** ~6 000 source words × 6 languages
**Status:** i18n scaffold ready; strings ~80% extracted

**Target languages:** Spanish (es), German (de), French (fr), Russian (ru), Simplified Chinese (zh-CN), Japanese (ja).

**Tech.**
- Existing `i18next` scaffold in `apps/web/src/i18n/`
- Audit pass to extract any remaining hard-coded strings
- Glossary doc (`/i18n/glossary.md`) defining canonical translations for:
  - Game-specific terms: RELAY CHAIN, NOTORIETY, TRACE, REVELATION, VST, DARKNET, OPERATIVE
  - Faction names: VOIDLINK INTERNATIONAL, ARUNMOR CORP, THE UNDERGROUND
  - Story-character handles stay untranslated (CIPHER, NIGHTOWL_22 — they're aliases)
- Professional translation: budget £0.10/word × 6 000 × 6 = £3 600
- Community proofreader pass after professional — list of volunteer proofreaders curated from Discord

**Acceptance criteria.**
- All 6 languages render at every screen without overflow/truncation
- Tutorial works end-to-end in each language
- Story missions readable in each language
- Special characters render correctly (zh-CN, ja need different font stack — likely `Noto Sans CJK`)

---

### L10 — Steam Deck verification 🎯
**Window:** 2026-08-W4 (1 week)
**Effort:** 1 week
**Status:** Not started

**Scope.** Hit all 5 Steam Deck Verified criteria.

1. **Input** — full controller support. Map: A=primary click, B=back, X=context menu, Y=focus next window, RB=launcher cycle, LB=settings, sticks=cursor + scroll. On-screen keyboard for text inputs.
2. **Display** — readable at 1280×800 default. UI scale defaults to 110% on Deck-detected platform. No text smaller than 12pt rendered.
3. **Seamlessness** — no platform-mismatch warnings. Steam Input bindings published.
4. **System support** — Proton compatibility verified (Electron build); native Linux build via electron-builder.
5. **Default settings** — Low Quality auto-detected on Deck (L6 toggle).

**Tech.**
- Steam Input mapping JSON published
- `usePlatformDetection()` hook returns `'deck' | 'desktop' | 'web'`
- Deck-only UI tweaks: bigger buttons in tutorial spotlight, larger touch hit areas

**Acceptance criteria.**
- Deck Verified badge granted at submission
- 30fps minimum sustained on Deck at Low Quality
- All windows readable handheld

---

## 1.b — Polish & Stand-Out Sprints (promoted from IDEAS.md)

These are scoped sprint stubs derived from `IDEAS.md`. Marker `💭` = proposed but not yet committed. Flip to `🎯` once locked in. Items split across three tracks: **P** (gameplay polish), **T** (technical polish), **M** (monetisation/marketing). The build plan is now fully here; `IDEAS.md` remains as the open-questions decision log.

For voice cast briefs, music tooling, and trailer workflow, see [`PRODUCTION.md`](../PRODUCTION.md) at repo root.

### P1 — Operative Signature ✅ SHIPPED 2026-06
33-entry catalogue in [`operativeSignature.ts`](../libs/core/src/data/operativeSignature.ts), rendered in Profile under the operative handle. Top-down priority: dual-trait combos → Arc 8 → Arc 7 → Arc 6 → Collaborator axis → Arc 1 → other traits → pattern buckets → mid-career neutral → default. Visible only in Profile. 12 tests.

---

### P2 — Operative Diary ✅ SHIPPED 2026-06
44-entry catalogue in [`diaryEntries.ts`](../libs/core/src/data/diaryEntries.ts). One-shot triggers via `diary_<id>` flag. New `DiaryWindow` opens from taskbar; cyan pulsing unread badge on the launcher when new entries land. Renders newest-first with VST timestamps. 12 tests.

---

### P3 — End-of-arc Wallpaper Shift 💭
**Effort:** ~1 hour. **Window:** any.

After each arc resolution the desktop background subtly changes — different city silhouette, different ambient tint, different glyph in the corner. Players notice on second arc; signals "the world is responding to me."

**Tech.** 8 wallpaper variants (one per arc). `DesktopScreen` reads which arcs have resolution flags set and picks the *latest* unlocked. CSS background-image swap. No new assets needed if I produce wallpapers in FL Studio's spectrum view (joke; actually needs real wallpaper art — see PRODUCTION.md for commissioning).

---

### P4 — CRT / Scanline Visual Mode ✅ SHIPPED 2026-06
CSS-only overlay (no WebGL). Scanlines via repeating-linear-gradient + subtle vignette + slow phosphor sweep keyframe + 0.5px text-shadow chromatic aberration ghost. Toggle in Settings. Zero perf impact when off.

---

### P5 — Death Recap 💭
**Effort:** ~3 hours. **Window:** any.

When trace hits 100% and the mission fails, a 15-second post-mortem overlay shows the last 5 actions the player took, with timestamps and the trace impact of each:

```
T-00:14  CRACKED node n4 (Tier 3) — trace 64% → 79%
T-00:08  SCANNED node n5            — trace 79% → 82%
T-00:03  delayed disconnect          — trace 82% → 100% TRACED
```

Educational and punishing. Builds trust that the simulation is fair.

**Tech.** New action-log ring buffer (last 10 actions) on `s.traceState`. Renders on mission fail.

---

### P6 — Difficulty Modes 💭
**Effort:** ~4 hours. **Window:** any pre-EA. Real community legs.

Three new toggles available at character creation (in addition to default Standard):

- **Hardcore** — one save slot, no save-scumming, perma-death on TRACED. Achievement: "Operative who survived."
- **Sandbox** — no trace, all missions unlocked, no story progression. For streamers and builders.
- **Speedrun** — timer visible, leaderboard-ready when L4 cloud saves land. Pauses on inbox / settings.

**Tech.** New `difficulty` field on `PlayerProfile`. Game systems respect it. Hardcore mode disables `saveGame()` during active missions; on TRACED, the save is deleted and a memorial entry is written to a global Hall of Falls.

**Acceptance.** Each mode is playable end-to-end without breaking story progression.

---

### P7 — Ambient World Drip 💭
**Effort:** ~4 hours of writing + ~30 min wire-up. **Window:** any.

Non-gameplay news headlines and inbox messages drip into the world even without player action. Makes the world feel lived-in between contracts. Examples:

- News: *"Reykjavík weather warnings issued for Westfjords — minor coastal flooding expected."*
- Inbox (sys.ops): *"Scheduled maintenance — relay infrastructure briefly degraded between 02:00 and 02:45 VST. Apologies for any inconvenience."*
- News op-ed: *"Mei Lin defends Arunmor's research ethics in rare public interview."*

**Tech.** New cron-style ambient event scheduler. Picks from a pool of ~30 ambient items weighted by recency and world-state.

---

### P8 — Inbox PGP Footer ✅ SHIPPED 2026-06
Renders on every decrypted encrypted message: *"── PGP fingerprint confirmed — message integrity verified by Internic routing layer ──"*. Tiny dashed border-top, dim cyan italic, user-select disabled (it's chrome, not content).

---

### P9 — Reflection Replay ✅ SHIPPED 2026-06
New `replayReflection(id)` store action bypasses the once-only `triggerReflection` gate. Settings panel renders a "REFLECTIONS — N UNLOCKED" list of every scene the player has unlocked (filtered by `activeFlags.reflection_<id>`). Empty-state reads "NO REFLECTIONS UNLOCKED YET".

---

### P10 — Branch Replay (Save Slot Branching) 💭
**Effort:** ~3 hours. **Window:** pre-EA polish.

Opt-in: before any major story-arc choice, the game asks *"Create a backup save slot before this choice? You can return here to explore the other branch."* If yes, save a snapshot keyed to the choice. Profile menu lists branch points; player can return to any.

A new flag `bond_grey` could (or could not) stamp on use — argue either way. Probably *don't* stamp; let it stay clean and useful for completionists.

**Tech.** Snapshot-based; reuses existing save serialisation + integrity signing (L5.1). New `branchSaves: {[choiceId]: SaveData}[]` on player or in a parallel localStorage key.

---

### T1 — Save Inspector Tool 💭
**Effort:** ~1 hour. **Window:** any. Dev quality-of-life.

A hidden `Ctrl+Shift+I` panel that dumps current save state as readable JSON. For your own debugging in the wild.

---

### T2 — PWA Manifest + Service Worker 💭
**Effort:** ~3 hours. **Window:** post-L4 cloud saves.

Makes the web build installable as a desktop app on any platform supporting PWAs (Chrome, Edge, Safari 17+). Enables offline play for the web build. Pairs with the Privacy Notice promise of "no internet required for single-player."

**Tech.** Standard PWA manifest + service worker caching strategy. Workbox or vanilla Cache API. The Phase A Railway static-host already serves HTTPS.

---

### T3 — Telemetry-Free In-Game Feedback Button 💭
**Effort:** ~1 hour. **Window:** any.

Settings → "Send Feedback" opens a `mailto:` link prefilled with save *metadata* only (handle, rank, arc progress, achievement count). Never save body, never email body, never auto-send. Player chooses to send. Matches the Privacy Notice promise.

---

### T4 — GitHub Issue Templates 💭
**Effort:** ~30 min. **Window:** any.

`.github/ISSUE_TEMPLATE/` with `bug.yml` and `feature.yml`. Players who want to file a proper ticket get guided.

---

### T5 — Save Format Migration Tests 💭
**Effort:** ~2 hours. **Window:** any pre-EA.

Snapshot saves at v3, v4, v5; assert that the migration runner handles each. Catch regressions before v6 ships.

---

### T6 — Three.js Tree-Shake 💭
**Effort:** ~3 hours. **Window:** post-L1, pre-EA.

Three.js is currently 524 KB raw because we import the umbrella `three` module. Switching to per-module imports (`from 'three/src/cameras/PerspectiveCamera.js'` etc.) and a tree-shaking-friendly Vite config could cut to 250-300 KB.

---

### T7 — Lazy-Load i18n until non-EN locale chosen 💭
**Effort:** ~30 min. **Window:** alongside L8 localisation.

Currently the 57 KB i18n chunk loads eagerly even though only EN is wired. Defer the i18n init until the language switcher is touched.

---

### T8 — Lazy-Load Profile / Settings / Codex windows 💭
**Effort:** ~2 hours. **Window:** post-EA acceptable.

Trim main bundle further by lazy-loading these heavy windows on first open. ~50-100 KB savings.

---

### T9 — Steam Deck Controller Input Layer 💭
**Effort:** ~6 hours. **Window:** L10 verification.

Controller-friendly default focus order on every window. D-pad navigation through Mission Board cards, tool tabs, inventory. Sticks for cursor when needed (Network Map / World Map). Critical for Deck Verified.

---

### T10 — Accessibility Audit Pass 💭
**Effort:** ~2 hours. **Window:** pre-EA.

Verify all overlays announce correctly to screen readers; check focus traps in modals; verify keyboard-only mode is genuinely complete; verify reduced-motion suppresses every animation.

---

### M1 — Founders Edition SKU 💭
**Effort:** ~2 days inc. art commissions + Steam setup. **Window:** pre-EA (must exist on launch day).

A premium £19.99 SKU available for the first 30 days of EA. Bundles:
- The EA game (£11.99 base)
- Soundtrack DLC when L1 lands (£4.99)
- Lore book / art book PDF (£9.99)
- **Handle scrolled past in a randomised credits list in every future build** — sentimental, free, *huge* signal
- 1-week early access to seasonal drops (EA-S1, EA-S2, EA-S3)

After 30 days the components sell separately at standard prices. **Recommended top monetisation move.**

**Tech.** Steam DLC entry; capsule art; copywriting for store description; in-game "Founders" panel in Credits screen reading from a shipped JSON list of Founders handles.

---

### M2 — Steam Next Fest Demo 💭
**Effort:** ~1 week to build + cut. **Window:** June or October 2026 Next Fest.

Free demo cut at the Arc 1 choice. ~1 hour playthrough. Demo save does NOT carry forward — purchase is separate. **Best wishlist tool on Steam.**

**Tech.** Demo build variant with story progression locked at Arc 1 climax + special "WISHLIST TO CONTINUE" overlay on attempting to proceed. Telemetry-free per the privacy promise.

**Decision pending:** June or October fest.

---

### M3 — Streamer & Press Key Programme 💭
**Effort:** ~3 days outreach + Steam key generation. **Window:** 2 weeks before EA.

First **100 verified streamers / press reviewers** get free keys through a closed application form. Builds the launch-day media spike. NOT free-for-everyone — that devalues and trains the wrong behaviour.

**Tech.** Google Form for applications + manual review against streamer/press credentials + Steam key dispensing.

---

### M4 — "Founders 100" Hybrid 💭
**Effort:** ~30 min in Steam dashboard. **Window:** launch week only.

First 100 *paying* customers (verified by purchase timestamp) get the £19.99 Founders Edition for £9.99 *and* their handle gets named (not randomised) in a permanent Founders Hall panel in the Credits screen.

Caps at ~£1k in forgone revenue; gains ~100 superfans + powerful social proof.

---

### M5 — Story DLC Pipeline (already on roadmap as EA seasons + post-1.0 DLC) 🎯
Already planned in §3 (EA-S1 GHOSTNET, EA-S2 ARES, EA-S3 ZERO DAY) and §4 (post-1.0 DLC #1 / DLC #2). Listed here so the monetisation track is visible in one place.

---

### M6 — Cosmetic DLC Catalogue 💭
**Effort:** rolling, 6-12 months. **Window:** post-EA.

Per `CLAUDE.md` rule — *cosmetics + story DLC only*. Suggested catalogue:

| DLC | Price | Notes |
|---|---|---|
| Wallpaper Pack 1 (6 backgrounds) | £1.99 | The cyberpunk-desktop crowd will buy multiple |
| Terminal Theme Pack 1 (5 themes) | £1.99 | Amber retro, monochrome green CRT, etc. |
| Custom Palette Editor | £2.99 | Standalone, build-your-own colour scheme |
| Boot Sequence Override | £1.99 | Alternative BIOS animation |
| Operative Avatar Pack (8 portraits) | £0.99 | |
| Glyph DLC (10 motif glyphs) | £0.99 | For splash card customisation |
| Soundtrack DLC | £4.99 | Sold separately after Founders window |
| Lore Book PDF | £9.99 | Sold separately after Founders window |

**Tech.** Each is a Steam DLC entry + a flag the game reads to unlock the cosmetic option in Settings.

---

### M7 — Voluntary Tip Jar 💭
**Effort:** ~1 hour. **Window:** post-EA.

Steam supporter pack tiers (£0.99 / £4.99 / £9.99) purely for people who want to give more. No gameplay impact. Single small recognition note in the in-game Credits scroll.

---

## 2. Backlog — Tier 1 (small, additive, pre-EA-friendly)

These are nice-to-haves that can slot into idle weeks during the L1–L10 sprint or land as small EA-S1 polish.

### Faction Territory Map (future visual layer)
**Effort:** 3 sessions (depends on M14i / M17 / M18 narrative scaffolding)

Make the WorldMap continent outlines reflect live faction control / activity:
- Each country (110m TopoJSON polygon) is owned by one of the 5 factions OR neutral
- Country tint shifts based on:
  - Current owner (cyan = Voidlink Intl, gold = Arunmor, magenta = Underground, red = Government, purple = REVELATION, dim grey = neutral)
  - Activity intensity over the last in-game week (brighter = more contracts originating there)
  - Player heat in the region (red flicker overlay if `heat_<corp>` flags are active for corps headquartered there)
- As the globe rotates, the player can read at-a-glance "where the action is right now"
- Faction ownership shifts dynamically: completing missions for a faction biases nearby countries toward that faction's tint over time
- Persists in `WorldState.factionTerritories: Record<countryISO, factionId>`
- Multiplayer-ready: when MMO lands, real player activity from all operatives feeds the activity intensity

Until this is built, the WorldMap uses static cyan continent outlines (M14h.9 bloom-tuning kept the visual quiet for clarity).

---

## 3. Backlog — Tier 2 (EA-season content)

Maps to EA-S1, S2, S3 cadence in [Roadmap.md](./Roadmap.md).

### EA-S1 — GHOSTNET (target 2026-09 → 2026-11)
**Effort:** ~6 sessions

Free narrative drop alongside EA launch.
- **Ghostnet darknet faction** — new 5th faction, anonymous collective of black-hat artists
- **5 new mission types:**
  - Crypto extraction (steal a private key without breaking the node — uses memscrape tool)
  - Service interruption (DDoS-style — keep a node offline for 30s without breaching)
  - Identity theft (clone a credential without leaving a wipeable trace)
  - Forensic frame (plant evidence with timestomp authentic-looking)
  - Heat redirect (use a false flag consumable mid-mission to point trace at a rival)
- **ARG-style hidden narrative begins** — encrypted messages from "the cartographer" appear in random newsfeeds, decoder hints in inbox. Resolves in EA-S3.
- **Backend:** M17 (Dark Web Layer foundations) — dark_web_node archetype gets per-faction routing, custom CVEs

### EA-S2 — ARES (target 2026-12 → 2027-02)
**Effort:** ~7 sessions

Story arc 9 + winter event.
- **Arc 9: ARES** — 5 missions infiltrating the Ares Defence Group military complex. New gov-aligned faction. Unique mechanics: SCADA breaches, satellite-layer hops.
- **Winter event (2 weeks)** — WorldMap gets snow/ice ambient overlay, news feed runs ARES-themed headlines, +20% rewards on ARES contracts
- **Backend:** M18 (Social Engineering) — phishing/vishing/OSINT mechanics

### EA-S3 — ZERO DAY (target 2027-03 → 2027-05)
**Effort:** ~8 sessions

Arc 10 + modding SDK + ARG resolution.
- **Arc 10: ZERO DAY** — final arc, resolves the ARG. Player decodes the cartographer's identity (it's REVELATION, or fragment of REVELATION, depending on Arc 1 + ARG progress)
- **Modding SDK opens** — Lua API published, Workshop integration goes live, first official mod templates released
- **Backend:** M14i (Research tree if not yet shipped), M19 (Counter-intel)

---

## 4. Backlog — Tier 3 (post-1.0 / DLC)

### M16 — Terminal Expanded Commands + Lua Scripting Layer
**Effort:** 4 sessions

Currently the in-game terminal is read-only logs. Expand:
- 40+ real commands: `nmap`, `crack`, `wipe`, `connect`, `disconnect`, `inbox read N`, `inbox decrypt N`, `bank deposit N`, `notoriety`, etc.
- Lua scripting layer — player can write small scripts in `/scripts/` folder that automate sequences. Sandboxed (same model as future mod sandbox).
- Tab completion + command history (`HISTSIZE=500`)
- Optional: stream commands over WebSocket to allow remote-control (for the Twitch integration in §5)

### M17 — Dark Web Layer
**Effort:** 5 sessions

Full dark web architecture:
- New "DARKNET" window accessible via Tor-style proxy
- Black market: 30+ unique tools / consumables / implants sold only in darknet
- Anonymous contracts: 5–10 contract types only available darknet (assassination by code, identity erasure, etc.)
- Dark-web reputation: separate from Voidlink International reputation
- Onion-routing simulation: darknet missions require routing through dark_web_node archetype hops

### M18 — Social Engineering: Full Suite
**Effort:** 5 sessions

- **OSINT** — research a person via partial public data, build a profile that unlocks targeted attacks
- **Phishing** — craft emails, send via captured mail_server, success rate based on profile depth + target paranoia
- **Vishing** — voice-call simulation, conversation-tree minigame
- **Insider recruitment** — turn an NPC employee, gain persistent access to one corp network

### M19 — Counter-Intelligence Layer
**Effort:** 4 sessions

- **Forensic trail meter** — separate from trace, accumulates from every dirty action; high meter = bounty hunters
- **Hunter NPCs** — persistent rivals who appear during your missions if your forensic meter is high
- **Burn notice** — story event triggered at extreme forensic meter; faction relationships reset, must rebuild identity
- **Cover IDs** — buy alternate operative IDs (separate save slots tied to same Steam account)

### M20 — Advanced Mission Types
**Effort:** 6 sessions

Five new advanced types (Difficulty 7+):
- **Stock manipulation** — coordinated multi-mission to profit from a corp's stock movement
- **Supply chain** — compromise a vendor to access their customer's network
- **AI breach** — only ai_core nodes, requires `cracker_quantum` + Architect spec
- **Ransomware deployment** — encrypt a corp's data, set ransom, negotiate over 3 in-game days
- **Whistleblower extraction** — protect a defecting NPC across multiple missions

### M21 — Living World Expansion
**Effort:** 4 sessions

- 20 new world events
- Corporate AI: corps proactively launch counter-ops against the player after multiple breaches
- Rival expansion: 5 named rival NPCs with personalities, signature tactics, and reputation arcs
- News feed deepening: opinion pieces, op-eds about the player's accumulated actions

### M22 — Hardware Tiers 5–8 + Black-Market Hardware
**Effort:** 3 sessions

- CPU tiers 5–8 (current cap: 4)
- Black-market: 3 quantum-class CPUs (illegal — owning one is a passive notoriety modifier)
- HDD tiers 5–8 (terabyte-scale)
- New slot: **Neural co-processor** (Architect-spec-only) — third concurrent tool when both RAM slots are full

### M23 — Endgame Arcs (post-launch story DLC)
**Effort:** 8 sessions (split across DEEP BLACK + QUANTUM SHADOW DLC)

- Arcs 6A/6B/6C — three branching post-1.0 epilogues, gated by 1.0 ending
- Arc 7 — Enemy of the State (Government route extension)

### M24 — Achievement Expansion + Challenge Runs + Prestige
**Effort:** 3 sessions

- 50 → 100 achievements
- Challenge runs: "Iron Operative" (one save, one life), "Pacifist" (no sabotage missions), "Speed Hacker" (1.0 ending in < 10h)
- Prestige system: at Rank 10 + Arc 5 complete, sacrifice current operative for prestige slot (+5% baseline reward forever on this account)

---

## 5. Backlog — Tier 4 (after PC 1.0 stabilises)

### M27 — VFX expansion + Music expansion + CRT terminal mode
**Effort:** 4 sessions

- Particle effects on breach (cascading green code rain)
- Screen-shake on trace spikes
- Optional CRT terminal mode: scanlines, phosphor glow, slight curvature
- Music: 10 → 25 looping tracks, adaptive based on mission type, time-of-day (VST)

### M28 — IoT/SCADA + Satellite Layer
**Effort:** 5 sessions

- IoT mesh archetype already exists; expand with consumer-device archetypes (smart home, industrial sensor)
- Satellite layer: literally hop a relay through orbital infrastructure (new tool `satellite_uplink`)
- New mission type: spacejack (breach an orbital relay)

### M29 — Mobile Port (React Native)
**Effort:** 12 sessions

Port to iOS + Android. Touch-first redesign of every window. Cloud save bridge. Expected only if PC 1.0 succeeds commercially.

### M30 — Arc 8 GHOST PROTOCOL + Arc 9 THE VOID (Prestige 10)
**Effort:** 6 sessions

Post-prestige-10 narrative content. Two final arcs for completionists.

### M31 — Workshop SDK refinement + Community Hub integration
**Effort:** 6 sessions

After EA-S3 SDK launches, refinement based on first 6 months of mod data: API gaps, performance issues, common pain points. Community hub integration: in-game Workshop browser with ratings, downloads, auto-update.

### Twitch Integration
**Effort:** 2 sessions

Chat votes on choice missions. Streamer-mode UI toggle (hides spoilers in inbox/news for active viewers).

### ARG Continuity
**Effort:** Ongoing

Quarterly puzzle hooks in the seasonal darknet drops keep the ARG community engaged post-EA-S3.

---

## 6. Multiplayer (LAST)

**Per user mandate, multiplayer is the very last system. Earliest realistic window is post-2028-Q3.** Vision lives in [Full_Plan §15](./Full_Plan.md#15-multiplayer-vision-last).

Until that window:
- **No multiplayer-specific code** in `apps/server/` (the directory is reserved but empty)
- **No server-side state** in any save
- **No anti-cheat hooks** (single-player only)
- **World clock + faction systems are architected to be multiplayer-compatible** so the eventual port is mechanical, not redesign

Tracked as M25 (infrastructure), M26 (co-op + PvP + bounty network) in the long-tail backlog.

---

*When something here ships, move its row out and into [Complete_Tasks.md](./Complete_Tasks.md). This document never shows shipped work.*
