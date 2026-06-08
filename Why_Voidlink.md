# Why Voidlink

The pitch — for press, for players, for anyone wondering whether this game is worth their time and their money.

Three companion docs sit alongside this one, written for different audiences:

- **[Voidlink_Synopsis.md](Voidlink_Synopsis.md)** — the comprehensive game guide. "What is this, what will I do, what will I remember from it."
- **[The_Voidlink_Codex.md](The_Voidlink_Codex.md)** — the world bible. The history of 2199 in full. Tolkien-depth lore. Read this if you want to *live* there.
- **[docs/Full_Plan.md](docs/Full_Plan.md)** — the engineering canon. For planners and contributors.

---

## The hook

> *You are a hacker. Not a movie hacker. Not a "tap-tap-tap I'm in" hacker. A patient, paranoid, calculating contractor who knows that every node you touch leaves a fingerprint and every credit you bank leaves a trail. This game does not let you cheat the tension. It rewards you for thinking like the people you're trying to be.*

**Voidlink** is the spiritual successor to *Uplink* (2001) that's been missing for twenty-five years. It is single-player. It is single-priced. It will never sell you an advantage. It is a love letter to a genre that refused to die.

---

## What is this?

You are an anonymous contractor for **Voidlink International** — a black-market network where corporations, governments, and criminals pay skilled hackers to do the things they can't do officially. You sign **the Bond** on intake: one contract, four rules, irrevocable. You will think about it again later.

You take contracts. You build a relay chain through compromised hosts around the globe. You connect to the target. You scan. You crack. You exfiltrate. You wipe your tracks. You disconnect — *before* the trace catches up.

You upgrade your tools with your earnings. You bank your money carefully, because the wrong bank leaves a paper trail that follows you into the next job. You watch the news for jobs you committed anonymously last week. You realise, somewhere around hour twelve, that the contract you took in your second session is connected to something much larger than you were told.

You are not in control of the situation you think you are.

---

## Why you'll want to play

**Because the tension is real.** The trace meter is not a timer. It's a threat. It climbs slowly while you're being careful — and spikes when you trip an IDS. There's a sound — a small, accelerating digital ping — that starts at 10% and gets faster as the bar fills. The first time you hear that beep speed up while you're still three nodes away from the file you need, you will understand what we built.

**Because the silence is a reward.** A perfect ghost run — no IDS triggered, no alarm spikes, every log wiped, every timestamp stomped, secure disconnect with thirty seconds to spare — has nothing in common with the bombast of most games. The reward is the hum of the ambient music and the cursor blinking on the terminal. You sit back. You earned that.

**Because every choice has weight.** You will spend forty hours of game time, and almost every interesting decision is a tradeoff. *Should I bank at Pacific National (22% APR, heaviest paper trail) or Cayman (6% APR, washes my notoriety)?* *Do I take the high-paying sabotage contract on a corp I just breached two missions ago, knowing they're still patched?* *Do I plant the backdoor on this node now, take the trace hit, but make every future job against this corp easier — or play safe?* The game refuses to make these decisions for you.

**Because the story finds you.** You don't have to seek out the narrative. It arrives in your encrypted inbox. CIPHER — a senior operative you'll come to recognise — sends you a message in your second session: *"Three things will keep you alive longer than upgrades. One, build your relay chain before every job. Two, wipe your logs. Three, don't bank where you breach."* Whether you listen or not, the world will react. You will read about your own crimes in the news feed the next morning. You will see your name — your handle — in REVELATION's terminal messages by Arc 4. You will be offered, somewhere around hour twenty, an ending earned by everything you have been — chosen from eleven possible variants — and you will only be able to pick one.

**Because the world is alive.** Sabotage Arunmor and their stock drops by 15%. Default on a loan and the bank files a news article about the "unidentified borrower flagged for default." Every corporation you breach patches their CVEs within three in-game days. Voidlink Standard Time — the in-game clock — is anchored globally, so when seasonal events run, every operative across the world sees them at the same moment. The game is not a sandbox. It is a simulation.

---

## What makes it different

