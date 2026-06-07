# Voidlink — Testing Guide

The single QA document. Two halves:

- **Part A** — milestone-by-milestone checklists. Run the relevant section after every milestone ship.
- **Part B** — end-to-end playtest walkthrough. 90–120 minutes for a full pass.

This file is the **only** QA reference — playtest walkthrough was merged in M14h.8.

For unshipped work see [Next_Stage.md](./Next_Stage.md). For the master plan see [Full_Plan.md](./Full_Plan.md).

**Dev server:** `cd apps/web && pnpm run dev` → open at http://localhost:5173
**Tests:** `pnpm test` (60 unit tests in `libs/core`) must pass before any commit.
**TypeCheck:** `pnpm --filter @voidlink/web exec tsc --noEmit` must be clean.

---

# Part A — Per-Milestone Checklists

Run the section corresponding to the milestone you just shipped. Test the golden path first, then the edge cases.

---

## 0. Pre-Flight

Before testing any specific feature, verify the app loads cleanly:

- [ ] Boot screen animates in (logo, progress bar, scanlines)
- [ ] Auto-advances to Login screen after ~3 seconds
- [ ] DataRain is visible throughout the login screen background (dense, constant)
- [ ] Voidlink logo glitches with erratic timing AND cycles through red/green/blue colour shifts
- [ ] No console errors on initial load (`F12 → Console`)

---

## 1. Login / Character Creation

**New player path:**
- [ ] Enter a handle and username → click CREATE OPERATIVE
- [ ] Lands on DesktopScreen with three windows open: SYSTEM TERMINAL, MISSION BOARD, OPERATIVE PROFILE
- [ ] NEWS FEED window also opens at bottom
- [ ] Terminal shows welcome message
- [ ] Profile shows: handle, username, NOVICE rank, LVL 1, 0 XP bar, 5,000 Cr, REP 0

**Returning player:**
- [ ] Close browser tab, reopen → lands on Login screen (not Boot — localStorage has session)
- [ ] Enter same handle → existing save loads: credits, rep, rank, completed missions all intact
- [ ] Completed missions (e.g. "first contract") do NOT reappear in Mission Board after re-login

**Edge cases:**
- [ ] Empty handle → button should do nothing / show validation
- [ ] Very long handle (32+ chars) → truncated or blocked at input level

---

## 2. Desktop Environment

- [ ] All app launcher buttons visible in Taskbar (TERMINAL, MISSIONS, SHOP, PROFILE, WORLD MAP, NETWORK, HACK TOOLS)
- [ ] NETWORK and HACK TOOLS are disabled (greyed, tooltip "no active connection") when no mission is active
- [ ] Clicking a launcher button opens the corresponding window
- [ ] Clicking same button again when window is open: focuses the window
- [ ] Windows are draggable by title bar
- [ ] Windows can be minimised via the `-` button; reopen via taskbar centre buttons
- [ ] Windows can be closed via `×`; launcher button no longer shows open-dot
- [ ] `⊞` (cascade) button in taskbar resets all windows to a tidy layout
- [ ] Ctrl+scroll zooms the entire window layer; zoom persists on save
- [ ] Player handle, credits, REP shown in taskbar right section and update immediately after missions

---

## 3. Mission Board

- [ ] At least 5 missions visible on fresh start (story mission + procedural contracts)
- [ ] Mission cards show: title, type, difficulty (1–5 dots), reward (Cr), archetype
- [ ] Clicking a mission card expands its briefing
- [ ] Story missions appear as distinct entries; look different from procedural contracts
- [ ] ACCEPT button triggers: Mission Board closes, Hacking Interface and Network Map open
- [ ] Cannot accept a mission while one is already active (ACCEPT button not shown)
- [ ] After a mission completes (success or fail), the Mission Board can be reopened and a new mission accepted

---

## 4. Network Map

**Requires an active mission.**

- [ ] Network loads with nodes visible as labelled dots connected by lines
- [ ] `entry_point` is always accessible from the start (clickable)
- [ ] Other nodes are connected in a graph — you can trace paths from entry
- [ ] Clicking a node: selects it (highlight) and opens its detail in Hacking Interface
- [ ] Selected node shows in HI: node type, security tier, breached/unbreached status
- [ ] Breached nodes show visually differently from unbreached ones (colour change)
- [ ] Log-wiped nodes show a distinct visual state
- [ ] 3D depth effect visible on the network map canvas

**Edge cases:**
- [ ] Clicking empty space deselects node
- [ ] Network map window resize doesn't break the canvas

---

## 5. Hacking Interface — Core Flow

**Step 1: Scan**
- [ ] Select an unscanned node → SCAN button is enabled
- [ ] SCAN shows a progress bar (duration varies with tier)
- [ ] After scan: node shows "SCANNED ✓"; any found CVEs listed in terminal (e.g. `SSH:22 → CVE-2023-38408`)
- [ ] CRACK button label changes to EXPLOIT if a CVE was found
- [ ] Scanning an already-scanned node logs "already scanned" and does nothing

**Step 2: Crack / Exploit**
- [ ] Select unbreached node → CRACK (or EXPLOIT if scanned+CVE) → progress bar runs
- [ ] Crack duration is longer than exploit; higher tier = longer
- [ ] On completion: node colour changes in network map to COMPROMISED; terminal logs "Access granted"
- [ ] Cancelling mid-crack (select different node, etc.) — stops progress cleanly

**Step 3: Mission action (varies by type)**
- [ ] `file_theft`: Breached file_server/database shows a ★ marked file → TRANSFER → objective ticks
- [ ] `account_deletion`: Breached database → DELETE ACCOUNT button → objective ticks
- [ ] `database_corruption`: Breached database → CORRUPT DATABASE → objective ticks
- [ ] `network_sabotage`: Breached router/admin_console → SABOTAGE → objective ticks, trace spike
- [ ] `bounty_hunt`: Breach the TARGET — label shows mission client handle → objective auto-completes

**Step 4: Wipe logs**
- [ ] After primary objective complete: step guide shows "Cover your tracks"
- [ ] Each breached node: select it → WIPE LOG → progress bar (Ghost spec is faster)
- [ ] Wiped node shows ✓ in the cover-tracks checklist
- [ ] All wiped → SECURE DISCONNECT button turns primary green

**Step 5: Disconnect**
- [ ] SECURE DISCONNECT: Mission Result overlay appears, shows credits earned, rep gained
- [ ] Credits and REP update in taskbar immediately
- [ ] Level-up logged to terminal if XP threshold crossed
- [ ] LEAVE NETWORK (dirty exit): mission fails, no payment; news feed shows breach logged

---

## 6. Trace System

- [ ] Trace bar visible in HI during mission; fills left to right as %/s builds
- [ ] Status transitions: CLEAN → ALARM (yellow) → CRITICAL (red flashing) at 75%+
- [ ] At 100%: TRACED — mission fails immediately
- [ ] Screen vignette effect intensifies as trace rises; critical banner at 90%+
- [ ] (M14h.5) +PROXY / -PROXY buttons in HI have been **removed**. Bounce reduction now comes entirely from the active RELAY CHAIN configured on WORLD MAP. Verify the buttons are gone.
- [ ] Each relay hop multiplies effective trace rate by 0.65 (was 0.85). With 3 hops the rate should be ~27% of unhopped.
- [ ] traceSpeed-15 networks now tick at ~0.54 %/s passively (was 0.75) — verify mid-tier missions feel completable.
- [ ] Rival hacker spawning: terminal warns, trace rate increases, 3-pulse intruder beep plays; INTERCEPT button removes them

---

## 7. Bounce Network

**Pre-mission (no active connection):**
- [ ] HI shows BOUNCE ROUTING panel with ACTIVE ROUTE and NODE LIBRARY sections
- [ ] 3 starting nodes in library: OSLO, SINGAPORE, AMSTERDAM
- [ ] Nodes show status dot: CLEAN (green), DIRTY (orange), TRACED (red)
- [ ] `+ ADD TO ROUTE` adds node to active route chain
- [ ] Route displays as YOU → [hop labels] → TARGET
- [ ] `REMOVE` button removes a hop from the route
- [ ] CLEAN nodes can be added; TRACED nodes cannot
- [ ] DIRTY nodes show `⚠ LOGS DIRTY` + `CLEAN HOP` button (not addable to route)

**CLEAN HOP sub-operation:**
- [ ] Click CLEAN HOP on a dirty node → progress bar runs for 6–9 seconds
- [ ] On complete: node status changes to CLEAN (green dot); can now be added to route
- [ ] Terminal logs "Bounce node logs wiped — node status: CLEAN"
- [ ] Cannot clean a TRACED node (button not shown)

**In-mission with bounce route:**
- [ ] Accepting a mission after setting route: trace bar shows hop indicators (squares)
- [ ] Hop count shown: `X/Y HOPS REMAINING`
- [ ] When trace reaches 100%: instead of mission fail, one hop is burned (orange LOGGED), trace resets to 0
- [ ] Terminal warns: `TRACE BYPASSED — [NODE LABEL] logged. Rerouting... X hops remaining`
- [ ] When all hops are burned and trace hits 100% again: mission fails
- [ ] Burned hops show as DIRTY in NODE LIBRARY after mission disconnect

---

## 8. Credential Mechanics (M12)

**Dump Credentials:**
- [ ] Breach an `admin_console`, `endpoint`, `database`, or `mail_server` node
- [ ] DUMP CREDS button appears in tools section (enabled)
- [ ] Clicking DUMP CREDS starts a timed operation (orange progress bar, ~2–5s)
- [ ] On complete: CREDENTIAL CACHE panel appears showing the cached entry
- [ ] Terminal logs extraction + trace note (non-Ghost: +1.5% trace; Ghost: silent)
- [ ] Dumping same node again: button shows "DUMPED ✓" and is disabled
- [ ] Cache entry shows: source label, time remaining (~8 min)

**Use Credentials:**
- [ ] With a cached credential in cache: select an unbreached node on the same network
- [ ] `USE CREDENTIALS` button (primary green) appears in tools section
- [ ] Click → ~0.6s delay → node is BREACHED without crack
- [ ] Terminal logs "CREDENTIAL ACCESS — [node] bypassed using cached credentials"
- [ ] Non-Ghost: +3% trace; Ghost: no trace
- [ ] After disconnect: credential cache is cleared

**Scrape Memory:**
- [ ] Must have CPU ≥ 2 GHz (check player hardware — starter hardware is 1 GHz so this requires a shop upgrade)
- [ ] Breach an `admin_console`, `endpoint`, or `mail_server` node
- [ ] SCRAPE MEM button enabled
- [ ] Progress bar runs (~1.5–3s, purple)
- [ ] On complete: cache entry shows `→ [TARGET NODE NAME]` — the specific adjacent node
- [ ] SCRAPE ALERT text appears: "SCRAPED: [target] — credentials ready"
- [ ] No trace spike at all (always silent regardless of specialisation)
- [ ] If no adjacent unbreached nodes: terminal logs "no adjacent unbreached nodes"

**RAM management:**
- [ ] Dump and Scrape each consume 1 RAM slot while running
- [ ] Running dump + scrape simultaneously on 2-slot hardware should block a third concurrent op

---

## 9. Shop (Upgrade Shop)

- [ ] Shop opens with hardware and software tabs
- [ ] Hardware upgrades shown: CPU, RAM, HDD, Modem — current tier, next tier, price
- [ ] Buying hardware: credits deducted, stat updated on player; visible in Profile → Hardware
- [ ] Architect specialisation: 15% discount visible on prices
- [ ] World Event "Data Broker Sale": 20% discount shown
- [ ] Cracker tools visible: Cracker v1 (basic), v2 (DictAttack Pro), v3 (Decypher), v4 (Hydra Zero)
- [ ] Buying a tool: appears in Profile → Software tab; improves crack speed on next mission
- [ ] Cannot buy same tool twice (button shows "OWNED")
- [ ] Cannot afford item: button disabled + message

---

## 10. Operative Profile

**Overview tab:**
- [ ] Hardware section: reflects real-time values after shop purchases
- [ ] Statistics: totalMissions, successfulBreaches, successRate, traceFails, escapes, creditsEarned, creditsSpent
- [ ] Software grid: all owned tools listed with version and level
- [ ] Footer: account created date, last seen timestamp

**XP / Level bar:**
- [ ] Shows LVL X — rank title — XP value
- [ ] Bar fills proportionally toward next level
- [ ] After a mission: bar should update if XP was awarded
- [ ] Level-up: bar resets with new level number

**Factions tab:**
- [ ] If not in a faction: "FOUND A FACTION" form visible
- [ ] Fields: FACTION NAME (max 32), TAG (max 6), DESCRIPTION (max 120)
- [ ] Costs 50,000 Cr and requires Rank 3 (SPECIALIST)
- [ ] Below-rank attempt: error "Rank 3+ (SPECIALIST) required"
- [ ] Insufficient credits: error "Need 50,000 Cr to found a faction"
- [ ] Success: faction panel appears with name, tag, description, founder, member count, INVITE CODE
- [ ] Invite code is 8-char uppercase alphanumeric
- [ ] LEAVE FACTION button: clears faction from profile

**Standings tab:**
- [ ] Faction standings shown as horizontal bars (red for negative, green for positive)
- [ ] 5 factions listed: VOIDLINK INTERNATIONAL, ARUNMOR, ARES DIVISION, UNDERGROUND, THE NAMELESS
- [ ] Rank label shown right of each bar (CONTRACTOR, ASSOCIATE, etc.)
- [ ] Complete missions: standings shift based on target corporation
- [ ] All values update without page refresh

---

## 11. World Map (3D Globe)

