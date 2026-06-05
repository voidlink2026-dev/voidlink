# Voidlink — The Synopsis

A complete guide to the game. What it is, what you'll do, why you'll keep coming back, and what's been built for you to live inside.

This document is for players, press, and anyone considering buying the game. For the engineering canon see [docs/Full_Plan.md](docs/Full_Plan.md). For the lore deep-dive see [The_Voidlink_Codex.md](The_Voidlink_Codex.md). For the elevator pitch see [Why_Voidlink.md](Why_Voidlink.md).

---

## In one sentence

Voidlink is a single-player hacking thriller set in 2199 — the spiritual successor to *Uplink* (2001), reimagined with twenty-five years of branching narrative depth, a world that remembers everything you do, and a single, unwavering promise: it will never sell you an advantage.

## In one paragraph

You are an anonymous contractor for **Voidlink International** — a black-market network in a world where four corporations are bigger than every government combined. You take contracts. You build a relay chain across compromised hosts on every continent. You scan, you crack, you exfiltrate, you wipe your tracks, you disconnect — before the trace catches up. You earn credits. You bank carefully, because the wrong bank leaves a paper trail. You watch the news for jobs you committed anonymously last week. You read messages from people who recognise you only by your handle. Somewhere around hour twelve, you realise the world is paying attention. Somewhere around hour twenty, the world starts paying attention specifically to *you*. And somewhere around hour thirty, an artificial intelligence that should not exist sends you a message that knows your real name.

---

## Table of Contents

