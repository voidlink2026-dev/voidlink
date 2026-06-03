# Voidlink — Complete Playtest Walkthrough

> *Old-school walkthrough format: do each step in order, tick the box, note anything that doesn't match the **Expected** column. At the end of each phase there's a "Notes / Defects" space — jot anything weird, missing, or broken there.*

**Game version:** Pre-alpha through M14h.2 (commit `0e36f1b` or later)
**Estimated playtest time:** 90–120 minutes for a full pass

---

## 📋 How to Use This Document

1. **Start with a clean slate** — if you've been testing previously, hit DELETE SAVE on every save in the login screen so you're starting fresh
2. **Open browser DevTools (F12)** before you begin and keep the **Console** tab visible — flag any red errors
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
| 0.2 | Watch the boot screen for ~3 seconds | Glowing Voidlink logo, "VOIDLINK BIOS v2.1.0 © 2199…", boot log lines scrolling, Stargate wireframe sphere rotating in the background |
| 0.3 | Wait for the auto-advance | Boot fades out smoothly, Login screen appears |
| 0.4 | Open DevTools → Console | **No red errors.** Yellow/orange axe-core "potential a11y" warnings are OK. |

**Tick everything that worked:**
- [ ] App loads with no white-screen
- [ ] Background is the rotating wireframe globe (NOT falling characters)
- [ ] Console is clean

**Notes / Defects:**
```
(write anything weird here)
```

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
| 1.8 | Fix email, click REGISTER | Loading state ≈ 100ms, then DesktopScreen loads |
| 1.9 | Note the auto-opened windows | SYSTEM TERMINAL, MISSION BOARD, OPERATIVE PROFILE, VOIDLINK NEWSFEED, HACKING INTERFACE, BOUNCE CHAIN — six windows |

**Tick everything that worked:**
- [ ] SHOW/HIDE password toggle works
- [ ] Email validation rejects `nope`
- [ ] All 6 default windows appear after signup
- [ ] Tutorial overlay appears bottom-right with step 1/25

**Notes / Defects:**
```

```

---

## Phase 2 — First Desktop & Tutorial Walkthrough

Goal: complete the tutorial as a brand new player would.

| # | Action | Expected |
|---|---|---|
| 2.1 | Look at the taskbar bottom | Left: launcher buttons. Right: in-game clock showing `01.JAN.2199 00:0?:??`, then trace placeholder ("NO ACTIVE CONNECTION"), then your handle / 5,000 Cr / REP 0, then ⊞ / ⚙ / ⏻ |
| 2.2 | Watch the in-game clock for 10 seconds | Time advances 1:1 with real time — second hand ticks every second |
| 2.3 | Click NEXT through tutorial steps 1–8 (info-only) | Each step has a cyan glowing spotlight ring on the relevant UI element. Game stays fully interactive. |
| 2.4 | At step 9 ("ACCEPT YOUR FIRST CONTRACT"), open MISSION BOARD if not already | See `FIRST CONTACT` story mission at the top (yellow border, "STORY" badge). All other missions show "Complete tutorial to unlock" instead of ACCEPT |
| 2.5 | Click the FIRST CONTACT card to expand, then ACCEPT | Connection animation plays full-screen (~3.5s). Dial-up SFX. Network Map auto-opens. Tutorial advances to step 10. |
| 2.6 | Note: trace bar should be **NOT** climbing during the animation | Trace bar shows 0% throughout the dial-up sequence |
| 2.7 | After connection animation completes, trace bar begins to climb | Trace starts to inch up from 0% |
| 2.8 | Tutorial step 11 says "SELECT A NODE" — click any node in NETWORK MAP | Node selected (cyan highlight), tutorial says "NODE SELECTED ✓ — CLICK NEXT WHEN READY". This step REQUIRES you to click NEXT (does not auto-advance) |
| 2.9 | Click NEXT | Step 12 |
| 2.10 | Continue through scan / crack / objective / wipe steps | Each conditional step auto-advances when you complete the action |
| 2.11 | At "TRANSFER THE FILE" step, locate the ★ marked file in the file_server panel and click TRANSFER | Progress bar runs ~3s, file appears in your local storage, objective ticks |
| 2.12 | Wipe logs on every breached node (use WIPE ALL LOGS button) | All ✓ ticks in COVER YOUR TRACKS panel |
| 2.13 | Click SECURE DISCONNECT | Mission Result overlay: Success, credits earned, REP earned. XP awarded in terminal. |
| 2.14 | Tutorial advances toward upgrades — opens shop step | Shop window auto-spotlight |
| 2.15 | Continue all the way to step 25 (FACTION STANDINGS) | Profile window comes to focus; other windows minimised. Final "BEGIN" button. |
| 2.16 | Click BEGIN | Tutorial dismisses. Game persists tutorial_done flag. |

