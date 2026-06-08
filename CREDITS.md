# Credits — Voidlink

## Development

**Designer, Developer, Writer** — Richard Martin
([voidlink2026-dev](https://github.com/voidlink2026-dev))

Voidlink is a solo-developed project. One person, one direction, one vision.

---

## A note on AI assistance

I built a lot of this game without AI. The foundations of Voidlink — the
core hacking loop, the trace mechanics, the network-map renderer, the
mission and bounce-chain systems, the banking layer, the world simulation,
the first run of story arcs, the visual identity — were designed and written
by me, by hand, over months of work.

Once the bones of the game were in place, I started using AI coding
assistants to help me finish it off. AI was used for the kind of work that
slows a solo developer down disproportionately: typing out catalogue
entries, generating boilerplate for repetitive UI components, refactoring
files I had already designed, writing scaffolding for systems I had already
specified, drafting test cases against existing logic, and producing
on-voice prose against tight character briefs that I had personally
established. Every line was reviewed, edited, and signed off by me before
it shipped. Every design decision is mine.

The shipped game binary contains no AI runtime — no generative model
inference, no on-the-fly text or art generation, no API calls. Everything
the player sees and interacts with is deterministic, hand-tuned, and
human-directed. AI assistance lived in the build process, not in the
product.

I am not hiding this and I am not advertising it. It is the truth. You can
look at the project's git history — it is intact. Nothing has been
rewritten to hide the assistance. The pattern of work, the prose voice, the
design instincts, the choices about what *not* to build — those are mine,
and they show up consistently across the commits that pre-date any AI
involvement and the ones that came after.

If this matters to you as a player, I respect that and I wanted you to have
the honest version up front.

---

## Acknowledgements

**Inspiration**
The original *Uplink* (Introversion Software, 2001). One of the most
influential games of my life. Voidlink is not a sequel, a remake, or an
official continuation — it is a love letter and a re-imagining for a
different decade.

**Open-source dependencies (selected)**

- **React** + **React DOM** — the application framework
- **Vite** — the build pipeline
- **Three.js** — the WebGL globe, network-map, and world-map renderers
- **Zustand** + **immer** — application state
- **framer-motion** — UI animation primitives
- **TopoJSON** + **world-atlas** — continent outlines for the globe
- **react-i18next** — internationalisation scaffolding
- **vitest** — the test runner
- **TypeScript** — type safety throughout

Full dependency manifest is in `package.json` and the lockfile is in source
control. Every dependency carries its own licence.

**Fonts**
- *JetBrains Mono* (Apache 2.0) — the terminal-style monospace
- *Inter* (SIL OFL 1.1) — UI sans-serif
- *Rajdhani* (SIL OFL 1.1) — display headers

**Code-style influences**
The cyberpunk visual language draws from the long tradition of green-on-
black terminals, the *Blade Runner / Ghost in the Shell / Mr Robot*
aesthetic family, and from the original *Uplink*'s commitment to making
hacking feel like work rather than a power fantasy.

---

## Closing

Voidlink began as a personal project to build the game I wanted to play.
It became a public one when it was good enough that other people might
want to play it too.

Thank you for taking the contract.

— Richard Martin
