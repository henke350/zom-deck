import type { Content } from '../game/types'
import { cards } from './cards'
import { connections, extraBuildings, largeMap, locations, startLocation } from './locations'

/** The game's content. Tests and the campaign can pass their own. */
export const defaultContent: Content = {
  cards,
  locations,
  connections,
  startLocation,
  packCard: 'heavyLoad',
  woundCard: 'wound',
  extraBuildings,
  largeMap,
  // What zombies carry: small, common things, and now and then something rare.
  bodyLoot: [
    { card: 'bandage', weight: 3 },
    { card: 'painkillers', weight: 2 },
    { card: 'alarmClock', weight: 2 },
    { card: 'flashlight', weight: 2 },
    { card: 'baseballBat', weight: 2 },
    { card: 'runningShoes', weight: 1 },
    { card: 'lockpick', weight: 1 },
    { card: 'molotov', weight: 1 },
    { card: 'pistol', weight: 1 },
    { card: 'firstAidKit', weight: 1 },
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
