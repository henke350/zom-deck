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
  { card: 'knife', weight: 1 },
  { card: 'silentTakedown', weight: 1 },
  { card: 'travelLight', weight: 1 },
  { card: 'bicycle', weight: 1 },
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
    startZombies: {
      min: 0,
      max: 1,
      kinds: [
        { kind: 'walker', weight: 3 },
        { kind: 'brute', weight: 1 },
      ],
    },
    service: { id: 'dismantle', filter: 'any' },
    lootPool: [
      { card: 'toolbox', weight: 3 },
      { card: 'axe', weight: 3 },
      { card: 'lockpick', weight: 2 },
      { card: 'flashlight', weight: 2 },
      { card: 'molotov', weight: 2 },
      { card: 'chainsaw', weight: 1 },
    ],
  },
  police: {
    id: 'police',
    kind: 'building',
    downtown: true,
    mapPos: { x: 520, y: 70 },
    startZombies: {
      min: 2,
      max: 3,
      kinds: [
        { kind: 'walker', weight: 2 },
        { kind: 'brute', weight: 2 },
      ],
    },
    lootPool: [
      { card: 'pistol', weight: 3 },
      { card: 'headShot', weight: 2 },
      { card: 'kevlarVest', weight: 3 },
      { card: 'baseballBat', weight: 2 },
      { card: 'districtMap', weight: 2 },
      { card: 'flashlight', weight: 1 },
      { card: 'shotgun', weight: 1 },
    ],
  },
  houseA: {
    id: 'houseA',
    kind: 'building',
    mapPos: { x: 120, y: 200 },
    startZombies: {
      min: 0,
      max: 1,
      kinds: [
        { kind: 'walker', weight: 4 },
        { kind: 'screamer', weight: 1 },
      ],
    },
    lootPool: houseLoot,
  },
  street: { id: 'street', kind: 'street', mapPos: { x: 320, y: 200 } },
  supermarket: {
    id: 'supermarket',
    kind: 'building',
    mapPos: { x: 520, y: 200 },
    startZombies: {
      min: 1,
      max: 1,
      kinds: [
        { kind: 'walker', weight: 3 },
        { kind: 'runner', weight: 1 },
      ],
    },
    alwaysHasPack: true,
    lootPool: [
      { card: 'runningShoes', weight: 2 },
      { card: 'alarmClock', weight: 2 },
      { card: 'travelLight', weight: 2 },
      { card: 'painkillers', weight: 2 },
      { card: 'bandage', weight: 2 },
      { card: 'knife', weight: 1 },
      { card: 'bicycle', weight: 1 },
    ],
  },
  shelter: { id: 'shelter', kind: 'shelter', mapPos: { x: 120, y: 330 } },
  pharmacy: {
    id: 'pharmacy',
    kind: 'building',
    mapPos: { x: 320, y: 330 },
    startZombies: {
      min: 1,
      max: 2,
      kinds: [
        { kind: 'walker', weight: 2 },
        { kind: 'screamer', weight: 1 },
      ],
    },
    service: { id: 'patchUp', filter: 'junk' },
    lootPool: [
      { card: 'bandage', weight: 3 },
      { card: 'painkillers', weight: 3 },
      { card: 'adrenaline', weight: 2 },
      { card: 'travelLight', weight: 1 },
      { card: 'alarmClock', weight: 1 },
      { card: 'firstAidKit', weight: 1 },
    ],
  },
  houseB: {
    id: 'houseB',
    kind: 'building',
    mapPos: { x: 520, y: 330 },
    startZombies: {
      min: 0,
      max: 1,
      kinds: [
        { kind: 'walker', weight: 4 },
        { kind: 'screamer', weight: 1 },
      ],
    },
    lootPool: houseLoot,
  },
} as const satisfies Record<string, LocationDef>

export type KnownLocationId = keyof typeof locations

/**
 * Buildings a random city can use besides the classic ones. A city has as many buildings as
 * the classic map has building slots, so some buildings are left out of every city.
 */