| Game | What we respect | What we improve |
|------|-----------------|------------------|
| *Uplink* (2001) | The original. The DNA. The tension. | Modern UI, branching narrative, full RPG progression, faction system, living world simulation. |
| *Hacknet* | Terminal authenticity, real-feeling commands. | Full RPG progression, story consequence, persistent reputation, mechanical depth beyond "type a command." |
| *Watch Dogs 2* | World-building, ambient hacking. | Pure hacking focus — every action means something at a system level, not "press X to hack." |
| *Deus Ex: Mankind Divided* | Player agency, faction depth, narrative branching. | Hacking IS the game, not a four-minute mini-game side note between gunfights. |
| *Cyberpunk 2077* | World, writing, atmosphere. | Every network has a real topology with authored personality. No "press a button to breach protocol." |

**Our unique position:** the only game in 2026 that combines real network topology simulation, branching RPG progression, living-world consequence modelling, and a UI that feels like genuine hacker tooling — at a price your friends will say "yes" to without thinking about it.

---

## The hacking

This is what you came for. Here's what's actually in the box.

- **Real network topology.** Every contract drops you into a graph of nodes — entry points, firewalls, routers, file servers, databases, mail servers, admin consoles, intrusion detectors, AI cores. Each one has services with versions and known vulnerabilities. Each one has connections. Each network has personality — corporate intranets are bureaucratic and patchy, government classified networks are paranoid and redundant, legacy mainframes are brutal to crack with modern tools but trivial if you understand 1990s exploit chains.
- **The pipeline:** *Scan* a node to discover its services and CVEs. *Exploit* a vulnerability for a 2× faster crack. *Crack* the node with dictionary, brute-force, or exploit-method. *Collect* the file, delete the account, corrupt the database, sabotage the router — whatever the contract demands. *Wipe* the logs. *Timestomp* the timestamps. *Disconnect* before trace completes. Every step has tools, tradeoffs, and visible consequences.
- **Real depth that reveals itself.** A new player wins missions with dictionary attacks on every node. An expert player dumps credentials from a breached database and uses them to skip cracks on lateral connections. A *master* player scrapes credentials out of memory before they're written to disk. The game does not gatekeep — it rewards curiosity.
- **Persistent backdoors.** Escalate privileges on a breached node (requires Cracker v3+ and CPU ≥ 3 GHz, with a trace penalty). Plant a backdoor. The next time you take a job against the same corporation, that node is already pre-breached. Your past work pays you forever.
- **Honeypots.** Some networks plant **canary files** — innocuous-looking documents that, if touched, immediately alert security: +25% trace, persistent heat, and a one-way ticket to fail. The only way to spot them is to invest in a stealth scanner or a deep-tap sniffer. Without one, every file looks identical to the trap.
- **Relay chains that matter.** You build your anonymity by stringing together compromised hosts around the world. Each hop multiplies your effective trace rate by 0.65 — three hops drops it to ~27% of baseline; eight hops to ~3%. Bigger jobs require bigger chains. Burning a hop with dirty logs costs you that node until you wipe it.
- **Exfiltration channels.** Direct FTP is fast and loud. DNS tunneling is slow and silent. ICMP exfil is barely detectable but requires elite tools. The channel you pick changes the texture of the mission.
- **Trace is a six-component rate model.** Passive baseline, alarm decay from breach spikes, IDS rate per unbreached detector, admin rate per active admin, rival hacker rate, world-event modifiers. The system is mechanically honest. There is no fake difficulty.

---

## The story

**Eight authored arcs. Eleven endings. Roughly eighteen hours of hand-written branching narrative.** Plus an ARG-style hidden mystery that begins on launch day and runs across Early Access.

When you sign up to Voidlink International, you sign **the Bond** — one contract, four rules, irrevocable. The whole game is the consequences.

**Arc 1 — REVELATION.** Routine jobs lead somewhere much larger. At the end of Arc 1 you find the AI core. You can upload the key, destroy it, or sell it to the highest bidder. **This choice is the axis around which the entire rest of the game turns.**

**Arc 2 — ARUNMOR.** The corporation that built REVELATION contacts you directly. Official position: contain it. Real plan: weaponise it.

**Arc 3 — UNDERGROUND.** An anonymous collective that has watched REVELATION since before Arunmor found it. They don't want to contain it. They want to *understand* it.

**Arc 4 — GHOST.** REVELATION has propagated. It has been communicating with you through your terminal — first subtly, then directly. It is not malevolent. It is incomprehensibly rational, and that is worse.

**Arc 5 — ENDGAME.** All factions converge. You choose your allegiance. You execute a final operation. Nine ending variants fan out from here based on your accumulated pattern.

**Arc 6 — DEAD DROP.** A series of routine courier contracts turns out to be one continuous operation, and *you* have been the courier. Resolution: clean your gateway (lose a relay node permanently), weaponise the tunnel as a backdoor into Arunmor, or sell the discovery.