**Tick everything that worked:**
- [ ] Tutorial spotlight is a glowing ring, not a hard-blocking overlay
- [ ] Game is fully clickable through the tutorial (you can drag windows, scroll terminal, etc.)
- [ ] Trace bar does NOT climb during the tutorial (paused)
- [ ] Trace bar does NOT climb during the connection animation
- [ ] All required action-gated steps advanced correctly
- [ ] First mission completed successfully
- [ ] BOUNCE NODE ACQUIRED terminal log appeared (you breached the entry_point)

**Notes / Defects:**
```

```

---

## Phase 3 — Window Management

Goal: stress-test the window system.

| # | Action | Expected |
|---|---|---|
| 3.1 | Drag MISSION BOARD by its title bar to a new position | Window follows cursor smoothly |
| 3.2 | Release mouse | Window stays at new position |
| 3.3 | Resize MISSION BOARD by dragging the bottom-right corner | Resizes from corner, contents reflow |
| 3.4 | Minimise it via the orange dot | Window disappears, launcher button now has 55% opacity + amber dot |
| 3.5 | Click MISSIONS in the launcher | Window restores to its previous position + size, fully visible |
| 3.6 | Click MISSIONS again | Window minimises (you can toggle from the launcher) |
| 3.7 | Restore, then close MISSION BOARD via the red dot | Window closes, launcher button green dot disappears |
| 3.8 | Click MISSIONS to re-open | Opens at the position you dragged/resized it to earlier |
| 3.9 | Hold Ctrl and scroll the mouse wheel | Whole window layer zooms 40–200% |
| 3.10 | Reset with Ctrl + scroll to 100% | OK |
| 3.11 | Click ⊞ in the taskbar | All open windows cascade into a tidy diagonal layout |
| 3.12 | Open SETTINGS ⚙, slide UI SCALE to 130% | Everything scales up |
| 3.13 | Reset UI scale to 100% via the RESET button | OK |

**Tick everything that worked:**
- [ ] Drag, resize, minimise, close all work
- [ ] Launcher buttons act as focus/minimise toggle when window is open
- [ ] Closed windows reopen at saved positions
- [ ] No duplicate buttons in the taskbar — every default window appears ONCE
- [ ] Ctrl+Scroll zoom works smoothly
- [ ] ⊞ cascade tidies up
- [ ] UI scale slider works without breaking layout

**Notes / Defects:**
```

```

---

## Phase 4 — Settings Window

Goal: verify every setting.

| # | Action | Expected |
|---|---|---|
| 4.1 | Open SETTINGS ⚙ | Three sections: AUDIO, DISPLAY, SHORTCUTS |
| 4.2 | Toggle MUSIC off | Idle music fades out within ~0.5s |
| 4.3 | Toggle MUSIC on | Music fades back in within ~3s |
| 4.4 | Drag MUSIC VOLUME to 0% | Music silences |
| 4.5 | Drag back to 65% | Music returns at moderate volume |
| 4.6 | Toggle SFX off, click TEST SFX | Silence |
| 4.7 | Toggle SFX on, click TEST SFX | 3-note rising scan sound |
| 4.8 | Drag SFX volume halfway and click TEST SFX again | Quieter |
| 4.9 | Click ◻ LIGHT theme | Whole UI switches to light mode — windows, taskbar, scrollbars, text all legible |
| 4.10 | Click ◼ DARK | Back to dark |
| 4.11 | Toggle REDUCE MOTION on, then off | (Effect: animations should still play; the flag just prepares for `prefers-reduced-motion`) |
| 4.12 | Toggle SHOW FPS COUNTER (currently a placeholder flag — note if you see anything change) | TBD |

