# CLAUDE.md – project rules for AI agents

**One More Building** (working title; Danish project name "Sidste tur ud") is a small,
turn-based, single-player zombie survival deckbuilder that runs in the browser.

- **Source of truth for design and scope:** `docs/plan.md` (Danish). Read the
  "Gældende beslutninger" section first; later sections override earlier ones.
- **Current milestone:** M0–M6 done (M5 waits only for the user's own three playthroughs).
  Next: **M7 – playtest and tuning**. Balance changes are the user's call; show them the
  effect with `npm run sim -- --set …` first.
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
- Content (cards, later locations and zombies) is plain data in `src/data/`. Engine
  functions take an optional `content` argument so tests can use their own.
- Effects the engine cannot resolve yet are left out of `implementedEffects` in
  `src/game/rules.ts`; `validate` refuses them with a reason. Add an effect there
  when its milestone implements it.
- `src/game/testkit.ts` builds exact game states for tests (`makeState`, incl. `packsAt`).
- Expedition stats are folded from the events of every action (`src/game/stats.ts`), so they
  always match what happened. `expeditionResult(state)` returns the result once the game is
  over; `previewOutcome(state, action)` tells the UI if an action would end the expedition.
- UI tests can start `GameScreen` from an exact state with `initialState={makeState(...)}`.
- `src/game/invariants.ts` (`checkInvariants`) lists what must always hold; fuzz tests and the
  simulator call it after every action.
- Simulator (`src/sim/`, Node): bots in `bot.ts`, `planner.ts`, `bots.ts`; they may only use
  what a player sees (`view.ts`), never hidden packs or unvisited zombie counts. `npm run sim`
  writes `docs/balance-report.md` (generated, never edit by hand); `npm run fuzz` plays 10 000
  random games. Built by `vite.sim.config.ts`, typechecked by `tsconfig.sim.json`.
- Search lives in `src/game/search.ts`: pack placement, weighted finds, the
  `chooseFind` phase (take / scrap / decline). A search is always the last effect
  of a card mode, because the game then waits for the player.
- Zombies live in `src/game/zombies.ts`: start zombies, noticing, noise and arrivals,
  the zombie phase (follow → attack), `previewEndTurn` and `zombieInfo` (hidden
  danger). Previews must reuse the real rules, never re-implement them.
- UI: `src/ui/GameScreen.tsx` composes `src/ui/components/*`; `useGame` holds the
  engine state and a readable log. The UI gets choices and reasons from
  `cardOptions`, `freeMoveTargets` and `validate`, never from its own rules.
- UI tests use Testing Library with `// @vitest-environment jsdom` at the top of the file.
- No backend, accounts, database, API keys or LLM calls in the game.

## Checks before every push

Run `npm run check` (lint, format check, typecheck, tests, build, fuzz). It must pass.
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
npm run sim        # balance report → docs/balance-report.md (add -- --set maxHp=9 to try a change)
npm run fuzz       # 10 000 random games, every rule checked after every action
npm run build      # production build in dist/
```