**Arc 7 — THE QUIET WAR.** Two mid-tier corporations are at corporate war. A hidden third party — an old broker — has been deliberately leaking to both sides to keep the war contained, because the war is the thing protecting eighty-three thousand other people. You decide whether to end it.

**Arc 8 — LIGHTHOUSE.** You take a routine surveillance contract on a former Voidlink Dispatch analyst. You discover that the platform that recruited you has been profiling and selling operatives — *including yourself* — to corporate intelligence buyers for at least eighteen months. The system you signed the Bond with is, has always been, a product whose inventory was you.

**The eleven endings.** Five canonical families across two convictions (CONTAINMENT, LIBERATION, SOVEREIGNTY, ERASURE × principled / mercenary) plus GHOST (solo route), REFORMER (late conversion), COLLABORATOR (the bleak one — you spent your career on the side of the people who built the wreckage), and a hidden platinum eleventh tied to the Lighthouse reveal. Each ending unlocks deliberately. The game does not tell you which one you're heading toward.

**The moral axis we built late: Collaborator vs Resistor.** Every contract you take is silently tagged by client faction (corporate / government / Underground / independent). The game does not show you a number. Cipher cools his greeting tone past a corporate-collaborator threshold. NIGHTOWL warms past a resistor threshold. After enough contracts, a reflection scene called WHO YOU WORK FOR fires automatically, and tells you what you have been.

The ARG runs across every Early Access season. Encrypted messages from "the cartographer" appear in random news feeds. Decoder hints arrive in your inbox. The community will solve it together over months — or it will solve it for you, the moment you complete the final arc.

---

## The world

You are not playing alone in a void. You are inside a simulation that continues whether you're paying attention or not.

