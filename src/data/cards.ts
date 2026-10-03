import type { CardDef } from '../game/types'

/**
 * Card mechanics (decided in docs/plan.md, sections 0 and 11).
 * Names and rules text live in texts.en.ts under `cards`.
 */
export const cards = {
  // Starter cards
  search: {
    id: 'search',
    kind: 'action',
    cost: 1,
    tags: [],
    trashable: true,
    modes: [{ effects: [{ kind: 'search' }] }],
  },
  crowbar: {
    id: 'crowbar',
    kind: 'action',
    cost: 1,
    tags: ['tool', 'weapon'],
    trashable: true,
    modes: [
      { effects: [{ kind: 'damage', amount: 1, target: 'one' }] },
      { effects: [{ kind: 'searchBonus', amount: 1 }] },
    ],
  },
  run: {
    id: 'run',
    kind: 'action',
    cost: 1,
    tags: ['move'],
    trashable: true,
    modes: [{ effects: [{ kind: 'move', maxSteps: 1 }] }],
  },
  sneak: {
    id: 'sneak',
    kind: 'action',
    cost: 1,
    tags: ['quiet'],
    trashable: true,
    modes: [{ effects: [{ kind: 'neutralize', target: 'one' }] }],
  },

  // Junk
  nerves: { id: 'nerves', kind: 'junk', cost: 0, tags: [], trashable: true, modes: [] },
  heavyLoad: {
    id: 'heavyLoad',
    kind: 'junk',
    cost: 0,
    tags: [],
    trashable: false,
    modes: [],
    freeMoveCostWhileInHand: 1,
  },
  wound: { id: 'wound', kind: 'junk', cost: 0, tags: [], trashable: true, modes: [] },

  // Finds: Quiet
  softSoles: {
    id: 'softSoles',
    kind: 'action',
    cost: 1,
    tags: ['move', 'quiet'],
    trashable: true,
    modes: [{ effects: [{ kind: 'move', maxSteps: 1, unnoticed: true }] }],
  },
  lockpick: {
    id: 'lockpick',
    kind: 'action',
    cost: 1,
    tags: ['tool', 'quiet'],
    trashable: true,
    modes: [
      {
        effects: [{ kind: 'search', silent: true }],
        followUp: { tag: 'quiet', effects: [{ kind: 'search', silent: true, bonus: 1 }] },
      },
    ],
  },
  flashlight: {
    id: 'flashlight',
    kind: 'action',
    cost: 0,
    tags: ['tool', 'quiet'],
    trashable: true,
    modes: [
      {
        effects: [{ kind: 'searchBonus', amount: 1 }],
        followUp: {
          tag: 'tool',
          effects: [
            { kind: 'searchBonus', amount: 1 },
            { kind: 'draw', amount: 1 },
          ],
        },
      },
    ],
  },
  alarmClock: {
    id: 'alarmClock',
    kind: 'action',
    cost: 1,
    tags: ['quiet'],
    trashable: true,
    modes: [{ useUp: true, effects: [{ kind: 'neutralize', target: 'allHere' }] }],
  },

  // Finds: Weapon
  baseballBat: {
    id: 'baseballBat',
    kind: 'action',
    cost: 1,
    tags: ['weapon'],
    trashable: true,
    modes: [
      {
        effects: [
          { kind: 'damage', amount: 1, target: 'one' },
          { kind: 'draw', amount: 1 },
        ],
      },
    ],
  },
  axe: {
    id: 'axe',
    kind: 'action',
    cost: 1,
    tags: ['weapon'],
    trashable: true,
    modes: [
      {
        effects: [{ kind: 'damage', amount: 2, target: 'one' }],
        followUp: { tag: 'weapon', effects: [{ kind: 'damage', amount: 3, target: 'one' }] },
      },
    ],
  },
  pistol: {
    id: 'pistol',
    kind: 'action',
    cost: 1,
    tags: ['weapon'],
    trashable: true,
    modes: [{ noise: 2, effects: [{ kind: 'damage', amount: 3, target: 'one' }] }],
  },
  molotov: {
    id: 'molotov',
    kind: 'action',
    cost: 1,
    tags: ['weapon'],
    trashable: true,
    modes: [
      {
        useUp: true,
        noise: 2,
        effects: [{ kind: 'damage', amount: 2, target: 'allHere' }, { kind: 'burnBuilding' }],
      },
    ],
  },
  kevlarVest: {
    id: 'kevlarVest',
    kind: 'action',
    cost: 1,
    tags: [],
    trashable: true,
    modes: [
      {
        effects: [{ kind: 'block', amount: 2 }],
        followUp: { tag: 'weapon', effects: [{ kind: 'block', amount: 3 }] },
      },
    ],
  },

  // Finds: Move
  runningShoes: {
    id: 'runningShoes',
    kind: 'action',
    cost: 1,
    tags: ['move'],
    trashable: true,
    modes: [
      {
        effects: [{ kind: 'move', maxSteps: 2 }],
        followUp: {
          tag: 'move',
          effects: [
            { kind: 'move', maxSteps: 2 },
            { kind: 'draw', amount: 1 },
          ],
        },
      },
    ],
  },
  adrenaline: {
    id: 'adrenaline',
    kind: 'action',
    cost: 0,
    tags: ['move'],
    trashable: true,
    modes: [
      {
        effects: [
          { kind: 'gainAp', amount: 2 },
          { kind: 'loseHp', amount: 1 },
        ],
      },
    ],
  },
  travelLight: {
    id: 'travelLight',
    kind: 'action',
    cost: 0,
    tags: ['move'],
    trashable: true,
    requires: { kind: 'ownedAtMost', count: 10 },
    modes: [
      {
        effects: [
          { kind: 'gainAp', amount: 1 },
          { kind: 'draw', amount: 1 },
        ],
      },
    ],
  },

  // Finds: Tool and Med
  toolbox: {
    id: 'toolbox',
    kind: 'action',
    cost: 1,
    tags: ['tool'],
    trashable: true,
    modes: [
      {
        effects: [{ kind: 'trashFromHand', filter: 'any' }],
        followUp: {
          tag: 'tool',
          effects: [
            { kind: 'trashFromHand', filter: 'any' },
            { kind: 'draw', amount: 1 },
          ],
        },
      },
    ],
  },
  districtMap: {
    id: 'districtMap',
    kind: 'action',
    cost: 0,
    tags: ['tool'],
    trashable: true,
    modes: [
      { effects: [{ kind: 'scout', scope: 'one', range: 2 }] },
      { useUp: true, effects: [{ kind: 'scout', scope: 'all' }] },
    ],
  },
  bandage: {
    id: 'bandage',
    kind: 'action',
    cost: 1,
    tags: ['med'],
    trashable: true,
    modes: [
      { effects: [{ kind: 'heal', amount: 1 }] },
      { useUp: true, effects: [{ kind: 'heal', amount: 3 }] },
    ],
  },
  painkillers: {
    id: 'painkillers',
    kind: 'action',
    cost: 0,
    tags: ['med'],
    trashable: true,
    modes: [
      {
        effects: [
          { kind: 'trashFromHand', filter: 'junk' },
          { kind: 'draw', amount: 1 },
        ],
      },
    ],
  },
} as const satisfies Record<string, CardDef>

export type KnownCardId = keyof typeof cards

/** The four card types in the starter deck that are not junk. */
export const starterCardIds = ['search', 'crowbar', 'run', 'sneak'] as const
