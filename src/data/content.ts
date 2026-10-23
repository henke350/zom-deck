import type { Content } from '../game/types'
import { cards } from './cards'
import { connections, extraBuildings, locations, startLocation } from './locations'

/** The game's content. Tests and the campaign can pass their own. */
export const defaultContent: Content = {
  cards,
  locations,
  connections,
  startLocation,
  packCard: 'heavyLoad',
  woundCard: 'wound',
  extraBuildings,
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