- [ ] Opens via WORLD MAP button in taskbar
- [ ] Globe renders: sphere, equator ring, meridian ring
- [ ] Bounce library nodes visible as coloured dots on globe surface (with region labels)
- [ ] World target nodes visible: banks, corps, gov facilities — different colours per type
- [ ] Connection arcs drawn between active route hops
- [ ] Legend panel top-right: explains node type colours
- [ ] Mouse drag: rotates globe
- [ ] Scroll: zooms in/out (clamped min/max)
- [ ] Globe is responsive: resize window and canvas adapts
- [ ] Lazy-loaded: does not block initial app render

---

## 12. System Console

- [ ] Visible in bottom-right of desktop (above taskbar), always on top
- [ ] Shows: active mission name + trace %, or "IDLE" if no mission
- [ ] Shows: bounce route (e.g. `BOUNCE: 2 HOPS → [OSLO, AMSTERDAM]`)
- [ ] Shows: active world events
- [ ] Shows: gateway bandwidth, proxy count
- [ ] Dirty hop warnings shown in orange if any bounce nodes are dirty
- [ ] Console is collapsible (click header)
- [ ] Updates in real time (every tick)

---

## 13. World Events

- [ ] Events appear in taskbar as pills (coloured, pulsing dot)
- [ ] Events have distinct colours: trace-reduction = green, trace-increase = red, shop discount = cyan, reward boost = orange
- [ ] Hovering a pill shows full event description
- [ ] Active events affect gameplay: verify trace speed changes during a SWEEP or GHOST event
- [ ] Events expire after their duration; pill disappears
- [ ] System console shows active events

---

## 14. Story Missions

- [ ] First mission "THE FIRST CONTRACT" appears on fresh start
- [ ] Story missions have richer briefings than procedural contracts
- [ ] Pre-defined networks (not randomly generated) — specific node layout
- [ ] Completing a story mission: it is removed from mission board and does NOT reappear on re-login
- [ ] Story missions award more XP than procedural (×4 multiplier)
- [ ] Arc 1 choice mission (if reached): three options presented; each triggers different outcome and faction standing changes
- [ ] News feed item appears after a notable story mission completes

---

## 15. Audio

- [ ] Ambient drone plays on desktop load; stops cleanly on logout
- [ ] Scan SFX plays when scan starts
- [ ] Crack SFX plays on successful breach
- [ ] Wipe SFX plays on successful log wipe
- [ ] Trace alarm begins at ~50% trace level; intensifies as trace rises
- [ ] Alarm stops immediately on successful disconnect

---

## 16. Persistence (Save/Load)

- [ ] All of the following survive a browser refresh:
  - [ ] Credits, reputation, rank
  - [ ] Completed mission IDs (no re-appearance)
  - [ ] Owned hardware and software
  - [ ] XP and level
  - [ ] Faction data (if founded)
  - [ ] Faction standings
  - [ ] Bounce library nodes (including dirty/traced status)
  - [ ] Active route configuration
  - [ ] Window positions and open state
  - [ ] Specialisation (if chosen)