**Tick everything that worked:**
- [ ] Music + SFX toggles + volume sliders work
- [ ] TEST SFX plays
- [ ] Light theme is fully legible (no green-on-white, no grey-on-dark)
- [ ] Settings persist across refresh (try refreshing browser tab now — settings should stick)

**Notes / Defects:**
```

```

---

## Phase 5 — System Terminal & News Feed

Goal: verify info windows.

| # | Action | Expected |
|---|---|---|
| 5.1 | Open SYSTEM TERMINAL | Shows previous mission log lines |
| 5.2 | Scroll up | Older entries visible |
| 5.3 | Open NEWS feed (taskbar NEWS button) | Multiple seeded news articles + your post-mission article |
| 5.4 | Click an article | Article expands (if interactive) or just is visible |
| 5.5 | Close NEWS, reopen | Should restore at saved position |

**Tick everything that worked:**
- [ ] Terminal scrollable and readable
- [ ] News feed shows pre-seeded articles + at least one player-action article (from your tutorial mission)

**Notes / Defects:**
```

```

---

## Phase 6 — Operative Profile

Goal: verify all profile tabs.

| # | Action | Expected |
|---|---|---|
| 6.1 | Open PROFILE | OVERVIEW tab default |
| 6.2 | Check Hardware section | CPU 1 GHz, RAM 2 slots, HDD 10GB, Modem 10 Mb/s, Gateway 10 Mb/s, no GPU, passive cooling |
| 6.3 | Check Statistics | Total Missions: 1, Successful Breaches: ≥1, Success Rate: 100%, Trace Fails: 0, Escapes: 0, Credits Earned: ≥5000, Credits Spent: 0 |
| 6.4 | Check Software section | Cracker basic, Proxy basic, Log Deleter basic, Port Scanner basic (all v1) |
| 6.5 | Check XP/Level bar | LVL 1 → 2 (depending on XP awarded), bar partially filled |
| 6.6 | Click FACTIONS tab | "FOUND A FACTION" form visible (rank-locked until rank 3) |
| 6.7 | Click STANDINGS tab | Five faction bars: Voidlink (+10), Arunmor (0), Ares (0), Underground (0), The Nameless (UNDETECTED) |

**Tick everything that worked:**
- [ ] All profile tabs render correctly
- [ ] Stats reflect the mission you just did
- [ ] Faction standings show the 5 expected factions
- [ ] Footer shows account creation date

**Notes / Defects:**
```

```

---

## Phase 7 — World Map Exploration

Goal: verify the globe + bounce + intel targets + banking.

| # | Action | Expected |
|---|---|---|
| 7.1 | Open WORLD MAP | 3D wireframe globe appears with neon green lat/lon grid, country outlines, atmosphere halo, starfield |
| 7.2 | Drag the globe | Rotates smoothly |
| 7.3 | Scroll wheel to zoom in close | Globe scales up, rotation becomes proportionally slower (less twitchy) |
| 7.4 | Scroll back out | Rotation regains normal sensitivity |
| 7.5 | Hover the green dots (your bounce library) | Cursor → pointer, tooltip in top-left appears with region/tier/status |
| 7.6 | Click a green bounce node | Added to bounce chain (visible in the chain panel at bottom + dedicated BOUNCE window) |
| 7.7 | Click it again | Removed from chain |
| 7.8 | Add 3 bounce nodes | Arc lines drawn between them on the globe |
| 7.9 | Click the LEGEND in top-right | Pure cosmetic — explains node colour types |
| 7.10 | Hover a CYAN dot (corp — Arunmor / Internic / Arunmor US Lab) | Pointer cursor |
| 7.11 | Click ARUNMOR HQ | TARGET INTEL window opens with lore, region, access requirements, flavour quote |
| 7.12 | Click ARES DIVISION (red dot) | Same — different intel |
| 7.13 | Click THE NAMELESS (purple dot, Japan) | Underground intel |
| 7.14 | Click VOIDLINK INTL (green dot near Switzerland) | Voidlink intel |
| 7.15 | Click any YELLOW dot (bank — Global Trust / Pacific National / Cayman Trust / Zurich Vault) | BANK TERMINAL opens (NOT intel — banks have their own UI) |

