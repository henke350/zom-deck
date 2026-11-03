import type { MissionKind } from '../data/balance'
import type { GameEvent, GameState, LocationId, Mission, Zombie } from './types'
import { zombiesAt } from './zombies'

/**
 * Campaign missions (inspired by Maximum Apocalypse's scenarios). Each day has one optional
 * mission in a marked building; done and home again, it brings a reward (`finishDay`).
 * - rescue: reach the marked building.
 * - clear: stand in it with no zombies there.
 * - boss: kill the boss that waits in it.
 */

/** Today's mission kind (the last value of `balance.campaign.missions` repeats). */
export function missionKindFor(
  missions: readonly MissionKind[],
  day: number,
): MissionKind | undefined {
  return missions[Math.min(day, missions.length) - 1]
}

/** The boss of a boss mission, placed in its building at the start of the expedition. */
export function placeBoss(state: GameState, mission: Mission): GameState {
  if (mission.kind !== 'boss') return state
  const boss: Zombie = {
    uid: `z${state.nextZombieUid}`,
    kind: 'boss',
    location: mission.target,
    hp: state.balance.zombies.boss.hp,
    alerted: false,
    neutralized: false,
  }
  return { ...state, zombies: [...state.zombies, boss], nextZombieUid: state.nextZombieUid + 1 }
}

function isDone(state: GameState, kind: MissionKind, target: LocationId): boolean {
  switch (kind) {
    case 'rescue':
      return state.player.location === target
    case 'clear':
      return state.player.location === target && zombiesAt(state, target).length === 0
    case 'boss':
      return !state.zombies.some((z) => z.kind === 'boss')
  }
}

/** After every action: is today's mission done now? */
export function checkMission(state: GameState, events: GameEvent[]): GameState {
  const mission = state.mission
  if (!mission || mission.done || !isDone(state, mission.kind, mission.target)) return state
  events.push({ type: 'missionDone', kind: mission.kind, target: mission.target })
  return { ...state, mission: { ...mission, done: true } }
}
