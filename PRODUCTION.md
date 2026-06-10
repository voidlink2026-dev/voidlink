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

The current game is text-and-typewriter. Voice acting is a *deliberate aesthetic choice*, not a default expectation. Recommended scope: **Tier B (light voicing)** — voice 4 named characters for the highest-impact moments only. Silence remains the default.

### B.1 The cast — 4 actors recommended

| Role | M/F | Age | Accent | Reference | Estimated cost |
|---|---|---|---|---|---|
| **CIPHER** | M | 40s-50s | Open — cast by tonal fit; accent should be authentic to the actor's ethnicity (NOT a performed "neutral" accent). Strong fits: Black British, British-Pakistani, Yoruba/Nigerian, Eastern European immigrant, US-Black, Indian-English. AVOID: RP, generic-American newscaster. | Mark Strong in Tinker Tailor (texture, not accent); Idris Elba's calmer Wire moments; Riz Ahmed reading aloud; Adewale Akinnuoye-Agbaje | £400-700 |
| **NIGHTOWL_22** | F | 50s+ | Nigerian or UK-Nigerian diaspora — character is canonically Lagos-based. Authentic accent only; NOT performative or "Hollywood African". Canon: *"her voice is older than her handle"* | Sophie Okonedo audiobook reads; Wunmi Mosaku; the cadence of Chimamanda Ngozi Adichie's interviews | £400-700 |
| **YAAKOV STERN** (Bond reading + optional trailer VO) | M | 60s+ | Ashkenazi / Eastern European Jewish heritage — name is Yiddish-German. Russian / Polish / Czech / Hungarian-tinged English all fit. Could also be an Israeli-English speaker. NOT cartoonish. | Christoph Waltz reading aloud; Mads Mikkelsen serious-mode; the late Erland Josephson; F. Murray Abraham | £400-700 |
| **ASHER VANCE** (consider recasting as female "ASTRID VANCE") | M or F | 40s | Open — character is set in Reykjavík but was formerly at Voidlink Dispatch which could be anywhere. Cast by tonal fit. Strong fits: Icelandic-English, mainland Scandinavian-English, American (Pacific Northwest neutral), British (mild Northern or middle-class non-RP), Black American. | Mark Gatiss quiet moments (texture); Ólafur Darri Ólafsson; David Tennant tired-not-camp; Wagner Moura quiet-mode | £300-500 |
| **MAGNUS / REVELATION** | — | — | Voice of one of the above + FL Studio processing (vocoder + pitch shift + reverb tail) | Tilda Swinton narrative; HAL 9000; SOMA's WAU | £0 (use existing cast) |

**Gender balance:** the default pick lands 3M / 1F (Cipher M, NightOwl F, Stern M, Vance M). Honest improvements:
- Recast Vance → Astrid (gender is incidental to the character's function) → 2M / 2F.
- Stern could be recast as female ("Yael Stern") — the canon doesn't define the signatory's gender beyond the name.
- Cipher is also genuinely open if we want — there's nothing in the canon that requires the senior Underground operative to be male; the existing letters use no gendered self-reference.

The cast doesn't need to default to British, white, or male. We cast for tonal fit and let authentic accent/ethnicity/gender follow whom we hire. The character writing is deliberately open on those axes so any of the four roles can flex.

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

### B.3 What gets voiced (Tier B scope)

| Moment | Voice | Duration |
|---|---|---|
| Bond reading at signup | Yaakov Stern | ~90s (~180 words) — *the most important voiced moment in the game.* |
| CIPHER's Arc 1 aftermath letter | Cipher | ~45s (~90 words) |
| CIPHER's Arc 8 lighthouse callback | Cipher | ~45s (~100 words) |
| NIGHTOWL's Arc 7 "Lunch" call | NightOwl | ~60s (~120 words) |
| Asher's Arc 8 lighthouse intro | Asher / Astrid | ~50s (~100 words) |
| MAGNUS introduction line (Arc 6) | Cipher's actor + FL Studio FX | ~10s (~20 words) |
| Trailer VO (optional, 1 line) | Stern doubling | ~5-8s |
| **Total recorded audio** | | **~5-6 minutes** |

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
> **Accent:** Open. We are casting by tonal fit, not accent — the actor's authentic accent will define the character. Strong fits include Black British, British-Pakistani, Yoruba/Nigerian, Eastern European immigrant, US-Black, Indian-English, mixed-heritage British non-RP. We are **not** looking for performed "neutral" voices or RP / generic-American newscaster delivery.
>
> **Age range:** 40s-50s, male.
>
> **Reference (texture, not accent):** Mark Strong in Tinker Tailor Soldier Spy; Idris Elba's calmer Wire moments; Riz Ahmed reading aloud; Adewale Akinnuoye-Agbaje.
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
> **Accent:** Open. Cast by tonal fit. The character is set in Reykjavík but was previously at Voidlink Dispatch, which could be from anywhere. Strong fits include Icelandic-English, mainland Scandinavian-English, American (Pacific Northwest neutral), British (mild Northern or middle-class non-RP), Black American. Authentic to the actor's background.
>
> **Age range:** 40s. **Open to male OR female voices** — we are casting the role on tonal fit and may rename "Asher" to "Astrid" depending on whom we hire.
>
> **Reference (texture, not accent):** Mark Gatiss in quieter moments; Ólafur Darri Ólafsson; David Tennant tired-not-camp; Wagner Moura quiet-mode.
>
> **Audition lines:** *"I worked for Voidlink Dispatch from 2191 to 2197. I helped build the system you read about. We called it the lighthouse — because it is a beam pointed at you, so that buyers can see you clearly."*
>
> **Estimated session:** 45-60 minutes covering ~2 minutes of audio.

### B.5 Recording / direction logistics

- Hire via Voquent's casting service — they will deliver auditions; you pick.
- Ask each hired actor for **48kHz / 24-bit WAV**, **dry** (no reverb / processing).
- Record in FL Studio at the same sample rate. You'll process in-game (light reverb to match the in-fiction encrypted-channel feel).
- Direct via Zoom session (live direction is *much* better than blind self-recording) — most pros expect this.
- Budget 30-60 mins per actor for the direction session itself.

### B.6 Budget summary — voice

| Tier | Cast | Total |
|---|---|---|
| **A — trailer only** | 1 voice | £200-500 |
| **★ B — light** *(recommended)* | 4 voices, ~6 mins audio | £1,500-2,500 |
| C — standard | 5-6 voices, ~15 mins audio | £2,500-4,500 |
| D — full | every NPC letter voiced | £8,000-15,000+ |

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

| Track | Realistic minimum | Realistic comfortable |
|---|---|---|
| Music (FL Studio + mastering) | £240 | £400 |
| Voice (4 actors via Voquent) | £1,500 | £2,500 |
| Trailer (DIY + commissioned key art) | £500 | £2,000 |
| Capsule + screenshots + GIFs | £400 (key art commission, rest DIY) | £1,500 |
| Mastering + post | — | £200 |
| **TOTAL** | **£2,640** | **£6,600** |

That sits inside the indie-respectable production-quality bracket for solo dev. Lands you in the same room as games doing 50k+ wishlists, with everything hand-attributable and the AI-disclosure line intact.

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
- [ ] Tier B (4 voices, ~6 mins) confirmed as scope
- [ ] Asher → Astrid recasting decision: keep / recast
- [ ] Voquent project posted
- [ ] Auditions reviewed for: CIPHER / NIGHTOWL / STERN / VANCE
- [ ] Cast confirmed (name + rate per role)
- [ ] Recording sessions scheduled
- [ ] Audio delivered + integrated

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