**Tick everything that worked:**
- [ ] Globe is the Stargate wireframe style (NOT solid texture)
- [ ] Rotation sensitivity adapts to zoom level
- [ ] Bounce node click adds to chain, visible on globe AS ARCS
- [ ] Bounce node click removes from chain
- [ ] Corp/gov/underground targets open TARGET INTEL window
- [ ] Banks open BANK TERMINAL window (yellow dots)
- [ ] Country outlines visible (faint green wireframe)

**Notes / Defects:**
```

```

---

## Phase 8 — Banking Deep-Dive

Goal: verify all four banks and four banking services.

| # | Action | Expected |
|---|---|---|
| 8.1 | Click GLOBAL TRUST BANK on the world map | BANK TERMINAL window opens with bank name in amber |
| 8.2 | Read the stats row | APR: 2.50% / Region: US-EAST / Your Cash: 5,xxx Cr / Darkcoin: 0.0000 DC |
| 8.3 | Click OPEN ACCOUNT (500 Cr setup fee) | Account opens, terminal logs the action, BUY button disappears, tabs strip appears |
| 8.4 | SAVINGS tab is default — type `2000` in the amount field, click DEPOSIT | Cash drops by 2000, balance shows 2000 Cr |
| 8.5 | Wait 30 seconds (or check after later steps) | Balance increases slightly via compound interest |
| 8.6 | Click ALL SAVINGS, then WITHDRAW | Cash returns, balance ~0 |
| 8.7 | Click LOAN tab | "LOAN AVAILABLE — UP TO X Cr" where X = (cash + balance) × 2 |
| 8.8 | Type `2000`, click BORROW | Cash increases by 2000, "OUTSTANDING PRINCIPAL" panel shows 2000 Cr |
| 8.9 | Wait a few seconds | Principal grows slightly (loan interest accruing) |
| 8.10 | Click FULL button → REPAY | Loan fully cleared, panel returns to "LOAN AVAILABLE" |
| 8.11 | Click TRADE tab | "1 DC = ~142 Cr" rate, updates every 1.5s |
| 8.12 | Type `1000` in BUY DARKCOIN, click BUY DC | Cash -1000, Darkcoin balance shows ≈ 6.9-7.0 DC |
| 8.13 | Type `5` in SELL DARKCOIN, click SELL DC | DC drops to ~2, cash gains ~700 Cr |
| 8.14 | Click STOCKS tab | 4 tickers visible: ARMR, ARES, INTC, GTBK with ▲/▼ drift |
| 8.15 | Click ARMR row | Detail panel shows price + holdings info |
| 8.16 | Type `2` shares, click BUY | Cash deducted, holdings show "2 shares" + cost basis |
| 8.17 | Wait until ARMR price changes (watch the row update) | Number ticks |
| 8.18 | Click SELL | Realised P&L logged to terminal (+/- sign in green/yellow) |
| 8.19 | Close BANK, click CAYMAN TRUST on globe | Opens — purple OFFSHORE tag in header |
| 8.20 | Try to open Cayman account (5,000 Cr setup) | Note: only SAVINGS tab — no Loan/Trade/Stocks |
| 8.21 | Close, click ZURICH VAULT | Opens with OFFSHORE tag, has SAVINGS + LOAN only |

