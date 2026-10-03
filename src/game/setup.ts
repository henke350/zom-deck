import { balance as defaultBalance, type Balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { startTurn } from './engine'
import { normalizeSeed, shuffle } from './rng'
import { placePacks } from './search'
import { emptyStats } from './stats'
import { setupZombies } from './zombies'
import type { CardId, CardInstance, Content, ExpeditionSetup, GameEvent, GameState } from './types'

export interface NewGameOptions {
  readonly balance?: Balance
  readonly content?: Content
  readonly setup?: ExpeditionSetup
}

/** The starter deck from the balance file, in a fixed order before shuffling. */
export function starterDeck(b: Balance): CardId[] {
  return Object.entries(b.starterDeck).flatMap(([card, count]) =>
    Array.from({ length: count }, () => card),
  )
}

/** Creates a new expedition: shuffles the deck and draws the first hand (turn 1). */
export function newGame(seed: number, options: NewGameOptions = {}): GameState {
  const balance = options.balance ?? defaultBalance
  const content = options.content ?? defaultContent
  const deckIds = options.setup?.startDeck ?? starterDeck(balance)

  for (const id of deckIds) {
    if (!content.cards[id]) throw new Error(`Unknown card in start deck: ${id}`)
  }
  if (!content.locations[content.startLocation]) {
    throw new Error(`Unknown start location: ${content.startLocation}`)
  }

  const instances: CardInstance[] = deckIds.map((card, i) => ({ uid: `c${i + 1}`, card }))
  const normalized = normalizeSeed(seed)
  const [draw, afterDeck] = shuffle(instances, normalized)
  const [sites, afterPacks] = placePacks(content, balance, afterDeck)
  const [zombies, nextZombieUid, rng] = setupZombies(content, balance, afterPacks)

  const startHp = options.setup?.startHp ?? balance.maxHp
  const initial: GameState = {
    seed: normalized,
    rng,
    balance,
    turn: 0,
    phase: 'action',
    player: {
      location: content.startLocation,
      hp: startHp,
      ap: 0,
      freeMoveUsed: false,
      packs: 0,
      searchBonus: 0,
      block: 0,
    },
    piles: { draw, hand: [], inPlay: [], discard: [], removed: [] },
    sites,
    tagsPlayedThisTurn: [],
    nextUid: instances.length + 1,
    zombies,
    nextZombieUid,
    noise: 0,
    visited: [content.startLocation],
    stats: emptyStats(startHp),
  }
  const events: GameEvent[] = []
  return startTurn(initial, events)
}
