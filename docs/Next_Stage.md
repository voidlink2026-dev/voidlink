# Voidlink — Next Stage

Forward-looking only. Every item here is unshipped work, scoped in **world-class detail** so any contributor can pick it up and execute without further design. When an item ships, its row **moves out of this file** into [Complete_Tasks.md](./Complete_Tasks.md).

For the timeline view see [Roadmap.md](./Roadmap.md). For the master design canon see [Full_Plan.md](./Full_Plan.md). For QA checklists see [Testing_Guide.md](./Testing_Guide.md).

**Current focus: Pre-Launch sprints L1–L10** (Steam Early Access target 2026-09-15).

### Sprint ordering rule

**L2 (Tutorial rewrite) ships LAST among gameplay-affecting work.** Any new mechanic, mission type, or UI surface that the player needs to learn must land before the tutorial is rewritten — otherwise the tutorial teaches yesterday's game. Audio (L1), Steam Cloud (L4), achievements (L5), perf (L6), localisation (L8), trailer (L7), EULA (L9), and Steam Deck (L10) all *can* happen alongside; **L2 happens last in the queue, locked only when no further mechanics are due to ship before EA**.

---

## Table of Contents

1. [Pre-Launch Sprints (L1–L10)](#1-pre-launch-sprints-l1l10)
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

### L11 / M14p — Choice Architecture & Reflection Mechanic ✅ SHIPPED 2026-06
**Status:** All four passes complete. Pattern reader + News Framing + NPC Dialogue Tone + Contract Availability Gating + Reflection Scenes + 9-Ending Fan-out architecture all in. 120 unit tests passing (60 → 120 across the sprint). Detailed Arc 5 mission authoring for each of the 9 ending paths is a content task that lands as part of L3 story-arc writing.

**Why this is now a launch-blocker.** The lore expansion, the 9-ending fan-out, the ongoing-world model, and the Codex-level immersion all depend on the world *reflecting* the player's accumulated choices. Without this system, the lore is just text — beautiful but inert. With it, the player's identity becomes the central mechanic.

**Scope.**

1. **Choice catalogue.** Audit every existing choice surface (Arc 1 key choice, M14o choice missions, mission-objective accepts/refusals, exfil sell-vs-leak, civilian-spare decisions, fellow-operative bounties) and ensure each writes a flag with consistent naming: `choice_<topic>_<value>` (e.g. `choice_arc1_key_upload`, `choice_civilian_spared_3`, `choice_op_bounty_accepted_2`).
2. **Pattern reader.** Single core helper `getDecisionPattern(player): { principledScore, mercenaryScore, recentTrend, dominantTraits[] }`. **Never shown to the player.** Read-only, derived from flags.
3. **Four reflection channels (wired):**
   - **NPC dialogue tone** — CIPHER, NIGHTOWL_22, Dispatch, faction brokers each have 3-5 variant lines per scripted exchange. Pattern reader picks the right one.
   - **News framing** — same news article body, different adjectives based on pattern. Headlines pick from 3 variants. Body uses 4-6 token substitutions.
   - **Contract availability** — high-tier mercenary contracts gate on `mercenaryScore`. High-status principled contracts gate on `principledScore`. Mid-tier work is alignment-agnostic.
   - **Faction induction events** — when pattern crosses a quiet threshold (e.g. `principledScore > 30 && underground_standing > 100`), trigger a one-time induction message in inbox. CIPHER's tone changes permanently.
4. **Reflection scenes.** New mission type `ReflectionScene` with no network, no trace, no objective — just a styled terminal overlay. Five base scenes:
   - End of Arc 1 (covers signup → Arc 1 climax)
   - End of Arc 3
   - End of Arc 5 (pre-ending)
   - Annual anniversary
   - Quarterly season transition
   Each scene has 6-8 variant text blocks; pattern reader selects 4-5 to surface.
5. **Ending fan-out.** Update Arc 5 climax to query `getDecisionPattern` + faction standings + spec. Offer the 1-3 endings that match. Reformer's Path triggers if `recentTrend != dominantTraits[0]`.

**Tech.**
- `libs/core/src/engine/decisionPattern.ts` — new module with `getDecisionPattern()` + helpers
- `apps/web/src/game/Reflection/ReflectionOverlay.tsx` — new full-screen overlay component
- `libs/core/src/data/dialogueVariants.ts` — keyed text variants for NPC tone
- `libs/core/src/data/newsFraming.ts` — keyed adjective/token substitutions for news
- Update mission `acceptMission` action to gate-check contract availability against pattern

**Acceptance criteria.**
- Playing through Arc 1 with a principled pattern → CIPHER's Arc 1 close message reads "Welcome to the deck. You've shown me what kind of operative you are."
- Same playthrough with a mercenary pattern → CIPHER's message reads "Welcome to the deck. We'll see what kind of operative you become."
- News article for the same successful sabotage mission produces "ruthless professional precision" for mercenary pattern, "anonymous vigilante action" for principled pattern, "another vicious Underground strike" for high-Underground-standing principled
- End-of-Arc-1 reflection scene fires, surfacing 4-5 facts that match what the player actually did
- Arc 5 climax offers 1-3 endings (not all 9) based on coherent decision pattern
- No UI ever displays a score to the player

This sprint unlocks the entire deep-narrative vision. Everything else in the post-1.0 Ongoing World model (ending-driven seasonal content, faction territory shifts, ARG personalisation) reads from `getDecisionPattern()`.

---

### M14q — Lore Exposure Layer ✅ SHIPPED 2026-06
**Status:** All five sub-sprints shipped. Boot prologue, Codex window with 18 unlockable entries + non-blocking unlock toasts, environmental flavour (BIOS line + bank subheaders), 6 Cipher/NightOwl essays drip into inbox, 8 splash cards on key story beats with SETTINGS toggle to disable. 13 unit tests added across the M14q sprint (120 → 133). The Codex's ~880 lines of lore are now discoverable in-game across multiple surfaces. **Cipher's First Contract** tutorial rewrite (L2) is the next gameplay-touching sprint and is now the last unshipped pre-launch sprint that affects what the player learns.

**Why this slots before L3 (story arcs 6-8):** every choice in Arcs 6-8 lands harder if the player already understands what the factions are, who the named NPCs are, why the Voidlink Bond matters, what the JCB does. Writing more story into a world the player can't see is wasteful.

#### Sub-sprint A — Boot Prologue 📜
**Effort:** Half a day
**Scope.** Before the login screen renders, a typewriter-styled prologue animates against the neon-Earth globe backdrop. ~250 words across 6-7 paragraphs. Establishes the year, the Collapse, the Big Four, the Voidlink Bond, and the player's place in it.

- **Gate:** localStorage flag `prologue_seen`. First-ever boot only. Returning players go straight to login.
- **Settings entry:** "Replay Prologue" toggle so fans can revisit. Resets the flag.
- **Skippable:** SPACE / click anywhere to skip. Auto-saves the seen flag immediately.
- **Audio:** soft modem hum + occasional typing click; respects audio settings.
- **Visual:** typewriter effect at 28 cps with cursor blink; ACES-tone-mapped globe in the background dim to 30% during prologue.

**Acceptance:**
- [ ] First fresh-install boot shows the prologue
- [ ] Second boot goes straight to login
- [ ] Settings "Replay Prologue" works
- [ ] SKIP works mid-prologue and persists the flag

#### Sub-sprint B — Codex Window + Unlock Catalogue 📖
**Effort:** 3 days
**Scope.** A new desktop window (CODEX in the taskbar) that contains the Codex content broken into 18-25 unlockable entries. Entries unlock through play — never forced, always discoverable.

**Entry catalogue (initial):**
- *Voidlink International* (unlocks on first mission complete)
- *The Voidlink Bond* (unlocks on signup, link to full text)
- *The Mesh* (unlocks on first CIPHER inbox message)
- *CIPHER* (unlocks after 2nd CIPHER message)
- *NIGHTOWL_22* (unlocks after first NIGHTOWL contract)
- *Arunmor Corp* + *Mei Lin* (unlocks on first Arunmor mission)
- *Ares Defence Group* (unlocks on first Ares mission)
- *Internic Holdings* + *Aino Virtanen* (unlocks on first Internic mission)
- *Nexus Financial* (unlocks on opening first bank account)
- *The Joint Cybersecurity Bureau* + *Director Mira Kovac* (unlocks at Rank 5)
- *The Underground* (unlocks after CIPHER's underground induction message)
- *Project R-1117 / REVELATION* (partial unlock at Arc 1 Mission 2, deepens through arcs)
- *The October Event* (unlocks at first anniversary OR on completing Arc 5)
- *The Nine Days* (unlocks alongside October Event)
- *The Reconciliation Accords* (unlocks at Rank 5)
- *The Five Cities* (unlocks at signup — your home city pre-selected)
- *Voidlink Standard Time* (unlocks on day 7 in-game)
- *Mesh Slang Glossary* (unlocks on first inbox decryption)
- *Famous Operatives — Astra / Halberd / The Crown / PROXY_ECHO* (unlock individually via news echoes)
- *Music Genres* (unlocks on completing tutorial)
- *Philosophy — Bond vs Stewardship Schools* (unlocks after Arc 3)

Each entry is 200-400 words. Pulled directly from `The_Voidlink_Codex.md` — minimal new writing. Markdown-rendered.

**UI behaviour:**
- Window opens with sidebar nav (categorised: FACTIONS / PEOPLE / HISTORY / CULTURE / TERMS) + reader pane
- Unread entries show a cyan dot in the sidebar
- CODEX taskbar button shows the standard unread badge (matches INBOX)
- "OPEN CODEX" deep-link from notification toasts scrolls to the entry

**Unlock notification:**
- Small toast slides in bottom-right (above System Console): *"NEW CODEX ENTRY: <name>"* with a small open-book icon
- Click → opens Codex to entry
- 8-second auto-dismiss
- Dismiss button visible
- Audio: one soft chime (respects SFX volume)
- **Never blocks gameplay**

**Acceptance:**
- [ ] Window opens at 800×580, sidebar + reader, scrollable
- [ ] Each unlock condition fires correctly via flag checks in disconnect path
- [ ] Toast appears non-blockingly on unlock
- [ ] CODEX taskbar button shows dot when entries unread
- [ ] Sidebar shows partial entries with greyed-out icon for locked ones (teases them)

#### Sub-sprint C — Cipher Essay Drip (Inbox lore) ✉️
**Effort:** 1 day (writing + wiring)
**Scope.** 5-8 additional scheduled inbox messages from CIPHER and NIGHTOWL_22 that drip lore over the first 30 hours of play. Each carries one Codex chapter's worth of background, in-character.

**Catalogue:**
- *Cipher: "The Bond, in plain language"* (after first 3 missions) — explains Rule 4 in his voice
- *Cipher: "Reykjavík, and other lies"* (after first month VST) — short essay on the operative's retirement myth
- *NIGHTOWL_22: "The history we don't write down"* (after Rank 3) — alludes to the Old Five
- *Cipher: "On Astra"* (after first relay-burn) — anecdote about the legendary operative
- *Cipher: "The argument about REVELATION"* (after first contact with REVELATION's terminal style) — frames the Stewardship-school view
- *NIGHTOWL_22: "Why we use VST"* (after first anniversary marker) — the global clock as resistance

Each: 250-400 words, encrypted/decryptable, lands in inbox via `evaluateDialogueTriggers()`. Same gate convention as Pass 2a (`dialogue_fired_<id>`).

**Acceptance:**
- [ ] Each message fires once at the appropriate trigger
- [ ] Tone variants per pattern bucket (use the M14p infrastructure)
- [ ] Player can re-read from inbox archive at any time

#### Sub-sprint D — Environmental Flavour 🏛️
**Effort:** Half a day
**Scope.** Tiny, high-density additions that establish setting in the spaces players already look at.

- **Boot BIOS line:** Change to *"VOIDLINK BIOS v2.1.0 — Internic-licensed routing — © 2199 Voidlink International, Geneva"*
- **Bank window subheaders:** One canonical line per bank under the name:
  - Global Trust Bank — *"New York · Nexus Financial subsidiary · est. 2179"*
  - Pacific National — *"San Francisco · Nexus Financial subsidiary · est. 2181"*
  - Cayman Trust — *"Cayman Islands · Neutral territory under Reconciliation Article XII"*
  - Zurich Vault — *"Zurich · Discreet numbered banking · Reconciliation-grade compliance"*
- **Faction broker bylines** in mission briefings — one line under the client handle: *"VoidLink Dispatch · Automated contract aggregator"*, *"CIPHER · Senior operative, Underground-aligned"*, *"NIGHTOWL_22 · Independent broker, Lagos"*
- **Inbox PGP fingerprint footer:** *"PGP fingerprint confirmed — message integrity verified by Internic routing layer"* (subtle, one line at bottom of decrypted view)
- **Operative Profile** small footer: *"Voidlink Bond signed [DATE] · Bond-clean: [YES/NO]"* — adds gravity to the profile

**Acceptance:**
- [ ] Each line in place, JetBrains Mono, dim grey
- [ ] No layout regressions
- [ ] No new strings break i18n scaffold (mark for translation pre-L8)

#### Sub-sprint E — Splash Cards 🎬
**Effort:** 2 days
**Scope.** 5-8 static splash cards that fire between major story beats. Each is a full-screen overlay: one paragraph of text on a styled background (atmospheric, evocative — think Max Payne chapter titles, Disco Elysium scene transitions). 8-10 seconds each, fully skippable. Sets tone.

**Catalogue:**
- *"FIRST CONTACT"* — fires before Arc 1 Mission 1
- *"THE LEAD"* — fires before Arc 1 Mission 2 (Arunmor)
- *"THE ORIGIN NODE"* — fires before Arc 1 Mission 3 (climax)
- *"AFTERMATH"* — fires after Arc 1 choice
- *"REVELATION IS LISTENING"* — fires on first REVELATION inbox message
- *"THE BOARD OF SEVEN"* — fires before first Government-aligned mission
- *"DIRECTOR KOVAC"* — fires before Arc 5 first mission
- *"DISCONNECT"* — fires before final ending choice

Visual: full-screen darkness, centred text in cyan with subtle bloom, optional motif graphic (line-art icon — a key, a chain, a globe, etc.). One audio sting per card (existing victory/fail sting variants). Skippable.

**Acceptance:**
- [ ] Each card fires at its trigger and writes a `splash_fired_<id>` flag
- [ ] Skippable via SPACE or click
- [ ] Settings option to disable splash cards globally
- [ ] No two cards back-to-back without a gameplay beat in between

#### Total effort and ordering
- Sub-sprints A + B + D ship together as Pass 1 (~3.5 days)
- Sub-sprint C ships as Pass 2 (~1 day)
- Sub-sprint E ships as Pass 3 (~2 days)
- **Total ~6.5 days** — slot before S3 starts

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

### L3 — Story arcs 6, 7, 8 ✅ SHIPPED 2026-06
All three arcs landed in 2026-06. See Complete_Tasks.md for per-arc detail.

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

### L5 — Achievements ✅ SHIPPED 2026-06
50 entries across six tiers wired in. See Complete_Tasks.md for the full detail. Steamworks SDK call is the only outstanding piece and rides with L4 Cloud Saves.

<!-- L5 historical spec retained below for context. Not actionable. -->
<details><summary>Original L5 plan (shipped, kept for reference)</summary>

### ~~L5 — Achievements (30–50)~~ 🎯
**Window:** 2026-07-W3 → 2026-08-W1 (1 week, parallel with L4)
**Effort:** 1 week
**Status:** Not started

**Scope.** Wire achievements into Steamworks. Most map to existing `player.activeFlags` and `player.stats`.

**Catalogue (first 40):**

| ID | Trigger | Difficulty |
|----|---------|------------|
| `first_mission` | Complete first mission | Trivial |
| `first_breach` | First node breached | Trivial |
| `first_crack` | First successful crack | Trivial |
| `clean_run` | Mission complete with no IDS triggered | Bronze |
| `100_missions` | 100 missions completed | Silver |
| `1000_missions` | 1000 missions | Gold |
| `arc1_upload` | Arc 1 ending: upload | Story |
| `arc1_destroy` | Arc 1 ending: destroy | Story |
| `arc1_sell` | Arc 1 ending: sell | Story |
| `arc5_containment` | Ending 1 | Story |
| `arc5_liberation` | Ending 2 | Story |
| `arc5_sovereignty` | Ending 3 | Story |
| `arc5_erasure` | Ending 4 | Story |
| `arc5_ghost` | Ending 5 (requires Ghost spec) | Story |
| `all_five_endings` | Complete all 5 endings on one account | Gold |
| `loan_default` | Default on a loan (ironic) | Bronze |
| `million_cr` | Hold 1M Cr cash | Silver |
| `notoriety_max` | Reach notoriety 10 | Silver |
| `notoriety_min` | Reach notoriety -5 | Silver |
| `paranoid` | Build a 10-hop relay chain | Silver |
| `escape_artist` | 10 SECURE DISCONNECT at >90% trace | Silver |
| `ghost_spec` | Choose Ghost | Bronze |
| `architect_spec` | Choose Architect | Bronze |
| `brute_spec` | Choose Brute | Bronze |
| `social_spec` | Choose Social | Bronze |
| `cipher_friend` | 20 missions with CIPHER as client | Silver |
| `nightowl_friend` | 20 missions with NIGHTOWL_22 as client | Silver |
| `arunmor_loyalist` | +500 Arunmor standing | Gold |
| `underground_loyalist` | +500 Underground standing | Gold |
| `voidlink_lifer` | +1000 Voidlink International standing | Gold |
| `government_double_agent` | Reach Government allied while keeping any other faction allied | Gold |
| `backdoor_master` | Plant 20 persistent backdoors | Silver |
| `escalation_expert` | ESCALATE on 50 nodes | Silver |
| `bountied` | Get traced and survive in same mission | Silver |
| `time_lord` | Play across 30 in-game days (VST) | Bronze |
| `wallet_warrior` | Earn 10M Cr lifetime | Gold |
| `data_hoarder` | 200 messages in inbox | Bronze |
| `clean_inbox` | Mark all as read (50+ unread) | Bronze |
| `seasoned` | Complete an EA-season event during its window | Bronze |
| `darknet_completionist` | Complete all 5 EA-seasonal narrative drops | Platinum |

Tier mix: 8 trivial, 18 bronze, 8 silver, 5 gold, 1 platinum = 40 base. Add 10 hidden achievements (specific node sequences, easter eggs) for 50.

**Tech.**
- `achievement.ts` in `libs/core` with `Achievement` type + catalogue
- `unlockAchievement(id)` action in `gameStore` — idempotent
- Hook into existing flag/stat updates: every time a relevant flag changes, run the catalogue
- Steamworks unlock call via `steamworks.js`; cache locally for offline plays
- In-game achievement panel: Operative Profile → ACHIEVEMENTS tab with grid + unlock dates

**Acceptance criteria.**
- All 40 base + 10 hidden trigger reliably
- Steam dashboard reflects unlocks
- Offline unlock queues + flushes on next online boot
- No false-positive unlocks (re-running a story arc doesn't re-fire)
</details>

---

### L6 — Perf pass + Low-Quality toggle ✅ SHIPPED 2026-06
Code-splitting + lazy GlyphDrift dropped first-paint bundle from 425 KB → 187 KB gzipped. Low Quality toggle skips bloom passes and CSS blurs. See Complete_Tasks.md.

<details><summary>Original L6 plan (shipped, kept for reference)</summary>

### ~~L6 — Perf pass + Low-Quality toggle~~ 🎯
**Window:** 2026-08-W1 → 2026-08-W2 (3 days)
**Effort:** 3 days
**Status:** Not started

**Scope.** Make Voidlink playable on integrated graphics. Current bottleneck: bloom + 600-point starfield + scan-grid on NetworkMap, similar on WorldMap and GlyphDrift.

**Toggle effect when ON ("Low Quality"):**
- Bloom passes disabled (composer.render → renderer.render directly)
- Starfield count halved (600 → 300 on NetworkMap; 1200 → 600 on WorldMap)
- Bounce arc segment count: 60 → 30
- Continent line opacity boosted to compensate for lost bloom glow
- DataRain throttled to 12fps (was 18fps)
- Game loop tick from 20Hz → 12Hz

**Tech.**
- `settingsStore` gets `quality: 'auto' | 'high' | 'low'`
- `auto` detection: on first boot, run a 300ms benchmark frame; if < 30fps avg, default to `low`
- Settings UI toggle (manual override)
- Each Three.js component reads `quality` from store and adjusts on mount

**Acceptance criteria.**
- Integrated-GPU laptop (Intel UHD 620 class) hits 60fps on the desktop screen in Low Quality
- Mission-active 60fps maintained
- Visual difference is noticeable but not jarring (still feels like Voidlink)
- Auto-detect is right ≥ 80% of the time on test hardware
</details>

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

### L9 — EULA + Privacy Notice + CREDITS.md ✅ SHIPPED 2026-06
Repo-root [EULA.md](../EULA.md), [PRIVACY.md](../PRIVACY.md), [CREDITS.md](../CREDITS.md). AI-assistance disclosure rewritten to match the developer's actual timeline. See Complete_Tasks.md.

<details><summary>Original L9 plan (shipped, kept for reference)</summary>

### ~~L9 — EULA + Privacy Notice + CREDITS.md~~ 🎯
**Window:** 2026-08-W3 (1 day)
**Effort:** 1 day
**Status:** Not started

**Scope.**
- `EULA.md` — standard indie-game EULA from a template (e.g., MIT Game Dev template). Covers refunds, IP, mod liability, multiplayer code-of-conduct hook.
- `PRIVACY.md` — what data is collected (local saves; Steam Cloud opt-in; Workshop mod metadata when published). Cookie statement (none used).
- `CREDITS.md` — solo dev name, contributors, third-party library credits, music composer, AI-assistance disclosure paragraph (D3 from [§22](./Full_Plan.md#22-ai-assistance-disclosure)).
- All three published in the Steam page footer + bundled with the build.

**Acceptance criteria.**
- EULA + privacy reviewed for over-reach (no IP claims on user-generated content beyond license to host)
- CREDITS.md visible in game (Settings → CREDITS)
- AI disclosure paragraph appears as a clearly-labelled section, not hidden
</details>

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
