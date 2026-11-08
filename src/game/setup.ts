import { balance as defaultBalance, type Balance } from '../data/balance'
import { eventScoutCount, eventStartCards, pickDayEvent, withDayEvent } from './dayEvents'
import { adoptDog } from './dog'
import { placeBoss } from './missions'
import { placeBarrels } from './barrels'
import { survivorDeck, survivorOf, withSurvivor } from './survivors'
import { defaultContent } from '../data/content'
import { startTurn } from './engine'
import { normalizeSeed, shuffle } from './rng'
import { contentForCity, mapContent, maybeRollCity } from './city'
import { placePacks } from './search'
import { emptyStats } from './stats'
import { revealZombies, setupZombies } from './zombies'
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
  const baseBalance = options.balance ?? defaultBalance
  const content = options.content ?? defaultContent
  // The event of the day changes the balance of this whole expedition.
  const dayEvent = pickDayEvent(baseBalance, seed, options.setup?.dayEvent)
  // So does the survivor you play (start deck, health and one ability).
  const survivor = survivorOf(baseBalance, options.setup?.survivor)
  const balance = withSurvivor(withDayEvent(baseBalance, dayEvent), survivor)
  const deckIds = [
    ...survivorDeck(options.setup?.startDeck ?? starterDeck(balance), survivor),
    ...eventStartCards(dayEvent),
  ]

  for (const id of deckIds) {
    if (!content.cards[id]) throw new Error(`Unknown card in start deck: ${id}`)
  }
  if (!content.locations[content.startLocation]) {
    throw new Error(`Unknown start location: ${content.startLocation}`)
  }

  const instances: CardInstance[] = deckIds.map((card, i) => ({ uid: `c${i + 1}`, card }))
  const normalized = normalizeSeed(seed)
  const [draw, afterDeck] = shuffle(instances, normalized)
  const setup = options.setup
  // A campaign keeps the same city every day; otherwise each expedition rolls its own.
  const [city, afterCity] = setup?.city
    ? [setup.city, afterDeck]
    : maybeRollCity(content, balance, afterDeck)
  const here = city ? contentForCity(city, mapContent(content, balance.cityMap)) : content
  const campaign = setup?.campaignDay !== undefined
  const [placed, afterPacks, packsPlaced] = placePacks(here, balance, afterCity, {
    ...(setup?.searchesUsed ? { searchesUsed: setup.searchesUsed } : {}),
    ...(setup?.burned ? { burned: setup.burned } : {}),
    packKinds: campaign,
  })
  // Lookout (and a found map): some buildings are scouted before you set out.
  const sites = { ...placed }
  const mapped = eventScoutCount(dayEvent) + (survivor?.scout ?? 0)
  const extraScouted =
    mapped > 0
      ? shuffle(
          Object.keys(sites).filter((id) => !(setup?.scouted ?? []).includes(id)),
          normalizeSeed(seed ^ 0x51ed270b),
        )[0].slice(0, mapped)
      : []
  const scoutedIds = [...(setup?.scouted ?? []), ...extraScouted]
  for (const id of scoutedIds) {
    const site = sites[id]
    if (site) sites[id] = { ...site, scouted: true }
  }
  const [zombies, nextZombieUid, rng] = setupZombies(here, balance, afterPacks)

  // A given start health (campaign) is before the survivor's extra health.
  const givenHp = options.setup?.startHp
  const startHp =
    givenHp === undefined
      ? balance.maxHp
      : Math.min(balance.maxHp, givenHp + (survivor?.maxHp ?? 0))
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
      poison: 0,
      ammo: balance.ammo.start,
    },
    piles: { draw, hand: [], inPlay: [], discard: [], removed: [], gear: [] },
    sites,
    tagsPlayedThisTurn: [],
    nextUid: instances.length + 1,
    zombies,
    nextZombieUid,
    noise: 0,
    danger: 1,
    gearLeft: {},
    visited: [content.startLocation],
    ...(dayEvent ? { dayEvent: dayEvent.id } : {}),
    ...(survivor ? { survivor: survivor.id } : {}),
    barrels: placeBarrels(here, balance, normalized),
    ...(setup?.mission && sites[setup.mission.target]
      ? { mission: { ...setup.mission, done: false } }
      : {}),
    ...(city ? { city } : {}),
    ...(campaign
      ? {
          campaignDay: setup.campaignDay,
          known: setup.known ?? [],
          ...(packsPlaced !== balance.packsOnMap ? { packsPlaced } : {}),
        }
      : {}),
    stats: emptyStats(startHp, instances.length),
  }
  const events: GameEvent[] = []
  const scouted = scoutedIds.filter((id) => sites[id])
  const withBoss = initial.mission ? placeBoss(initial, initial.mission) : initial
  const revealed = scouted.reduce((s, id) => revealZombies(s, here, id), withBoss)
  // Campaign: the dog from earlier days comes along.
  const withDog = setup?.dog ? adoptDog(revealed, setup.dog.hp, events) : revealed
  return startTurn(withDog, events)
}
