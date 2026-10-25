import { balance as defaultBalance, type Balance, type UpgradeId } from '../data/balance'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { buildingKnown, cityContent, contentForCity, mapContent, rollCity } from './city'
import { normalizeSeed, shuffle } from './rng'
import { starterDeck } from './setup'
import { expeditionResult } from './stats'
import type {
  CardId,
  City,
  Content,
  ExpeditionSetup,
  GameState,
  LocationId,
  Outcome,
  Validation,
} from './types'

/**
 * Version 2: a campaign of days in one city (docs/plan.md, section 12). Each day is one
 * expedition. In the evening you eat and drink; between days you build on the base. The city
 * remembers what you learned and what you plundered, so you see more of it day by day and the
 * supplies move further out.
 *
 * Like the rules engine, this is pure: every function returns a new campaign.
 */

/** The upgrades in the order the base shows them. */
export const upgradeIds: readonly UpgradeId[] = [
  'lookout',
  'workbench',
  'infirmary',
  'locker',
  'rainCollector',
  'garden',
]

/** What happened on one day, for the base screen. */
export interface DayReport {
  readonly day: number
  readonly outcome: Outcome
  /** Brought home today (nothing when the day was lost). */
  readonly food: number
  readonly water: number
  readonly materials: number
  readonly cardsFound: readonly CardId[]
  /** The evening meal: false means you went without. */
  readonly ate: boolean
  readonly drank: boolean
  /** Rain Collector and Garden overnight. */
  readonly producedFood: number
  readonly producedWater: number
  /** What happened with the Stray Dog today and tonight, if anything. */
  readonly dog?: 'joined' | 'died' | 'ate' | 'ranAway'
}

export interface CampaignState {
  readonly seed: number
  /** The day you are getting ready for (or, once over, the last day played). */
  readonly day: number
  readonly food: number
  readonly water: number
  readonly materials: number
  readonly upgrades: readonly UpgradeId[]
  /** Penalties for the next expedition, from the evening before. */
  readonly hungry: boolean
  readonly thirsty: boolean
  readonly wounds: number
  /** Days lost (killed or caught by the dark). */
  readonly losses: number
  /** The city: the same every day. Absent on the classic map without random cities. */
  readonly city?: City
  /** Buildings you have got to know on earlier days. */
  readonly known: readonly LocationId[]
  readonly searchesUsed: Readonly<Record<LocationId, number>>
  readonly burned: readonly LocationId[]
  /** Locker: a card found yesterday that goes with you today. */
  readonly locker?: CardId
  /** The Stray Dog, if it lives at the base. */
  readonly dog?: { readonly hp: number }
  readonly history: readonly DayReport[]
  /** survived: all days done. lost: one lost day too many. */
  readonly over?: 'survived' | 'lost'
}

/** Starts a campaign: the city is rolled once and kept for every day. */
export function newCampaign(
  seed: number,
  balance: Balance = defaultBalance,
  content: Content = defaultContent,
): CampaignState {
  const normalized = normalizeSeed(seed)
  const city = balance.randomCity
    ? rollCity(mapContent(content, balance.cityMap), normalized)[0]
    : undefined
  return {
    seed: normalized,
    day: 1,
    food: balance.campaign.startFood,
    water: balance.campaign.startWater,
    materials: 0,
    upgrades: [],
    hungry: false,
    thirsty: false,
    wounds: 0,
    losses: 0,
    ...(city ? { city } : {}),
    known: [],
    searchesUsed: {},
    burned: [],
    history: [],
  }
}

/** The seed of one day's expedition: different every day, the same for the same campaign. */
export function daySeed(campaign: CampaignState): number {
  return normalizeSeed(campaign.seed + campaign.day * 1_000_003)
}

/** The balance of today's expedition: going home, more zombies, the Infirmary. */
export function dayBalance(campaign: CampaignState, balance: Balance = defaultBalance): Balance {
  const c = balance.campaign
  const byDay = c.extraZombiesByDay
  const extra = byDay[Math.min(campaign.day, byDay.length) - 1] ?? 0
  const infirmary = campaign.upgrades.includes('infirmary') ? c.infirmaryHp : 0
  return {
    ...balance,
    packsToWin: c.packsToGoHome,
    extraStartZombies: balance.extraStartZombies + extra,
    maxHp: balance.maxHp + infirmary,
  }
}

