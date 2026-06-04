# Voidlink — Agent Notes

Project-root instructions for any AI assistant working in this repo.

## Documentation rule — MANDATORY

Every code change that ships a milestone or fix must update **all three planning docs in the same commit**:

1. **[docs/COMPLETE_TASKS.md](docs/COMPLETE_TASKS.md)** — append a row describing what was shipped (top of the current month's section).
2. **[docs/NEXT_STAGE.md](docs/NEXT_STAGE.md)** — remove the corresponding "unshipped" row (or trim a planned scope).
3. **[docs/ROADMAP.md](docs/ROADMAP.md)** — flip the matching phase row from 🚧/🎯 → ✅ with the date.

If a change is too small to be a milestone (typo fix, minor copy tweak) it does **not** need the planning-doc update. Anything user-visible or mechanically significant **does**.

When player-facing behaviour changes, also update:
- **docs/GAME_GUIDE.md** — if the change affects how the player understands a mechanic.
- **docs/TESTING_GUIDE.md** — if there's a new thing to manually verify.
- **docs/PLAYTEST_WALKTHROUGH.md** — if the change affects the scripted playtest path.

## The three planning docs — ownership

- `COMPLETE_TASKS.md` is **append-only**. Never edit existing rows.
- `NEXT_STAGE.md` is **forward-looking only**. Never contains shipped milestones.
- `ROADMAP.md` is the **visual timeline**. Phases + sprints + season cadence.

Anything else (`GAME_DESIGN_MASTER.md`, `GAME_GUIDE.md`, `TESTING_GUIDE.md`, `PLAYTEST_WALKTHROUGH.md`, `DEV_GUIDE_01-10`) is reference, not planning.

## Commit style

- Use conventional-commit prefixes: `feat(M14h.7):`, `fix(M14h.5):`, `docs:`.
- **Do NOT** add `Co-Authored-By: Claude` lines — see [NEXT_STAGE.md §16](docs/NEXT_STAGE.md#16-ai-assistance-disclosure--pre-launch-cleanup-plan) for the disclosure policy.
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
