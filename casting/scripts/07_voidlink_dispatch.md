# VOIDLINK DISPATCH / sys.ops — Recording Script

**Project:** Voidlink (indie video game)
**Role:** The corporate AI voice of the Voidlink International platform itself (and its internal sys.ops alert layer)
**Date drafted:** 2026-06-08
**Status:** Draft 1. Optional cast addition — only commission this script if doing Tier C voicing or above.

## At a glance

- **Total word count:** ~250
- **Estimated total recorded audio:** ~3 minutes (raw); after processing and editing, ~2 minutes in-game
- **Number of distinct cues:** 10 short system announcements
- **Recommended session length:** 45 minutes inc. direction + pickups
- **Delivery format:** 48 kHz / 24-bit WAV, dry, one file per cue, named `DISPATCH_<cue_id>.wav`
- **Post-processing:** vocoder + slight pitch-shift + subtle reverb. Done in FL Studio after delivery. Talent records clean and neutral.

## Voice direction

The voice of the platform. The corporate AI that routes contracts and fires system messages to every operative on the Voidlink network. **Should sound almost human — corporate AI that hasn't been processed enough to feel safe.** The uncanniness is the point.

Crucially: the player should *never be sure whether there's a person behind it*. Stillness is the goal. No theatrical AI inflection. No friendly customer-service warmth. Read as if you are bored of saying these things, but professionally bored — the way a long-serving call-centre operator might be bored.

Distinct from MAGNUS in tone: Dispatch is the *corporation* — efficient, clean, faintly bureaucratic. MAGNUS is something older and stranger. Do not blur them.

Accent is **open** — authentic to the actor. We process in post to make the final voice deliberately filtered. The original take should be clean and neutral-toned.

---

## Section A — Auditions (sides for casting)

**A.1 — three system announcements (~30s):**
> *"Voidlink Dispatch. Contract authorised. Briefing in your inbox. Voidlink takes twelve percent. Disputes go through Voidlink arbitration. Welcome back, operative."*
>
> *"sys.ops: scheduled maintenance window 02:00 to 02:45 Voidlink Standard Time. Relay infrastructure briefly degraded. Apologies for any inconvenience."*
>
> *"Voidlink Dispatch. Payment received. Funds cleared via Pacific National. Your operative balance has been updated."*

---

## Section B — Full recording script

### B.1 Contract-Routing Announcements

These fire whenever a new contract becomes available to the player. Six unique recordings; the in-game system picks one based on contract type.

**Cue D-001 — generic contract authorisation:**
> *"Voidlink Dispatch. Contract authorised. Briefing in your inbox."*

**Cue D-002 — high-tier contract authorisation:**
> *"Voidlink Dispatch. Priority contract authorised. Briefing in your inbox. Voidlink takes twelve percent. Disputes go through Voidlink arbitration."*

**Cue D-003 — story-mission authorisation:**
> *"Voidlink Dispatch. Story-arc contract authorised by client. Briefing in your inbox. Voidlink arbitration applies."*

**Cue D-004 — bounty contract authorisation:**
> *"Voidlink Dispatch. Bounty contract authorised. The target is a fellow operative on this network. Rule four of the Voidlink Bond applies. Voidlink arbitration is mandatory before lethal action. Briefing in your inbox."*

**Cue D-005 — choice-mission authorisation:**
> *"Voidlink Dispatch. Multi-phase contract authorised. The contract includes a binding operative decision. Voidlink arbitration applies. Briefing in your inbox."*

**Cue D-006 — return-after-completion welcome:**
> *"Voidlink Dispatch. Welcome back, operative. New contracts are available. Voidlink Standard Time advances. We appreciate your continued service."*

### B.2 System Announcements (sys.ops)

These are *system-level* announcements unrelated to contracts. Four short cues.

**Cue D-010 — scheduled maintenance:**
> *"sys.ops: scheduled maintenance window 02:00 to 02:45 Voidlink Standard Time. Relay infrastructure briefly degraded. Apologies for any inconvenience."*

**Cue D-011 — payment confirmation:**
> *"sys.ops: payment received. Funds cleared via Pacific National. Your operative balance has been updated."*

**Cue D-012 — security advisory:**
> *"sys.ops: a security advisory has been added to your inbox. Voidlink recommends review at your earliest convenience. The advisory does not affect active contracts."*

**Cue D-013 — anniversary acknowledgement:**
> *"sys.ops: today marks one year since you signed the Voidlink Bond. We have no additional message. We mark the date."*

---

## Notes for the actor

- This is a *system voice*. The character does not have feelings about what it is saying. Resist the urge to *act*. Read each cue in roughly the same register — bored, professional, faintly bureaucratic.
- The phrase *"We appreciate your continued service"* (Cue D-006) should be read with **no warmth whatsoever**. The blandness is the joke.
- Cue D-013 — the anniversary acknowledgement — is the most *uncanny* of the cues. The line *"We have no additional message. We mark the date."* lands the entire character: a system that has noticed something a human would have warmth about, and has chosen not to perform that warmth. Read it flat.
- *Voidlink Standard Time* is the in-fiction clock the game uses. Pronounce as written.
- *Pacific National* is the canonical default bank in the game. Pronounce as written.
- All cues are short. Each cue should be deliverable in 4-15 seconds. Take your time inside the cue, but the cues themselves are *small*.

## Post-processing notes (in FL Studio after delivery)

For reference; the actor does not need to do any of this in-session.

- Subtle vocoder pass (carrier: clean sine, ~80% wet)
- Pitch-shift: 0 (Dispatch is *not* shifted; MAGNUS is the shifted one)
- Light convolution reverb (small room, 0.6s decay, 15% wet)
- Final EQ: gentle high-frequency roll-off at 8 kHz to make it feel "broadcast" rather than "studio"

The aim is *almost human, not quite, deliberately*. If we shift too far into robot-AI territory, we lose the uncanniness that makes the voice work.

## Pickup window

One round of free pickups within 7 days of session.
