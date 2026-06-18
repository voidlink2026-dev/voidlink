# Voidlink — Image / animation prompts for the Operative Intro

**Purpose.** Per playtester feedback ("maybe we could even produce some prompts to create images to go along with it and animate them slightly"), this doc holds the artist-brief shape for each chapter's atmospheric visuals. Hand these to a 2D illustrator + simple-animator pipeline (Spine, After Effects, or Rive). NOT to a generative AI per the disclosure stance in `CREDITS.md`.

Each chapter image targets ~1920×1080, dim cyberpunk palette, subtle motion. **Style anchors** repeated across all chapters: deep blue-black background, cyan/amber accent lighting only, JetBrains Mono-rendered text overlays already supplied by the engine (do NOT bake any text into the artwork).

---

## Chapter 1 — INTAKE CONFIRMED

**Static brief.** A single dimly-lit office desk in deep shadow. A computer screen showing a single line of green text on a black terminal: *Hardware identity hash received. Bond recorded.* No keyboard player visible — just the back of the operator's hands resting near the keys. Cool cyan rim light from the monitor, no other light source.

**Motion (~2-3s loop).**
- Monitor flickers once at ~1.5s
- A subtle ambient cursor blink in the terminal
- Faint dust motes in the rim light

---

## Chapter 2 — THE ROOM

**Static brief.** The operative's apartment seen from a low three-quarter angle. A single narrow blade of late-morning light through curtain slit, hitting the desk and computer at an angle. Utility-grey walls. Empty cereal bowl on desk corner. Half-finished mug. Window in background showing partly-rebuilt city blocks under low overcast sky — cranes, tarpaulins, distant aerial walkways. Computer monitor brightness dominates the colour of the room.

**Motion (~4-5s loop).**
- Dust visibly drifts in the curtain light beam
- Monitor flicker — faint, every ~3s
- Window background: very slow parallax of distant crane silhouette
- The kettle in the kitchenette has a faint heat shimmer
- Slight breathing motion on the curtain (so it's clearly *alive* without being distracting)

---

## Chapter 3 — WHAT THE WORLD LOOKS LIKE

**Static brief.** A wide horizon view at low orbit altitude — Earth seen from above, but the night side. Four enormous corporate sigils faintly lit in different regions of the dark globe: amber (Arunmor) over Europe, red-orange (Ares) over North America, cyan (Internic) sweeping the Pacific, gold (Nexus) over the Middle East and Asia. The sigils are not buildings; they are pure data-overlay glyphs floating above the night surface like persistent satellite icons. National borders are absent. A few faint city lights persist between the sigils.

**Motion (~5s loop).**
- Very slow rotation of the Earth (1 full rotation per 60s — barely perceptible)
- Sigils very subtly pulse out of phase with each other
- Occasional satellite glint passing across the upper third
- Atmospheric haze in the limb of the planet glows faintly cyan

---

## Chapter 4 — THE WORK

**Static brief.** A close-up of a hand on a mouse, cursor hovering over a contract briefing displayed on a generic operative-style terminal. The brief is unreadable (deliberately illegible blocks of text) — the focus is on the *moment of decision*. Off-screen ambient: the same apartment from chapter 2 but darker, like the operative has been at the desk for hours. A second monitor in the periphery shows a trace bar at ~22%, paused.

**Motion (~3s loop).**
- The cursor twitches gently as if hand is shaking from concentration
- Trace bar pulses subtly
- A new line scrolls into the terminal every ~2s but in unreadable cipher characters
- Slight chair-creak shadow at the bottom of the frame

---

## Chapter 5 — VOICES IN YOUR INBOX

**Static brief.** Four envelopes / message indicators floating in 3D space against the deep-blue background. Each has a different colour and fingerprint hash:
- A green cipher-block fingerprint (CIPHER)
- A warmer amber fingerprint (NIGHTOWL_22)
- A cold cyan automated identifier (VoidLink Dispatch)
- A grey system label (sys.ops)

They are arranged at different depths — Cipher closest, sys.ops furthest away. Lines connect them faintly to a central terminal screen on the desk in the foreground.

**Motion (~4s loop).**
- Each envelope very slowly rotates
- The connection lines occasionally pulse, like real-time delivery
- The closest envelope (CIPHER) glows slightly brighter when it pulses

---

## Chapter 6 — THE THING THAT KNOWS YOU

**Static brief.** A single eye-like geometric construct in the centre of frame — vaguely architectural, like a stylised sensor array or an abstract iris. Surrounded by a halo of slow-pulsing rings. The terminal in the foreground is showing a single line of unreadable hex that *almost* resolves into a name and then doesn't. The room around the operative is uncharacteristically dark.

**Motion (~6s loop, deliberately slow).**
- The eye / sensor array rotates slowly
- The rings pulse out of sync with each other
- The hex line on the terminal flickers and reshapes once per loop
- A very subtle "is something watching back?" feeling — slight zoom-in then zoom-out over 6s

---

## Chapter 7 — TONIGHT, AND TOMORROW

**Static brief.** The apartment desk again, this time with the desktop UI visible on the monitor in a half-detailed state — Mission Board card glowing, World Map dimmed in the background, inbox with one unread highlight. The operative's coffee has gone cold; we see steam where the steam used to rise from it but it's stopped. A small calendar / time widget shows 22:47 VST.

**Motion (~4s loop).**
- Mission Board card pulses to draw the eye
- The clock advances second by second (so the player feels the actual *now*)
- Window light has gone from the morning blade to a cold blue late-evening glow
- A subtle radio static / signal hum suggestion implied through slight CRT lines on the monitor

---

## Chapter 8 — BEGIN

**Static brief.** Tight overhead-into-monitor shot. Just the monitor screen filling almost the entire frame, the desktop wallpaper visible (the V8 city silhouette + grid we've shipped). The desktop is *waiting* — no windows open, just the wallpaper and a faint taskbar at the bottom. A small text overlay floats above: *The desktop is waiting.*

**Motion (~3s loop).**
- The cursor blinks
- A new inbox notification badge fades in toward the end of the loop, signalling the first contract
- One faint glyph drifts across the wallpaper

---

## Production notes

- All images delivered as 1920×1080 PNG (static) + WebM/MP4 for animated variants. Loop seamlessly.
- We will fade between chapters in the engine — animations should hold their final frame cleanly.
- Budget guideline (commissioned art): £300-700 per chapter for static + loop pair, £2,500-5,600 for all eight if commissioned as a pack.
- Lower-cost alternative: a single artist with Rive or After Effects can probably do all eight as a focused 2-3 week project for £1,500-2,500 if briefed clearly.

These prompts are for *human artists*. We are not generating these via AI per the disclosure commitment in `CREDITS.md` §22.
