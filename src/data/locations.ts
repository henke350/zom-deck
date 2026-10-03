import type { LocationDef, LocationId } from '../game/types'

/**
 * The fixed city map of the prototype (docs/plan.md, section 3.2).
 * Names and descriptions live in texts.en.ts under `locations`.
 */
export const locations = {
  workshop: { id: 'workshop', kind: 'building', mapPos: { x: 120, y: 70 } },
  police: { id: 'police', kind: 'building', mapPos: { x: 520, y: 70 } },
  houseA: { id: 'houseA', kind: 'building', mapPos: { x: 120, y: 200 } },
  street: { id: 'street', kind: 'street', mapPos: { x: 320, y: 200 } },
  supermarket: { id: 'supermarket', kind: 'building', mapPos: { x: 520, y: 200 } },
  shelter: { id: 'shelter', kind: 'shelter', mapPos: { x: 120, y: 330 } },
  pharmacy: { id: 'pharmacy', kind: 'building', mapPos: { x: 320, y: 330 } },
  houseB: { id: 'houseB', kind: 'building', mapPos: { x: 520, y: 330 } },
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
