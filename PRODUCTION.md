# Voidlink — Production Handbook

**Purpose.** Reference document for the production-side work that ships *outside* the game binary: music, voice acting, trailer, key art, store assets. Captures the research, briefs, recommended suppliers, budget shapes, and UK-specific resources discovered during pre-launch planning.

Created 2026-06-08. Update when a supplier is contacted, hired, or rejected.

For the formal sprint scope of L1 (audio) and L7 (trailer + press kit) see [`docs/Next_Stage.md`](docs/Next_Stage.md).

---

## A. Music — self-production (L1 audio)

**You write the music yourself in FL Studio.** This section captures the brief, sample/instrument recommendations, mastering options, and reference tracks.

### A.1 What needs to exist (6 tracks)

Per the L1 sprint spec in `Next_Stage.md`:

| Track | Duration | Triggers when | Notes |
|---|---|---|---|
| **boot.ogg** | 2:00 loop | BIOS / boot screen, prologue, login | Sparse synth pad + distant glitch ticks. Sets the *world*. |
| **desktop.ogg** | 5:00 loop | Desktop with no active mission | Ambient cyberpunk pad, subtle modulation. Has to survive 200 hours of replay. |
| **mission_active.ogg** | 4:00 loop | Connected mission, trace < 60% | Low pulse + analog warmth. Layerable. |
| **mission_critical.ogg** | 3:00 loop | Trace ≥ 60% (crossfade in at 60%, crossfade out at ≤ 50% — hysteresis) | Same percussion layer as mission_active, plus arpeggiated tension. **Must crossfade cleanly with mission_active.** |
| **victory.ogg** | 0:30 one-shot | SECURE DISCONNECT + reward overlay | |
| **fail.ogg** | 0:30 one-shot | TRACED / mission fail | |

**Asset budget:** ≤ 25 MB total. OGG Vorbis q5 + M4A AAC fallback for Safari. Zero-cross spliced for click-free loops.

### A.2 FL Studio — what you already have is enough

FL Studio's native toolkit covers everything you need for cyberpunk ambient:

| Native plugin | What for |
|---|---|
| **Harmor** | Additive synthesis. Great for the slow-evolving pads in desktop.ogg. |
| **Sytrus** | FM synth. The glitch ticks on boot.ogg, the arpeggios on mission_critical.ogg. |
| **Sakura** | Plucked-string physical modelling. Quiet textures. |
| **Hardcore** | Guitar amp / distortion for analog warmth. |
| **Fruity Reeverb 2** | Standard reverb — fine for ambient if used sparingly. |
| **Maximus** | Multi-band mastering. Your final-pass mastering tool. |
| **Limiter** | Brick-wall limiting on the master. |
| **Vintage Phaser / Vintage Tube** | Analog colouration. Pair with mission_active.ogg pads. |
| **Patcher** | Build composite instruments. Useful for layered pad sounds. |

You do not need to buy more synths. You may *want* one or two free additions for variety.

### A.3 Free instruments / libraries worth adding