**Tick everything that worked:**
- [ ] All 4 banks accessible
- [ ] Open account / deposit / withdraw works
- [ ] Loan borrow + repay works, principal accrues interest visibly
- [ ] Currency trading works both directions with 1% spread
- [ ] Stocks list updates live with ▲/▼ drift
- [ ] Buy/sell stocks works, P&L is recorded
- [ ] Offshore banks have correct restricted tabs (Cayman = savings only, Zurich = +loans)

**Notes / Defects:**
```

```

---

## Phase 9 — Upgrade Shop (Skill Tree Graph)

Goal: verify the graph view, list view, consumables tab, and a real upgrade purchase.

| # | Action | Expected |
|---|---|---|
| 9.1 | Open SHOP — should open larger window (~1280×620) | Graph view default |
| 9.2 | Verify 15 columns visible | HW band: CPU / RAM / MODEM / GATEWAY / GPU / COOLING. SW band: CRACKER / PROXY / LOG / SCAN / FW / SNIFF / MEM / AF / MISC |
| 9.3 | Note the band separator between HW and SW columns | Dashed vertical line |
| 9.4 | Click the starter "CPU v1 (1 GHz)" green node (top of CPU column) | Side panel: "STARTER ITEM" with description |
| 9.5 | Click CPU v2 node | Cyan-outlined "Affordable", side panel shows BUY button + 8,000 Cr |
| 9.6 | Click BUY | Cash deducted, node turns green ✓, terminal logs the buy |
| 9.7 | Open PROFILE → Hardware tab | CPU should now read 2 GHz (or "CPU v2" depending on display) |
| 9.8 | Back in shop, click cracker_v2 node | Cyan outlined, can afford. Click BUY (4,500 Cr) |
| 9.9 | Open PROFILE → Software tab | Cracker basic + cracker_v2 listed (both owned) |
| 9.10 | Click LIST view toggle | Legacy view with HARDWARE / SOFTWARE tabs |
| 9.11 | Click CONSUMABLES view toggle | 7 items listed with stack counters |
| 9.12 | Buy 1 × Panic Kit (3,500 Cr) | Stack counter ticks to "1 / 3" |
| 9.13 | Buy 1 × Zero-Day Pack (8,000 Cr) | Same |
| 9.14 | USE the Zero-Day Pack | Terminal logs "Zero-day exploit primed". Stack goes to "0 / 5" |
| 9.15 | Click a node in the graph that is **locked-rep** (grey 🔒) | Side panel: "Requires X REP (you have Y)" |
| 9.16 | Click a **locked-funds** node (amber outline) | Side panel: "Need X more Cr" |

**Tick everything that worked:**
- [ ] All 15 columns visible
- [ ] Node colour states correct (starter/owned/affordable/locked-funds/locked-rep)
- [ ] Buying an item updates the graph immediately
- [ ] LIST and CONSUMABLES toggles work
- [ ] Consumable USE clears one from inventory
- [ ] Profile shows newly-bought items in real time

**Notes / Defects:**
```

```

---

## Phase 10 — Second Mission (Procedural Contract)

Goal: full mission from accept → wipe → disconnect, with the upgrades you just bought.