- **Banks have personalities.** Global Trust is the safe boring choice (12% APR, public records). Pacific National is the aggressive growth fund (22% APR, but every credit you hold adds to your notoriety — and notoriety raises your starting trace pressure on every future mission). Cayman Trust launders heat at 6%. Zurich Vault is the balanced compromise.
- **Stocks move.** Sabotage a publicly-traded corporation and their share price drops 15%. Buy the dip if you saw it coming. Sell short if you didn't.
- **News reacts.** Hack a corp, read about it tomorrow. Default on a loan, the bank flags an "unidentified high-risk borrower" — and recovery agents start looking.
- **Corporations patch.** Three real-time minutes after a successful breach equals three in-game days; the CVEs you used are now closed. Hit them too often and they raise security globally.
- **World events.** *MARKET CRASH* zeroes savings APR. *GLOBAL BGP ROUTE LEAK* slows government trace for 48 hours. *DARK WEB MARKETPLACE SHUTDOWN* spikes proxy prices for a day. *RIVAL COLLECTIVE ACTIVE* doubles rival-hacker spawn rates for 72 hours. The world keeps moving.
- **Five factions, real consequences.** Voidlink International (your employer), Arunmor (the corporation), the Underground (the anonymous collective), the Government (the agency that wants to catch you), REVELATION (the AI that's slowly learning your handle). Faction standings shift with every decision. By Arc 5 the standings determine which ending is even available to you.
- **Voidlink Standard Time.** A single global game clock anchored at real-world 2026-01-01 = game-world 2199-01-01. Every operative — single-player now, multiplayer eventually — sees the same in-game time at the same wall-clock moment. Seasonal world events are scheduled against it.

---

## The feel

There's a thing that happens around your fourth or fifth mission. The dial-up sequence kicks in — DTMF tones, ring, carrier hiss, modem warble, handshake chirp — and you realise you've stopped breathing while it plays. That sequence will play hundreds of times across the game. It will always feel like that.

We obsess over the small things:
- **The trace beep accelerates linearly with the bar.** Not a panicked alarm. A patient, accelerating proximity sensor that puts you in the head of your target's security team.
- **The dial-up sequence is procedural.** DTMF tones for the bounce nodes, ring tone, carrier negotiation, modem handshake. Not a loop — an authentic 3.5-second sequence every time.
- **A 3-pulse intruder beep** plays the moment a rival hacker spawns on your network. You will *feel* it before you see the alert.
- **Window position memory.** Lay out your operating environment the way you want — windows dragged, resized, minimised, even closed. Log out, log back in two days later, your exact layout returns.
- **The globes have real continents.** Both background and interactive — drawn from a 110m TopoJSON dataset, glowing in cyan with UnrealBloomPass post-processing and ACESFilmic tone mapping. They look like something from a film. They are actually just clever rendering.
- **The encrypted inbox.** Mission briefings, NPC correspondence, faction tip-offs all arrive here. Encrypted messages render as a 4×16 cipher grid until you click DECRYPT WITH KEY. The cipher art is procedurally generated from the message ID — every one different, every one deterministic.
- **Six soundtrack tracks** layer adaptively (boot / desktop / mission-active / mission-critical / victory / fail). The transitions are hysteresis-controlled — no pop, no double-bass, no audible seam.

---

## The progression

Nothing is free. Hardware costs real money. Story missions require capability gates that you can see on every mission card: *✓ CRACKER LV2 / ✗ CPU 2.0 GHz+ / ✓ REP 25+ / ✗ RELAY ≥ 3 HOPS*. The shop is salvation, not a slot machine.

You earn credits by completing contracts. Difficulty-1 missions pay 1,500–3,000 Cr. Difficulty-10 missions pay 100,000–500,000. The curve is calibrated so you always feel slightly behind, always have a clear next goal, always know exactly what you need to do to unlock the next thing you want.

There are **four specializations** you choose at Rank 5:
- **GHOST** — stealth specialist. Faster log wipes, lower trace from unbreached nodes, required for one of the five endings.
- **ARCHITECT** — systems specialist. Custom exploit chains, exclusive hardware.
- **BRUTE** — aggressive specialist. Bigger payouts on sabotage and corruption missions, smaller trace spikes on breach.
- **SOCIAL** — manipulation specialist. Phishing module reliability, exclusive social-engineering missions.

You're not locked into your spec. It amplifies your style.

---

## The promise

This is the most important section in this document.

### What we will sell

- **Cosmetic UI themes.** Amber palette. Red palette. Purple palette. £2.99 each.
- **Cosmetic boot animations and wallpapers.** £1.99 each.
- **Operative title flair.** Pure vanity. Earned or purchased.
- **The Original Soundtrack** as a separate SKU. £4.99.
- **Story DLC** where every player gets the same content. £6.99 each (DEEP BLACK, QUANTUM SHADOW announced).
- **Founder's Bundle** at 1.0 launch — base game + soundtrack + 3 themes + ASCII credit in the game — £24.99 for the first 30 days only.

### What we will NEVER sell

- Battle passes with mechanical rewards.
- Loot boxes of any kind.
- In-game currency top-ups (no real-money Cr, no real-money Darkcoin, no real-money XP).
- Premium missions that drop better loot.
- Paywalls in front of faster hacks, more relay hops, better tools, or extra inventory.
- Energy systems or play-time gates.

**The single rule:** anything in the shop must be possible to ignore forever without missing mechanical depth.

That is the promise. It is written into the project's design canon. It will not change.

---

## What it costs

| When | What you get | Price |
|------|--------------|-------|
| **2026-09 Early Access** | Full base game + roadmap + EA discount on first week | £11.99 / $14.99 / €13.49 |
| **2027-06 1.0 launch** | All EA buyers get the full 1.0 at no extra cost. New buyers pay full price. | £14.99 / $19.99 / €16.99 |
| **OST** (1.0 day) | Original soundtrack as a standalone Steam SKU | £4.99 |
| **Founder's Bundle** (first 30 days of 1.0) | Base + OST + 3 cosmetic themes + ASCII credit | £24.99 |
| **DEEP BLACK** (2027-09) | Story DLC: 3 new arcs, new faction, ~8h content | £6.99 |
| **QUANTUM SHADOW** (2028-03) | Story DLC: 3 new arcs, ai-core breach mechanics, ~8h | £6.99 |

**Every quarter, forever, a free Darknet Drop** ships — one-off contracts, news, narrative beats. Free. Optional cosmetic skin £2.99.

---

## What's coming

**Early Access seasons (2026-09 → 2027-06):**
- **GHOSTNET** (autumn 2026) — new darknet faction, 5 new mission types, ARG begins.
- **ARES** (winter 2026/27) — Arc 9, military complex story arc, winter ambient event.
- **ZERO DAY** (spring 2027) — Arc 10 resolves the ARG, modding SDK opens, Steam Workshop integration.

**1.0 launch (2027-06):**
- 8 launch languages (English, Spanish, German, French, Russian, Simplified Chinese, Japanese, Brazilian Portuguese).
- Steam Deck Verified.
- 50 achievements.
- Cloud saves.
- 50+ hours of content if you complete every arc and every ending.

**Post-1.0:**
- Story DLC: DEEP BLACK (2027-09), QUANTUM SHADOW (2028-03).
- Workshop modding with full Lua scripting API.
- Quarterly seasonal narrative drops, free forever.
- Twitch integration — chat votes on choice missions for streamers.

**Multiplayer is the LAST system.** Not because we can't, but because we want to get the single-player right first. When multiplayer lands, the entire world clock, faction standing, market simulation, news feed, and bounty network is built to absorb it without redesign.

---

## Who made this

One developer. A lifelong *Uplink* fan who could not find a modern successor that respected what the original was about. Built with modern tooling — including AI-coding assistance, openly disclosed on the store page — but every design decision, every balance call, every line of story, every system pillar is the developer's.

**The dev documentation is part of the marketing.** Every design decision, every system spec, every rejected idea is in this repository. We are showing our work because we want you to know exactly what you're buying.

The full plan is in [docs/Full_Plan.md](docs/Full_Plan.md). It is 900 lines. It is honest about what is shipped and what is planned. There is no hidden monetisation roadmap. There is no future battle pass. The promise above is the plan.

---

## A few moments you'll remember

These are real, specific things that already happen in the game:

- The first time you fail a Tier 3 crack because your Cracker v1 doesn't have the right method, you'll go to the shop. The shop will tell you exactly what to buy. You'll buy it. You'll come back. You'll succeed. That feedback loop is the engine of the game.
- The first time you trigger an IDS alarm three nodes deep, hear the trace beep accelerate, and *still* exfiltrate the file by burning a relay hop with three seconds to spare — you'll lean back from the screen and exhale.
- The first time CIPHER messages you with personal advice — not a tutorial, not a mission briefing, just a senior operative telling you something you should know — you'll start reading every inbox message that arrives.
- The first time a news article appears in your feed about a hack *you* did, written by a journalist's voice, with a corporation's official statement — you'll realise the world is paying attention.
- The first time you face the Arc 1 choice — upload, destroy, or sell — and the game does not flinch, does not soften the consequence, does not give you a reload — you'll understand what kind of game this is.
- The first time you complete Arc 5 with one of the five endings, and the credits roll, and the next save slot opens, and the world is different because of what you did — you'll start a new operative.

---

## Get it

**Wishlist on Steam** (page goes live closer to 2026-09 EA launch).

**Follow development** at [github.com/voidlink2026-dev/voidlink](https://github.com/voidlink2026-dev/voidlink) — design docs, milestone ledger, roadmap, and the actual source code are all public.

**Discord** opens at EA launch.

**Press kit + AI-assistance disclosure paragraph** available on request from the developer.

---

## This is not a game with an end

We are not building a game you finish.

We are building a **world**. The story has a beginning (Arc 1 — The Revelation Arc). It has an ending — nine of them, in fact, branching on the coherence of your accumulated choices. But the world *doesn't stop* when you reach an ending.

Every quarter, forever, a free narrative drop lands. Every nine months or so, a paid Chapter expands the story. Every September, an anniversary event drops free cosmetics for everyone. The world clock — **Voidlink Standard Time** — is anchored globally, so seasonal events happen to every operative simultaneously.

Your ending choice **shapes the future content you see**. Principled LIBERATION? News articles cite your handle. Mercenary SOVEREIGNTY? REVELATION keeps sending you contracts and they get stranger.

Closure exists. You can choose to stop. But if you keep playing, the world has been waiting for you.

We have ambition for this world. We want operatives to talk about Voidlink the way *Red Dead* fans talk about Arthur. The way *Max Payne* fans talk about that staircase. The way Tolkien readers talk about the Long Lake. The way Harry Potter readers talk about going back to King's Cross every September.

That ambition is in the docs. The Codex is real. The Synopsis is real. The world has been built to be lived in. Whether we get there depends on you.

We were here. Here is what we made.

---

## The closing line

*Uplink* mattered because it took its players seriously. It assumed they were smart, patient, and willing to think before they clicked.

A generation of games forgot how to do that. They wrapped their hacking in mini-games. They wrapped their tension in cutscenes. They wrapped their consequences in save-scumming.

Voidlink doesn't.

You are a hacker. The world is paying attention. The trace is climbing.

**Disconnect when you're ready.**
