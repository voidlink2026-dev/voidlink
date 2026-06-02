# Voidlink — Manual Testing Guide

> Run through this document after every significant feature addition. Each section covers one system. Test the golden path first, then the edge cases listed beneath it.

**Dev server:** `cd apps/web && npm run dev` → open at http://localhost:5173

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
- [ ] ADD PROXY button: reduces trace accumulation rate (visible on trace bar)
- [ ] Maximum 3 proxies stackable
- [ ] REMOVE PROXY reduces count; trace rate increases again
- [ ] Rival hacker spawning: terminal warns, trace rate increases; INTERCEPT button removes them

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
