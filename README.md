# Voidlink

A world-class remake of the classic hacking game Uplink (2001), built with React, TypeScript, and Zustand.

---

## Status: Pre-Alpha Feature Complete

All core systems, five story arcs, three branching endings, audio engine, i18n, and accessibility pass are complete. 60/60 unit tests passing.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript strict, Vite |
| State | Zustand + Immer middleware |
| Core engine | `libs/core` — pure TypeScript, no browser deps |
| UI components | `libs/ui` — shared design system |
| Audio | Web Audio API (procedural synthesis, no asset files) |
| i18n | react-i18next (en baseline) |
| Tests | Vitest — 60 unit tests |
| Desktop | Electron wrapper in `apps/desktop` |
| Package manager | pnpm workspaces |

---

## Quick Start

```bash
pnpm install
pnpm dev          # starts the web app at localhost:5173
pnpm test         # run all tests
pnpm typecheck    # TypeScript check all packages
```

---

## Project Structure

```
uplink2/
├── apps/
│   ├── web/          # React frontend (main game)
│   └── desktop/      # Electron wrapper
├── libs/
│   ├── core/         # Game engine (types, trace, cracker, generators, story)
│   └── ui/           # Shared components (Window, Button, TraceBar, Terminal)
├── docs/             # All documentation (see below)
└── tools/            # Build tooling
```

---

## Documentation

All documentation lives in [`docs/`](docs/):

All planning, reference, and QA lives in **five docs** (consolidated 2026-06 in M14h.8). Updated after every milestone:

| Document | Contents |
|----------|----------|
| [Full_Plan.md](docs/Full_Plan.md) | Master plan — vision, pillars, every system spec, multiplayer + modding intent, security policy, launch + disclosure, monetisation guardrails |
| [Complete_Tasks.md](docs/Complete_Tasks.md) | Shipped ledger — append-only, every milestone with date |
| [Next_Stage.md](docs/Next_Stage.md) | Future work — world-class detail on every unshipped milestone |
| [Roadmap.md](docs/Roadmap.md) | Visual timeline — phases, sprint plan, EA season cadence, post-1.0 DLC |
| [Testing_Guide.md](docs/Testing_Guide.md) | QA — per-milestone checklists + end-to-end playtest walkthrough |

---

## What's Built

- Multi-window OS-style desktop: drag, resize (all 8 edges/corners), minimize, Ctrl+scroll zoom
- Full hacking loop: scan → crack/exploit → collect → wipe logs → disconnect
- Three distinct mission outcomes: COMPLETE (green) / CONNECTION SEVERED (amber) / TRACED (red)
- Trace system with six rate components; auto-fail cleans up all state correctly
- All stats (totalMissions, successfulBreaches, traceFailures) accurate for every outcome
- 8 mission types with requirements gates and mission events
- 20 hand-authored story missions across 5 arcs (3 branching endings)
- Faction standing system (5 factions)
- 4 specialization paths (Ghost / Brute / Social / Architect)
- World events system (7 authored events)
- Rival hacker AI
- Interactive 8-step tutorial: action-gated, polls game state, auto-advances on completion
- Procedural audio (Web Audio API)
- i18n scaffolding (react-i18next)
- Accessibility: ARIA roles, focus management, axe-core integration
- localStorage persistence with auto-save