export const extraBuildings = {
  gasStation: {
    id: 'gasStation',
    kind: 'building',
    startZombies: {
      min: 0,
      max: 2,
      kinds: [
        { kind: 'walker', weight: 2 },
        { kind: 'runner', weight: 1 },
        { kind: 'screamer', weight: 1 },
      ],
    },
    lootPool: [
      { card: 'molotov', weight: 3 },
      { card: 'bow', weight: 1 },
      { card: 'runningShoes', weight: 2 },
      { card: 'travelLight', weight: 2 },
      { card: 'flashlight', weight: 2 },
      { card: 'toolbox', weight: 1 },
      { card: 'bicycle', weight: 1 },
    ],
  },
  school: {
    id: 'school',
    kind: 'building',
    startZombies: {
      min: 1,
      max: 2,
      kinds: [
        { kind: 'runner', weight: 2 },
        { kind: 'walker', weight: 1 },
      ],
    },
    lootPool: [
      { card: 'districtMap', weight: 3 },
      { card: 'bow', weight: 2 },
      { card: 'flashlight', weight: 2 },
      { card: 'alarmClock', weight: 2 },
      { card: 'bandage', weight: 2 },
      { card: 'baseballBat', weight: 2 },
      { card: 'softSoles', weight: 1 },
    ],
  },
  hospital: {
    id: 'hospital',
    kind: 'building',
    downtown: true,
    startZombies: {
      min: 2,
      max: 3,
      kinds: [
        { kind: 'walker', weight: 2 },
        { kind: 'brute', weight: 1 },
        { kind: 'screamer', weight: 1 },
      ],
    },
    service: { id: 'patchUp', filter: 'junk' },
    lootPool: [
      { card: 'bandage', weight: 3 },
      { card: 'painkillers', weight: 2 },
      { card: 'adrenaline', weight: 2 },
      { card: 'alarmClock', weight: 1 },
      { card: 'kevlarVest', weight: 1 },
      { card: 'firstAidKit', weight: 1 },
    ],
  },
  apartments: {
    id: 'apartments',
    kind: 'building',
    downtown: true,
    startZombies: {
      min: 1,
      max: 3,
      kinds: [
        { kind: 'walker', weight: 3 },
        { kind: 'screamer', weight: 2 },
        { kind: 'runner', weight: 1 },
      ],
    },
    lootPool: [
      { card: 'bandage', weight: 2 },
      { card: 'painkillers', weight: 2 },
      { card: 'alarmClock', weight: 2 },
      { card: 'travelLight', weight: 2 },
      { card: 'flashlight', weight: 1 },
      { card: 'softSoles', weight: 1 },
      { card: 'districtMap', weight: 1 },
      { card: 'knife', weight: 1 },
      { card: 'silentTakedown', weight: 1 },
    ],
  },
  church: {
    id: 'church',
    kind: 'building',
    startZombies: {
      min: 0,
      max: 1,
      kinds: [
        { kind: 'walker', weight: 2 },
        { kind: 'screamer', weight: 1 },
      ],
    },
    service: { id: 'patchUp', filter: 'junk' },
    lootPool: [
      { card: 'bandage', weight: 2 },
      { card: 'softSoles', weight: 2 },
      { card: 'silentTakedown', weight: 1 },
      { card: 'alarmClock', weight: 2 },
      { card: 'travelLight', weight: 2 },
      { card: 'painkillers', weight: 1 },
    ],
  },
  sportsShop: {
    id: 'sportsShop',
    kind: 'building',
    downtown: true,
    startZombies: {
      min: 1,
      max: 2,
      kinds: [
        { kind: 'runner', weight: 2 },
        { kind: 'walker', weight: 1 },
      ],
    },
    lootPool: [
      { card: 'runningShoes', weight: 3 },
      { card: 'baseballBat', weight: 3 },
      { card: 'headShot', weight: 1 },
      { card: 'bow', weight: 2 },
      { card: 'crossbow', weight: 1 },
      { card: 'kevlarVest', weight: 1 },
      { card: 'softSoles', weight: 1 },
      { card: 'travelLight', weight: 1 },
      { card: 'bicycle', weight: 1 },
    ],
  },
} as const satisfies Record<string, Omit<LocationDef, 'mapPos'>>

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

/**
 * The large city (balance.cityMap: 'large'): 5 × 3 places, 10 empty building slots (b1–b10)
 * and two street hubs. The Shelter sits at the west edge; downtown (b4, b5, b7) lies 4–5 steps
 * away, so the rich buildings are a long walk from home.
 *
 *   b1 ── b2 ── b3 ── b4 ── b5
 *   │     │     │     │     │
 *   Shelter─Street─b6─ Square─b7
 *   │     │     │   ╱
 *   b8 ── b9 ── b10
 */
const col = (c: number) => 90 + c * 190
const row = (r: number) => 65 + r * 135
const slot = (id: string, c: number, r: number, downtown = false): LocationDef => ({
  id,
  kind: 'building',
  slot: true,
  ...(downtown ? { downtown: true } : {}),
  mapPos: { x: col(c), y: row(r) },
})

export const largeMap: {
  readonly locations: Readonly<Record<LocationId, LocationDef>>
  readonly connections: readonly (readonly [LocationId, LocationId])[]
} = {
  locations: {
    shelter: { id: 'shelter', kind: 'shelter', mapPos: { x: col(0), y: row(1) } },
    street: { id: 'street', kind: 'street', mapPos: { x: col(1), y: row(1) } },
    square: { id: 'square', kind: 'street', mapPos: { x: col(3), y: row(1) } },
    b1: slot('b1', 0, 0),
    b2: slot('b2', 1, 0),
    b3: slot('b3', 2, 0),
    b4: slot('b4', 3, 0, true),
    b5: slot('b5', 4, 0, true),
    b6: slot('b6', 2, 1),
    b7: slot('b7', 4, 1, true),
    b8: slot('b8', 0, 2),
    b9: slot('b9', 1, 2),
    b10: slot('b10', 2, 2),
  },
  connections: [
    ['shelter', 'street'],
    ['shelter', 'b1'],
    ['shelter', 'b8'],
    ['street', 'b2'],
    ['street', 'b9'],
    ['street', 'b6'],
    ['b1', 'b2'],
    ['b2', 'b3'],
    ['b3', 'b4'],
    ['b4', 'b5'],
    ['b5', 'b7'],
    ['b8', 'b9'],
    ['b9', 'b10'],
    ['b6', 'b3'],
    ['b6', 'b10'],
    ['b6', 'square'],
    ['b10', 'square'],
    ['square', 'b4'],
    ['square', 'b7'],
  ],
}