| # | Action | Expected |
|---|---|---|
| 10.1 | Open MISSION BOARD | Multiple procedural contracts now visible (tutorial unlocked them all) |
| 10.2 | Pick a difficulty-2 mission (FILE THEFT preferred) | Card expands on click |
| 10.3 | Note the requirements section | ✓ Cracker LV1 / ✓ CPU / ✓ REP |
| 10.4 | First — open WORLD MAP, click 2 green bounce nodes to chain | Chain shows YOU → 2 nodes → TARGET |
| 10.5 | Accept the mission | Connection animation plays, network map appears |
| 10.6 | During the 3.5s animation, watch the trace bar | Stays at 0% |
| 10.7 | After animation, trace starts climbing | Yes — slow at first |
| 10.8 | Click an unbreached node on network map | Right-side panel: type, tier, scan button |
| 10.9 | SCAN the node | Progress bar, then reveals services + CVE if any |
| 10.10 | If CVE shown, CRACK becomes EXPLOIT [PROTOCOL] | Click it, faster than dictionary crack |
| 10.11 | After breach, terminal logs "+ BOUNCE NODE ACQUIRED" if entry_point or router | New green dot appears on globe after disconnect |
| 10.12 | Continue cracking towards the file_server | Trace climbs |
| 10.13 | When trace reaches 50%, trace beep starts ticking | Audible digital ping every ~3s |
| 10.14 | At trace 75%, status changes to ALARM (yellow), beep accelerates | Yes |
| 10.15 | Complete primary objective (transfer file) | Terminal: "Objective complete" |
| 10.16 | Click WIPE ALL LOGS | Sequential wipe through all breached nodes |
| 10.17 | Click SECURE DISCONNECT | Mission Result overlay, payment + REP earned |
| 10.18 | Check terminal for "BOUNCE NODE ACQUIRED" log lines from the mission | Yes |
| 10.19 | Open WORLD MAP | New green nodes from the corp you just hit |

**Tick everything that worked:**
- [ ] Bounce chain reduces trace climb visibly
- [ ] Trace beep starts at ~10–25% and accelerates linearly
- [ ] Connection animation pauses trace for ~3.5s
- [ ] WIPE ALL LOGS sequentially wipes every dirty node
- [ ] Mission success awards credits + REP
- [ ] Bounce library expanded with corp's entry_point/router

**Notes / Defects:**
```

```

---

## Phase 11 — Mission Variety

Goal: try each mission type at least once. Do these in **separate sessions** (one mission at a time).

| Mission type | What to test | Expected |
|---|---|---|
| **Account Deletion** | Breach a database node, click DELETE ACCOUNT button | Objective ticks |
| **Database Corruption** | Breach database, click CORRUPT DATABASE | Same as above with different action |
| **Network Sabotage** | Breach the CORE ROUTER node (always present now), click SABOTAGE | Objective complete + 60s + 15s/hop escape window kicks in, trace spikes mildly (+3 base rate) |
| **Bounty Hunt** | Breach the specifically-labelled TARGET node | Auto-completes |

For sabotage specifically:
- [ ] With 3 bounce hops, the 60+(3×15) = 105s deadline is actually achievable
- [ ] Trace climbs at +3 base / +2.5 alarm — NOT brutal anymore
- [ ] You can wipe logs AND secure disconnect within the window

**Notes / Defects:**
```

```

---

## Phase 12 — Mid-Mission Mechanics

Goal: verify all in-mission features in one playthrough.

Start a difficulty 3 mission, then:

| # | Action | Expected |
|---|---|---|
| 12.1 | Use SCAN on a node | Reveals services + CVEs |
| 12.2 | If scanned node has admin_console: USE DUMP CREDENTIALS | Cached creds appear in HI panel |
| 12.3 | Try the cached creds on another node — USE CREDENTIALS button | Bypasses the crack, breach is instant |
| 12.4 | (If you bought sniffer_v1) Breach a router | Terminal: "SNIFFER: N adjacent nodes auto-revealed" |
| 12.5 | Cancel a crack mid-way on a Tier 4–5 node | If non-Brute: 30s lockout, +2% trace |
| 12.6 | Try clicking a Zone B node before pivot is breached | Status badge: "ZONE B — PIVOT REQUIRED" (only on government_classified / cloud_infrastructure networks) |
| 12.7 | Use the PANIC KIT consumable (if you bought one) | Trace resets, mission abandoned |

**Tick everything that worked:**
- [ ] Scanning reveals services + CVE
- [ ] Dump creds + use creds bypass works
- [ ] Sniffer auto-reveal works after router breach
- [ ] Lockout triggers correctly
- [ ] Panic Kit emergency disconnect works

