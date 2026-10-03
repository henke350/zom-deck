import { ownedCount } from './deck'
import type { CardDef, CardMode, Effect, EffectKind, GameState } from './types'

/** Effects the engine can resolve so far. The rest arrive with the map (M2), search (M3) and zombies (M4). */
export const implementedEffects: ReadonlySet<EffectKind> = new Set<EffectKind>([
  'gainAp',
  'draw',
  'heal',
  'loseHp',
  'trashFromHand',
  'searchBonus',
  'block',
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