/** Everything today's expedition starts from: the base's upgrades and yesterday's penalties. */
export function daySetup(
  campaign: CampaignState,
  balance: Balance = defaultBalance,
  content: Content = defaultContent,
): ExpeditionSetup {
  const c = balance.campaign
  const today = dayBalance(campaign, balance)
  const deck = starterDeck(balance)
  if (campaign.upgrades.includes('workbench')) {
    for (let i = 0; i < c.workbenchNerves; i++) {
      const at = deck.indexOf('nerves')
      if (at >= 0) deck.splice(at, 1)
    }
  }
  if (campaign.hungry) deck.push(...Array<CardId>(c.hungerNerves).fill('nerves'))
  deck.push(...Array<CardId>(campaign.wounds).fill(content.woundCard))
  if (campaign.locker) deck.push(campaign.locker)

  const startHp = Math.max(1, today.maxHp - (campaign.thirsty ? c.thirstHp : 0))
  return {
    campaignDay: campaign.day,
    startDeck: deck,
    startHp,
    ...(campaign.city ? { city: campaign.city } : {}),
    known: campaign.known,
    searchesUsed: campaign.searchesUsed,
    burned: campaign.burned,
    ...(campaign.dog ? { dog: campaign.dog } : {}),
    scouted: campaign.upgrades.includes('lookout')
      ? lookoutTargets(campaign, balance, content)
      : [],
  }
}

/**
 * Lookout: the buildings scouted before you set out. Unknown buildings that can still be
 * searched come first, so the Lookout shows you new parts of the city.
 */
function lookoutTargets(campaign: CampaignState, balance: Balance, content: Content): LocationId[] {
  const map = mapContent(content, balance.cityMap)
  const here = campaign.city ? contentForCity(campaign.city, map) : map
  const open = Object.values(here.locations)
    .filter((l) => l.kind === 'building')
    .map((l) => l.id)
    .filter(
      (id) =>
        !campaign.burned.includes(id) &&
        (campaign.searchesUsed[id] ?? 0) < balance.searchesPerBuilding,
    )
  const [order] = shuffle(open, daySeed(campaign))
  const unknown = order.filter((id) => !campaign.known.includes(id))
  const rest = order.filter((id) => campaign.known.includes(id))
  return [...unknown, ...rest].slice(0, balance.campaign.lookoutBuildings)
}

/**
 * The evening after an expedition: bring home what you found (or lose it), remember the city,
 * eat and drink, and let the base produce overnight. Then the next day starts, or the campaign
 * ends.
 */
