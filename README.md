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

| Document | Contents |
|----------|----------|
| [GAME_GUIDE.md](docs/GAME_GUIDE.md) | Complete player guide — every mechanic, all five arcs, all three endings |
| [NEXT_STAGE.md](docs/NEXT_STAGE.md) | Feature roadmap — dark web, satellite hacking, social engineering, co-op, and more |
| [DEV_DOCS_INDEX.md](docs/DEV_DOCS_INDEX.md) | Implementation status, all milestones, file index |
| [GAME_DESIGN_MASTER.md](docs/GAME_DESIGN_MASTER.md) | Full game design specification |
| [UPLINK_NG_OVERVIEW.md](docs/UPLINK_NG_OVERVIEW.md) | Project overview and architecture summary |
| [DEV_GUIDE_01–10](docs/) | Step-by-step implementation guides for each system |

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
