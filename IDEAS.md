# Voidlink — Ideas & Opportunities

**Purpose.** This is a brainstorm document, not a planning commitment. It captures (a) where we stand right now, (b) ideas to make the game stand out further, and (c) monetisation directions including the *"free for first N players"* concept. Anything here can be picked up, deferred, or rejected.

For the active sprint plan and commitments, see `docs/Roadmap.md` and `docs/Next_Stage.md`.

Created 2026-06-08. Updated as we decide.

---

## A. Where we stand — honest snapshot

**Shipped and verified (✅):**

| Area | Status |
|---|---|
| Core hacking loop (M01–M15) | Pre-alpha feature complete |
| Banking, exfil, shop expansion, multi-phase + choice missions | ✅ |
| 8 story arcs, 30 hand-authored missions, 5 multi-phase resolutions | ✅ |
| Choice Architecture (M14p) + Lore Exposure Layer (M14q) | ✅ |
| Diegetic onboarding (M14r) + Bond rename + Collaborator Axis (M14s/t) | ✅ |
| Cipher-voiced tutorial rewrite (L2) | ✅ |
| 50-entry achievement catalogue + toast + Profile tab (L5) | ✅ |
| Perf pass — bundle 1.47 MB → 611 KB raw, Low-Quality toggle (L6) | ✅ |
| EULA, Privacy, CREDITS with honest AI disclosure (L9) | ✅ |
| L5.1 Save Integrity & Steam Achievement Trust (this audit) | ✅ |
| ErrorBoundary + GitHub Actions CI | ✅ |
| Post-arc reflections (6/7/8) + Cipher Arc 8 callback letter | ✅ |
| 161 unit tests, tsc clean, deployed to Railway Phase A | ✅ |

**Outstanding for EA launch (2026-09-15 target):**

| Sprint | What's left | Who can do it |
|---|---|---|
| **L1 Audio** | 6 looping tracks (boot/desktop/mission/critical/victory/fail) + per-bus volume | Composer needed |
| **L4 Cloud Saves** | Railway Phase B — Hono API + Postgres + magic-link auth | Codeable (~1 week) |
| **L7 Trailer / press kit** | Capture, edit, screenshots, store page | You (or contracted) |
| **L8 Localisation** | ES / DE / FR / RU / zh-CN / JA | Translators (scaffold ready) |
| **L10 Steam Deck verification** | Perf measurement + controller mapping + Valve cert | Needs Deck hardware |

Six of eight planned pre-launch sprints are shipped. **We are ahead of plan on narrative and polish; behind on production-side dependencies (composer, translators, capture).**

---

## B. Pre-release polish — gameplay ideas (most → least likely to stand out)

Ordered by impact-for-effort.

1. **Operative Signature** *(★ top pick)*. A one-line dynamic title that updates as you play, visible only in your Profile. Reads from `getDecisionPattern()` + traits. Examples:
   - *"You are: a quiet professional with three uncomfortable secrets."*
   - *"You are: the kind of operative Cipher writes to."*
   - *"You are: the one who turned away."*
   ~3 hours to author. Lands hard because the player sees themselves *named*.

2. **Operative Diary** *(★ high-value)*. Automatic Codex-style notes accumulating as the world simulation rolls forward. Written in second-person, terse, in the established voice. A new entry every season transition or major choice. Player can open Diary window from taskbar and re-read their own story. ~6 hours.

3. **End-of-arc Desktop Wallpaper Shift**. After each arc resolution, the desktop background subtly changes — a different city skyline, a different glyph in the corner, a different ambient tint. Players will notice on the second arc. Tiny technical cost, big "the world is responding to me" feel. ~1 hour.

4. **CRT / Scanline Mode**. Visual toggle in Settings adding scanlines + CRT curvature + chromatic aberration to the entire screen. Optional. Polarising, but the fans who want it will *love* it. ~2 hours.

