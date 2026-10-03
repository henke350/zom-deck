import type { LocationDef, LocationId, LootEntry } from '../game/types'

/** Mixed everyday finds in homes. Weights are relative chances. */
const houseLoot = [
  { card: 'softSoles', weight: 2 },
  { card: 'baseballBat', weight: 2 },
  { card: 'bandage', weight: 2 },
  { card: 'flashlight', weight: 2 },
  { card: 'runningShoes', weight: 1 },
  { card: 'alarmClock', weight: 1 },
  { card: 'districtMap', weight: 1 },
  { card: 'travelLight', weight: 1 },
] as const satisfies readonly LootEntry[]

/**
 * The fixed city map of the prototype (docs/plan.md, sections 3.2 and 11).
 * Names and descriptions live in texts.en.ts under `locations`.
 */
export const locations = {
  workshop: {
    id: 'workshop',
    kind: 'building',
    mapPos: { x: 120, y: 70 },
    startZombies: { min: 0, max: 1 },
    service: { id: 'dismantle', filter: 'any' },
    lootPool: [
      { card: 'toolbox', weight: 3 },
      { card: 'axe', weight: 3 },
      { card: 'lockpick', weight: 2 },
      { card: 'flashlight', weight: 2 },
      { card: 'molotov', weight: 2 },
    ],
  },
  police: {
    id: 'police',
    kind: 'building',
    mapPos: { x: 520, y: 70 },
    startZombies: { min: 2, max: 3 },
    lootPool: [
      { card: 'pistol', weight: 3 },
      { card: 'kevlarVest', weight: 3 },
      { card: 'baseballBat', weight: 2 },
      { card: 'districtMap', weight: 2 },
      { card: 'flashlight', weight: 1 },
    ],
  },
  houseA: {
    id: 'houseA',
    kind: 'building',
    mapPos: { x: 120, y: 200 },
    startZombies: { min: 0, max: 1 },
    lootPool: houseLoot,
  },
  street: { id: 'street', kind: 'street', mapPos: { x: 320, y: 200 } },
  supermarket: {
    id: 'supermarket',
    kind: 'building',
    mapPos: { x: 520, y: 200 },
    startZombies: { min: 1, max: 1 },
    alwaysHasPack: true,
    lootPool: [
      { card: 'runningShoes', weight: 2 },
      { card: 'alarmClock', weight: 2 },
      { card: 'travelLight', weight: 2 },
      { card: 'painkillers', weight: 2 },
      { card: 'bandage', weight: 2 },
    ],
  },
  shelter: { id: 'shelter', kind: 'shelter', mapPos: { x: 120, y: 330 } },
  pharmacy: {
    id: 'pharmacy',
    kind: 'building',
    mapPos: { x: 320, y: 330 },
    startZombies: { min: 1, max: 2 },
    service: { id: 'patchUp', filter: 'junk' },
    lootPool: [
      { card: 'bandage', weight: 3 },
      { card: 'painkillers', weight: 3 },
      { card: 'adrenaline', weight: 2 },
      { card: 'travelLight', weight: 1 },
      { card: 'alarmClock', weight: 1 },
    ],
  },
  houseB: {
    id: 'houseB',
    kind: 'building',
    mapPos: { x: 520, y: 330 },
    startZombies: { min: 0, max: 1 },
    lootPool: houseLoot,
  },
} as const satisfies Record<string, LocationDef>

export type KnownLocationId = keyof typeof locations

/** Two-way connections. Neighbours are derived from this list, so they always match. */
export const connections = [
  ['shelter', 'street'],
  ['shelter', 'houseA'],
  ['houseA', 'street'],
  ['houseA', 'workshop'],
  ['street', 'supermarket'],
  ['street', 'pharmacy'],
  ['street', 'houseB'],
  ['pharmacy', 'houseB'],
  ['workshop', 'police'],
  ['supermarket', 'police'],
] as const satisfies readonly (readonly [KnownLocationId, KnownLocationId])[]

export const startLocation: LocationId = 'shelter'
