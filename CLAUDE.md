# CLAUDE.md – project rules for AI agents

**One More Building** (working title; Danish project name "Sidste tur ud") is a small,
turn-based, single-player zombie survival deckbuilder that runs in the browser.

- **Source of truth for design and scope:** `docs/plan.md` (Danish). Read the
  "Gældende beslutninger" section first; later sections override earlier ones.
- **Current milestone:** M0 done. Next: **M1 – rules core: deck and turns** (no UI).
  Work one milestone at a time and meet its "done" criteria before moving on.

## Talking to the user

- The user is a Danish engineer, not a professional developer. Write to them in
  **plain Danish**, briefly explain technical terms, and say what changed, why, and
  what they need to test or decide.
- Docs for the user (`docs/plan.md`, `README.md`) are in Danish.

## Language in code and game

- All player-facing text is **English** and lives in `src/data/texts.en.ts`.
- Identifiers, comments and commit messages are in English.

## Architecture (enforced by `src/game/architecture.test.ts`)

```
src/game/  rules engine – pure TypeScript, no React, no DOM, no clock, no Math.random
src/data/  content and balance – cards, locations, zombies, balance.ts, texts
src/ui/    React view and input – shows state, sends actions, contains no rules
src/sim/   bots and balance reports (from M6), run in Node
```

- Main entry: `applyAction(state, action) → { state, events }`. Never mutate the old
  state; return a new one.
- **All randomness** goes through the seeded RNG whose state lives in `GameState`.
  Same seed + same actions = same game.
- **All balance numbers** live in `src/data/balance.ts`. Never hard-code them in rules
  or UI.
- The UI asks `validate(state, action)` whether an action is legal and shows the
  returned reason on disabled controls.
- The engine accepts an optional `ExpeditionSetup` and can return an
  `ExpeditionResult`, so the version-2 campaign can be layered on later.
- No backend, accounts, database, API keys or LLM calls in the game.

## Checks before every push

Run `npm run check` (lint, format check, typecheck, tests, build). It must pass.
CI (`.github/workflows/ci.yml`) runs the same steps on every push.

- Tests are colocated as `*.test.ts(x)` and use Vitest.
- Rules code needs tests for each rule it adds (see "Kontrol og playtest" in the plan).
- Formatting: Prettier (`npm run format`). Linting: oxlint.

## Commands

```
npm install        # once
npm run dev        # local dev server at http://localhost:5173
npm test           # run tests once (npm run test:watch to keep running)
npm run check      # everything CI checks
npm run build      # production build in dist/
```