5. **Death Recap**. When the trace gets you, a 15-second "How did it come to this?" overlay walks back the last 5 actions you took: SCANNED node 4 — CRACKED node 4 (trace 42%) — SCANNED node 5 (trace 51%) — CRACKED node 5 (trace 64%) — DELAYED disconnect (trace 100% — TRACED). Educational and punishing. ~3 hours.

6. **Difficulty Modes**. Three new toggles available from character creation:
   - **Standard** (current)
   - **Hardcore** (one save slot, no save scumming, perma-death on TRACED)
   - **Sandbox** (no trace, all missions unlocked, no story — a builder mode for streamers)
   - **Speedrun** (timer visible, leaderboard-ready when MP lands)
   ~4 hours. Real legs for the community.

7. **Ambient World Events Drip**. Even without player action, the news feed and inbox should drip non-gameplay-affecting lore: small headlines about Reykjavík weather, an op-ed by a public figure, a sys.ops announcement about server maintenance. Makes the world feel alive between contracts. ~4 hours of writing.

8. **Inbox PGP Fingerprint Footer** (already on Next_Stage backlog). Subtle one-line *"PGP fingerprint confirmed — message integrity verified by Internic routing layer"* footer on decrypted views. ~30 min. Just deliciously diegetic.

9. **Reflection Replay**. The reflection scenes are powerful. Right now they fire once. A "Replay Reflections" panel in Settings or Profile would let players revisit. ~30 min.