- [ ] LOGOUT button (⏻) in taskbar: saves, clears session, returns to login
- [ ] LOGOUT is disabled while a mission trace is active (can't flee)

---

## 17. M13 — Service Exploits, Lockout & Subnet Zones (2026-05-28)

These features shipped in M13 and can be tested:

**Service-Specific Exploits:**
- EXPLOIT button label now shows the protocol: `EXPLOIT [FTP]`, `EXPLOIT [RDP]`, `EXPLOIT [SSH]` etc.
- FTP exploit: fastest (×0.35 speed); auto-wipes log on completion; terminal warns about network traffic visibility
- RDP/HTTPS exploit: silences admin monitoring for 45 seconds after breach
- SQL (MySQL/PostgreSQL) exploit: auto-completes database objectives instantly; no separate action needed
- SMTP/IMAP exploit: auto-dumps credentials to cache on completion
- Telnet exploit: auto-scans all directly connected nodes on breach
- SMB exploit: requires cached credentials — shows error if cache empty

**Brute Force Lockout:**
- Tier 4–5 nodes: cancelling a crack mid-progress triggers a 30-second lockout
- Locked-out nodes show `LOCKED OUT Xs` in HI and a pulsing red badge in network map
- Brute specialisation: requires 2 failed/cancelled attempts before lockout triggers
- Lockout raises trace level by +2%

**Subnet Zones:**
- Government (`government_classified`) and Cloud (`cloud_infrastructure`) networks now have Zone A/B segmentation
- Zone B nodes appear amber/orange in 3D network map; Zone A perimeter nodes stay their normal colour
- `admin_console` nodes are PIVOT nodes (bright yellow); shown with PIVOT badge in node panel
- Zone B nodes cannot be cracked until the pivot (admin_console) is breached first
- Selecting a Zone B node before pivot is breached: status shows `ZONE B — PIVOT REQUIRED`

**Known Limitations (as of 2026-05-28):**
- Scrape Memory requires CPU ≥ 2 GHz; starter hardware is 1 GHz. Buy a CPU upgrade in shop first.
- Lockout timer is display-only — it does not auto-refresh the countdown in real time (reselect the node to update the display).
- Leaderboard is local only (server infrastructure not yet built).
- Dark web layer not yet accessible.
- Mobile layout not yet built.

---

## 18. M14a — Pre-Alpha Polish Pass (2199-01-01)

The big sweep. Test everything below.

### 18.1 Settings Menu (⚙ button in taskbar, right side)
- [ ] **AUDIO** section:
  - [ ] MUSIC toggle: ON → idle music plays at desktop; OFF → music silent
  - [ ] MUSIC VOLUME slider: 0% silences, 100% full
  - [ ] SFX toggle: OFF silences clicks, beeps, scan/crack/wipe sounds
  - [ ] SFX VOLUME slider works
  - [ ] TEST SFX button plays the scan sound (when SFX enabled)
- [ ] **DISPLAY** section:
  - [ ] DARK / LIGHT theme buttons switch globally (windows, taskbar, scrollbars, text)
  - [ ] Light mode: no green text on white surfaces, all text legible
  - [ ] Dark mode: no grey-on-grey, scrollbar visible (#4a4a4a)
  - [ ] UI SCALE slider (70%–150%) zooms the entire app; layout still works at every step; RESET returns to 100%
  - [ ] REDUCE MOTION toggle
  - [ ] SHOW FPS COUNTER toggle
- [ ] **SHORTCUTS** section shows kbd keys for Ctrl+Scroll, ⊞ cascade, ⏻ logout, ⚙ settings
- [ ] Settings persist across browser refresh

### 18.2 Idle Music
- [ ] On desktop load, music fades in over ~3 seconds
- [ ] Music loops perfectly (~4:26 track, no audible click at the seam)
- [ ] On mission accept, music fades out over ~2.5s
- [ ] On mission disconnect, music fades back in
- [ ] Logout stops music cleanly

### 18.3 Trace Beep System
- [ ] At <10% trace: no beeps (just silence)
- [ ] At 10% trace: one beep every ~5 seconds
- [ ] At 50% trace: roughly one beep every 2.5 seconds (linear scaling)
- [ ] At 100% trace: rapid beeps (~120ms apart)
- [ ] Beep tone is digital (square + noise click), NOT the old wirring alarm
- [ ] On disconnect: beeps stop immediately

### 18.4 In-Game Clock (taskbar, right side)
- [ ] First-ever signup: shows `01.JAN.2199 00:01:01` ish
- [ ] Counter advances 1:1 with real time
- [ ] On returning login: clock continues from where account "would be" (real-time-elapsed since account creation)
- [ ] Tabular numerals — no jittery layout shift

### 18.5 Newsfeed Launcher
- [ ] NEWS button visible in the taskbar app launcher row
- [ ] Click → opens (or focuses) the news window

### 18.6 Window Position Memory
- [ ] Drag a window to a new position
- [ ] Close it via × button
- [ ] Reopen it via taskbar launcher → window appears at the position you dragged it to (not the default cascade slot)
- [ ] Position persists across save/load too (via auto-save)

### 18.7 Password Show/Hide on Signup
- [ ] Signup form PASSWORD label has a `SHOW`/`HIDE` button
- [ ] Click SHOW → password field becomes plain text; confirm field too
- [ ] Click HIDE → back to masked
- [ ] Validation still works the same regardless of show/hide

### 18.8 Mission Retry (after clean disconnect)
- [ ] Accept a mission, scan a node, but don't complete the objective
- [ ] Click LEAVE NETWORK (dirty exit, but no trace)
- [ ] Terminal shows "DISCONNECTED — objectives incomplete. Mission remains available for retry."
- [ ] Open MISSION BOARD → that mission is still in AVAILABLE list with fresh state
- [ ] Accept it again → works, objectives reset

### 18.9 Cracker Level Fix
- [ ] Buy `cracker_v2` from shop (4500 Cr)
- [ ] Open MISSION BOARD → any mission requiring "CRACKER LV2+" now shows `✓` (was previously broken — showed `✗`)
- [ ] Accept such a mission → works

### 18.10 Breach Button Removed from Network Map
- [ ] Select an unbreached node in NETWORK MAP
- [ ] Right-side panel does NOT show "▶ INITIATE BREACH" button
- [ ] All cracking happens via HACK TOOLS (CRACK / EXPLOIT button)

### 18.11 Bounce Routing on World Map (Reworked)
- [ ] HACKING INTERFACE no longer shows the bounce-routing panel
- [ ] Open WORLD MAP from taskbar
- [ ] Globe shows neon green lat/lon grid, dot intersections at every 30°
- [ ] Country outlines visible (faint green)
- [ ] Starfield in background; atmosphere halo around globe
- [ ] Bounce library nodes appear as larger green dots, with labels
- [ ] Drag globe to rotate; scroll to zoom
- [ ] Hover a bounce node → tooltip appears showing region/tier/status
- [ ] Click a clean green bounce node → added to BOUNCE CHAIN panel at bottom; arc drawn on globe
- [ ] Click again → removed from chain
- [ ] Chain panel shows YOU → [hops] → TARGET
- [ ] CLEAR ROUTE button empties chain
- [ ] Default (basic proxy): max 3 hops; clicking a 4th is blocked
- [ ] Buy proxy_v2 → max becomes 5; proxy_v3 → max becomes 7

### 18.12 Light Mode Coverage
- [ ] Toggle to light theme
- [ ] Desktop background: light gray, not black
- [ ] Taskbar: light surface, all icons and text legible
- [ ] All window chrome (title bar, borders): light
- [ ] Buttons: cyan accents visible on light, no white-on-white
- [ ] CRT scanlines and screen sweep are disabled
- [ ] Toggle back to dark → all returns to dark

### 18.13 Tutorial (25 steps)
- [ ] On first signup, tutorial starts immediately
- [ ] Soft cyan-glow spotlight ring; rest of screen dimmed but NOT blocked
- [ ] Game is fully interactive throughout tutorial
- [ ] Trace bar does NOT climb during tutorial (only event-driven spikes from scanning/cracking)
- [ ] Step 9 (ACCEPT YOUR FIRST CONTRACT) — only `story_arc01` is acceptable; all other missions show "Complete tutorial to unlock"
- [ ] Step 11 (SELECT A NODE) — clicking a node enables NEXT button (does NOT auto-advance)
- [ ] Step 14 (BOUNCE ROUTING) — spotlights WORLD MAP button in taskbar (NOT the hacking interface)
- [ ] Step 18 (TRANSFER THE FILE) — present, explicit; waits for primary objective completion
- [ ] Step 23 (HARDWARE AND SOFTWARE) — minimises non-shop windows when entered
- [ ] Step 25 (FACTION STANDINGS) — minimises non-profile windows when entered
- [ ] Tutorial only runs once; SKIP TUTORIAL button always available
- [ ] Completed flag persists across logout/login

### 18.14 Performance
- [ ] Open Chrome Task Manager (Shift+Esc) → tab CPU sits low when idle
- [ ] CRTOverlay WebGL canvas is gone (only CSS scanlines remain)
- [ ] DataRain still visible but only updates ~18 fps (no battery drain)
- [ ] Switch to another browser tab → return → game state correct (loops paused while hidden)
- [ ] No console errors after Pre-Flight checks

### 18.15 Year 2199
- [ ] Boot screen BIOS line shows `© 2199 Voidlink International`
- [ ] Settings window footer shows `© 2199 Voidlink International`
- [ ] In-game clock starts at year 2199

**Known Limitations (as of 2199-01-01):**
- Banking nodes on the World Map: visible but not yet interactive (M14b)
- Scrape Memory still requires CPU ≥ 2 GHz; starter hardware is 1 GHz
- Mobile layout not yet built
- Dark web layer not yet accessible

---

## 19. M14b — Banking Foundations (2199-01-01)

### 19.1 World Map bank targets
- [ ] Open WORLD MAP from taskbar
- [ ] Yellow bank dots visible: GLOBAL TRUST BANK (US-East), PACIFIC NATIONAL (US-West)
- [ ] Click a yellow bank dot → opens BANK TERMINAL window (does NOT add to bounce chain)
- [ ] Clicking a green bounce node still adds it to chain (banks have priority but separate hit-test)

### 19.2 Open account
- [ ] Click GLOBAL TRUST → bank panel shows name, region, APR, your cash
- [ ] No account yet → shows setup fee + "OPEN ACCOUNT" button
- [ ] Insufficient credits: button disabled
- [ ] Click OPEN ACCOUNT → setup fee deducted, account opens at 0 Cr balance
- [ ] Success terminal log: "Account opened at Global Trust Bank. APR 2.50%. Setup fee: 500 Cr."

### 19.3 Deposit / Withdraw
- [ ] After opening: balance panel shows ACCOUNT BALANCE 0 Cr
- [ ] Enter "1000" in amount → click DEPOSIT → cash -1000, balance +1000
- [ ] Click ALL CASH → amount field fills with current credits
- [ ] Click ALL SAVINGS → amount field fills with current balance
- [ ] Click WITHDRAW with amount > balance → button is disabled
- [ ] Click WITHDRAW with valid amount → credits returned, balance reduced
- [ ] Every transaction logged to terminal

### 19.4 Interest accrual
- [ ] With 1000 Cr deposited, leave the game running for ~60 seconds
- [ ] Balance should increase slightly (≈ 1000 × exp(0.025 × 60 / 31_557_600) ≈ 1000.00005 — visible at higher balances or over hours)
- [ ] "Interest earned" counter on balance panel tracks the cumulative gain
- [ ] Interest pauses when browser tab is hidden (game loop paused via visibility API)

### 19.5 Multi-bank
- [ ] Open PACIFIC NATIONAL on the globe
- [ ] Open second account (750 Cr setup, 3.40% APR)
- [ ] Switching between bank panels via the globe correctly shows that bank's account state

### 19.6 Persistence
- [ ] Deposit credits, log out, log back in
- [ ] Account balance, total interest earned, openedAt date all intact

---

## 20. M14c — Banking Expansion (2199-01-01)

### 20.1 New banks on the World Map
- [ ] CAYMAN TRUST visible at Caribbean (~19°N, 81°W)
- [ ] ZURICH VAULT visible at Switzerland (~47°N, 8°E)
- [ ] Both yellow bank dots; clicking opens BANK TERMINAL
- [ ] Both list under FINANCIAL INSTITUTIONS (when no bank selected) with OFFSHORE tag

### 20.2 Loans
- [ ] At Global Trust or Pacific National, open the LOAN tab
- [ ] Without an active loan: shows "LOAN AVAILABLE — UP TO X Cr"
- [ ] Borrow a small amount (say 1000 Cr) → cash increases, "OUTSTANDING PRINCIPAL" appears
- [ ] After ~30 seconds the principal increases slightly (loan interest accrues)
- [ ] Repay partial: principal reduces, terminal logs remaining principal
- [ ] Repay in full (FULL button): "Loan repaid in full" terminal log, panel returns to LOAN AVAILABLE
- [ ] Cannot borrow with active loan: error "Existing loan must be repaid first"
- [ ] Cannot borrow above max (collateral × multiplier): error "Max loan: X Cr"
- [ ] Cayman Trust does NOT show LOAN tab (savings only)
- [ ] Zurich shows LOAN tab with 7% APR

### 20.3 Currency trading (Cr ↔ Darkcoin)
- [ ] Open TRADE tab on Global Trust or Pacific National
- [ ] EXCHANGE RATE shows "1 DC = ~142 Cr", updates every 1.5s
- [ ] BUY DARKCOIN: enter Cr amount → shows estimated DC → click BUY DC → credits decrease, darkcoin increases
- [ ] SELL DARKCOIN: enter DC (e.g. 0.5) → shows estimated Cr → click SELL DC → DC decreases, credits increase
- [ ] 1% spread: buying then immediately selling loses ~2% (expected)
- [ ] Darkcoin balance visible in the stats row at top (top stat panel)

### 20.4 Equities
- [ ] Open STOCKS tab on Global Trust or Pacific National
- [ ] 4 stocks listed: ARMR (Arunmor), ARES (Defence), INTC (Internic), GTBK (Global Trust)
- [ ] Each row shows ticker, name, price, ▲/▼ drift %, owned shares (if any)
- [ ] Prices update every ~1.5s (random walk with mean reversion)
- [ ] Click a stock → highlighted, detail panel shows price + holdings
- [ ] Buy 5 shares of ARMR: credits deduct, holdings show "5 shares", cost basis recorded
- [ ] Sell at higher price → terminal shows "Realised P&L: +X Cr" (green)
- [ ] Sell at lower price → "Realised P&L: -X Cr" (warn yellow)
- [ ] Cannot sell more than you own (button disabled)

### 20.5 Offshore banks
- [ ] CAYMAN TRUST: only SAVINGS tab shown
- [ ] ZURICH VAULT: SAVINGS + LOAN tabs only (no trade/stocks)
- [ ] Both show "OFFSHORE" purple tag in header and bank card list
- [ ] Footer text reads "OFFSHORE ACCOUNT — DEPOSITS REDUCE HEAT…" (flavour only for now)
- [ ] Higher setup fees (5,000 / 8,000 Cr) than retail banks

### 20.6 Persistence
- [ ] Deposit, take a loan, buy stocks, swap to Darkcoin
- [ ] Log out, log back in
- [ ] All balances + holdings + loan principal intact
- [ ] Stock prices reset to base on fresh session (server-authoritative in future, OK for now)

---

## 21. M14d — UX & Balance Polish (2199-01-01)

### 21.1 Mandatory log wipe + WIPE ALL LOGS
- [ ] Complete a mission's primary objective
- [ ] COVER YOUR TRACKS section shows a list of breached nodes with ✓ / ✗ icons
- [ ] WIPE ALL LOGS button visible while any dirty nodes remain
- [ ] Click it → sequential wipe through all dirty nodes; terminal logs each
- [ ] Per-node ground-up wipe (selecting a node and using WIPE LOG) still works
- [ ] LEAVE NETWORK with dirty logs: warning text reads "⚠ MISSION WILL FAIL — wipe all logs first…"
- [ ] Dirty exit = mission abandoned, zero payment, news feed picks up

### 21.2 OPEN WORLD MAP from HI
- [ ] Open HACK TOOLS before accepting a mission
- [ ] BOUNCE ROUTING panel shows the current ACTIVE ROUTE
- [ ] "▶ OPEN WORLD MAP TO EDIT ROUTE" primary button visible
- [ ] Click → World Map window opens (or focuses if already open)
- [ ] Dirty hops listed separately with CLEAN HOP buttons
- [ ] Traced hops listed under "TRACED HOPS — CANNOT BE REUSED"

### 21.3 Connection effect
- [ ] Accept any mission
- [ ] Full-screen overlay appears: VOIDLINK UPLINK SERVICE
- [ ] Node chain renders: YOU → [hops] → TARGET, lighting up in sequence
- [ ] Dial-tone SFX plays (4 ascending tones + handshake buzz)
- [ ] Status line cycles through INITIATING / HANDSHAKE / AUTH / ACK
- [ ] Progress bar fills; overlay closes; Network Map ready

### 21.4 Sabotage missions always have a router
- [ ] Accept a `network_sabotage` mission
- [ ] Open NETWORK MAP — a CORE ROUTER node is present (was missing in some corporate_intranet/legacy_mainframe seeds before)
- [ ] Breach it → SABOTAGE NODE button works → objective completes

### 21.5 Clickable Corp / Gov / Underground / VoidLink
- [ ] Open WORLD MAP
- [ ] Click ARUNMOR / ARES / INTERPOL / NAMELESS / VOIDLINK targets
- [ ] TARGET INTEL window opens with: name, type, region, intel description, access requirements, flavour quote
- [ ] Footer reads "DIRECT CONNECTION NOT YET AVAILABLE — contract via the MISSION BOARD"
- [ ] These are NOT added to bounce chain (only green bounce dots can be)

### 21.6 Rep gating rebalanced
- [ ] cracker_v3 unlock: 80 rep (was 200)
- [ ] cracker_v4 unlock: 250 rep (was 600)
- [ ] proxy_v3 unlock: 100 rep (was 250)
- [ ] cpu_t3 unlock: 80 rep (was 200)
- [ ] cpu_t4 unlock: 250 rep (was 600)
- [ ] After 4–5 successful difficulty-3+ missions you should have access to cracker_v3

---

## 22. M14g — Upgrade Shop Skill Tree (2199-01-01)

### 22.1 Graph view (default)
- [ ] Open SHOP from taskbar — opens at 1280×620
- [ ] Top right: GRAPH / LIST toggle, GRAPH is active by default
- [ ] HARDWARE band (left) shows 4 columns: CPU, RAM, MODEM, GATEWAY
- [ ] SOFTWARE band (right) shows 6 columns: CRACKER, PROXY, LOG, SCAN, FW, MISC
- [ ] Vertical dashed separator between bands
- [ ] Each column has a starter node (●, always green) at top, tier 2/3/4 below
- [ ] Edges connect each tier to its prereq

### 22.2 Node colour states
- [ ] Starter / owned node: green-filled circle with ✓ / ●
- [ ] Affordable node: cyan-outlined circle showing tier badge (T2/v3/etc.)
- [ ] Locked-funds: amber-outlined circle (rep met, can't afford)
- [ ] Locked-rep: grey circle with 🔒
- [ ] Edge from owned → next node lights green; later edges stay dim

### 22.3 Side panel
- [ ] Default: shows UPGRADE TREE hint + colour-coded legend
- [ ] Click any node → side panel shows name, badge, description, stat, price
- [ ] Owned: shows "INSTALLED" badge
- [ ] Affordable: large BUY button
- [ ] Locked-funds: "Need X more Cr"
- [ ] Locked-rep: "Requires Y REP (you have Z)"
- [ ] BUY succeeds → node turns green, edge to next tier lights up, side panel refreshes

### 22.4 List view (legacy fallback)
- [ ] Click LIST toggle → reverts to the old list with HARDWARE / SOFTWARE tabs
- [ ] All purchase functionality intact
- [ ] Toggle back to GRAPH retains selected node state

---

## 23. M14h — Shop Expansion (2199-01-01)

### 23.1 New hardware columns in graph
- [ ] Open SHOP → graph view shows 6 HW columns: CPU, RAM, MODEM, GATEWAY, **GPU**, **COOLING**
- [ ] GPU starter is "No GPU" → click to inspect; tiers 1/2/3 below
- [ ] Cooling starter is "Passive" → tiers 1/2/3 below
- [ ] HW/SW band separator moved correctly between GATEWAY/COOLING and CRACKER
- [ ] Buy GPU v1 (12,000 Cr + 50 rep) → node turns green, edge to v2 lights up

### 23.2 New software columns
- [ ] Graph shows: CRACKER, PROXY, LOG, SCAN, FW, **SNIFF**, **MEM**, **AF**, MISC
- [ ] PacketGhost v1 (sniffer) and MemDump v1 (memory scraper) buyable at low rep
- [ ] Anti-Forensic v1 buyable at 80 rep, 7,500 Cr
- [ ] All new tools appear in profile's installed software list

### 23.3 Tier extensions
- [ ] Cracker v5 ChaosNet unlocks at 600 rep, 180k Cr (test gating only)
- [ ] Proxy v4 ShadowMesh unlocks at 300 rep
- [ ] Log Wiper v3 unlocks at 150 rep
- [ ] PortMap v3 DeepRecon unlocks at 200 rep
- [ ] Firewall Bypass v2 unlocks at 280 rep
- [ ] RAM tier 4 (8 extra slots) unlocks at 200 rep
- [ ] Modem v4 Quantum Link unlocks at 350 rep
- [ ] Gateway v3 Onion Stack unlocks at 220 rep

### 23.4 CONSUMABLES tab
- [ ] Toggle in shop header: GRAPH / LIST / CONSUMABLES
- [ ] 7 items listed: Panic Kit, Zero-Day Pack, Decoy Log, False Flag, Rep Token (Small/Large), Cred Pack
- [ ] Each card shows stack count "0 / N", description, price, BUY button
- [ ] Buy → quantity ticks up
- [ ] USE button appears next to BUY when stack > 0
- [ ] Cannot exceed maxStack (3/5/10 per item)
- [ ] Rep-locked items show "REQ X REP" instead of BUY

### 23.5 Consumable effects — wired in
- [ ] **Rep Token (Small)** — USE outside a mission → +25 rep instantly, token consumed
- [ ] **Zero-Day Pack** — USE → terminal says "Zero-day exploit primed". Accept a mission, scan a node → service auto-marked vulnerable with CVE-0DAY-PACK. Flag clears after one use.
- [ ] **Cred Pack** — USE → terminal says "Pre-acquired credentials loaded". Next CRACK attempt completes in ~200ms (instant bypass).
- [ ] **Panic Kit** — only usable during active mission. USE → trace clears, network disconnects, mission marked abandoned (returns to available).
- [ ] **Decoy Log** — USE → terminal log + 10-min flag set on player.activeFlags.

### 23.6 GPU acceleration
- [ ] Without GPU: crack a Tier 3 node, note duration
- [ ] Buy GPU v1 (×0.75) → re-do same crack → ~25% faster
- [ ] Buy GPU v3 → crack times roughly a third of unaccelerated

### 23.7 Sniffer auto-reveal
- [ ] Buy PacketGhost v1
- [ ] Accept a mission with a router in the network
- [ ] Breach the router → terminal logs "SNIFFER: N adjacent nodes auto-revealed"
- [ ] Those adjacent nodes now show isScanned=true (services + CVEs visible without scanning)

### 23.8 Anti-Forensic heat suppression
- [ ] Buy Anti-Forensic v1
- [ ] Complete a mission but leave logs dirty
- [ ] ~30% of the time: terminal logs "ANTI-FORENSIC: evidence reduction held"
- [ ] No heat flag set on corp for that run (won't show next-mission trace penalty)
- [ ] AF v2: ~60% suppression rate

---

## 24. M14h.1 — Hotfix Pass (2199-01-01)

### 24.1 Sabotage trace rebalance
- [ ] Accept a `network_sabotage` mission with 3 bounce hops in your route
- [ ] Complete primary objective → deadline = 60s + (3 × 15s) = 105s
- [ ] Trace climbs but is no longer brutal: baseRate +3 (was +8), alarm 2.5 (was 5)
- [ ] You have time to wipe logs AND secure-disconnect on average

### 24.2 Audio master bus
- [ ] Open Settings ⚙ → set MUSIC VOLUME slider → music level changes IMMEDIATELY
- [ ] Set SFX VOLUME slider → click anything, beep, etc. responds to slider
- [ ] MUSIC toggle OFF → silences idle music (fades to 0)
- [ ] SFX toggle OFF → silences all SFX (master gain → 0)
- [ ] Toggling either back on restores at the slider value

### 24.3 Auto-open windows
- [ ] On every desktop load (fresh signup OR returning login), these auto-open:
  - System Terminal, Mission Board, Operative Profile, News, **Hacking Interface**, **Bounce Chain**
- [ ] Bounce Chain shows "No active route" + "Open WORLD MAP to build your chain" hint
- [ ] HI shows "▶ OPEN WORLD MAP TO EDIT ROUTE" button when no mission active

### 24.4 Bounce Chain dedicated window
- [ ] Click BOUNCE in taskbar → opens (or focuses) Bounce Chain window
- [ ] Shows: header (N/M HOPS), chain (YOU → hops → TARGET), per-hop ✕ remove buttons
- [ ] Legend at bottom: Clean / Dirty / Traced
- [ ] EDIT ON WORLD MAP button opens (or focuses) WorldMap
- [ ] CLEAR button wipes the route

### 24.5 Bounce-library expansion
- [ ] Accept any mission, breach the entry_point node
- [ ] Terminal log: `+ BOUNCE NODE ACQUIRED: [corp] — entry_point. Added to library.`
- [ ] After disconnect, open WORLD MAP → new green dot visible at the corp's region
- [ ] Can be added to bounce chain like any other clean node
- [ ] Also triggers on `router` node breach
- [ ] Repeat breach of same node does NOT add duplicate

### 24.6 Better dial-up SFX
- [ ] Accept any mission. Connection effect plays:
  1. DTMF dial pulses (7 digits) — distinct beeps
  2. Ring tone fragment (440+480 Hz)
  3. Bandpassed pink-noise carrier hiss
  4. Dual-tone modem warble at 1270/2225 Hz with LFO wobble
  5. Frequency-sweep chirp (2400 → 900 Hz)
- [ ] ~3.5s total. Sequence text matches: DIALLING → RING → CARRIER → AUTH → ACK → ACKNOWLEDGED

---

## 25. M14h.2 — Layout Persistence + WorldMap Sensitivity + Hack Tools Re-openable

### 25.1 Full window-layout persistence
- [ ] Open the app, sign in
- [ ] Arrange windows: drag some, resize others, minimise one, close one
- [ ] Log out (⏻)
- [ ] Log back in
- [ ] Every window is in the exact same position + size as you left it
- [ ] Minimised windows stay minimised, closed windows stay closed
- [ ] z-order respects what was on top before logout
- [ ] Hacking Interface and Network Map are NOT auto-restored (they require an active mission)
- [ ] First-ever signup still gets the default 6-window layout

### 25.2 Resize persistence
- [ ] Resize any window by dragging the corner
- [ ] Log out, log back in → window opens at the resized dimensions

### 25.3 HACK TOOLS re-openable without mission
- [ ] At the desktop (no mission active), close the Hacking Interface window
- [ ] Click HACK TOOLS in the taskbar launcher → window re-opens
- [ ] Shows the bounce panel hint + dirty hop cleanup tools as before

### 25.4 WorldMap rotate sensitivity
- [ ] Open WORLD MAP, drag to rotate at default zoom → smooth
- [ ] Scroll-zoom in close to the globe
- [ ] Drag to rotate → movement is much slower / easier to focus on a region
- [ ] Zoom out → rotate speed scales back up to default
- [ ] Wheel zoom itself is also gentler (0.6× speed, was 1.0)

---

## 26. M14m — Multi-Phase Missions (2199-01-01)

### 26.1 PROJECT GHOST mission visibility
- [ ] On a FRESH session (delete save, sign up new operative), open MISSION BOARD
- [ ] After completing the tutorial, "Operation: PROJECT GHOST" mission visible
- [ ] Client handle: NIGHTOWL_22, base reward 18,000 Cr + 60 REP

### 26.2 Phase 1 — OSINT
- [ ] Accept PROJECT GHOST → connects to a corporate_intranet network
- [ ] HI shows a new PHASE STRIP above the step guide:
  - "PHASE 1 / 3 — OSINT" label
  - Three phase dots — first one cyan (current), other two grey
  - Phase description: "Locate the subsidiary holding the GHOST package..."
- [ ] Objective: "Transfer directory.enc from the corporate file_server"
- [ ] Complete the objective → terminal logs phase advance + 4,000 Cr advance payment

### 26.3 Phase 2 — Breach
- [ ] After phase 1 completes, terminal logs "▶ PHASE 2 — BREACH: Connect to the cloud infrastructure..."
- [ ] HI phase strip updates: first dot green ✓, second cyan, third grey
- [ ] New objective injected: "Corrupt the GHOST package database"
- [ ] Player must still complete this within the same active connection (single network for now)
- [ ] After phase 2: another 4,000 Cr advance + 20 REP

### 26.4 Phase 3 — Decoy
- [ ] Terminal: "▶ PHASE 3 — DECOY"
- [ ] HI phase strip: two dots green, third cyan
- [ ] Objective: "Upload decoy.enc to the personal_gateway file_server"
- [ ] Complete + wipe + secure disconnect

### 26.5 News Echoes
- [ ] After successful mission completion, check NEWS feed
- [ ] Three new news articles, one per completed phase:
  - "Anonymous Audit Reveals Subsidiary Mismanagement" (corporate)
  - "Corporate Database Corruption — Investigation Opens" (crime)
  - "Investigators Chase False Lead in Recent Breach" (crime)
- [ ] Timestamps are staggered (60s / 120s / 240s offsets)
- [ ] None of them are tagged as YOUR action (no player-action badge)

### 26.6 Legacy missions unaffected
- [ ] Other procedural missions (file_theft, etc.) work as before — no phase strip
- [ ] Story missions (story_arc01 etc.) still work — no phase strip
- [ ] Only PROJECT GHOST shows the phase UI

---

## 27. M14n — Mission Runtime Events (2199-01-01)

### 27.1 Events fire on triggers
- [ ] Accept a difficulty 3+ procedural mission
- [ ] Watch the trace bar climb — at 35% a banner pops in top-centre: "INTERPOL backbone has joined the trace..."
- [ ] Banner has a severity colour (red border = bad, cyan = neutral, green = good)
- [ ] Banner has a tag: ⚠ ALERT / EVENT / ◆ INTEL
- [ ] Plays a brief SFX (error sound for bad, tick for good)
- [ ] After ~6 seconds banner auto-dismisses with a fade
- [ ] Trace speed increases (or decreases for good events) by the event's delta

### 27.2 Multiple events can stack
- [ ] If multiple events fire close together, they stack vertically with gaps
- [ ] Each dismisses independently after its 6s lifetime

### 27.3 Per-difficulty event count
- [ ] Difficulty 1 missions: 2 events
- [ ] Difficulty 3 missions: 2–3 events
- [ ] Difficulty 5 missions: 3–4 events
- [ ] Difficulty 7+ missions: 4–5 events

### 27.4 Event types
- **Trace-threshold:** "INTERPOL joined" at 35%, "Corporate SOC" at 55%, "Rival operative" at 70%
- **Time-elapsed:** Auto-audit at 45s, backup slowdown (good!) at 90s, shift change at 120s
- **Node-breach:** Database alert on database breach, admin alert on admin_console, firewall alert on firewall

### 27.5 Effects applied
- [ ] When "Backup process" event fires (-0.4 delta), trace climbs visibly slower
- [ ] When "Rival operative" event fires, rivalHacker spawns in the network

### 27.6 No regressions
- [ ] Tutorial mission (FIRST CONTACT) has no procedural events (story missions use authored events)
- [ ] Toast pop-ups don't break the existing terminal log of events (both fire)

---

## 28. M14e — Banking Polish (2199-01-01)

### 28.1 Sabotage → stock drop
- [ ] Buy a stock (e.g. 5 shares of ARMR @ 245 Cr)
- [ ] Accept a `network_sabotage` mission, complete it
- [ ] Terminal: "MARKET REACTION: <TICKER> dropped 15% to X Cr (sabotage detected)."
- [ ] Open SHOP → BANK → STOCKS tab — that ticker shows a 15% drop in price
- [ ] Note: which stock drops is random (full corp↔ticker mapping is on the M14e-followup backlog)

### 28.2 MARKET CRASH world event
- [ ] Wait for the next world event cycle OR trigger via dev console (until time-elapsed simulation produces one)
- [ ] CRASH pill appears in taskbar (orange-red colour)
- [ ] Open a bank's STOCKS tab — all 4 prices drop sharply over ~10s
- [ ] Open SAVINGS — balance no longer grows from interest (effective APR is 0)
- [ ] Once event expires, prices begin recovering and APR resumes

### 28.3 Loan defaulting
- [ ] Open a bank, take a small loan
- [ ] Spend all your credits (or just stop paying)
- [ ] Wait for the loan principal to grow via interest until it exceeds 5× (cash + all bank balances)
- [ ] Terminal: "⚠ LOAN DEFAULT at <bankId>. Principal X Cr exceeds your collateral. -50 REP..."
- [ ] Open NEWS — new article: "Unidentified Borrower Flagged for Loan Default"
- [ ] PROFILE shows -50 REP
- [ ] activeFlags has `loan_default_<bankId>` set (visible via persistence inspection)
- [ ] No second default triggers from the same bank (flag prevents repeat)

### 28.4 No regressions
- [ ] Regular savings interest still accrues outside of MARKET CRASH
- [ ] Regular stock random-walk still works outside of MARKET CRASH
- [ ] Buying/selling stocks during MARKET CRASH still works (just at crashed prices)

---

## 29. M14o — Choice Missions (2199-01-01)

### 29.1 BLACK HALO visible
- [ ] On a fresh session, MISSION BOARD shows "Operation: BLACK HALO" (difficulty 4, 24,000 Cr + 80 REP, client: CIPHER)
- [ ] Briefing mentions a 3-phase structure with a decision point in phase 2

### 29.2 Phase 1 — Trace
- [ ] Accept the mission, breach corporate_intranet, transfer identity_dossier.enc
- [ ] Phase strip shows "PHASE 1 / 3 — TRACE"
- [ ] On phase 1 complete, the choice overlay appears full-screen with cyan border

### 29.3 Choice overlay
- [ ] Title: "◆ DECISION POINT"
- [ ] Subtitle: "PHASE 1 — TRACE COMPLETE"
- [ ] Two large buttons: "TURN THEM" (green effects badges) and "BURN THEM" (mixed effects)
- [ ] Each button shows: label, description, effect badges (rep + faction deltas)
- [ ] Game is paused behind the overlay (cannot click anything else)

### 29.4 TURN THEM path
- [ ] Click TURN THEM → overlay dismisses, terminal logs "Choice taken: 'TURN THEM'"
- [ ] +15 REP applied, Underground faction +20, Arunmor faction -10
- [ ] Phase strip now shows "PHASE 2 / 3 — RECRUIT"
- [ ] New objective: "Upload contact_handshake.enc to the gateway file_server"

### 29.5 BURN THEM path (try in a separate playthrough)
- [ ] Click BURN THEM → skips the Recruit phase entirely
- [ ] Goes directly to phase 3 — Cover
- [ ] +10 REP, Underground -15, Arunmor +25, Ares +10

### 29.6 No regressions
- [ ] PROJECT GHOST (no choices) still works exactly as before — auto-advances phases
- [ ] Legacy single-phase missions still work
- [ ] Choice overlay doesn't appear on non-choice missions

---

## 30. M14f — Exfiltration Channels (2199-01-01)

### 30.1 Channel bar visible during active mission
- [ ] Accept any mission with files (file_theft works well)
- [ ] In NETWORK MAP, above the main canvas, see "EXFIL:" bar with 4 buttons:
  - DIRECT FTP (always available, default)
  - ENCRYPTED TUNNEL (locked unless you have Proxy v3+)
  - DNS TUNNELING (locked unless Port Scanner v2+)
  - ICMP EXFIL (locked unless Ghost spec + CPU ≥ 4 GHz)
- [ ] Locked buttons show 🔒, are dim, disabled

### 30.2 Direct FTP (default)
- [ ] Click DIRECT FTP (active by default)
- [ ] Breach a file_server, click TRANSFER on a file
- [ ] Terminal: "[DIRECT FTP] Initiating transfer: file.enc (X KB @ Y KB/s)…"
- [ ] Transfer at modem speed, no trace mod
- [ ] Completes normally

### 30.3 Encrypted Tunnel (Proxy v3+)
- [ ] Buy Proxy v3 from shop (or skip if not affordable)
- [ ] Channel button becomes active
- [ ] Click ENCRYPTED TUNNEL → button highlights cyan
- [ ] Start a transfer: trace level DROPS by 5% at start
- [ ] Transfer takes 60% longer (1/0.6×) than direct

### 30.4 DNS Tunneling (Port Scanner v2+)
- [ ] Buy Port Scanner v2 (22,000 Cr)
- [ ] Channel available; click → cyan highlight
- [ ] Transfer takes 5× longer (1/0.2×)
- [ ] Trace -2% on start

### 30.5 ICMP Exfil (Ghost + CPU 4+)
- [ ] Only available if specialised as Ghost + CPU ≥ 4 GHz
- [ ] If you meet criteria: channel is selectable
- [ ] 20× slower transfer, -10% trace on start — pure stealth play

### 30.6 No regressions
- [ ] Single-phase missions still work
- [ ] Multi-phase missions (PROJECT GHOST / BLACK HALO) still work
- [ ] Channel resets to DIRECT FTP on next mission

---

## 31. M15 — Privilege Escalation + Persistent Backdoors (2199-01-01)

### 31.1 ESCALATE button
- [ ] Buy Cracker v3 (180 rep, 18,000 Cr) + CPU v3 (80 rep, 24,000 Cr) from the shop
- [ ] Accept any mission, breach a node
- [ ] In the node panel, ESCALATE PRIVILEGES button appears (amber)
- [ ] Without those upgrades, button is disabled with a tooltip
- [ ] Click ESCALATE → trace spikes (+ tier × 2.5%), terminal logs "[ROOT] Privileges escalated..."
- [ ] [ROOT] badge appears on the node panel

### 31.2 PLANT BACKDOOR
- [ ] After ESCALATE, a PLANT BACKDOOR button appears (purple)
- [ ] Click → terminal: "[BACKDOOR] Persistent access planted..."
- [ ] Badge text: "✓ BACKDOOR ACTIVE — future missions to this target..."

### 31.3 Backdoor on next mission
- [ ] Disconnect cleanly
- [ ] Wait for or find another mission against the SAME corporate target (clientHandle)
- [ ] On accept, terminal logs "[BACKDOOR] Pre-breached <node_type>..."
- [ ] In Network Map, that node is already isBreached + isScanned with hasBackdoor=true
- [ ] You can go straight to objective without crack/scan on that node

### 31.4 No regressions
- [ ] Missions without backdoor flags work normally (no pre-breach)
- [ ] All other mechanics (trace, wipe, exfil, phases, choices) work unchanged

---

## 32. M14h.4 — Signup email confirmation + password reset (2199-01-01)

### 32.1 Signup verify
- [ ] Fill out the signup form → click REGISTER OPERATIVE
- [ ] Panel switches to "DARKNET RELAY — CONFIRMATION REQUIRED"
- [ ] The dashed purple "INTERCEPTED (demo build)" box shows a 6-digit code
- [ ] Wrong code shows "INCORRECT CODE — CHECK YOUR INBOX"
- [ ] Correct code → DesktopScreen loads; terminal: "Email verified."
- [ ] RESEND replaces the code; CANCEL returns to signup with all fields intact

### 32.2 Forgotten password
- [ ] On a saved operative, click CONNECT then click FORGOT? in the inline password row
- [ ] Reset panel asks for the account email
- [ ] Unknown email → "NO OPERATIVE FOUND FOR THAT EMAIL"
- [ ] Known email → code panel appears with the demo code visible
- [ ] Wrong code → "INCORRECT CODE"
- [ ] Correct code + new password (min 6 + 1 special) + matching confirm → "Password reset" terminal log
- [ ] Returned to operative picker; the new password unlocks the save

---

## 33. M14h.5 — Mid-game rebalance batch (2199-01-01)

### 33.1 +PROXY removal + relay-driven bounceCount
- [ ] No +PROXY / -PROXY buttons anywhere in Hacking Interface
- [ ] Open WORLD MAP, build a 3-hop relay chain
- [ ] Start any mission — System Console "RELAY CHAIN — 3 HOPS" row visible
- [ ] Effective trace rate (Taskbar pill) is roughly 0.65³ ≈ 27% of the unhopped rate

### 33.2 Hop caps
- [ ] Starting (proxy_basic) → max 3 hops
- [ ] Proxy v2 → max 6
- [ ] Proxy v3 → max 8
- [ ] Proxy v4 → max 10

### 33.3 Trace rebalance
- [ ] Easy network (traceSpeed 5) — passive ~9 min to 100% (was ~7)
- [ ] Mid-tier networks no longer blow through 0→100 inside a minute when you have a relay chain

### 33.4 Sabotage briefing
- [ ] Accept a network_sabotage mission — briefing reads "Disable the network — breach a core router OR an admin console to take it offline"
- [ ] Both node types complete the objective

### 33.5 Banking APRs + notoriety
- [ ] BankWindow shows new APRs (Global 12%, Pacific 22%, Cayman 6%, Zurich 15%)
- [ ] Each bank card shows its notoriety/h indicator (orange for +, green for -)
- [ ] Holding a balance in Pacific over a few minutes raises `player.notoriety` (System Console shows NOTORIETY row at ≥3 or with any non-zero value)
- [ ] Holding a balance in Cayman/Zurich tics it down (clamped at -5)
- [ ] At mission start with notoriety > 0, baseRate is +0.10 %/s per point higher; warning terminal line at ≥3

### 33.6 World clock (VST)
- [ ] Taskbar clock advances 1:1 with real time and shows the same value across multiple browser windows on the same wall-clock minute (independent of which operative is logged in)
- [ ] Real-world 2026-01-01 00:00 UTC maps to game 2199-01-01 00:00 UTC (verify by spot-checking elapsed-since-anchor maths)

### 33.7 Login save-list reveal
- [ ] On login screen with ≥2 saves, the cards slide in left-to-right one at a time (~220 ms apart) with a soft click SFX per card

---

## 34. M14h.6 — Encrypted Email Inbox + Mission Relay Gating (2026-06)

### 34.1 Inbox seed + UI
- [ ] First login (or first ever for a fresh save): INBOX taskbar button shows 3 unread badge
- [ ] Click INBOX — window opens 720×480 with sidebar + reader pane
- [ ] Three seed messages present: VoidLink Dispatch welcome, CIPHER advice, sys.ops billing
- [ ] CIPHER's message and VoidLink's are ENCRYPTED (purple cipher grid until DECRYPT WITH KEY)
- [ ] sys.ops is plain (no decrypt step)
- [ ] Category chips colour-coded: cyan (contact), mid-grey (system), gold (mission), purple (faction), pink (darknet), red (rival)
- [ ] Star toggle works (gold ★)
- [ ] DELETE removes the row
- [ ] MARK READ button clears unread badge

### 34.2 Mission-accept inbox dispatch
- [ ] Accept any mission — terminal logs as usual
- [ ] Open INBOX — new ENCRYPTED `mission` category message at top from the contract client
- [ ] Decrypt — body matches briefing + reward/difficulty/contract-ID footer
- [ ] Inbox persists across logout (save v4)
- [ ] Inbox count cap at 100 (verify by opening DevTools localStorage if you've cycled through enough)

### 34.3 Mission relay-hop gating
- [ ] Open MISSION BOARD with zero active route
- [ ] Mission cards Difficulty 2+ show new `✗ RELAY ≥N HOPS` chip in red
- [ ] ACCEPT disabled for any card whose RELAY check fails
- [ ] Hint when ONLY relay fails: "Build a N-hop relay on WORLD MAP" (not the generic shop hint)
- [ ] Hint when relay + something else fail: defaults to "Upgrade in SHOP to unlock"
- [ ] Open WORLD MAP, build a relay chain to satisfy the missing hop count
- [ ] Return to MISSION BOARD — relay chip now green ✓, ACCEPT enabled

---

## 35. M14h.7 — NetworkMap Cyberpunk Visual Rework (2026-06)

- [ ] Accept any mission to render NetworkMap
- [ ] Verify cyan starfield visible at distance (small bright dots, parallax on rotate)
- [ ] Verify scan-grid plane visible below the node graph (cyan thin lines, semi-transparent)
- [ ] Node emissives glow softly (bloom) — not blown out / smeared
- [ ] Selection ring still works (click a node, cyan torus appears)
- [ ] Rival ring still spins orange (spawn rival via mission events to verify)
- [ ] Edges read as cyan (was grey 0x1a1a1a, now ~0x2a4a6a)
- [ ] Resize window — composer scales without artifacts
- [ ] Disconnect — graph tears down without WebGL warnings

---

## 48. M14q (Sub-sprints C + E) — Cipher Essays + Splash Cards (2026-06)

### 48.1 Cipher essay drip (Sub-sprint C)
- [ ] Complete 3 successful missions with a principled pattern → CIPHER's "on the Bond, in plain language" essay arrives
- [ ] Same conditions with mercenary pattern → essay arrives with shorter "on the Bond" tone variant
- [ ] Reach Rank 3 → NIGHTOWL_22's "the history we don't write down" arrives
- [ ] Burn a relay node → CIPHER's "on burning relays" essay arrives (in-game `relay_burn_count` flag check)
- [ ] First REVELATION contact → CIPHER's "the argument" essay arrives (the Stewardship-vs-Bond school debate)
- [ ] 30+ days since signup → NIGHTOWL_22's "why we use VST" essay arrives
- [ ] Notoriety ≥ 5 → CIPHER's "Reykjavík and other lies" essay arrives
- [ ] Each essay fires exactly once (verify by completing the trigger condition again — no re-fire)
- [ ] Strong-mercenary players DO NOT receive `cipher_essay_bond`, `cipher_essay_astra`, `cipher_essay_revelation`, `nightowl_essay_history` (variant returns null)

### 48.2 Splash cards (Sub-sprint E)
- [ ] Accept first mission ever → "FIRST CONTACT" splash fires full-screen with motif glyph, subtitle "Arc 1 · Mission 1", body paragraph
- [ ] SPACE / click / Escape skips immediately
- [ ] After 12s the splash auto-dismisses
- [ ] Accept `story_arc1_02` → "THE LEAD" splash fires
- [ ] Accept `story_arc1_03` → "THE ORIGIN NODE" splash
- [ ] Complete Arc 1 choice → "AFTERMATH" splash (after reflection scene dismisses)
- [ ] Accept `story_arc5_01` → "DIRECTOR KOVAC" splash
- [ ] Each splash fires once (re-running same condition does not re-fire)
- [ ] Settings → DISABLE SPLASH CARDS toggle, then trigger any splash → splash is suppressed silently

### 48.3 Static motif variant
- [ ] The Aftermath card uses the 'static' motif — visible scanline overlay across the screen

---

## 47. M14q (Sub-sprints A + B + D) — Lore Exposure Layer (2026-06)

### 47.1 Boot Prologue
- [ ] Fresh-install boot (clear `localStorage` first) shows boot logs → then prologue screen with typewriter text on neon-globe backdrop
- [ ] Title reads "VOIDLINK INTERNATIONAL — OPERATIVE BRIEFING"
- [ ] Lines type at ~38 cps with light tick SFX every ~3 characters
- [ ] After all 7 lines, "SIGN THE BOND" button appears
- [ ] Clicking it advances to Login screen
- [ ] SPACE / Enter / Escape during typing → snaps to completed state
- [ ] Second boot: prologue does NOT show; goes straight to Login
- [ ] Settings → PROGUE → REPLAY ON NEXT BOOT button shows confirmation; next boot replays

### 47.2 Codex window
- [ ] CODEX appears in taskbar launcher list
- [ ] Open CODEX → window opens 880×580 with sidebar + reader pane
- [ ] Sidebar shows 5 category headers: FACTIONS / PEOPLE / HISTORY / CULTURE / TERMS
- [ ] Each entry shows title + tagline; locked entries show "⊘ LOCKED ENTRY" + "Unlocks through play."
- [ ] Voidlink Bond entry is unlocked from signup (always visible)
- [ ] Click locked entry → nothing happens; click unlocked entry → reader pane shows category / title / tagline / body
- [ ] **bold** in body renders as cyan bold text

### 47.3 Unlock toasts
- [ ] Complete first mission → toast slides in from the right: "NEW CODEX ENTRY: Voidlink International" + tagline
- [ ] Toast auto-dismisses after 8 seconds
- [ ] Click toast → CODEX window opens (or focuses) and scrolls to the entry
- [ ] Up to 3 toasts visible at once if multiple unlock simultaneously

### 47.4 Read tracking
- [ ] After unlock, sidebar entry shows cyan dot to the left of its title
- [ ] Click entry to read → dot disappears
- [ ] Reopening the window keeps the read state

### 47.5 Unlock conditions per entry
- [ ] First mission → Voidlink International
- [ ] First CIPHER inbox message → CIPHER + The Mesh
- [ ] First Arunmor mission (story_arc1_02) → Arunmor Corp + Mei Lin
- [ ] First bank account → Nexus Financial
- [ ] Rank 5 → JCB + Director Kovac + Reconciliation Accords
- [ ] Tutorial complete → Mesh slang glossary
- [ ] Day 7 in-game → VST entry

### 47.6 Environmental flavour
- [ ] Boot screen line reads "VOIDLINK BIOS v2.1.0 — Internic-licensed routing — © 2199 Voidlink International, Geneva"
- [ ] Each bank window shows the canonical subheader between header and flavour

---

## 46. M14p (Pass 2d) — Arc 5 9-ending Fan-out (2026-06)

### 46.1 Trigger and choice overlay
- [ ] DevTools: `useGameStore.getState().triggerEndingChoice()` opens the EndingChoiceOverlay
- [ ] Title reads "THE END OF ARC 5 — CHOOSE"
- [ ] Heading reads "One/Two/Three paths remain open to you." matching the offered count
- [ ] Each choice card shows family + conviction title + italic tagline

### 46.2 Pattern + Arc 1 choice combinations
- [ ] arc1_key_choice='upload' + principled flags → LIBERATION — The Folk Hero offered
- [ ] arc1_key_choice='upload' + mercenary flags → LIBERATION — The Ransom offered
- [ ] arc1_key_choice='destroy' + low Arunmor standing → only ERASURE family offered
- [ ] arc1_key_choice='destroy' + Arunmor standing ≥40 → ERASURE + CONTAINMENT
- [ ] arc1_key_choice='sell' → CONTAINMENT family
- [ ] arc1_key_choice='upload' + `revelation_contact_count=5` → LIBERATION + SOVEREIGNTY

### 46.3 Ghost spec
- [ ] Ghost specialization always adds GHOST as a third option
- [ ] Picking GHOST shows the "no epilogue" epilogue (it acknowledges that there is no summary)

### 46.4 Reformer's Path
- [ ] Heavy mercenary catalogue + recent_choice_direction = +6 → Reformer is offered
- [ ] Picking it shows the late-conversion epilogue

### 46.5 Epilogue transition
- [ ] Click any choice card → card grid replaced by ending title + epilogue body
- [ ] FINISH button dismisses the overlay
- [ ] `ending_chosen` flag set to the ending ID; cannot re-trigger

### 46.6 No numbers visible
- [ ] At no point in the choice or epilogue overlay is any numeric score shown.

---

## 45. M14p (Pass 2c) — Reflection Scenes (2026-06)

### 45.1 Arc 1 reflection auto-fires
- [ ] New operative, play through Arc 1 to the key choice
- [ ] Pick any choice (upload / destroy / sell)
- [ ] Full-screen REFLECTION overlay appears with title "REFLECTION — FIRST PASS"
- [ ] Body text references `{DAYS}` (resolved to a number) and `{MISSIONS}` (resolved to the player's mission count)
- [ ] 4-5 facts surfaced, appropriate to the pattern (sell → mercenary facts; upload + civilian protections → principled facts)
- [ ] CONTINUE button dismisses the overlay
- [ ] On next mission disconnect or save reload, the overlay does NOT re-appear (reflection_end_of_arc_1 flag persists)

### 45.2 Pattern shapes the text
- [ ] Reset, replay Arc 1, choose 'sell' with several `choice_civilian_burned` flags set
- [ ] Reflection body reads with strong-mercenary lines ("you used to think you'd quit when you hit a million credits", "the JCB has your handle on a watchlist")
- [ ] Reset, replay Arc 1, choose 'upload' with several `choice_whistleblower_protected` and `choice_civilian_spared` flags
- [ ] Same scene, completely different text — strong-principled lines ("CIPHER addresses you by your initials now", "the Underground has a name for you")

### 45.3 No numbers visible
- [ ] The overlay shows: title, body, CONTINUE button. The body contains the player's mission count, days since signup, counts of specific choices (civilians spared, etc) — but NO `principledScore` / `mercenaryScore` / `netScore` is ever rendered. Verify by inspecting the text.

### 45.4 Manual trigger (for story missions / future seasons)
- [ ] In DevTools console run `useGameStore.getState().triggerReflection('anniversary')`
- [ ] Anniversary reflection appears
- [ ] Run it again: nothing happens (gated via flag)

---

## 44. M14p (Pass 2b) — Contract Availability Gating (2026-06)

### 44.1 Pattern-gated procedural contracts appear at D5+
- [ ] Reach rank/REP that surfaces Difficulty-5 contracts on the board
- [ ] Refresh contracts repeatedly (mission completions reroll) — over a sample of ~10 D5+ contracts, observe that some carry a chip "Underground-vetted client" and some "Discreet client — no oversight" (~20% each, ~60% open)
- [ ] D1-D4 contracts NEVER show pattern gate chips

### 44.2 Mismatched pattern disables ACCEPT
- [ ] Open a contract with the "Underground-vetted client" chip while your pattern is mercenary-leaning
- [ ] The chip shows red ✗
- [ ] ACCEPT button is disabled
- [ ] Hint reads: "Client wants a different kind of operative — earn the track record."

### 44.3 Matching pattern enables ACCEPT
- [ ] Build a strongly principled pattern (DevTools or natural play)
- [ ] Same Underground-vetted contract now shows green ✓
- [ ] ACCEPT enabled

### 44.4 The chip never shows a number
- [ ] Inspect the mission card carefully — the only label visible is `patternGateLabel` ("Underground-vetted client" / "Discreet client — no oversight"). NO numeric score is ever rendered.

---

## 43. M14p (Pass 2a) — NPC Dialogue Tone Variants (2026-06)

### 43.1 CIPHER's first advice — pattern-aware
- [ ] Start a new operative, complete 2 missions cleanly
- [ ] CIPHER's "re: nice work" or similar message appears in inbox after the second mission complete
- [ ] Tone matches pattern (principled: warm acknowledgement; neutral: formal observation; mercenary: terse one-line signoff)

### 43.2 The Three Rules letter — silence for high mercenary
- [ ] Build up to 8 successful missions with a strongly principled pattern (DevTools: set `arc1_key_choice='upload'` + several `choice_civilian_spared`)
- [ ] After mission 8 complete, "three rules — by request" email arrives from CIPHER
- [ ] Reset, build to 8 missions with strongly mercenary pattern (DevTools: `arc1_key_choice='sell'`, `choice_civilian_burned=5`)
- [ ] After mission 8 complete: **CIPHER does NOT send the three-rules email**. That silence IS the message. Verify by inspecting inbox — no new CIPHER mail post-mission.

### 43.3 Dispatch rank-3 — same event, different tone
- [ ] Reach rank 3 (via faction standing / REP) with principled pattern → rank-3 email mentions "Stewardship contracts"
- [ ] Reach rank 3 with mercenary pattern → rank-3 email mentions "Tier-2 Mercenary Listings"

### 43.4 Arc-1 aftermath — three variants
- [ ] Set `arc1_key_choice='upload'`, finish a mission → CIPHER's "you uploaded it" arrives
- [ ] Reset, set `arc1_key_choice='destroy'` → CIPHER's "you destroyed it" arrives
- [ ] Reset, set `arc1_key_choice='sell'` → CIPHER's "you sold it" arrives — for strong-principled it reads "I was wrong about you"; for strong-mercenary it's just "Sold. The credits clear in a few hours. Cipher."

### 43.5 Underground induction
- [ ] Reach Underground standing ≥ 50 AND set `choice_whistleblower_protected=1` with principled pattern
- [ ] On next mission disconnect, CIPHER's "welcome" or "a note" induction email arrives
- [ ] Reset, reach same conditions but with mercenary pattern: induction does NOT fire (verify inbox)

### 43.6 Each entry fires at most once
- [ ] After a dialogue entry has fired, complete another mission with same conditions still true
- [ ] Verify the same entry does NOT re-fire (gated via `dialogue_fired_<id>` flag in activeFlags)

---

## 42. M14p (Pass 1) — Choice Architecture + News Framing (2026-06)

### 42.1 Pattern reader (unit-tested, no UI)
- [ ] 24 new unit tests in `libs/core/src/engine/decisionPattern.test.ts` + `libs/core/src/data/newsFraming.test.ts` pass (run `pnpm test`)
- [ ] `getDecisionPattern(player)` returns sensible scores given known flags
- [ ] **The pattern is NEVER rendered to the player as a number anywhere in the UI** — visually verify by searching the running app for any number derived from `principledScore`, `mercenaryScore`, `netScore`. (None should appear; if any does, M14p has been compromised.)

### 42.2 News framing — visible reflection
- [ ] Start a new operative and complete a sabotage mission cleanly. News article uses the **neutral** bucket adjectives (`anonymous`, `unattributed`, `skilled`).
- [ ] DevTools: set `player.activeFlags.arc1_key_choice = 'sell'` and `player.activeFlags.choice_civilian_burned = 3` (forces strong mercenary pattern).
- [ ] Complete another sabotage mission. News article should now use **strong mercenary** adjectives (`savage`, `merciless`, `vicious`).
- [ ] DevTools: reset, set `player.activeFlags.choice_whistleblower_protected = 5` (forces strong principled).
- [ ] Complete another mission. News article uses **strong principled** adjectives (`anonymous`, `principled`, `careful`).
- [ ] Same mission type, three different framings — same event, different narration.

### 42.3 Back-compat
- [ ] Legacy `arc1_key_choice` flag still works as before. The Arc 1 ending mission still gates on it (`requiredFlagValue` check unchanged).
- [ ] Existing saves with `arc1_key_choice` set load and their pattern reads correctly (the back-compat shim maps the legacy string to the pattern).

### 42.4 Catalogue extension
- [ ] Adding a new entry to `CHOICE_CATALOGUE` and setting the corresponding flag bumps the pattern score on next read. (No restart required — pure function.)

---

## 41. M14i — Research Tech Tree (2026-06)

### 41.1 Window + earning RP
- [ ] Taskbar shows a new RESEARCH launcher
- [ ] Click — RESEARCH BENCH window opens (1100×580), header shows `0 RP`, 5 columns visible
- [ ] Complete a Difficulty-3 mission with a clean exit (no IDS triggered) and full timestomped wipes
- [ ] Terminal: `+5 RP earned (D3 + clean + stomped). Total: 5.` (3 base + 1 clean + 1 stomped)
- [ ] Open RESEARCH — header now shows `5 RP`

### 41.2 Branch layout
- [ ] CRYPTO column (cyan), STEALTH (purple), HARDWARE (amber), SOCIAL (pink), AI (green)
- [ ] Each column shows 5 cards top-to-bottom (C1→C5, S1→S5, etc.)
- [ ] Cards above prereq met show in cyan border; affordable cards show amber border
- [ ] Locked cards (prereq not met) show dim 45% opacity with `req X` chip

### 41.3 Unlock first node
- [ ] With 5+ RP, click C1 (Quantum Primer, 3 RP)
- [ ] Terminal: `Research unlocked: Quantum Primer (3 RP). Crack speed +5%.`
- [ ] Card flips to green border + ★ tag
- [ ] RP header drops by 3

### 41.4 Verify crack speed effect
- [ ] Start a mission and crack a node
- [ ] Crack duration is ~5% shorter than before C1 (verifiable by comparing baseline to post-unlock durations on the same tier)

### 41.5 Lattice Math discount
- [ ] With C1 + 5 RP, unlock C2 (Lattice Math, 5 RP)
- [ ] Verify subsequent Crypto nodes show cost `node.cost - 1` (e.g. C3 now shows 6 RP instead of 7)

### 41.6 Stealth — relay-hop stack
- [ ] Unlock S1 then S2 (Phantom Routes)
- [ ] WorldMap relay-chain cap now `(baseCap + brute_synapse + 1)`. With proxy_basic the cap is 4 (no implant) or 5 (with Brute Synapse)

### 41.7 Hardware — RAM stack
- [ ] Unlock H1 → H2 → H3 → H4 (Memory Bus Tuning)
- [ ] HI RAM slot count is `base + 1 (architect spec) + 1 (architect cortex) + 1 (H4)` — all stack

### 41.8 Stealth — canary softening
- [ ] Unlock S1 → S2 → S3 (Forensic Static)
- [ ] Trigger a canary file — trace spike is +15% instead of +25%; terminal log reflects the lower number

### 41.9 Stealth — Total Ghost baseline
- [ ] Unlock S1 → S2 → S3 → S4 → S5 (Total Ghost)
- [ ] Accept any mission — baseRate is 0.10 %/s lower than before (stacks with Quantum Inhibitor implant)

### 41.10 AI branch gating
- [ ] On a fresh save, click A1 (Curious Anomaly) — `story-gated` chip visible, button disabled
- [ ] DevTools: set `player.activeFlags.revelation_contact_count = 1`
- [ ] Refresh — A1 unlocks normally

### 41.11 Persistence
- [ ] Unlock 3 nodes, log out, log back in — researchPoints + researchUnlocked persisted

### 41.12 Sovereignty (A5)
- [ ] Unlock the full AI chain (A1 → A5)
- [ ] Subsequent missions show `+N RP` where N is `difficulty + clean + stomped + 1`

---

## 40. M14l — Physical-Location Gateways (2026-06)

### 40.1 Gateway panel in profile
- [ ] Open OPERATIVE PROFILE
- [ ] Below the divider after stats, GATEWAY section visible with `Home Gateway` highlighted as active
- [ ] Four cards in a 2×2 grid: Home (★ ACTIVE), Safehouse (15 000 Cr), Corporate VPN (25 000 Cr), Tor Relay (40 000 Cr)
- [ ] Each card shows name + cost (or remaining rent days for active rented), effect summary, and acquire/switch button

### 40.2 Acquire + activate Safehouse
- [ ] With ≥ 20 000 Cr: click ACQUIRE on Safehouse → terminal: `Gateway acquired: Safehouse (UNDISCLOSED — EU-WEST). Switch in OPERATIVE PROFILE.`
- [ ] Card flips to a SWITCH button
- [ ] Click SWITCH → first week's rent (5 000 Cr) deducted, terminal: `Switched to Safehouse. First week's rent paid…`
- [ ] Safehouse card now ★ ACTIVE with "7d rent" label

### 40.3 Safehouse trace effect
- [ ] Accept any mission with Safehouse active
- [ ] Network's passive trace rate is ×0.90 of normal (e.g. traceSpeed-15 network ticks at ~0.49 %/s instead of ~0.54)

### 40.4 Corporate VPN trade-off
- [ ] Acquire + activate Corporate VPN
- [ ] Accept any mission — baseRate is ×1.15 (higher pressure)
- [ ] Hold ≥ 10 000 Cr at any public bank and let the next bank tick run
- [ ] `player.notoriety` ticks up at HALF the normal rate (verify via System Console NOTORIETY row over a few minutes)

### 40.5 Tor Relay
- [ ] Activate Tor Relay → trace baseline ×0.80 on next mission
- [ ] No rent, no notoriety mod

### 40.6 Eviction
- [ ] Activate Safehouse with low cash (say, 7 000 Cr)
- [ ] Wait for the weekly tick (the rent timer counts down in real time — fast-forward in DevTools by setting `player.gatewayPaidUntil['safehouse']` to `Date.now() - 1`)
- [ ] On the next bank-tick (~1 second after a transfer or wait), eviction fires
- [ ] Terminal: `EVICTED from Safehouse — couldn't cover rent…`
- [ ] Active gateway reverts to Home
- [ ] Inbox: new SYSTEM message from `Property Management` with subject `[EVICTION NOTICE] Safehouse`

### 40.7 Persistence
- [ ] Acquire + activate any gateway, log out and back in
- [ ] State persists: ownedGateways list intact, activeGatewayId preserved, paidUntil timer continues

---

## 39. M14k — Implants / Wetware (2026-06)

### 39.1 Shop tab + grid
- [ ] Open SHOP — new IMPLANTS toggle button next to CONSUMABLES
- [ ] Click IMPLANTS — 4 cards visible: Ghost Reflexes, Brute Synapse, Architect Cortex, Quantum Inhibitor
- [ ] Each card shows name + cost + blurb + description + EFFECT row + faction requirement (where applicable)
- [ ] Faction chip shows ✓/✗ based on current standing

### 39.2 Install a non-gated implant
- [ ] On a fresh save, buy Brute Synapse (Cr 120,000 — may need to grind first)
- [ ] Terminal: `Implant installed: Brute Synapse. Max relay-chain hops +1. This is permanent.`
- [ ] Inbox: new unread DARKNET message from "Underground Clinic" with procedure confirmation
- [ ] Card now shows ★ INSTALLED in green; INSTALL button gone

### 39.3 Verify Brute Synapse effect
- [ ] Open WORLD MAP — relay-chain cap is now `baseCap + 1` for current proxy tier (basic: 4 instead of 3, v2: 7 instead of 6, etc.)
- [ ] Bounce Chain Window shows the boosted cap in `N/X HOPS`

### 39.4 Faction-gated implant
- [ ] On a fresh save with 0 Underground standing, attempt to INSTALL Ghost Reflexes
- [ ] Button disabled; chip shows ✗ REQUIRES UNDERGROUND ≥ 50
- [ ] Grind to ≥ 50 Underground standing → button enables → install works

### 39.5 Architect Cortex effect
- [ ] Buy Architect Cortex (requires Voidlink Intl ≥ 100)
- [ ] During a mission, HI shows RAM `N/(baseSlots + 1)` (or `+2` if Architect spec also chosen)
- [ ] You can run one more simultaneous tool than before

### 39.6 Ghost Reflexes effect
- [ ] Install Ghost Reflexes
- [ ] During a wipe operation, the duration is ~20% shorter than before (Ghost spec adds further ×0.6 multiplier on top)

### 39.7 Quantum Inhibitor effect
- [ ] Install Quantum Inhibitor (requires Arunmor ≥ 50)
- [ ] Accept any mission — terminal shows the trace bar baseline visibly lower (the `-0.15 %/s` applies before notoriety)
- [ ] On traceSpeed-15 networks the passive rate drops from ~0.54 %/s to ~0.39 %/s

### 39.8 Persistence
- [ ] Log out then back in — implants persist; effects still apply
- [ ] Cannot re-install (button gone permanently)

---

## 38. M14j — Loadout Slots (2026-06)

### 38.1 Preset seed + UI
- [ ] First time MissionBoard or Bounce Chain Window renders for a fresh save, three preset chips appear at the top: 👁 STEALTH, ⚡ BRUTE, 💎 BANK RUN
- [ ] Each preset has a SAVE button to its right
- [ ] Hovering a preset shows tooltip with `route (N hops), exfil <id>, arm <consumable>`

### 38.2 Apply a preset
- [ ] On WORLD MAP, build a 2-hop relay chain
- [ ] In Bounce Chain Window, click SAVE next to STEALTH — terminal: `Loadout saved: STEALTH (2 hops).`
- [ ] Clear the relay (`CLEAR ROUTE`)
- [ ] Click the STEALTH chip — chip turns cyan (active), terminal: `Loadout applied: STEALTH (2/2 hops, exfil: dns).`
- [ ] activeRoute restored to the 2 hops
- [ ] exfilChannel changed to DNS (verify in NetworkMap exfil bar during next mission)

### 38.3 Mission-active lockout
- [ ] Accept any mission
- [ ] LoadoutBar chips are disabled with tooltip "Disconnect first to apply a different loadout"
- [ ] Hint text "locked while connected" appears on the right
- [ ] SAVE still works during a mission (saves current state for next time)

### 38.4 Armed consumable on apply
- [ ] Buy a Decoy Log consumable
- [ ] Click STEALTH preset — `consumable_decoy_log_armed` flag should be set (check via DevTools or by triggering a wipe — should consume the decoy)

### 38.5 Persistence
- [ ] Save settings: apply STEALTH preset with 2 hops, then log out
- [ ] Reconnect — activeRoute restored, exfilChannel still DNS, active loadout chip still cyan

### 38.6 Deletion guard
- [ ] (Future custom-slot UI exists or via DevTools) — attempt to delete a preset → returns 'preset', no change
- [ ] Custom slot can be deleted normally

---

## 37. M14f.1 — Canary Files + Timestomping (2026-06)

### 37.1 Canary trip without detection tool
- [ ] On a fresh account (no `port_scanner_stealth` / `_v3` / `sniffer_v2`), accept a mission targeting a `corporate_intranet` or `government_classified` network (IDS present)
- [ ] Breach a file_server / database / mail_server node — multiple times across missions if needed until a canary spawns (chance scales with tier; T3 ≈ 30% per data node)
- [ ] File list shows the canary as a normal file (no special marker visible)
- [ ] Click TRANSFER on the canary
- [ ] Terminal: "⚠ CANARY TRIPPED: ... was a honeypot. IDS auto-alerted security."
- [ ] Trace jumps +25% immediately
- [ ] Alarm rate kicks in for ~15s (visible as accelerated bar)
- [ ] No actual file transfer happens (transferringFileId stays null)
- [ ] Next mission against the same corp starts with `heat_<corp>` flag → +2 %/s baseline + warning terminal line

### 37.2 Canary visibility with detection tool
- [ ] Buy `port_scanner_stealth` (or `port_scanner_v3` / `sniffer_v2`)
- [ ] On the next mission, a canary file shows a red `⚠ CANARY` chip next to its name
- [ ] Click TRANSFER anyway → same penalty (the tool reveals it, doesn't disarm it)

### 37.3 Timestomp + heat suppression
- [ ] Without any timestomper tool, complete a mission with clean wipe (all logs wiped, no IDS triggered)
- [ ] Disconnect — terminal warns "X nodes not timestomped. <corp> will start your next visit on heightened alert."
- [ ] `heat_<corp>` flag set; next mission baseRate +2 %/s
- [ ] Buy `timestomper_v1` (Chrono Stomper)
- [ ] Repeat clean-wipe mission against the same corp — terminal should NOT show the unstomped warning
- [ ] `heat_<corp>` deleted on clean exit; next mission has no heat penalty

### 37.4 Edge cases
- [ ] Tripping a canary still allows the player to disconnect (it's painful but not auto-fail)
- [ ] Trip + wipe sequence: canary trip raises heat → clean wipe + timestomp does NOT clear it (the canary already alerted them, timestomping wipes is too late). Verify: `heat_<corp>` persists even after timestomped wipe if the canary was tripped earlier in the same session.
- [ ] On a network with no IDS (e.g. `personal_gateway`), no canaries spawn

---

## 36. M14h.8 — Docs Consolidation (2026-06)

This is a docs-only milestone; verify the file tree only.

- [ ] `docs/` contains exactly: `Full_Plan.md`, `Complete_Tasks.md`, `Next_Stage.md`, `Roadmap.md`, `Testing_Guide.md` (plus subdirs if any)
- [ ] No `GAME_GUIDE.md`, `GAME_DESIGN_MASTER.md`, `PLAYTEST_WALKTHROUGH.md`, `DEV_GUIDE_*.md`, `ARCHIVE_*.md`, `UPLINK_NG_OVERVIEW.md`, `DEV_DOCS_INDEX.md`, or the old TitleCASE TESTING_GUIDE.md / NEXT_STAGE.md / COMPLETE_TASKS.md / ROADMAP.md
- [ ] `README.md` updated to reference the 5 docs only
- [ ] `CLAUDE.md` references the 5-doc model and the no-`Co-Authored-By: Claude` rule

---

# Part B — End-to-End Playtest Walkthrough

> Old-school walkthrough format: do each step in order, tick the box, note anything that doesn't match the **Expected** column. At the end of each phase there's a "Notes / Defects" space — jot anything weird, missing, or broken there. Estimated playtest time: **90–120 minutes** for a full pass.

**How to use this section:**

1. **Start with a clean slate** — DELETE SAVE on every save in the login screen so you're starting fresh
2. **Open browser DevTools (F12)** and keep the **Console** tab visible — flag any red errors
3. **Read each step's Expected column BEFORE doing the step** so you know what to look for
4. **Tick the checkbox** if it matches. If it doesn't, write what happened in the Notes section at the end of that phase
5. **Do not skip steps** — many later tests depend on state set up by earlier steps
6. **At the end** — go to the "Final Report Template" section at the bottom and fill it in

---

## Phase 0 — First Boot

Goal: app loads cleanly, no console errors.

| # | Action | Expected |
|---|---|---|
| 0.1 | Hard-refresh the browser tab (Ctrl+Shift+R) | Boot screen appears within 1 second |
| 0.2 | Watch the boot screen for ~3 seconds | Glowing Voidlink logo, "VOIDLINK BIOS v2.1.0 © 2199…", boot log lines scrolling, neon-Earth globe rotating in the background |
| 0.3 | Wait for the auto-advance | Boot fades out smoothly, Login screen appears |
| 0.4 | Open DevTools → Console | **No red errors.** Yellow/orange axe-core "potential a11y" warnings are OK. |

**Tick everything that worked:**
- [ ] App loads with no white-screen
- [ ] Background is the neon-Earth bloom globe (NOT falling characters)
- [ ] Console is clean

---

## Phase 1 — Account Creation

Goal: create a fresh operative and reach the desktop.

| # | Action | Expected |
|---|---|---|
| 1.1 | Click "NEW OPERATIVE" tab if not already on it (only appears when there's at least one existing save) | Signup form visible |
| 1.2 | Enter handle: `PLAYTEST_001` | Field accepts input |
| 1.3 | Enter username: `playtest1` | Field accepts |
| 1.4 | Enter email: `test@playtest.local` | Field accepts (no live validation until submit) |
| 1.5 | Enter password: `pass!1234` and confirm | Fields type as masked dots by default |
| 1.6 | Click the SHOW button next to PASSWORD | Both fields become plain text. Click HIDE → back to dots |
| 1.7 | Try clicking REGISTER with an invalid email like `nope` | Red error banner: "INVALID EMAIL ADDRESS" |
| 1.8 | Fix email, click REGISTER | Verification panel appears: "DARKNET RELAY — CONFIRMATION REQUIRED", with a 6-digit code visible in a dashed purple box (demo build). |
| 1.9 | Type the displayed 6-digit code, click VERIFY & CONNECT | DesktopScreen loads. Terminal shows "Email verified." |
| 1.10 | Note the auto-opened windows | SYSTEM TERMINAL, MISSION BOARD, OPERATIVE PROFILE, VOIDLINK NEWSFEED, HACKING INTERFACE, RELAY CHAIN — six windows |

**Tick everything that worked:**
- [ ] SHOW/HIDE password toggle works
- [ ] Email validation rejects `nope`
- [ ] Confirmation code panel appears with code shown in purple dashed box
- [ ] Wrong code rejected with "INCORRECT CODE — CHECK YOUR INBOX"
- [ ] Correct code accepted and operative committed
- [ ] All 6 default windows appear after signup
- [ ] Tutorial overlay appears bottom-right with step 1/25

### Phase 1b — Password Reset (optional)

| # | Action | Expected |
|---|---|---|
| 1b.1 | Log out, click your saved operative, then click FORGOT? next to the password input | Reset panel appears asking for the account email |
| 1b.2 | Enter the email you signed up with, click SEND RESET CODE | Code panel appears with the demo code shown |
| 1b.3 | Type the code, enter a new password (min 6 + 1 special), confirm, click UPDATE PASSWORD | Returned to operative picker, terminal logs "Password reset" |
| 1b.4 | Click CONNECT and use the new password | Account opens normally |

---

## Phase 2 — First Desktop & Tutorial Walkthrough

Goal: complete the tutorial as a brand new player would.

| # | Action | Expected |
|---|---|---|
| 2.1 | Look at the taskbar | Left: launcher buttons. Right: VST clock (01.JAN.2199 …), trace placeholder ("NO ACTIVE CONNECTION"), handle / 5,000 Cr / REP 0, then ⊞ / ⚙ / ⏻ |
| 2.2 | Watch the VST clock for 10 seconds | Time advances 1:1 with real time |
| 2.3 | Click NEXT through tutorial steps 1–8 (info-only) | Each step has a cyan glowing spotlight ring on the relevant UI element. Game stays fully interactive. |
| 2.4 | At step 9 ("ACCEPT YOUR FIRST CONTRACT"), open MISSION BOARD if not already | See `FIRST CONTACT` story mission at the top (yellow border, "STORY" badge). All other missions show "Complete tutorial to unlock" instead of ACCEPT |
| 2.5 | Click the FIRST CONTACT card to expand, then ACCEPT | Connection animation plays full-screen (~3.5s). Dial-up SFX. Network Map auto-opens. Tutorial advances to step 10. |
| 2.6 | Note: trace bar should be **NOT** climbing during the animation | Trace bar shows 0% throughout the dial-up sequence |
| 2.7 | After connection animation completes, trace bar begins to climb | Trace starts to inch up from 0% |
| 2.8 | Tutorial step 11 says "SELECT A NODE" — click any node in NETWORK MAP | Node selected (cyan highlight), tutorial says "NODE SELECTED ✓ — CLICK NEXT WHEN READY". |
| 2.9 | Click NEXT | Step 12 |
| 2.10 | Continue through scan / crack / objective / wipe steps | Each conditional step auto-advances when you complete the action |
| 2.11 | At "TRANSFER THE FILE" step, locate the ★ marked file in the file_server panel and click TRANSFER | Progress bar runs ~3s, file appears in your local storage, objective ticks |
| 2.12 | Wipe logs on every breached node (use WIPE ALL LOGS button) | All ✓ ticks in COVER YOUR TRACKS panel |
| 2.13 | Click SECURE DISCONNECT | Mission Result overlay: Success, credits earned, REP earned. XP awarded in terminal. |
| 2.14 | Tutorial advances toward upgrades — opens shop step | Shop window auto-spotlight |
| 2.15 | Continue all the way to step 25 (FACTION STANDINGS) | Profile window comes to focus. Final "BEGIN" button. |
| 2.16 | Click BEGIN | Tutorial dismisses. Game persists tutorial_done flag. |

**Tick everything that worked:**
- [ ] Tutorial spotlight is a glowing ring, not a hard-blocking overlay
- [ ] Game is fully clickable through the tutorial
- [ ] Trace bar does NOT climb during the tutorial (paused)
- [ ] Trace bar does NOT climb during the connection animation
- [ ] All required action-gated steps advanced correctly
- [ ] First mission completed successfully
- [ ] BOUNCE NODE ACQUIRED terminal log appeared

---

## Phase 3 — Window Management

| # | Action | Expected |
|---|---|---|
| 3.1 | Drag MISSION BOARD by its title bar to a new position | Window follows cursor smoothly |
| 3.2 | Resize MISSION BOARD by dragging the bottom-right corner | Resizes from corner, contents reflow |
| 3.3 | Minimise via the orange dot | Window disappears, launcher button now has amber dot |
| 3.4 | Click MISSIONS in the launcher | Window restores to its previous position + size |
| 3.5 | Click MISSIONS again | Window minimises (toggle from launcher) |
| 3.6 | Close MISSION BOARD via the red dot | Window closes, launcher green dot disappears |
| 3.7 | Click MISSIONS to re-open | Opens at the position you dragged/resized it to |
| 3.8 | Hold Ctrl and scroll the mouse wheel | Whole window layer zooms 40–200% |
| 3.9 | Click ⊞ in the taskbar | All open windows cascade into a tidy layout |
| 3.10 | Open SETTINGS ⚙, slide UI SCALE to 130% | Everything scales up |

**Tick:**
- [ ] Drag/resize/minimise/close all work
- [ ] Closed windows reopen at saved positions
- [ ] Ctrl+Scroll zoom works
- [ ] No duplicate launcher buttons

---

## Phase 4 — Settings

| # | Action | Expected |
|---|---|---|
| 4.1 | Open SETTINGS ⚙ | Sections: AUDIO, DISPLAY, SHORTCUTS |
| 4.2 | Toggle MUSIC off then on | Idle music fades out/in |
| 4.3 | Click TEST SFX | 3-note rising scan sound |
| 4.4 | Click ◻ LIGHT theme | Whole UI switches to light mode |
| 4.5 | Click ◼ DARK | Back to dark |

---

## Phase 5 — System Terminal & News Feed

| # | Action | Expected |
|---|---|---|
| 5.1 | Open SYSTEM TERMINAL | Shows previous mission log lines |
| 5.2 | Open NEWS feed | Multiple seeded articles + your post-mission article |

---

## Phase 6 — Operative Profile

| # | Action | Expected |
|---|---|---|
| 6.1 | Open PROFILE | OVERVIEW tab default |
| 6.2 | Hardware section | CPU 1 GHz, RAM 2, HDD 10GB, Modem 10 Mb/s, Gateway 10 Mb/s |
| 6.3 | Statistics | Total Missions: 1, Successful Breaches: ≥1, Credits Earned: ≥5000 |
| 6.4 | FACTIONS tab | "FOUND A FACTION" form (rank-locked) |
| 6.5 | STANDINGS tab | Voidlink +10, others at base |

---

## Phase 7 — World Map Exploration

| # | Action | Expected |
|---|---|---|
| 7.1 | Open WORLD MAP | Neon-Earth globe (bloom + real continent outlines, cyan/magenta) |
| 7.2 | Drag to rotate, scroll to zoom | Rotation slows as zoom increases |
| 7.3 | Click a green bounce node | Added to relay chain, arc drawn on globe |
| 7.4 | Click a yellow dot (bank) | BANK TERMINAL opens |
| 7.5 | Click a cyan/red/purple dot (corp/gov/underground) | TARGET INTEL window opens |

---

## Phase 8 — Banking Deep-Dive

| # | Action | Expected |
|---|---|---|
| 8.1 | Click GLOBAL TRUST on globe | Bank window — APR 12% (M14h.5) |
| 8.2 | Open account (500 Cr) | Tabs appear: SAVINGS / LOAN / TRADE / STOCKS |
| 8.3 | Deposit 2000, withdraw later | Balance moves, interest accrues |
| 8.4 | Check notoriety chip on bank card | "+0.4 NOTORIETY/h" in amber |
| 8.5 | Click CAYMAN | Only SAVINGS tab. "-0.6 NOTORIETY/h" in green |
| 8.6 | Click PACIFIC | All 4 tabs. "+0.8 NOTORIETY/h" in amber |
| 8.7 | Open System Console | If notoriety ≠ 0, NOTORIETY row visible |

---

## Phase 9 — Upgrade Shop

| # | Action | Expected |
|---|---|---|
| 9.1 | Open SHOP | Graph view default, 15 columns |
| 9.2 | Click cracker_v2 node | Cyan outline, BUY button enabled |
| 9.3 | BUY | Cash deducted, node turns green ✓, terminal logs |
| 9.4 | Open PROFILE → Software | Cracker v2 listed |
| 9.5 | CONSUMABLES toggle | 7 items visible with stack counters |

---

## Phase 10 — Second Mission (Procedural)

| # | Action | Expected |
|---|---|---|
| 10.1 | Open MISSION BOARD | Procedural contracts visible. Each shows RELAY hop chip |
| 10.2 | Pick a Difficulty-3 mission (requires 2 hops) | Card expands |
| 10.3 | Open WORLD MAP, build 2-hop relay | Chain visible. Mission card chip flips green ✓ |
| 10.4 | Accept | Connection animation, NetworkMap opens (new cyber visuals — bloom + scan grid + starfield) |
| 10.5 | Scan a node | Services + CVE revealed |
| 10.6 | Crack/Exploit | Faster than Tier 1 |
| 10.7 | Complete objective + WIPE ALL LOGS | All ✓ |
| 10.8 | SECURE DISCONNECT | Reward overlay |
| 10.9 | Open INBOX | NEW unread ENCRYPTED contract email from the client |

---

## Phase 11 — Mission Variety

| Mission type | Test |
|--------------|------|
| Account Deletion | Breach DB → DELETE ACCOUNT |
| Database Corruption | Breach DB → CORRUPT |
| Network Sabotage | Breach router OR admin_console → SABOTAGE |
| Bounty Hunt | Find + breach named target |

For sabotage specifically:
- [ ] Briefing reads "Disable the network — breach a core router OR an admin console to take it offline" (M14h.5)
- [ ] Both node types complete the objective

---

## Phase 12 — Mid-Mission Mechanics

- [ ] SCAN reveals services + CVE
- [ ] DUMP CREDENTIALS on admin/database/endpoint adds creds to cache
- [ ] USE CREDENTIALS on adjacent node bypasses crack
- [ ] Sniffer auto-reveal on router breach (if `sniffer_v1` owned)
- [ ] PANIC KIT consumable: instant disconnect with no rep hit
- [ ] ESCALATE (CPU≥3, Cracker v3+) shows ROOT badge after breach
- [ ] PLANT BACKDOOR after root logs to terminal
- [ ] Next mission against same corp: backdoor pre-breaches the same node type

---

## Phase 13 — System Console

- [ ] SYS panel bottom-right shows live state: trace level, relay hops, world events, gateway speed, notoriety (if non-zero)
- [ ] Collapsing header works
- [ ] Mission-active state shows MISSION ACTIVE row

---

## Phase 14 — Audio Verification

| Sound | When | Expected |
|---|---|---|
| Idle music | Desktop | Looped track plays softly |
| Music fade-out | Mission accept | Fades out over ~2.5s |
| Music fade-in | Disconnect | Fades back in over ~3s |
| Dial-up | Mission accept | DTMF + ring + hiss + warble + chirp (~3.5s) |
| Trace beep | ≥10% trace | Digital ping, accelerates |
| Per-action SFX | Scan/crack/wipe/etc. | All play |
| Intruder beep | Rival hacker spawns | 3-pulse warning beep |
| Mission success/fail stings | Disconnect | Distinct rising/falling stings |

---

## Phase 15 — Layout Persistence

| # | Action | Expected |
|---|---|---|
| 15.1 | Arrange windows custom | Layout is your config |
| 15.2 | Logout | Saves and returns to login |
| 15.3 | Reconnect with password | Desktop reloads with exact layout (positions, sizes, minimised state) |
| 15.4 | Hard-refresh browser (F5) | Layout still restored |
| 15.5 | INBOX state persists | Read/unread + starred + cipher-decrypted state retained |

---

## Phase 16 — Edge Cases & Polish

- [ ] LOGOUT during active mission: ⏻ button disabled
- [ ] Try to accept a second mission while one is active: blocked
- [ ] Bounce Chain window editable via "▶ EDIT ON WORLD MAP"
- [ ] Light theme covers EVERY window
- [ ] Tutorial re-runs on a fresh save (DELETE SAVE then register fresh)

---

## Phase 17 — Multi-Phase Mission: PROJECT GHOST (M14m)

> **Prerequisite:** Tutorial complete + 1 procedural mission cleared. PROJECT GHOST requires 30 REP minimum.

| # | Action | Expected |
|---|---|---|
| 17.1 | MISSION BOARD → "Operation: PROJECT GHOST" | Client: NIGHTOWL_22, reward 18,000 Cr + 60 REP, difficulty 3 |
| 17.2 | Briefing | Explains 3 phases: OSINT → Breach → Decoy |
| 17.3 | Accept | Connection animation; trace stays 0% during dial-up |
| 17.4 | HI shows new cyan-bordered PHASE STRIP above step guide | "PHASE 1 / 3 — OSINT", three dots |
| 17.5 | Complete phase 1 (transfer directory.enc from file_server) | Phase advance + 4,000 Cr advance + 15 REP |
| 17.6 | Phase strip updates | First dot ✓ green, second cyan, label "BREACH" |
| 17.7 | Complete phase 2 (corrupt the GHOST package DB) | Phase 3 + 4,000 Cr + 20 REP |
| 17.8 | Phase 3 "DECOY" — upload decoy.enc to a file_server | Objective ticks |
| 17.9 | Wipe all logs, secure disconnect | Mission result: 18,000 Cr + 60 REP |
| 17.10 | Open NEWS after disconnect | THREE staggered news echoes posted (60s / 120s / 240s offsets) |

---

## Phase 18 — Choice Mission: BLACK HALO (M14o)

| # | Action | Expected |
|---|---|---|
| 18.1 | MISSION BOARD → "Operation: BLACK HALO" (requires arc progress) | Story mission visible |
| 18.2 | Accept + complete phases 1–2 | Standard flow |
| 18.3 | At phase 3, full-screen choice overlay appears | Two cards: TURN (faction reward) vs BURN (different faction reward, skipped phase) |
| 18.4 | Pick one | Overlay dismisses, mission proceeds with chosen branch |
| 18.5 | After disconnect | Faction standings reflect the choice |

---

## Phase 19 — Encrypted Inbox Smoke Test (M14h.6)

| # | Action | Expected |
|---|---|---|
| 19.1 | Open INBOX | 3+ seed messages, mission emails for completed contracts |
| 19.2 | Click an encrypted message | Cipher grid renders blurred; DECRYPT button at bottom |
| 19.3 | DECRYPT WITH KEY | Body reveals; success SFX plays |
| 19.4 | Star a message, delete another | Visual update + list count |
| 19.5 | Logout + reconnect | Inbox state survives |

---

## 🏁 Final Report Template

```
# Voidlink Playtest Report — <date>

## Overall impression
(One paragraph: how does it feel? What stands out?)

## What worked well
- ...

## What needs fixing (defects)
| Severity | Where (Phase/step) | Description |
|---|---|---|
| Critical | (e.g. Phase 7.6) | ... |
| Medium   | ... | ... |
| Minor    | ... | ... |

## What needs improving (UX / feel)
- ...

## What I want next
- ...

## Time spent
~ X minutes
```

---

## Cheat sheet — quick reference

When you spot a fix, the relevant doc sections are:

- **Master plan + game systems reference:** `docs/Full_Plan.md`
- **Shipped milestones (ledger):** `docs/Complete_Tasks.md`
- **Forward plan:** `docs/Next_Stage.md`
- **Timeline:** `docs/Roadmap.md`
- **This file:** `docs/Testing_Guide.md`

If you find something broken, note its Phase + step number — it makes the fix-cycle quick.

**Have fun. Take notes.**
