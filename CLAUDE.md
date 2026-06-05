# Voidlink — Agent Notes

Project-root instructions for any AI assistant working in this repo.

## Documentation rule — MANDATORY

The repo has exactly **5 docs in `docs/`** (consolidated 2026-06 in M14h.8). No others. If you find yourself wanting to create a new markdown file in `docs/`, you almost certainly want to extend one of these instead.

1. **[docs/Full_Plan.md](docs/Full_Plan.md)** — master plan / design canon
2. **[docs/Complete_Tasks.md](docs/Complete_Tasks.md)** — append-only shipped ledger
3. **[docs/Next_Stage.md](docs/Next_Stage.md)** — world-class detail on unshipped work only
4. **[docs/Roadmap.md](docs/Roadmap.md)** — visual phase + sprint timeline
5. **[docs/Testing_Guide.md](docs/Testing_Guide.md)** — QA checklists + playtest walkthrough

Every code change that ships a milestone or fix must update **all relevant docs in the same commit**:

- **Complete_Tasks.md** — append a concise row describing what was shipped (top of the current month's section).
- **Next_Stage.md** — remove the corresponding "unshipped" row (or trim a planned scope).
- **Roadmap.md** — flip the matching phase row from 🚧/🎯 → ✅ with the date.
- **Full_Plan.md** — update if a system spec, policy, or architectural decision changed.
- **Testing_Guide.md** — add or update the section for the milestone.

If a change is too small to be a milestone (typo fix, minor copy tweak) it does **not** need the doc update. Anything user-visible or mechanically significant **does**.

## The five docs — ownership

- `Full_Plan.md` — the design canon. Update when a system or policy changes.
- `Complete_Tasks.md` is **append-only**. Never edit existing rows.
- `Next_Stage.md` is **forward-looking only**. Never contains shipped milestones — when a milestone ships, its row MOVES out of Next_Stage into Complete_Tasks.
- `Roadmap.md` is the **visual timeline**. Phases + sprints + season cadence.
- `Testing_Guide.md` is QA. Add a section per milestone; keep evergreen.

## Repo-root creative / marketing docs (separate from the 5 planning docs)

These live at the **repo root**, not in `docs/`. They are creative/marketing, not planning. They are also single-source-of-truth for their domain:

- `Why_Voidlink.md` — the pitch document. For press and players. Updated when the vision shifts.
- `Voidlink_Synopsis.md` — comprehensive player-facing game guide. Updated when major systems ship that change the player experience.
- `The_Voidlink_Codex.md` — the world bible / lore book. Tolkien-depth in-universe history. Updated when canonical lore is added or refined. Treat with care — this is the *story* of the world.
- `README.md` — repository entry point. Updated on doc structure changes.
- `CLAUDE.md` — agent instructions (this file).

Adding new creative docs at repo root is allowed if they serve a clearly different purpose. Adding more planning docs is **not** — extend one of the five instead.

## Commit style

- Use conventional-commit prefixes: `feat(M14h.7):`, `fix(M14h.5):`, `docs:`.
- **Do NOT** add `Co-Authored-By: Claude` lines — see [Full_Plan.md §22](docs/Full_Plan.md#22-ai-assistance-disclosure) for the disclosure policy.
- Heredoc commit messages should describe **why**, not just **what**.

## Test/typecheck before commit

- `pnpm --filter @voidlink/web exec tsc --noEmit` — must be clean
- `pnpm test` — all 60 tests must pass

## Multiplayer

Mandate: **multiplayer is the LAST system**. Do not touch it unless explicitly requested.

## Hard rules — never violate

- No pay-to-win, ever. Cosmetics + story DLC only.
- No AI runs in the shipped game binary.
- No history rewrites; never force-push to main.