10. **Replayable Choice Branches**. Opt-in: before any major choice, the game creates a backup save slot. Player can return to the choice and explore the other branch on the same character. The bond_grey trait stamps if you do it. (Or don't stamp — let it stay clean.) Useful for completionists. ~3 hours.

---

## C. Pre-release polish — technical ideas

1. **Save inspector tool** *(★ dev quality of life)*. A hidden Settings panel `Ctrl+Shift+I` that dumps current save state as readable JSON. For your own debugging. ~1 hour.

2. **PWA manifest + service worker**. Makes the web build installable as a desktop app on any platform that supports PWAs (Chrome, Edge, Safari 17+). Offline play for the web build. ~3 hours.

3. **Telemetry-free in-game feedback button**. Settings → "Send Feedback" opens a mailto: link prefilled with save *metadata* only (handle, rank, arc progress, achievement count — NO save body, NO email). Player chooses to send. Matches the privacy promise. ~1 hour.

4. **GitHub Issue templates** for bug reports + feature requests. Players who want to file a proper bug ticket get guided. ~30 min.

5. **Save format migration tests**. Snapshot saves at v3, v4, v5; assert that the migration runner handles each. Catch regressions before v6 ships. ~2 hours.

6. **Tree-shake Three.js**. Import only the modules we use. Three is currently 524 KB raw; could be 250–300 KB. ~3 hours.

7. **Lazy-load i18n until non-EN locale picked**. The 57 KB i18n chunk loads eagerly with EN only. Defer until language switched. ~30 min.

8. **Lazy-load codex / settings / profile windows on first open**. Trim main bundle further. ~2 hours.

9. **Steam Deck-specific input layer**. Controller-friendly default focus order on every window. ~6 hours.

10. **Accessibility audit pass**. Verify all overlays announce correctly to screen readers; check focus traps in modals. ~2 hours.

---

## D. Post-launch — already on the roadmap

These are already planned in `docs/Next_Stage.md` Tier 2+. Listed here so we don't double-count.

- **EA-S1 GHOSTNET** (2026-09 → 2026-11) — first seasonal narrative drop
- **EA-S2 ARES** (2026-12 → 2027-02)
- **EA-S3 ZERO DAY** (2027-03 → 2027-05)
- **1.0 launch** (2027-06)
- **DLC #1 / #2** (post-1.0)
- **Mobile port (M29)** (post-PC-1.0 success)
- **Workshop / SDK refinement (M31)**

## E. Post-launch — new directions worth considering

1. **Soundtrack album release on Bandcamp** name-your-price + Steam DLC. Pairs with L1 audio.
2. **Hardcover lore book** — Print the Codex + Tolkien-depth backstory as a physical artefact. Limited run via [The Pixel Empire](https://pixelempire.com) or similar specialist publisher. Pricing £29–49.
3. **Web comic / serial** set in the Voidlink universe. Posts free; collected paperback paid later. Low-effort marketing reach.
4. **Convention presence** — gamescom indie row, EGX Rezzed, PAX East. ~£3–8k each but real wishlist conversions.
5. **Streamer outreach kit** — pre-built press kit + free key + suggested arc-1 demo flow that respects spoiler boundaries. Free to do; high return.
6. **Modding API** — JSON-based mission importer. Lets community ship contracts. Workshop integration when MP lands. Big community-longevity unlock.
7. **The "Operative Network" newsletter** — monthly low-pressure Substack with one short in-universe news item + one dev note. Builds owned audience independent of Steam.
8. **Crossover collab** — unofficial nod to Introversion (Uplink's original devs). If they're willing, a small recognition / shoutout / cameo file in a server somewhere. The original *Uplink* community would lose their minds.

---

## F. Monetisation — pricing & launch mechanics

Two non-negotiables from `CLAUDE.md`:
- **No pay-to-win, ever.**
- **Cosmetics + story DLC only.**

Within those, here are mechanics worth considering. **Top recommendations marked ★.**

### F.1 Pre-launch — wishlist building

1. **★ Free demo via Steam Next Fest** (June or October). One-hour demo covering boot → first signup → 2 procedural missions → Arc 1 choice. Demo save does NOT carry forward — that's a separate purchase. Best wishlist tool on the platform. **My #1 recommendation.**

2. **Discord open during EA** — closed-during-pre-alpha keeps focus, open-at-EA gives the community a home. Free.

3. **Devlog video series** — short (3–5 min) YouTube devlogs about specific systems. Two or three before launch. Honest about being solo-dev + AI-assisted at the finish.

### F.2 Launch pricing structures

| Option | Pros | Cons | My take |
|---|---|---|---|
| **A. Standard £11.99 EA → £14.99 1.0** (current plan) | Predictable; no special-casing | No buzz mechanic | Safe floor |
| **B. ★ Founders Edition £19.99 (first 30 days)** | Premium tier captures fans; builds revenue early | Two SKUs to manage | **Recommended** |
| **C. Pay-what-you-can first week (min £0)** | Buzz; honest signal of value | Devalues; competes with future sales | Risky — too early in your career |
| **D. Free for first N players** | Viral; "I got Voidlink free!" social proof | Trains audience that work is free; quality risk | **Don't do as default; see F.4** |
| **E. Pay-what-you-want first 100 players, then standard** | Hybrid of B and D | Confusing | Probably overcomplicated |

**My recommendation: A + B together.** Standard EA at £11.99, **Founders Edition at £19.99 for the first 30 days**, including:
- The EA game (£11.99 value)
- Soundtrack DLC when L1 lands (£4.99 value)
- Lore book / art book PDF (£5.99 value)
- Player's handle scrolled past in a randomised list during the boot screen of every future build (sentimental, free to implement, *huge* community signal)
- Beta access to seasonal drops 1 week early

After 30 days, the Founders Edition pack is no longer available; its components are sold separately at standard prices.

### F.3 Post-launch revenue streams (cosmetic + story only)

Ranked by my estimate of player demand:

1. **Story DLC expansions** — *the load-bearing post-launch monetisation*. Per the existing roadmap: 3 seasonal drops in EA window + 2 paid DLC at 1.0.
2. **Soundtrack DLC** — £4.99. Easy unlock; high goodwill.
3. **Wallpaper packs** — 6 wallpapers per pack, £1.99 each. The cyberpunk-desktop crowd will buy multiple.
4. **Terminal colour theme packs** — 5 themes per pack, £1.99 each. Amber retro, monochrome green CRT, Voidlink default, custom palette editor. The custom-palette one could be standalone at £2.99.
5. **Boot sequence override DLC** — alternative BIOS animations. £1.99.
6. **Operative avatar packs** — small portrait variations. £0.99.
7. **Glyph DLC** — extra motif glyphs for splash cards. £0.99.
8. **Lore book PDF / art book PDF** — separately purchasable post-Founders-window. £9.99.
9. **Steam Supporter Pack (tip jar)** — £0.99 / £4.99 / £9.99 tiers, purely voluntary, single small in-credit recognition. Some players want to give more.

### F.4 The "free for first N players" idea — direct evaluation

The user specifically asked about this. Here's my honest read.

**The version that works:**
- **Free for the first 100 verified streamers / press reviewers** in a closed application window before EA launch. Builds the launch-day media spike.

**The version to be careful with:**
- **Free for the first 1,000 paying customers** — gives away ~£12k of revenue you can probably better deploy on a composer or translators.

**The version not to do:**
- **Free for everyone for the first 24 hours of EA.** Trains the audience that Voidlink is a free game. The Steam algorithm rewards demos over launch giveaways anyway.

**A hybrid I like:**
- **"Founders 100"** — the first 100 customers (verified by purchase timestamp) get the £19.99 Founders Edition for £9.99 *and* their handle gets explicitly named (not randomised) in a permanent founders panel inside the game's Credits screen. Limited; not free; rewards earliest believers; doesn't devalue the product. ~£1k in revenue forgone; ~100 superfans gained.

### F.5 What NOT to do — anti-patterns

- ❌ Lootboxes / gambling mechanics — even cosmetic-only
- ❌ XP boosters / time skips / energy systems
- ❌ Battle pass — the structural commitment it implies doesn't fit a solo-dev cadence
- ❌ NFTs — for obvious reasons
- ❌ Always-online for single-player
- ❌ Pre-order skins that lock anyone out of in-game cosmetics post-launch
- ❌ Free game + sell save slots — done by the worst kinds of mobile publishers; against the spirit of `CLAUDE.md`

---

## G. My prioritised "what next" stack

If I were you, in order:

1. **★ Build the Founders Edition tier in the Steam dashboard** — gives every future decision a target audience and a revenue line
2. **★ Operative Signature feature (B.1)** — ~3 hours, biggest "this game knows me" feel-good
3. **★ Steam Next Fest demo** — cuts at Arc 1 choice; pure wishlist building
4. **L4 Cloud Saves** — unlocks Steamworks integration which unlocks L5.1's Steam-side achievement queue
5. **L1 Audio composer outreach** — pitch a brief; ~3 week procurement cycle
6. **L7 Trailer + screenshots + press kit** — needs you, but lands the store page
7. **L8 Localisation outreach** — contract translators in parallel with the above
8. **Operative Diary feature (B.2)** — once L1 audio lands, the diary's tonal weight is supported
9. **CRT / Scanline mode (B.4)** + **Difficulty modes (B.6)** — polish + community legs
10. **L10 Steam Deck verify** — last, because by then the perf state is final

---

## H. Open questions for you to decide on

Mark each with a quick decision when you read this:

- [ ] Founders Edition: yes / no / different shape?
- [ ] Steam Next Fest demo: which fest window — June or October?
- [ ] First-100 free streamer key giveaway: yes / no?
- [ ] Operative Signature feature: now or post-EA?
- [ ] CRT mode: yes / no / "yes, but post-EA"?
- [ ] Hardcore + Sandbox + Speedrun difficulty modes: ship before EA or as seasonal drop?
- [ ] Composer budget cap: £1k / £2k / £3k?
- [ ] Localisation budget cap: ~£300 per language (community proofread) or ~£1k per language (professional)?
- [ ] Discord open at EA or wait until 1.0?

Decisions get rolled into `docs/Next_Stage.md` and `docs/Roadmap.md` once locked in.

---

*Brainstorm doc. Not a commitment. Re-read; argue with it; pick.*