| Tool | Why | UK link |
|---|---|---|
| **★ Spitfire LABS** | Free, gorgeous orchestral and texture instruments. *Cinematic Frozen Strings*, *Electric Piano*, *Mandolins* are all elite-tier free. UK-based (Hammersmith). | [labs.spitfireaudio.com](https://labs.spitfireaudio.com) |
| **Vital** | Free Serum-killer wavetable synth. Lead and bass duties. | [vital.audio](https://vital.audio) |
| **Surge XT** | Free open-source synth. Glitchy, digital, perfect for cyberpunk leads. | [surge-synthesizer.github.io](https://surge-synthesizer.github.io) |
| **Decent Sampler** | Free sample player. Combine with the free libraries on [pianobook.co.uk](https://pianobook.co.uk) (Christian Henson's project, UK-based). | [decentsamples.com](https://decentsamples.com) |
| **TDR Nova** | Free dynamic EQ. Useful on the master bus. | [tokyodawn.net](https://tokyodawn.net) |

### A.4 Reference tracks (tonal targets)

These are vibes-references — listen to set the brief in your head, don't copy.

**For boot.ogg:**
- Vangelis — *Blade Runner End Titles* (the quiet middle section, not the climax)
- Brian Eno — *Music for Airports 1/1*
- Disasterpeace — *Hyper Light Drifter — Awakening*

**For desktop.ogg:**
- Carbon Based Lifeforms — *Photosynthesis*
- Tycho — *Awake* (the quiet ambient versions)
- Yagya — *Rhythm of Snow*

**For mission_active.ogg:**
- Jon Hopkins — *Open Eye Signal* (the restrained 1st half)
- Trent Reznor & Atticus Ross — *The Social Network — Hand Covers Bruise*
- Bonobo — *Cirrus*

**For mission_critical.ogg:**
- Jon Hopkins — *Singularity*
- Burial — *Archangel*
- Reso — *Tangram*

**For victory.ogg:**
- Carpenter Brut — *Turbo Killer* (the *end* of, not the whole thing)
- One memorable ascending phrase resolving on a major chord

**For fail.ogg:**
- One descending phrase. Distorted. Resolving on minor or unresolved.
- Reference: the *Inception* "bwaaam" but quieter, more personal.

### A.5 Mastering — outsource this

Self-mastering with Maximus + Limiter will get you 80% of the way. The last 20% (loudness ceiling, tonal balance across the 6 tracks, mono compatibility) is genuinely a different skillset and worth hiring for.

| Option | Price | Notes |
|---|---|---|
| **Direct hire — UK indie mastering** | £30-80 per track | Search Reddit r/WeAreTheMusicMakers, post a brief. Many UK indie engineers will do a 6-track pack for £200-400. |
| **★ [Audio Animals](https://www.audioanimals.co.uk)** | ~£40 per track | Kent-based, has done indie game work. |
| **[Aria Audio](https://www.ariaaudio.co.uk)** | ~£50 per track | London-based. |
| **LANDR (algorithmic)** | £20-40 per track | Cheap, fast, sounds *good enough* for a placeholder. AI-assisted — you said you want to avoid AI. Skip. |

### A.6 Realistic timeline

**3-4 weeks of evenings** for a competent composer on a 6-track package. Suggested cadence:
- Week 1: boot + desktop drafts. These are the longest loops; nail the tonal palette here.
- Week 2: mission_active + mission_critical drafts. The crossfade compatibility is the hard part — design them together.
- Week 3: victory + fail one-shots. Iterate boot/desktop based on how they sit in-game.
- Week 4: master pass, in-game test, send to mastering engineer, ship.

### A.7 Budget summary — music

| Item | Cost |
|---|---|
| FL Studio | £0 (you have it) |
| Free instruments / libraries | £0 |
| Mastering (6 tracks @ £40) | £240-400 |
| **Total** | **£240-400** |

---

## B. Voice acting — UK casting

Voidlink's narrative work — the choice architecture, the reflection scenes, the 8 hand-authored arcs, the post-arc reflections, the Cipher Arc 8 callback — is real and substantial. The text-and-typewriter style is a *style*, not a limitation; it earns extra weight when broken in the right places.

**Recommended scope: voice every named recurring character.** That's 6 core actors + 1-2 processed system voices. Roughly 25-35 minutes of total recorded audio across the whole game. This is the *project-deserves* recommendation, not the *budget-compromise* one.

If budget genuinely caps the scope, Tier B (4 actors) is a defensible fallback — but the question isn't *"can we get away with fewer"*, it's *"which characters do we want to be real."* Listed in the budget table below for completeness; recommendation is the full cast.

### B.1 The cast — 6 actors recommended (plus system voices)

| Role | M/F | Age | Accent | Reference | Estimated cost |
|---|---|---|---|---|---|
| **CIPHER** | M | 40s-50s | Open — we cast by tonal fit and accept the actor's authentic accent. Fits include British (any region, RP or otherwise), Black British, British-Pakistani, Yoruba/Nigerian, US-Black, Eastern European immigrant, Indian-English, and others. We are not specifying ethnicity; we are saying we will not *default* to one. The only thing we won't accept is a *performed* accent that isn't the actor's own. | Mark Strong in Tinker Tailor; Idris Elba's calmer Wire moments; Riz Ahmed reading aloud; Adewale Akinnuoye-Agbaje | £400-700 |
| **NIGHTOWL_22** | F | 50s+ | Nigerian or UK-Nigerian diaspora — character is canonically Lagos-based. Authentic accent only; NOT a performed "Hollywood African". Canon: *"her voice is older than her handle"*. | Sophie Okonedo audiobook reads; Wunmi Mosaku; the cadence of Chimamanda Ngozi Adichie's interviews | £400-700 |
| **YAAKOV STERN** (Bond reading + optional trailer VO) | M | 60s+ | Ashkenazi / Eastern European Jewish heritage — name is Yiddish-German. Russian / Polish / Czech / Hungarian-tinged English all fit. Israeli-English also fits. British actors with this heritage absolutely qualify. NOT cartoonish. | Christoph Waltz reading aloud; Mads Mikkelsen serious-mode; the late Erland Josephson; F. Murray Abraham | £400-700 |
| **ASHER VANCE** (consider recasting as female "ASTRID VANCE") | M or F | 40s | Open. Reykjavík-set but formerly at Voidlink Dispatch which could be anywhere. Cast by tonal fit. Fits include British (any region including RP), Icelandic-English, mainland Scandinavian-English, American (any region), Black American — any authentic accent that matches the *texture* described. | Mark Gatiss quiet moments; Ólafur Darri Ólafsson; David Tennant tired-not-camp; Wagner Moura quiet-mode | £300-500 |
| **DIRECTOR KOVAC** | F | 50s | Open. Senior law-enforcement director (Joint Cybersecurity Bureau). Fits include British (RP works particularly well for institutional authority), American (East Coast educated), or any equivalent. Authoritative without being cold. | Olivia Williams; Sigourney Weaver in interviews; Cynthia Erivo serious-mode; Indira Varma | £300-500 |
| **MEI LIN** | F | 40s-50s | Open. Arunmor's lead research scientist, appears across the CONTAINMENT and LIBERATION ending families. Brilliant, exhausted, has had to defend her own work in rooms that didn't deserve to question it. Fits include Mandarin-English, Cantonese-English, British-Chinese, Singaporean-English, American-Chinese, or any other accent matching the actor's heritage. | Michelle Yeoh quiet-mode; Awkwafina serious-mode; Sandra Oh introspective; Gemma Chan reading aloud | £300-500 |
| **VOIDLINK DISPATCH / sys.ops** | any | any | The corporate-platform voice. The player hears this every time Voidlink Dispatch routes them a contract or fires a system message. Should sound *almost human* — corporate-AI that hasn't been processed quite enough to feel safe. Real voice + processing (vocoder pass + slight pitch-shift + subtle reverb). | British Airways announcement voice but slightly *off*; the WAU in SOMA; the BBC News at Ten in-promo voice with subtle filtering | £200-400 |
| **MAGNUS / REVELATION** | — | — | Voice of CIPHER's actor + FL Studio processing (vocoder + pitch shift down 4 semitones + long reverb tail). Distinct from Dispatch's processing — MAGNUS is *not corporate*. Older, deliberate, patient. | Tilda Swinton narrative-mode; HAL 9000; SOMA's WAU | £0 (use existing cast) |

**Gender balance:** the full 6-actor recommendation lands 3M / 3F (Cipher M, NightOwl F, Stern M, Vance M, Kovac F, Mei Lin F). Plus Voidlink Dispatch / sys.ops as any-gender. Honest variants available:
- Recast Vance → Astrid (gender is incidental to the character's function) → 2M / 4F.
- Stern could be recast as female ("Yael Stern") — the canon doesn't define the signatory's gender beyond the name → 1M / 5F if combined with the Vance recast.
- Cipher is also genuinely open — there's nothing in the canon that requires the senior Underground operative to be male; the existing letters use no gendered self-reference.

The cast doesn't need to default to British, white, or male. We cast for tonal fit and let authentic accent / ethnicity / gender follow whom we hire. Some roles will end up with British actors — that's fine; the point is we don't *assume* it. The character writing is deliberately open on those axes so any of the named roles can flex.

### B.2 Marketplaces, ranked

**Mid-budget (£100-500 per project) — start here:**

1. **★ [Voquent](https://voquent.com)** — UK-based casting house. Human casting team. Best for indie game work where you want quality without breaking budget. **Top pick.**
2. **[Bodalgo](https://bodalgo.com)** — European, German-run, huge UK pool. Direct-to-artist negotiation.
3. **[Voices.com](https://voices.com)** — global, huge volume, quality varies wildly.

**Higher-end (£500-2,000+ per project):**

4. **[Spotlight](https://spotlight.com)** — *the* UK acting industry directory. Voice section. Union-trained talent with TV/radio credits.
5. **[Mandy](https://mandy.com)** — UK industry directory, cheaper and faster than Spotlight.
6. **[The Voiceover Network](https://thevoiceovernetwork.co.uk)** — UK professional directory.

**Hidden gems:**

7. **[Equity UK voiceover register](https://www.equity.org.uk)** — actors' union members.
8. **Fiverr Pro voiceovers (Pro tier only)** — £50-200 for short content. Many UK Pro-verified voices.
9. **Direct outreach** — listen to indie game credits, find an actor whose work you love, cold-email. Many established voice actors will do a £200-400 indie role for love of the work.

### B.3 What gets voiced (full cast scope)

| Moment | Voice | Duration |
|---|---|---|
| Bond reading at signup (the four rules) | Yaakov Stern | ~90s — *the most important voiced moment in the game.* |
| Welcome message + first sys.ops greetings | Voidlink Dispatch (processed) | ~45s |
| Operative Intro chapter narration (optional — could be Stern doubling) | Stern | ~3-4 minutes if used |
| CIPHER first advice letter | Cipher | ~30s |
| CIPHER three rules letter | Cipher | ~45s |
| CIPHER Arc 1 aftermath letter (per Arc 1 choice — 3 variants) | Cipher | 3 × ~45s |
| CIPHER underground induction | Cipher | ~30s |
| CIPHER collaborator drift letter (per pattern bucket — 3 variants) | Cipher | 3 × ~30s |
| CIPHER Arc 8 lighthouse callback (per bucket — 5 variants) | Cipher | 5 × ~45s |
| NIGHTOWL first contract pitch | NightOwl | ~45s |
| NIGHTOWL Arc 7 "Lunch" call | NightOwl | ~60s |
| NIGHTOWL resistor offer (3 variants) | NightOwl | 3 × ~30s |
| Asher / Astrid Arc 8 lighthouse intro | Vance | ~60s |
| Asher / Astrid Arc 8 buyer-list confirmation | Vance | ~30s |
| MAGNUS introduction (Arc 6 M3) | Cipher's actor + FX | ~15s |
| MAGNUS resolution dialogue (per Arc 6 choice — 3 variants) | Cipher's actor + FX | 3 × ~20s |
| KOVAC ERASURE ending dialogue | Kovac | ~60s |
| KOVAC CONTAINMENT ending dialogue | Kovac | ~45s |
| MEI LIN CONTAINMENT ending dialogue | Mei Lin | ~45s |
| MEI LIN LIBERATION ending dialogue | Mei Lin | ~60s |
| Dispatch contract-routed announcements (procedural × ~6 unique recordings) | Dispatch (processed) | 6 × ~10s |
| Dispatch maintenance / system announcements (~4 unique) | Dispatch (processed) | 4 × ~15s |
| Trailer VO line | Stern doubling | ~5-8s |
| **Total recorded audio** | | **~25-35 minutes** |

### B.4 Casting brief — copy-paste templates

Generic header for all four:

> **Project:** Voidlink — indie cyberpunk hacking sim, solo-developed, UK
> **Platform:** PC (Steam, web), 1.0 release Q3 2026
> **Recording:** delivered as 48kHz WAV stems, dry (no FX/reverb)
> **Usage:** in-game audio + trailer + marketing use, in-perpetuity, all platforms
> **Pickup terms:** one round of free pickups within 7 days for line errors
> **Payment:** on receipt of approved final files

**Brief — CIPHER**

> Senior Underground operative in a near-future cyberpunk setting. The character writes letters to a new operative (the player), in measured, weary prose. He is NOT macho or hard-boiled. He is intelligent, slightly tired, dryly observant. Reads in the manner of a senior tradesperson explaining their craft to an apprentice he half-expects not to make it.
>
> **Accent:** Open. We will cast for tonal fit and accept the actor's authentic accent — whatever it is. Fits include British (any region — RP, Northern, Scottish, Estuary, Welsh, Black British, British-Pakistani, etc.), American, Yoruba/Nigerian, Eastern European immigrant, Indian-English, and others. We are not specifying ethnicity; we are simply not defaulting to one. The only thing we will not accept is a *performed* accent that is not the actor's own.
>
> **Age range:** 40s-50s, male.
>
> **Reference (texture, not accent):** Mark Strong in Tinker Tailor Soldier Spy; Idris Elba's calmer Wire moments; Riz Ahmed reading aloud; Adewale Akinnuoye-Agbaje; Wagner Moura quiet-mode.
>
> **Audition lines:** *"Saw the wipe pattern. Professional. Keep that habit. The hard part isn't getting in — it's leaving without writing your name on the wall."*
>
> **Estimated session:** 60-90 minutes covering ~6 minutes of letter audio across the full game.

**Brief — NIGHTOWL_22**

> Independent broker on a hidden contractor network. Based in Lagos. The character's defining canon line is *"her voice is older than her handle suggests."* She is worn-in, not glamorous; slightly amused at most things; carries weight without performing authority.
>
> **Accent:** West African (Nigerian) or UK-Nigerian diaspora. Authentic, not performative. Should NOT sound "Hollywood African."
>
> **Age range:** 50s+, female.
>
> **Reference:** Sophie Okonedo's audiobook reads; Wunmi Mosaku in His Dark Materials; the cadence of Chimamanda Ngozi Adichie's interviews.
>
> **Audition lines:** *"I have been the third client. The bookmark in this message connects to a dead-drop node I operate on a defunct academic mesh. It has held my files for nine years."*
>
> **Estimated session:** 45-60 minutes covering ~2 minutes of audio.

**Brief — YAAKOV STERN**

> The in-fiction signatory of a four-rule operative contract that the player signs at the start of the game. The character is the *gravitas voice* of the entire project — the first significant voiced moment the player hears. Reads the four rules deliberately, with weight, the way a notary reads a clause that the person signing it does not yet fully understand.
>
> **Accent:** Eastern European-tinged English (Polish, German, Czech root). Subtle, not cartoonish. The character's name is Yiddish-German.
>
> **Age range:** 60s+, male.
>
> **Reference:** Christoph Waltz reading aloud; Mads Mikkelsen serious-mode; the late Erland Josephson.
>
> **Audition lines:** *"Rule One: You will take no contract that you do not, on examination of your conscience, consider acceptable. Rule Two: You will accept no second client for the same contract. Rule Three: You will leave no operative behind. Rule Four: You will not hunt your own."*
>
> **Estimated session:** 45 minutes covering the ~90-second Bond reading and the optional ~10-second trailer line.

**Brief — ASHER (or ASTRID) VANCE**

> Former corporate intelligence analyst, now privately consulting from Reykjavík. The character refused, two years before the game opens, to write a profile on someone whose work they respected, and quit. They are principled, exhausted, formerly idealistic. The voice should carry the texture of someone who has been right and unrewarded for a long time.
>
> **Accent:** Open. Reykjavík-set but previously at Voidlink Dispatch which could be anywhere. Fits include British (any region — RP works, Northern works, Scottish works), Icelandic-English, mainland Scandinavian-English, American (any region), Black American, or any other accent authentic to the actor's background. The character has *travelled*.
>
> **Age range:** 40s. **Open to male OR female voices** — we are casting on tonal fit and may rename "Asher" to "Astrid" depending on whom we hire.
>
> **Reference (texture, not accent):** Mark Gatiss in quieter moments; Ólafur Darri Ólafsson; David Tennant tired-not-camp; Wagner Moura quiet-mode; Sophie Okonedo audiobook reads.
>
> **Audition lines:** *"I worked for Voidlink Dispatch from 2191 to 2197. I helped build the system you read about. We called it the lighthouse — because it is a beam pointed at you, so that buyers can see you clearly."*
>
> **Estimated session:** 45-60 minutes covering ~2 minutes of audio.

**Brief — DIRECTOR KOVAC**

> Director of the Joint Cybersecurity Bureau (the JCB) — the international law-enforcement authority operatives are afraid of. Appears in the player's life only at major endings (the ERASURE and CONTAINMENT families). When she does appear she is the *establishment voice*: senior, polite, professionally curious about what you have become. Not a villain. Not a friend. The institution speaking through one person.
>
> **Accent:** Open. RP British works particularly well for this kind of institutional authority — that register is the *point*. American educated East Coast also fits. Any equivalent authoritative-but-not-cold accent works. Authentic to the actor.
>
> **Age range:** 50s, female.
>
> **Reference (texture, not accent):** Olivia Williams; Sigourney Weaver in interviews; Cynthia Erivo serious-mode; Indira Varma.
>
> **Audition lines:** *"I have read your file. All of it. I would like, if I may, to ask you some questions that are not in it. You should know that the answers you give now go nowhere — not to a court, not to a record, not to your handler. They go only to me."*
>
> **Estimated session:** 45 minutes covering ~90 seconds of ending dialogue.

**Brief — MEI LIN**

> Arunmor Corporation's lead research scientist. Built REVELATION. Defends it. Appears across the CONTAINMENT (your character locks down her work and audits her) and LIBERATION (your character exposes her work to the world) ending families. Brilliant, exhausted, has spent fifteen years answering questions from people who didn't deserve to ask them. Not the antagonist; not the ally. The architect.
>
> **Accent:** Open. The character's name is Chinese; she could be from anywhere in the Sinosphere or its diaspora. Fits include Mandarin-English, Cantonese-English, British-Chinese, Singaporean-English, American-Chinese, Taiwanese-English, or any other accent authentic to the actor.
>
> **Age range:** 40s-50s, female.
>
> **Reference (texture, not accent):** Michelle Yeoh in her quiet moments; Awkwafina serious-mode; Sandra Oh introspective; Gemma Chan reading aloud.
>
> **Audition lines:** *"You think you found me. You did not find me. I have been here for fifteen years. The locks on the doors to this work were drawn by people who, on the whole, were less qualified than I am to draw them. And here you are, at one of the doors. I am not surprised. I am, in some small way, glad."*
>
> **Estimated session:** 45-60 minutes covering ~2 minutes of ending dialogue across the two ending families.

**Brief — VOIDLINK DISPATCH / sys.ops** *(processed)*

> The voice of the platform itself. The player hears this every time a contract is routed to them ("Voidlink Dispatch — Contract authorised. Briefing in your inbox.") and every time a system event fires ("sys.ops — Scheduled maintenance window…"). Should sound *almost* human — corporate AI that hasn't been processed enough to feel safe. The uncanniness is the point. The player should never be sure whether there's a person behind it.
>
> Distinct from MAGNUS: Dispatch is *the corporation*; MAGNUS is *something older*. Different processing chains, different tonal targets.
>
> **Accent:** Open. Authentic to the actor. We process in post — the final voice will sound deliberately filtered. The original take should be clean and neutral-toned.
>
> **Age range:** any, any gender.
>
> **Reference (texture, not accent):** the BBC News at Ten in-promo voice with subtle filtering; British Airways announcement voice *slightly* off; SOMA's WAU; the platform voice in *The Stanley Parable* but corporate-bureaucratic instead of mischievous.
>
> **Audition lines:** *"Voidlink Dispatch. Contract authorised. Briefing in your inbox. Voidlink takes twelve percent. Disputes go through Voidlink arbitration. Welcome back, operative."*
>
> **Estimated session:** 30-45 minutes covering ~2 minutes of scattered system audio. We will record with no FX; processing happens in post.

### B.5 Recording / direction logistics

- Hire via Voquent's casting service — they will deliver auditions; you pick.
- Ask each hired actor for **48kHz / 24-bit WAV**, **dry** (no reverb / processing).
- Record in FL Studio at the same sample rate. You'll process in-game (light reverb to match the in-fiction encrypted-channel feel).
- Direct via Zoom session (live direction is *much* better than blind self-recording) — most pros expect this.
- Budget 30-60 mins per actor for the direction session itself.

### B.6 Budget summary — voice

| Tier | Cast | Roles voiced | Realistic spend |
|---|---|---|---|
| A — trailer only | 1 voice | 1 trailer line | £200-500 |
| B — light *(budget-compromise version)* | 4 voices, ~6 mins | CIPHER + NIGHTOWL + STERN + VANCE (MAGNUS via processing) | £1,500-2,500 |
| **★ C — full recurring cast** *(recommended)* | 6 voices + 1 system voice, ~25-35 mins | CIPHER + NIGHTOWL + STERN + VANCE + KOVAC + MEI LIN + DISPATCH (MAGNUS via processing Cipher's actor) | £3,500-6,000 |
| D — extended | Tier C + voiced codas for the major arc moments | ~40-50 mins, no new actors | £4,500-7,500 |
| E — full | every NPC letter / coda / sys message in the game | ~60-90 mins | £10,000-20,000+ |

**Recommendation: Tier C.** This is the cast that lets every recurring named character feel *real* without spilling into voicing things that don't need it (procedural mission briefings, repeated UI confirmations). It's the right scope for the project the rest of the game already is.

If the £3,500-6,000 range genuinely doesn't fit, drop to Tier B and the game will still be playable — but every major character who isn't in Tier B (Kovac, Mei Lin, Dispatch) silently becomes a *text moment* in their otherwise-voiced game, which reads as a deliberate omission to a player who's heard the other characters speak. Better to either do Tier C properly or hold Tier B until you can do Tier C.

---

## C. Trailer (L7)

### C.1 Tools — all free

| Tool | Purpose | UK link |
|---|---|---|
| **★ DaVinci Resolve** | Free professional video editor. Includes colour grading, audio mixing, motion graphics, scene detection. Most working game-trailer editors use this. | [blackmagicdesign.com](https://blackmagicdesign.com/products/davinciresolve) (free version is full-featured) |
| **OBS Studio** | Game capture at 1080p60 or 4K60. Set up now even before you need it. | [obsproject.com](https://obsproject.com) |
| **Audacity** | Free audio editor for VO cleanup. | [audacityteam.org](https://audacityteam.org) |

### C.2 Stock + SFX (free, commercial-OK)

| Source | What it is | UK link |
|---|---|---|
| **★ BBC Sound Effects archive** | 33,000 free SFX from the BBC archives. Industrial, machinery, broken radios, vintage modems. Check the licence per-clip. | [sound-effects.bbcrewind.co.uk](https://sound-effects.bbcrewind.co.uk) |
| **Mixkit** | Free stock video, free SFX, commercial-OK. | [mixkit.co](https://mixkit.co) |
| **Pexels Videos** | Free stock video, commercial-OK. | [pexels.com/videos](https://pexels.com/videos) |
| **Freesound.org** | Creative Commons SFX. Check per-clip licence. | [freesound.org](https://freesound.org) |

### C.3 Trailer structure — the indie formula

Adapted from Derek Lieu's public masterclasses (he edited the trailers for Untitled Goose Game, Slay the Spire, Tunic, A Short Hike — go watch his YouTube channel for free):

| Time | What | Voidlink-specific |
|---|---|---|
| **0–3s** | Hook. Most distinctive moment first. | Trace bar at 95% with morse blips intensifying. Cut on the SECURE DISCONNECT click. |
| **3–15s** | Genre clarity. The player knows what kind of game this is. | Network map (3D graph), hacking interface, world map. The texture of the work. |
| **15–45s** | Variety + depth. | Multiple mission types. Codex window. Inbox with a Cipher letter. World Map relay chain. |
| **45–65s** | Story / stakes. | The Bond signing scene (with Stern's VO if you have it). The four rules on screen. A glimpse of choices. |
| **65–80s** | Climax + logo. | A high-trace escape. SECURE DISCONNECT. Cut to logo + tagline + release date + Steam wishlist call-to-action. |

**Total: 60-80 seconds. Hard limit 90.** Over 90 you lose 30% of viewers.

**Tagline candidate (self-contained from your own prologue):**
> *Voidlink. The only career in 2199 that nobody owns.*

### C.4 DIY vs commission decision tree

**DIY trailer route (£0-50):**
- DaVinci Resolve + OBS captures + BBC SFX
- 2-3 weeks of evenings to learn the workflow + produce
- Result quality: depends on you. Some solo devs nail it (Hades, Inscryption); most don't.
- *Worth it if:* you have a video-editing background or are willing to invest 40+ hours learning the craft.

**Commissioned editor route (£400-5,000):**
- You supply clean OBS captures + a brief
- Editor delivers final 60-80s trailer

| Editor / studio | Notes | Estimated cost |
|---|---|---|
| **★ [Derek Lieu](https://www.dereklieu.com)** | The legend. Edited indie hits including Untitled Goose Game, Slay the Spire, Tunic. US-based; async work means timezones don't matter. | £2,000-5,000 |
| **[Edition Studio](https://edition.studio)** | London-based game video studio. | £1,500-4,000 (estimate) |
| **[ICO Partners](https://icopartners.com)** | London indie PR firm; has trailer-editor contacts. | Quote-based |
| **Hooded Horse (UK)** | Publisher; their trailer-house list is worth poking at even if they don't publish you. | Varies |
| **Upwork / Fiverr Pro game-trailer specialists** | £400-1,000 for a 90s edit if you supply clean footage and clear brief. | £400-1,000 |
| **Direct freelancers on [Mandy](https://mandy.com)** (UK) | Search "game trailer editor", filter UK. | £500-1,500 |

### C.5 Free education — read / watch these before you start

1. **★ Derek Lieu's YouTube channel** — free masterclasses; breakdown videos of why specific indie trailers worked. Watch *"Why your indie game trailer sucks"* and *"How long should a trailer be"*.
2. **Chris Zukowski — [How to Market a Game](https://howtomarketagame.com)** — best free resource on indie marketing. Read *"How long should an indie trailer be?"* and *"What goes in a Steam page?"*.
3. **[GameDiscoverCo newsletter](https://newsletter.gamediscover.co)** (Simon Carless) — free, covers what's actually working on Steam right now.
4. **The Devolver "Indie Trailer Bible" GDC talk** (2018, YouTube) — half-jokey, half-serious. Watch all the way through.

### C.6 Steam store assets you'll also need

The trailer is one of seven assets. The full Steam page kit:

| Asset | Spec | Notes |
|---|---|---|
| Capsule (main) | 920x430 px | The thumbnail across the Steam UI. **Most important visual asset.** Commission this. |
| Capsule (small) | 462x174 px | Variant for smaller layouts. |
| Capsule (vertical) | 374x448 px | For library / wishlist. |
| Library hero | 3840x1240 px | Large banner on library page. |
| Screenshots (6 minimum) | 1920x1080 px | Mix gameplay + interface + story moments. |
| Trailer | MP4, H.264, 1080p60, < 1 GB | The thing this section is about. |
| Optional GIFs (2-3) | 720x405, < 5 MB each | For social posting. Auto-generated from trailer or hand-edited. |

For capsule art — commission. £400-1,500 from an illustrator on ArtStation or [hand-picked from the Voidlink Codex visual references](The_Voidlink_Codex.md).

### C.7 Budget summary — trailer + assets

| Item | DIY cost | Commissioned cost |
|---|---|---|
| Trailer edit | £0 (your time) | £400-5,000 |
| Capture / SFX / VO | £0-300 (Voquent VO) | same |
| Steam capsule + key art | — | £400-1,500 |
| Steam screenshots / GIFs | £0 (you produce) | £100-300 if outsourced |
| **Total realistic** | **£500-1,000** (DIY trailer + commissioned key art) | **£2,000-6,500** (full commission) |

---

## D. Combined production budget summary

Reflects the **recommended** tier across each track (Tier C for voice; commissioned trailer; commissioned key art). This is the project-deserves figure, not the bare-minimum figure.

| Track | Realistic | Comfortable | Notes |
|---|---|---|---|
| Music (FL Studio self-produce + outsourced mastering) | £240 | £400 | You're capable of producing in-house; mastering is the outsourced piece |
| Voice — full recurring cast (Tier C: 6 voices + 1 system) | £3,500 | £6,000 | Via Voquent. Recommended scope. |
| Trailer (commissioned edit) | £2,000 | £5,000 | Derek Lieu at the top end; UK freelance at the bottom |
| Steam capsule + key art | £400 | £1,500 | ArtStation commission |
| Screenshots + GIFs (DIY from OBS captures) | £0 | £200 | If outsourced for polish |
| Audio mastering (6 tracks) | £240 | £400 | Already counted above; listed for clarity |
| **TOTAL** | **£6,140** | **£13,100** |

A tighter figure is achievable with Tier B voice (-£2k), DIY trailer (-£2k), DIY screenshots (already £0). **The lower-bound figure if every cut is made is ~£2,600** — but that involves silently downgrading the narrative quality of a narrative game to save money, which is exactly the trap solo devs fall into. Land in the **£6-13k range** and ship something the audience can hear.

Comparison: a fully professional studio production of a similar-scope narrative indie costs £80-200k. £6-13k for everything-hand-attributable, no-AI-in-binary, real voice cast, real composer-mastered audio, real key art commission is *competitive on quality* with games that cost an order of magnitude more.

---

## E. Decision tracking

Mark with `[x]` when locked in.

### Music (L1)
- [ ] FL Studio confirmed as DAW
- [ ] Free instrument additions installed (Spitfire LABS, Vital)
- [ ] Reference tracks shortlist locked in
- [ ] Mastering engineer contacted: ____________________
- [ ] Mastering quote received: £____________________
- [ ] First track in progress: ____________________
- [ ] All 6 tracks complete

### Voice (L7-adjacent)
- [ ] Tier confirmed: B (£1.5-2.5k) / **C recommended (£3.5-6k)** / D (£4.5-7.5k) / E (£10k+)
- [ ] Asher → Astrid recasting decision: keep / recast
- [ ] Stern recasting decision: keep / recast as Yael Stern
- [ ] Cipher recasting decision: keep / recast as female
- [ ] Voquent project posted (one project per role, or single project listing all)
- [ ] Auditions reviewed for: CIPHER / NIGHTOWL / STERN / VANCE / KOVAC / MEI LIN / DISPATCH
- [ ] Cast confirmed (name + rate per role)
- [ ] Recording sessions scheduled
- [ ] Audio delivered + integrated
- [ ] MAGNUS processing chain finalised in FL Studio (vocoder + pitch shift + reverb tail)
- [ ] Dispatch processing chain finalised (lighter filtering — corporate-AI uncanniness)

### Trailer (L7)
- [ ] DIY vs commission decision: ____________________
- [ ] If commissioned — editor contacted: ____________________
- [ ] Editor brief sent
- [ ] OBS captures complete (target: 90 mins of clean gameplay)
- [ ] Capsule art commissioned: ____________________
- [ ] 6 screenshots finalised
- [ ] Trailer first cut
- [ ] Trailer final
- [ ] Steam page populated

---

*This handbook is the single source of production information for things outside the game binary. For the formal sprint scope (acceptance criteria, dates) see `docs/Next_Stage.md` L1 + L7 sections.*
