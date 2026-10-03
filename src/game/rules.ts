import { ownedCount } from './deck'
import type { CardDef, CardMode, Content, Effect, EffectKind, GameState } from './types'

/** Effects the engine can resolve. A card with any other effect is refused with a reason. */
export const implementedEffects: ReadonlySet<EffectKind> = new Set<EffectKind>([
  'gainAp',
  'draw',
  'heal',
  'loseHp',
  'trashFromHand',
  'searchBonus',
  'block',
  'move',
  'search',
  'damage',
  'neutralize',
  'scout',
  'burnBuilding',
])

export function isFollowUpActive(state: GameState, mode: CardMode): boolean {
  return mode.followUp !== undefined && state.tagsPlayedThisTurn.includes(mode.followUp.tag)
}

/** The effects a mode will have right now, taking Follow-up into account. */
export function activeEffects(state: GameState, mode: CardMode): readonly Effect[] {
  return isFollowUpActive(state, mode) && mode.followUp ? mode.followUp.effects : mode.effects
}

export function conditionMet(state: GameState, def: CardDef): boolean {
  if (!def.requires) return true
  switch (def.requires.kind) {
    case 'ownedAtMost':
      return ownedCount(state.piles) <= def.requires.count
  }
}

export function trashFilterOf(effects: readonly Effect[]): 'any' | 'junk' | undefined {
  for (const effect of effects) {
    if (effect.kind === 'trashFromHand') return effect.filter
  }
  return undefined
}

/** True if the effects need the player to pick one zombie at their location. */
export function needsZombieTarget(effects: readonly Effect[]): boolean {
  return effects.some((e) => (e.kind === 'damage' || e.kind === 'neutralize') && e.target === 'one')
}

/** True if the effects only make sense with at least one zombie at the player's location. */
export function needsZombiesHere(effects: readonly Effect[]): boolean {
  return effects.some(
    (e) => (e.kind === 'damage' || e.kind === 'neutralize') && e.target === 'allHere',
  )
}

/** Range of a single-building scout effect, or undefined if the effects don't scout one building. */
export function scoutRangeOf(effects: readonly Effect[]): number | undefined {
  for (const effect of effects) {
    if (effect.kind === 'scout' && effect.scope === 'one') return effect.range ?? 0
  }
  return undefined
}

/** Largest number of steps a move effect allows, or undefined if the effects don't move you. */
export function moveStepsOf(effects: readonly Effect[]): number | undefined {
  for (const effect of effects) {
    if (effect.kind === 'move') return effect.maxSteps
  }
  return undefined
}

/** AP cost of the free move: 0, or more while Heavy Load (or similar) is in hand. Does not stack. */
export function freeMoveCost(state: GameState, content: Content): number {
  let cost = 0
  for (const card of state.piles.hand) {
    cost = Math.max(cost, content.cards[card.card]?.freeMoveCostWhileInHand ?? 0)
  }
  return cost
}

/** Noise a mode makes when played: its own noise plus search noise from the balance file. */
export function modeNoise(state: GameState, mode: CardMode): number {
  const searchNoise = activeEffects(state, mode).some((e) => e.kind === 'search' && !e.silent)
    ? state.balance.searchNoise
    : 0
  return (mode.noise ?? 0) + searchNoise
}

/** Stars for a number of packs: 0 below the win condition, then 1–3. */
export function starsFor(state: GameState, packs: number): number {
  return state.balance.starThresholds.filter((needed) => packs >= needed).length
}