**Notes / Defects:**
```

```

---

## Phase 13 — System Console (Bottom-Right Live Display)

| # | Action | Expected |
|---|---|---|
| 13.1 | While idle (no mission), check the bottom-right SYS console | Shows: IDLE, bounce route summary, world events, proxy count |
| 13.2 | During a mission | Adds: "MISSION ACTIVE — trace X%" line |
| 13.3 | Toggle SYS header (click) | Collapses / expands |

**Tick:**
- [ ] System Console visible and accurate
- [ ] Collapsing works

---

## Phase 14 — Audio Verification

| Sound | When | Expected |
|---|---|---|
| Idle music | At desktop (no mission) | 4:26 looped track plays softly |
| Music fade-out | On mission accept | Fades out over ~2.5s |
| Music fade-in | On disconnect | Fades back in over ~3s |
| Dial-up SFX | On mission accept | DTMF tones → ring → carrier hiss → modem warble → handshake chirp (~3.5s) |
| Trace beep | At ≥10% trace | Digital ping, accelerates with trace |
| Scan | On SCAN | Three-note rising |
| Crack | On crack complete | Noise burst + success chord |
| Wipe | On log wipe | Descending sawtooth |
| Mission success | On clean disconnect | Ascending C-major scale |
| Mission fail | On dirty exit or trace 100% | Descending tritone |
| Button click | On any button press | Tiny digital tick |
| Window open / close | On open / close | Up / down sweep |

**Tick everything you heard correctly:**
- [ ] Idle music
- [ ] Music fade transitions
- [ ] Dial-up handshake sounds rich (DTMF + ring + hiss + warble + chirp, not a single beep)
- [ ] Trace beep is a CRISP digital sound (not a fuzzy alarm)
- [ ] Per-action SFX play
- [ ] Volume sliders in Settings actually change levels

**Notes / Defects:**
```

```

---

## Phase 15 — Layout Persistence

| # | Action | Expected |
|---|---|---|
| 15.1 | Arrange windows however you like — drag, resize, minimise one, close one | Layout is your custom configuration |
| 15.2 | Click ⏻ (LOGOUT) | Saves and returns to login screen |
| 15.3 | Click CONNECT on your PLAYTEST_001 save, enter password | Desktop reloads with **your exact layout** — positions, sizes, minimised state |
| 15.4 | Closed windows stay closed; click their launcher to re-open | Re-opens at last position |
| 15.5 | Hard-refresh browser (F5) — should also restore | Yes (auto-save fires every 60s + on logout) |

**Tick:**
- [ ] Layout persists across logout/login
- [ ] Closed windows reopen at saved positions
- [ ] Hacking Interface and Network Map are NOT auto-restored (they need a mission)

**Notes / Defects:**
```

```

---

## Phase 16 — Edge Cases & Polish

| # | Action | Expected |
|---|---|---|
| 16.1 | Try to LOGOUT during an active mission (mid-trace) | ⏻ button is disabled |
| 16.2 | Try to accept a second mission while one is active | "You already have an active mission" error |
| 16.3 | Accept a mission, click LEAVE NETWORK with dirty logs | "MISSION WILL FAIL" warning, mission abandoned |
| 16.4 | Disconnect cleanly without completing objectives | Mission stays "available" — you can retry |
| 16.5 | Open the Bounce Chain window | Shows YOU → hops → TARGET, with per-hop ✕ removal |
| 16.6 | Click ▶ EDIT ON WORLD MAP from Bounce Chain | Opens / focuses World Map |
| 16.7 | Toggle to light theme | Bounce Chain is fully legible |
| 16.8 | Test the tutorial overlay AGAIN on a NEW save | DELETE SAVE, register fresh operative — tutorial runs again |

**Tick:**
- [ ] Logout disabled during trace
- [ ] Mission concurrency enforced
- [ ] Mission retry path works
- [ ] Light theme covers everything

---

## 🏁 Final Report Template

