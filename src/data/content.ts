import type { Content, LocationDef } from '../game/types'
import { cards } from './cards'
import {
  connections,
  extraBuildings,
  largeMap,
  locations,
  salvageWeights,
  startLocation,
} from './locations'

/** Adds Salvage to every building's finds; it only turns up in a campaign (`campaignOnly`). */
function withSalvage<L extends Partial<LocationDef>>(
  all: Readonly<Record<string, L>>,
): Record<string, L> {
  return Object.fromEntries(
    Object.entries(all).map(([id, loc]) => {
      const weight = salvageWeights[id] ?? 0
      if (!loc.lootPool || weight <= 0) return [id, loc]
      const salvage = { card: 'salvage', weight, campaignOnly: true }
      return [id, { ...loc, lootPool: [...loc.lootPool, salvage] }]
    }),
  )
}

/** The game's content. Tests and the campaign can pass their own. */
export const defaultContent: Content = {
  cards,
  locations: withSalvage(locations),
  connections,
  startLocation,
  packCard: 'heavyLoad',
  woundCard: 'wound',
  salvageCard: 'salvage',
  extraBuildings: withSalvage(extraBuildings),
  largeMap,
  // What zombies carry: small, everyday things. The good finds wait in the special buildings.
  bodyLoot: [
    { card: 'bandage', weight: 3 },
    { card: 'painkillers', weight: 2 },
    { card: 'alarmClock', weight: 2 },
    { card: 'flashlight', weight: 2 },
    { card: 'knife', weight: 2 },
  ],
  // Noise mostly brings Walkers; dusk brings more Runners, so the walk home gets faster and harder.
  // With the danger meter, noise and hordes bring the kinds of the current level instead.
  arrivals: {
    byDanger: [
      [{ kind: 'walker', weight: 1 }],
      [
        { kind: 'walker', weight: 3 },
        { kind: 'runner', weight: 1 },
      ],
      [
        { kind: 'walker', weight: 2 },
        { kind: 'runner', weight: 1 },
        { kind: 'screamer', weight: 1 },
      ],
      [
        { kind: 'walker', weight: 1 },
        { kind: 'runner', weight: 2 },
        { kind: 'brute', weight: 1 },
        { kind: 'screamer', weight: 1 },
      ],
    ],
    noise: [
      { kind: 'walker', weight: 6 },
      { kind: 'runner', weight: 2 },
      { kind: 'screamer', weight: 1 },
    ],
    dusk: [
      { kind: 'walker', weight: 1 },
      { kind: 'runner', weight: 1 },
    ],
  },
}