export function finishDay(
  campaign: CampaignState,
  expedition: GameState,
  balance: Balance = defaultBalance,
  baseContent: Content = defaultContent,
): CampaignState {
  const result = expeditionResult(expedition, baseContent)
  if (!result) throw new Error('finishDay: the expedition is not over yet')
  if (campaign.over) throw new Error('finishDay: the campaign is over')
  const c = balance.campaign
  const content = cityContent(expedition, baseContent)
  const home = result.outcome.result === 'won'
  const brought = home ? result : { food: 0, water: 0, materials: 0 }

  // The city remembers: buildings you got to know, searches used, buildings burned.
  const buildings = Object.keys(expedition.sites)
  const known = [
    ...new Set([
      ...campaign.known,
      ...buildings.filter((id) => buildingKnown(expedition, content, id)),
    ]),
  ]
  // Overnight a plundered building gets some searches back.
  const searchesUsed: Record<LocationId, number> = {}
  for (const id of buildings) {
    const left = expedition.sites[id]?.searchesLeft ?? 0
    const used = Math.max(0, balance.searchesPerBuilding - left - c.searchesRegrowPerNight)
    if (used > 0) searchesUsed[id] = used
  }
  const burned = [
    ...new Set([...campaign.burned, ...buildings.filter((id) => expedition.sites[id]?.burned)]),
  ]

  // Evening: eat and drink.
  let food = campaign.food + brought.food
  let water = campaign.water + brought.water
  const ate = food >= c.foodPerNight
  const drank = water >= c.waterPerNight
  food = ate ? food - c.foodPerNight : 0
  water = drank ? water - c.waterPerNight : 0

  // The Stray Dog: it joined today, died today, or eats every few nights (or runs away).
  const d = balance.dog
  let dog = expedition.dog ? { hp: expedition.dog.hp } : undefined
  let dogNews: DayReport['dog']
  if (dog && !campaign.dog) dogNews = 'joined'
  if (!dog && campaign.dog) dogNews = 'died'
  if (dog && campaign.day % d.foodEvery === 0) {
    if (food >= 1) {
      food -= 1
      dogNews = dogNews ?? 'ate'
    } else {
      dog = undefined
      dogNews = 'ranAway'
    }
  }
  if (dog) dog = { hp: Math.min(d.hp, dog.hp + d.healPerNight) }

  // Night: the base produces every few nights.
  const producing = campaign.day % c.productionEvery === 0
  const producedFood = producing && campaign.upgrades.includes('garden') ? 1 : 0
  const producedWater = producing && campaign.upgrades.includes('rainCollector') ? 1 : 0

  const report: DayReport = {
    day: campaign.day,
    outcome: result.outcome,
    food: brought.food,
    water: brought.water,
    materials: brought.materials,
    cardsFound: home ? result.cardsFound : [],
    ate,
    drank,
    producedFood,
    producedWater,
    ...(dogNews ? { dog: dogNews } : {}),
  }
  const losses = campaign.losses + (home ? 0 : 1)
  const over: CampaignState['over'] =
    losses > c.lossesAllowed ? 'lost' : campaign.day >= c.days ? 'survived' : undefined
  const { locker: _yesterday, dog: _dog, ...rest } = campaign
  return {
    ...rest,
    ...(dog ? { dog } : {}),
    day: over ? campaign.day : campaign.day + 1,
    food: food + producedFood,
    water: water + producedWater,
    materials: campaign.materials + brought.materials,
    hungry: !ate,
    thirsty: !drank,
    wounds: home ? 0 : c.woundsAfterLoss,
    losses,
    known,
    searchesUsed,
    burned,
    history: [...campaign.history, report],
    ...(over ? { over } : {}),
  }
}

/** Can this upgrade be built now? The reason is shown on the base screen. */
export function validateBuild(
  campaign: CampaignState,
  id: UpgradeId,
  balance: Balance = defaultBalance,
): Validation {
  const r = texts.campaign.reasons
  if (campaign.over) return { ok: false, reason: r.over }
  if (campaign.upgrades.includes(id)) return { ok: false, reason: r.built }
  const cost = balance.campaign.upgradeCost[id]
  if (campaign.materials < cost) return { ok: false, reason: r.materials(cost, campaign.materials) }
  return { ok: true }
}

/** Builds an upgrade with materials. It works from the next expedition on. */
export function build(
  campaign: CampaignState,
  id: UpgradeId,
  balance: Balance = defaultBalance,
): CampaignState {
  const check = validateBuild(campaign, id, balance)
  if (!check.ok) throw new Error(`build: ${check.reason}`)
  return {
    ...campaign,
    materials: campaign.materials - balance.campaign.upgradeCost[id],
    upgrades: [...campaign.upgrades, id],
  }
}

/** Locker: the cards from yesterday you may keep for today (none without a Locker). */
export function lockerChoices(campaign: CampaignState): readonly CardId[] {
  if (!campaign.upgrades.includes('locker') || campaign.over) return []
  const yesterday = campaign.history.at(-1)
  return yesterday && yesterday.day === campaign.day - 1 ? [...new Set(yesterday.cardsFound)] : []
}

/** Locker: keep one of yesterday's finds for today, or none (undefined). */
export function chooseLocker(campaign: CampaignState, card: CardId | undefined): CampaignState {
  const { locker: _old, ...rest } = campaign
  if (card === undefined) return rest
  if (!lockerChoices(campaign).includes(card)) throw new Error(`chooseLocker: cannot keep ${card}`)
  return { ...rest, locker: card }
}