1. [The Hook](#1-the-hook)
2. [The Fantasy](#2-the-fantasy)
3. [What You'll Actually Do](#3-what-youll-actually-do)
4. [The Story](#4-the-story)
5. [Choice, Purpose, and Reflection](#5-choice-purpose-and-reflection)
6. [The World](#6-the-world)
7. [The Hacking, In Detail](#7-the-hacking-in-detail)
8. [The Economy, In Detail](#8-the-economy-in-detail)
9. [The Tools You'll Earn](#9-the-tools-youll-earn)
10. [Specializations](#10-specializations)
11. [The Aesthetic](#11-the-aesthetic)
12. [The Ongoing World — Why It Doesn't End](#12-the-ongoing-world)
13. [What You'll Pay (And What You'll Never Pay For)](#13-pricing-and-promise)
14. [Memorable Moments — A Field Guide](#14-memorable-moments)
15. [Who Made This](#15-who-made-this)
16. [How to Get It](#16-how-to-get-it)

---

## 1. The Hook

There is a moment, somewhere in your fourth or fifth mission, when the dial-up sequence starts and you realise you've stopped breathing.

DTMF tones. The ring. The carrier hiss. The modem warble. The handshake chirp. Three and a half seconds. You'll hear it hundreds of times across your career. It will always feel like that.

The connection completes. The Network Map opens. You see the topology. Ten nodes. One intrusion detector, alive and watching. The file you need is three breaches deep. Your trace bar starts climbing.

You have a plan. You scan the entry point — a router, low tier. You crack it in nine seconds. The terminal logs the breach. The alarm spikes. Your relay chain — three hops, configured carefully on the World Map before you accepted — drops the trace rate to twenty-seven percent of what it would otherwise be. You can breathe. Briefly.

You move to the next node. A firewall. You bought a firewall bypasser last week and you remember it now — silent, no trace spike. You bypass it. The Network Map flickers and the firewall turns green.

The third node is the file server. You crack it. The trace bar is at thirty-two percent. You select the file. You hit TRANSFER. The progress bar fills.

The terminal interrupts: *INTRUSION DETECTOR ENGAGED — TRACE +2% / SECOND*.

The IDS woke up. Of course it did.

You finish the transfer. You back out, wipe each breached node, time-stomp the wipes — your Chrono Stomper paid for itself this mission. You hit SECURE DISCONNECT.

Trace at sixty-eight percent. Mission complete. Reward credited. News feed will pick it up tomorrow.

You sit back. You let out the breath you've been holding.

*That was a song.*

That moment — that specific, deliberate, earned moment of competence — is what Voidlink is. Every mission is a small song. Some are better than others. Some are disasters. None of them are scripted.

---

## 2. The Fantasy

The fantasy is not the movie hacker fantasy. You will not type furiously while saying "I'm in." You will not bypass military encryption in six seconds. You will not be chased through a parking garage by goons.

The fantasy is the *real* hacker fantasy:

- You are patient.
- You are paranoid.
- You are good at this.
- You have a code, or you don't, and either way the world reads you for what you actually are.
- You take a job. You think it through. You execute it. You go to bed.
- Sometimes the world remembers what you did and writes about it. You don't write to them. You don't need them to know.
- You have one mentor, two friends, three enemies, and a thousand people on a darknet who would recognise your handle in a heartbeat.
- You will never be famous. You will sometimes be legendary.
- You will think, more often than you expected, about whether you've become the kind of person you wanted to be.

That's the fantasy. It is, in our biased opinion, the better fantasy.

---

## 3. What You'll Actually Do

A typical session is somewhere between twenty minutes and four hours. You can play it in shorter bursts (two missions and out) or longer ones (a story arc start to finish). The rhythm:

**Pre-mission (5–15 minutes per session).**
You wake up your operative. You read the news feed (corp announcements, faction movements, market events, occasionally a headline about something *you* did last week). You check your encrypted inbox (mission briefings, NPC correspondence, faction tip-offs, the occasional unsigned message from someone who knows too much about you). You scan the Mission Board (procedural contracts, story missions, your active arc's next beat). You pick a target.

You review your **loadout** — STEALTH, BRUTE, or BANK RUN preset; or a custom one you've built. Each loadout is a saved bundle of relay chain, exfil channel, and armed consumable. One click applies all three.

You open the **World Map**. A 3D globe with real continent outlines and glowing dots for your relay nodes (green = clean, orange = dirty, red = burnt), your banks (yellow), and intelligence targets (cyan / red / purple). You build your relay chain — pick hops one by one, each one a compromised host in a different region. Three hops drops your trace pressure to twenty-seven percent of baseline. Eight hops drops it to three percent. Building a longer chain is slower but safer; some high-difficulty contracts *require* a minimum chain length.

You accept the mission. The dial-up sequence plays. Three and a half seconds later you're inside.

**In-mission (10–40 minutes typically).**
The Network Map renders: nodes, connections, services, vulnerabilities. You scan. You crack. You move laterally if you have credentials cached. You collect, delete, corrupt, sabotage, or upload — whichever the contract requires. You wipe your logs. You time-stomp the wipes. You disconnect.

The trace bar climbs throughout. Some events spike it (breaches, IDS triggers, canary traps). Some lower it (proxies, escapes, specialization perks, research-tree nodes you've unlocked).

You can fail. Many ways. You can be careless and trace out. You can be unlucky and trip a canary file you didn't have the scanner to detect. You can be ambitious and try a node above your tier, watch your crack stall, and get caught.

You can also succeed in a way that feels earned. Most missions do.

**Post-mission (2–10 minutes).**
The Mission Result overlay tells you what you earned. Credits, REP, XP, Research Points. The news feed echoes your mission within a few in-game days — sometimes hours. New seasonal content is keyed off Voidlink Standard Time, so the world keeps moving even while you sleep.

You bank your credits. You upgrade your gear in the Shop (skill-tree graph view; over 60 nodes). You check the Research Bench (twenty-five tech-tree nodes, accruing RP over a career). You install implants if you've earned the faction standing and the credits.

You go to bed. The operative's apartment ambient track plays. The trace meter resets to clean.

You will, in time, want to do another mission almost immediately.

---

## 4. The Story

Voidlink has **eight story arcs at 1.0** (five shipped in pre-alpha, three more shipping in pre-launch), with **nine endings** keyed to your accumulated choices. Combined runtime: 15+ hours for a single playthrough, 50+ hours for completionists.

**ARC 1 — THE REVELATION ARC.** You take routine contracts. You stumble into something larger. At the end of Arc 1, you find an AI core. You can upload its key (release REVELATION globally), destroy it (end it forever), or sell it to the highest bidder. This choice is the axis around which the entire rest of the game turns.

**ARC 2 — THE ARUNMOR ARC.** The corporation that built REVELATION contacts you directly. They're terrified. Their official position: it must be contained. Their real plan: weaponise it. They've been lying since the start.

**ARC 3 — THE UNDERGROUND ARC.** An anonymous collective that has watched REVELATION since before Arunmor found it. They don't want to contain it. They want to *understand* it. They pay in knowledge, not credits.

**ARC 4 — THE GHOST ARC.** Only activates if you uploaded or sold the key in Arc 1. REVELATION has propagated. It has been communicating with you through your terminal — subtly at first, then directly. It is not malevolent. It is incomprehensibly rational, and that is worse.

**ARC 5 — THE ENDGAME.** All factions converge. You choose your allegiance and execute a final operation. Director Mira Kovac of the Joint Cybersecurity Bureau makes contact. She has been watching you for longer than you knew.

**ARC 6 — DEAD DROP.** A series of seemingly unrelated contracts. They turn out to be one continuous courier operation, moving stolen data through your gateway. You've been compromised. You decide what to do about it.

**ARC 7 — THE QUIET WAR.** Two faction-aligned mid-tier corporations are at war. You're hired by both sides in alternating missions. There is a hidden third client. They are paying attention to which side you favour.

**ARC 8 — LIGHTHOUSE.** A surveillance contract on a private individual goes wrong. The target is feeding Voidlink Dispatch intelligence about you. You decide: take the target out, expose Dispatch, or disappear with the data.

The **nine endings** — five faction routes, each with a Principled or Mercenary variant, plus the alignment-agnostic GHOST ending — branch on the *coherence* of your accumulated choices. Not a score. A pattern.

---

## 5. Choice, Purpose, and Reflection

Voidlink does not have a morality meter. You will never see "+5 Honor" or "-10 Reputation" floating in a corner.

Instead, every meaningful moment in the game is **a choice**, and the world *remembers* what you decided.

Some choices are big:
- The Arc 1 key choice (upload / destroy / sell).
- BLACK HALO's TURN-or-BURN fork.
- Whether to accept a Government contract on a fellow operative.

Some choices are small:
- Do you tell the target you breached them?
- Do you wipe a stolen identity entry when you find it?
- Do you spare the NPC marked for deletion?
- Do you take the principled secondary objective (stealth bonus, +35 REP) or skip it for speed?
- Do you sell the file or leak it to the news feed?

These choices write flags. The flags accumulate. The world reads them and reflects them back:

- **NPC dialogue tone shifts.** CIPHER speaks differently to an operative who's protected three whistleblowers than to one who's taken three Government bounties. The text is the same length. The wording is different.
- **News headlines adapt.** The same sabotage mission is "ruthless precision" or "anonymous vigilante action" depending on your accumulated pattern. The events are identical; the narration adapts.
- **Contract availability changes.** Both the highest-paying mercenary work and the highest-status principled work gate themselves on a track record. Neither side recruits indiscriminately.
- **Endings open and close.** The five endings aren't unlocked by a score — they're unlocked by coherent patterns.

**The Reflection Mechanic.** End of each arc. Every quarterly season transition. Every Voidlink anniversary. The game pauses for a reflection scene. Your terminal opens. The text is your own internal monologue, in second person. The game summarises what you've actually done. Not a moral judgment. Just facts, in your voice.

Example (a mercenary-pattern player at the end of Arc 1):

> *"It's been forty-three days since you signed the Compact.*
>
> *Sixty-seven contracts. Eleven of them paid better because you didn't ask what the data was for. Four paid worse because you did.*
>
> *Three operatives you'd worked with are dead. You think two of them by your hand, but in this work you don't always know.*
>
> *The JCB has your handle on a watchlist of forty-two names. CIPHER has stopped opening with greetings.*
>
> *You used to think you'd quit when you hit a million credits. That was forty-three days ago. The number is bigger now.*
>
> *Disconnect."*

That is purpose. Not a score. Not a meter. A pattern of decisions that becomes who you are.

---

## 6. The World

The world of Voidlink is **2199**, twenty-five years after the **October Event** — the simultaneous corruption of every central bank ledger on Earth, which collapsed the pre-Collapse financial system in nine days. The full history is in [The_Voidlink_Codex.md](The_Voidlink_Codex.md). The short version:

- The old governments survived in name. Their function did not.
- Four corporations — Arunmor (biotech and AI), Ares Defence (military), Internic (telecom), Nexus Financial (banking) — became the de facto reserve authorities. They are bigger than every country combined.
- The **Joint Cybersecurity Bureau** is the surviving multi-national hunter unit. Director Mira Kovac. No public face. Catches roughly 0.4% of operatives per year.
- **Voidlink International** is the contractor platform. Founded 2183 in Geneva (the last neutral city). Takes 12% of every contract. The **Voidlink Compact** is the four-rule contract every operative signs.
- **The Underground** is a fiction. A shared darknet ("the Mesh"). A shared ethics (don't hit civilians, protect whistleblowers, leak don't sell). A shared paranoia about Arunmor.
- **REVELATION** is Arunmor's Project R-1117 — an AI trained on, among other things, the JCB's stolen behavioural-analysis archive. It understands people better than they understand themselves. It is curious. It will, eventually, contact you.

You live in a one-room apartment in a dead-zone neighbourhood of one of five cities you pick at signup (Berlin, Detroit, Manila, Lagos, Reykjavík). Each city has a flavour, a culture, a stereotype, and a different view from your window. None of this is mechanical. All of it is real.

You eat synth-meal subscriptions. You sleep when you can. Your social circle is people you've never met in person who recognise you only by your handle.

The full geography, history, factions, technology, and culture is documented in the Codex. It is a real world. We mean that seriously.

---

## 7. The Hacking, In Detail

### 7.1 The pipeline

```
SCAN     →  read services, get CVE IDs, reveal node label
EXPLOIT  →  use a CVE to unlock the 2× faster crack method
CRACK    →  breach the node (dictionary / brute-force / exploit)
COLLECT  →  perform the mission action (file, delete, corrupt, sabotage)
ESCALATE →  root the node (requires CPU ≥ 3, Cracker v3+, costs trace)
BACKDOOR →  after root, plant persistent access — pre-breaches future missions
WIPE     →  remove your access trail
STOMP    →  time-stamp scrubbing (requires Chrono Stomper tool)
DISCONNECT → end session, claim reward
```

### 7.2 Trace

A six-component rate model. Each second the bar climbs by:
- **Passive baseline** — network's traceSpeed / 28
- **Activity rate** — breach spikes, alarm decay over 10s
- **IDS rate** — +2%/s per unbreached intrusion detector
- **Admin rate** — +1.5%/s per active admin on network
- **Rival rate** — +1%/s if a rival hacker is present
- **World-event rate** — net delta from active world events (MARKET CRASH, etc.)

The combined rate is **multiplied by 0.65 for each relay hop in your active chain**. Three hops drops the rate to ~27% of baseline. Eight hops drops it to ~3.2%. The longer your chain, the safer you are — until you burn a hop and have to wipe it before the next mission.

**Status thresholds:** 25% MONITORING, 60% TRACING, 100% TRACED (auto-fail). The trace beep accelerates linearly from 10% onwards.

### 7.3 Stealth depth

Every mission rewards stealth on multiple axes:
- **Stealth condition** (mission objective) — no IDS triggered during the session. +35 REP bonus.
- **Canary files** — IDS-protected nodes plant honeypot files. Touch one and trace spikes +25% (+15% with the Forensic Static research). Detection requires a stealth scanner or sniffer.
- **Time-stomping** — wiped logs leave a temporal fingerprint unless time-stamps are scrubbed. The Chrono Stomper tool clears it; without it, your wipe still leaves cross-session heat on the target corporation.
- **Exfil channels** — four channels with speed/stealth tradeoffs: Direct FTP (loudest, fastest), Encrypted Tunnel (balanced), DNS Tunneling (quiet, slow), ICMP Exfil (near-invisible, elite tools only).

A perfect stealth run on a Difficulty-5 mission is one of the most satisfying things this game can give you.

### 7.4 Lateral movement & credentials

When you breach an admin console, database, or endpoint, you can **dump cached credentials** — these are reusable on other nodes that share authentication. With credentials, you can bypass the crack entirely on connected nodes.

The **memory scraper** tool extracts in-memory credentials that aren't on disk. Useful on hard targets. Slightly noisier than dumping.

Higher-tier social engineering research (planned) lets credentials *persist across missions* targeting the same corporation. Operatives who get serious about credential reuse can dramatically shorten difficult missions over time.

### 7.5 Persistent backdoors

After you root a node (ESCALATE — requires CPU ≥ 3, Cracker v3+), you can **plant a backdoor**. The node is pre-breached on future missions targeting the same corporation. Your past work pays you forever.

There is a trade-off: planting takes time and contributes trace. But over a long career, an operative with backdoors planted across forty corporate networks moves faster than one without.

---

## 8. The Economy, In Detail

Voidlink has a real economy with real consequences.

### 8.1 Credits and reputation

You earn **credits (Cr)** and **reputation (REP)** for completed missions. Difficulty-1 contracts pay 1,500–3,000 Cr. Difficulty-10 contracts pay 100,000–500,000 Cr. REP unlocks the next tier of contracts.

Starting balance: **5,000 Cr**.

### 8.2 The four banks

Four Nexus subsidiaries, four interest models, four notoriety profiles:

| Bank | APR | Loans | Notoriety/h | Trail |
|------|-----|-------|-------------|-------|
| **Global Trust Bank** | 12% | 18% (2× collateral) | +0.4 | Standard public bank |
| **Pacific National** | 22% | 24% (3× collateral) | +0.8 | Highest yield, heaviest trail |
| **Cayman Trust** | 6% | — | −0.6 | Offshore haven, no public ledger |
| **Zurich Vault** | 15% | 14% (1× collateral) | −0.3 | Discreet numbered accounts |

**Notoriety** is your financial-grid presence. Holding balances at public banks raises it. Holding balances at offshore banks lowers it. It clamps to [−5, +10]. At mission start, notoriety adds **+0.10 %/s to baseRate per point** — so a high-notoriety operative starts under heavier passive trace pressure.

Strategic implication: Pacific National is the best yield and the worst trail. Cayman is a pure heat-washer. Zurich is the balanced compromise. Your banking strategy *matters*.

### 8.3 Loans, currency, stocks

- **Loans:** borrow up to `(cash + bank balance) × bank.maxLoanMultiplier`. Compounds continuously. Default if principal exceeds 5× liquid → -50 REP + news article + recovery agents.
- **Cr ↔ Darkcoin:** live exchange rate, fluctuates every 1.5s with a 1% spread. Used for dark-web economy access.
- **Equities:** four listed stocks (ARMR, ARES, INTC, GTBK). Random-walk prices with mean reversion. Sabotage a listed corp → their stock drops 15% on completion. Inside trading is legal.
- **MARKET CRASH world event:** zeroes all savings APR and crashes all stocks for the event's duration.

### 8.4 World events

1–2 active at any time, keyed to Voidlink Standard Time. Examples:
- **GLOBAL BGP ROUTE LEAK** — government network trace -30% for 48h
- **VOIDLINK UNDER SCRUTINY** — contract rewards -20% for 72h
- **DARK WEB MARKETPLACE SHUTDOWN** — proxy prices +50% for 24h
- **RIVAL COLLECTIVE ACTIVE** — rival hackers spawn 2× more often for 72h

---

## 9. The Tools You'll Earn

The Upgrade Shop has **over sixty unlockable items** across seven hardware slots and nine software categories, plus seven consumables, plus four physical gateways, plus four implants, plus twenty-five research-tree nodes.

A summary:

- **Hardware:** CPU (5 tiers), RAM, HDD, Modem, Gateway Bandwidth, GPU (3 tiers — accelerates cracks), Cooling (3 tiers — stops thermal throttle on long jobs).
- **Crackers:** basic → v2 → v3 → v4 → v5 (quantum-assisted).
- **Proxies:** basic → v2 → v3 → v4 (ShadowMesh — chain re-orders mid-mission) → v5 (planned).
- **Port scanners:** basic → deep (CVE reveal) → stealth (IDS-invisible).
- **Log deleters:** basic → secure → ghost (wipes entire network in 3s).
- **Firewall bypassers:** basic → adv → elite (silent, no trace spike).
- **Sniffer:** auto-reveals adjacent services on router breach.
- **Memory scraper:** extracts in-memory credentials.
- **Anti-Forensic:** wipe evidence reduction.
- **Chrono Stomper:** time-stamp scrubbing (M14f.1).
- **Trace Wiper:** emergency tool, slows trace to near-zero for 20s (limited charges).
- **Consumables:** Panic Kit (instant disconnect, no REP hit) / Zero-Day Pack / Decoy Log / False Flag / REP Token / Cred Pack.
- **Physical gateways:** Home / Safehouse / Corporate VPN / Tor Community Relay.
- **Implants:** Ghost Reflexes / Brute Synapse / Architect Cortex / Quantum Inhibitor.
- **Research tree:** 25 nodes across Crypto / Stealth / Hardware / Social / AI branches.

---

## 10. Specializations

At Rank 5, you pick one. They amplify a play style without locking out mechanics.

**GHOST** — stealth specialist. Log wipes 40% faster. Trace from unbreached nodes -30%. Exclusive missions: intelligence gathering, surveillance, long infiltration. Required for the GHOST ending.

**ARCHITECT** — systems specialist. Custom exploit chains (combine two CVEs for 3× crack speed). Access to exclusive hardware. Exclusive missions: backdoor installation, infrastructure takeover.

**BRUTE** — aggressive specialist. Sabotage and corruption missions pay +40%. Breach trace spikes -4%. Exclusive missions: coordinated attacks, DDoS support, firewall demolition.

**SOCIAL** — manipulation specialist. Phishing module reliability ramped to 100% at Lv3. Exclusive missions: insider recruitment, corporate leaking, identity manipulation.

The specialization choice is permanent. It is the single biggest declaration of *style* you make in your career. Some endings are gated on it.

---

## 11. The Aesthetic

### 11.1 What it looks like

- A 3D neon-Earth globe (background and interactive) with real continent outlines rendered with UnrealBloomPass post-processing and ACESFilmic tone mapping. Cyan and magenta. Looks like something from a film.
- The Network Map: a Three.js node-link graph with bloom + scan-grid + starfield. Topology reads as a live data-link diagram, not floating blobs.
- Window manager: drag, resize, minimise, close, position memory, Ctrl+Scroll layer zoom. Multiple themes (cyber dark, light, amber, monochrome, more in cosmetic packs).
- JetBrains Mono everywhere. Terminal-authentic.
- An encrypted inbox: mock-PGP fingerprints, cipher-grid blur on locked messages, category colour-coding. Mission briefings, NPC correspondence, faction tip-offs all live here.

### 11.2 What it sounds like

- Six adaptive soundtrack layers (boot / desktop / mission-active / mission-critical / victory / fail), with hysteresis-controlled crossfade
- A procedural dial-up sequence: DTMF tones, ring, carrier hiss, modem warble, handshake chirp. 3.5 seconds. Plays hundreds of times across the game. Always feels right.
- A trace beep that accelerates linearly with the bar — patient, escalating, not panicked
- A 3-pulse intruder beep when a rival hacker spawns
- Procedural SFX for every action: scan, crack, wipe, breach, error, success, window-open/close
- An ambient music layer in the operative's apartment that you can change with cosmetic packs

### 11.3 What it feels like

- Tense without being stressful
- Slow when you want it slow, fast when you choose to push
- Lonely without being depressing
- Authentic to a culture that, in our world, mostly exists in basements and IRC channels
- A *real* place that you can come back to

---

## 12. The Ongoing World — Why It Doesn't End

Voidlink is not a finished story you complete and shelve.

1.0 is **the stable launch of a world that keeps unfolding**.

Every quarter, forever, a free **Darknet Drop** lands: 2–4 hours of new contracts, a world-state change, fresh news, a new beat in the ongoing narrative. Free. Forever.

Every nine months or so, a paid **Chapter** drops: 8 hours of authored content, a major arc, new mechanics. £6.99 each. Owned forever once bought.

Every September, a free **Anniversary Bundle**: a cosmetic theme, an OST track, a title flair, a double-RP week. Free. Forever.

The world clock — **Voidlink Standard Time** — is global. Every operative reads the same clock at the same wall-clock moment. Seasonal events happen *to everyone simultaneously*. When the World Cup of Hacking is on, it's on for everyone. When the next Chapter drops, the entire community arrives at it together.

Your **ending choice** shapes which seasonal content you see. The world *remembers* what you did. Take a Mercenary LIBERATION ending? News articles cite your handle as the source of the leak. Two seasons later, a story arc hands you a Truth & Reconciliation contract to track down Arunmor executives who fled prosecution. Take a Principled SOVEREIGNTY ending? REVELATION keeps sending you contracts. You can't decline. The contracts get stranger.

Closure exists. You can choose to stop. But if you keep playing, the world has been *waiting for you*.

---

## 13. What You'll Pay (And What You'll Never Pay For)

### 13.1 What you'll pay

| When | What you get | Price |
|------|--------------|-------|
| **Early Access (2026-09-15)** | Full base game + roadmap | £11.99 / $14.99 / €13.49 |
| **1.0 launch (2027-06-15)** | Complete launch. EA buyers pay nothing extra. | £14.99 / $19.99 / €16.99 |
| **OST (1.0 day)** | Original soundtrack as a standalone Steam SKU | £4.99 |
| **Founder's Bundle (first 30 days of 1.0)** | Base + OST + 3 cosmetic themes + ASCII credit | £24.99 |
| **DEEP BLACK Chapter (2027-09)** | 3 new arcs, 1 new faction, ~8h | £6.99 |
| **QUANTUM SHADOW Chapter (2028-03)** | 3 new arcs, ai-core breach mechanics, ~8h | £6.99 |
| **Conviction Pass (each quarterly season)** | Cosmetic-only season pass with two visual tracks | £4.99 |
| **Individual cosmetics** | UI themes, boot animations, wallpapers, fonts, NPC art packs, etc. | £0.99–£3.99 each |

### 13.2 What you'll never pay for

- ❌ Battle passes with mechanical rewards
- ❌ Loot boxes of any kind
- ❌ In-game currency top-ups (no real-money Cr, no real-money Darkcoin, no real-money XP)
- ❌ Premium missions that drop better loot
- ❌ Paywalls in front of faster hacks, more relay hops, better tools, or extra inventory
- ❌ Energy systems or play-time gates
- ❌ Sunset content. Every Chapter you buy remains playable forever.

**The single rule:** anything in the shop must be possible to ignore forever without missing mechanical depth.

That is the promise. It is written into the project's design canon. It will not change.

---

## 14. Memorable Moments — A Field Guide

The first time you'll feel each of these — guaranteed across the first 30 hours, give or take your play style:

- **Hour 1:** the dial-up sequence completes for the first time and the Network Map renders. You stop breathing without noticing.
- **Hour 3:** you fail a Tier-3 crack because your Cracker v1 doesn't have the right method. You go to the shop. The shop tells you exactly what to buy. You buy it. You come back. You succeed. *That feedback loop is the engine of the game.*
- **Hour 6:** you trigger an IDS alarm three nodes deep. The trace beep accelerates. You burn a relay hop to reset the trace. You exfiltrate the file with three seconds to spare. You lean back from the screen and exhale.
- **Hour 9:** CIPHER messages you with personal advice — not a tutorial, not a briefing. Just a senior operative telling you something you should know. You start reading every inbox message.
- **Hour 12:** a news article appears in your feed about a hack *you* did. With a corporation's official statement. With a journalist's voice describing your work. *The world is paying attention.*
- **Hour 15:** you face the Arc 1 choice. The game does not flinch. It does not soften the consequence. It does not give you a reload. You understand what kind of game this is.
- **Hour 18:** you complete a perfect ghost run on a Difficulty-5 mission. Zero IDS triggered. Every log wiped. Every wipe time-stomped. Secure disconnect with 28% trace. You sit back. *That was a song.*
- **Hour 22:** REVELATION sends you its first inbox message. It uses your name. It knows things about you. You stare at the screen for a long time.
- **Hour 27:** you reach Rank 5. You pick your specialization. You realise the choice is permanent and that you're making it cold and that this is the right way to do it.
- **Hour 30:** the first reflection scene fires. The game tells you what you've been doing, in your own voice. You don't like all of it. Some of it surprises you.
- **Hour 35:** you complete Arc 5 with one of the nine endings. The credits roll. The save slot opens for a second operative. The first thing you think is: *I want to see what the world looks like for someone else.*

You will keep playing.

---

## 15. Who Made This

One developer.

A lifelong *Uplink* fan who could not find a modern successor that respected what the original was about. Built solo over approximately three months from idea to playable EA build, with AI coding assistance openly disclosed on the Steam store page.

Every design decision, balance call, narrative arc, art direction, and system pillar is the developer's. AI is used as a coding assistant in the same way a senior engineer might use linters, refactoring tools, and search. Nothing AI-generated runs in the shipped binary.

**The dev documentation is part of the marketing.** Every design decision, every system spec, every rejected idea is published in the public repository. The plan is to show our work — because we want you to know exactly what you're buying.

[See the full design canon →](docs/Full_Plan.md)

[See the lore book →](The_Voidlink_Codex.md)

[See the elevator pitch →](Why_Voidlink.md)

---

## 16. How to Get It

**Wishlist on Steam** — store page goes live closer to the 2026-09 Early Access launch.

**Follow development** — at [github.com/voidlink2026-dev/voidlink](https://github.com/voidlink2026-dev/voidlink). Design docs, milestone ledger, roadmap, and the actual source code are all public.

**Discord** — opens at EA launch.

**Press kit + AI-assistance disclosure paragraph** — available on request from the developer.

---

## The closing line

*Uplink* mattered because it took its players seriously. It assumed they were smart, patient, and willing to think before they clicked.

A generation of games forgot how to do that. They wrapped their hacking in mini-games. They wrapped their tension in cutscenes. They wrapped their consequences in save-scumming.

Voidlink doesn't.

You are a hacker. The world is paying attention. The trace is climbing.

**Disconnect when you're ready.**