When you're done, paste the below into a fresh document or paste in the chat. Fill it in:

```
# Voidlink Playtest Report — <date>

## Overall impression
(One paragraph: how does it feel? What stands out?)

## What worked well
- ...
- ...

## What needs fixing (defects)
| Severity | Where | Description |
|---|---|---|
| Critical | (e.g. Phase 7.6) | ... |
| Medium   | ... | ... |
| Minor    | ... | ... |

## What needs improving (UX / feel)
- ...
- ...

## What I want next
- ...
- ...

## Time spent
~ X minutes
```

---

## Cheat Sheet — Quick Reference for Re-Testing

When you spot a fix you want me to make, the relevant doc sections are:

- **Player-facing mechanics:** `docs/GAME_GUIDE.md`
- **What's shipped / roadmap:** `docs/NEXT_STAGE.md`
- **Per-milestone test checklists:** `docs/TESTING_GUIDE.md` (§17 → §25)
- **Architecture / system spec:** `docs/GAME_DESIGN_MASTER.md`
- **Pre-alpha summary:** `docs/UPLINK_NG_OVERVIEW.md`
- **Doc index + status:** `docs/DEV_DOCS_INDEX.md`

If you find something broken, note its Phase + step number — that makes it instant to find again.

**Have fun. Take notes.**

---

## Phase 17 — Multi-Phase Mission: PROJECT GHOST (M14m)

Goal: validate the new multi-phase mission framework end-to-end.

> **Prerequisite:** Tutorial completed and at least one other mission cleared, so the player has some XP/REP and the procedural pool is populated. PROJECT GHOST requires 30 REP minimum.

| # | Action | Expected |
|---|---|---|
| 17.1 | Open MISSION BOARD, find "Operation: PROJECT GHOST" | Client: NIGHTOWL_22, reward: 18,000 Cr + 60 REP, difficulty 3 |
| 17.2 | Read the briefing | Explains 3 phases: OSINT → Breach → Decoy, with advance payments |
| 17.3 | Accept the mission | Connection animation plays; trace stays at 0% during the dial-up |
| 17.4 | Look at HACKING INTERFACE | New cyan-bordered PHASE STRIP visible above the regular step guide |
| 17.5 | Phase strip should show | "PHASE 1 / 3 — OSINT", three dots (first cyan, others grey), description text |
| 17.6 | Complete phase 1 objective (transfer directory.enc from a file_server) | Terminal logs phase advance + 4,000 Cr advance payment + 15 REP |
| 17.7 | Phase strip updates | First dot turns green ✓, second dot turns cyan, label is now "BREACH" |
| 17.8 | New objective injected into the active list | "Corrupt the GHOST package database" appears in the objectives section |
| 17.9 | Complete phase 2 (corrupt the database — node with database type, CORRUPT DATABASE action) | Terminal: phase 3 advance + 4,000 Cr + 20 REP |
| 17.10 | Phase 3 — "DECOY" label active, third dot cyan | New objective: upload decoy.enc to file_server |
| 17.11 | Find or scan a file_server, execute the EVIDENCE PLANT / UPLOAD action | Note: current mission system may need adjustments here — note any quirks |
| 17.12 | Wipe all logs, secure disconnect | Mission Result: success, full payout (18,000 Cr + 60 REP) |
| 17.13 | Open NEWS feed after disconnect | THREE new news echoes posted: "Anonymous Audit..." / "Database Corruption..." / "Investigators Chase False Lead..." |
| 17.14 | Confirm echo timestamps are staggered | Yes (60s / 120s / 240s offsets — they may appear with future timestamps if your clock is correct) |

**Tick everything that worked:**
- [ ] PROJECT GHOST visible in mission board
- [ ] Phase strip renders above step guide
- [ ] Phase advance fires on each objective completion
- [ ] Advance payments paid correctly
- [ ] News echoes posted after mission complete
- [ ] Legacy single-phase missions still work (test one to confirm no regressions)

**Notes / Defects:**
```

```

