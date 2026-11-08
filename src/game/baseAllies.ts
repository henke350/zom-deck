import type { AllyJob, Balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { nextFloat, normalizeSeed } from './rng'
import type { CardId, Content, Validation } from './types'

/**
 * Allies at the base (campaign only, the user's idea of 8 Nov 2026). Allies you bring home live
 * at the base. Each morning you choose who goes out with you (their card is in your start deck)
 * and who stays home to do a job (`balance.campaign.allies.jobs`). An ally knocked out by
 * zombies comes home wounded and must rest a day; lose the day and the allies with you are
 * gone. Every ally eats, and an ally without food leaves.
 */

export interface BaseAlly {
  readonly uid: string
  readonly card: CardId
  /** Chosen to go out today. */
  readonly going: boolean
  /** Knocked out yesterday: rests today (cannot go out, does no job). */
  readonly wounded: boolean
}

/** The part of a campaign this module needs (keeps it free of campaign.ts). */
interface WithAllies {
  readonly seed: number
  readonly day: number
  readonly over?: 'survived' | 'lost'
  readonly allies?: readonly BaseAlly[]
}

/** What happened with the allies today and tonight. */
export interface AllyNews {
  readonly joined: readonly CardId[]
  readonly wounded: readonly CardId[]
  readonly died: readonly CardId[]
  readonly left: readonly CardId[]
}

export function alliesOf(campaign: WithAllies): readonly BaseAlly[] {
  return campaign.allies ?? []
}

export function isAllyCard(content: Content, card: CardId): boolean {
  return content.cards[card]?.gear?.ally === true
}

/** Can this ally go out today (or stay home again)? */
export function validateToggleAlly(
  campaign: WithAllies,
  uid: string,
  balance: Balance,
): Validation {
  const r = texts.allies.reasons
  if (campaign.over) return { ok: false, reason: texts.campaign.reasons.over }
  const ally = alliesOf(campaign).find((a) => a.uid === uid)
  if (!ally) return { ok: false, reason: r.unknown }
  if (ally.going) return { ok: true }
  if (ally.wounded) return { ok: false, reason: r.wounded }
  const max = balance.campaign.allies.maxAlong
  if (alliesOf(campaign).filter((a) => a.going).length >= max) {
    return { ok: false, reason: r.full(max) }
  }
  return { ok: true }
}

/** Takes an ally along today, or leaves them home. */
export function toggleAlly<C extends WithAllies>(campaign: C, uid: string, balance: Balance): C {
  const check = validateToggleAlly(campaign, uid, balance)
  if (!check.ok) throw new Error(`toggleAlly: ${check.reason}`)
  return {
    ...campaign,
    allies: alliesOf(campaign).map((a) => (a.uid === uid ? { ...a, going: !a.going } : a)),
  }
}

/** The cards of the allies going out today. */
export function alongCards(campaign: WithAllies): CardId[] {
  return alliesOf(campaign)
    .filter((a) => a.going && !a.wounded)
    .map((a) => a.card)
}

/** The jobs done today by the allies who stay home (and are not resting). */
export function homeJobs(campaign: WithAllies, balance: Balance): AllyJob[] {
  return alliesOf(campaign).flatMap((a) => {
    const job = !a.going && !a.wounded ? balance.campaign.allies.jobs[a.card] : undefined
    return job ? [job] : []
  })
}

/** Today's expedition: what the allies at home add (Nurse and Scout). */
export function jobsForToday(
  campaign: WithAllies,
  balance: Balance,
): { hp: number; wounds: number; scout: number } {
  let hp = 0
  let wounds = 0
  let scout = 0
  for (const job of homeJobs(campaign, balance)) {
    if (job.kind === 'heal') {
      hp += job.hp
      wounds += job.wounds
    }
    if (job.kind === 'scout') scout += job.buildings
  }
  return { hp, wounds, scout }
}

/**
 * The evening: allies who rested are well again; allies knocked out today rest tomorrow; lose
 * the day and the allies with you are gone; allies found today move in (if you got home).
 */
export function alliesAfterDay(
  campaign: WithAllies,
  home: boolean,
  knockedOut: readonly CardId[],
  found: readonly CardId[],
): { allies: BaseAlly[]; news: AllyNews; nextUid: number } {
  const knocked = new Map<CardId, number>()
  for (const card of knockedOut) knocked.set(card, (knocked.get(card) ?? 0) + 1)
  const takeKnock = (card: CardId): boolean => {
    const n = knocked.get(card) ?? 0
    if (n <= 0) return false
    knocked.set(card, n - 1)
    return true
  }
  const wounded: CardId[] = []
  const died: CardId[] = []
  const allies: BaseAlly[] = []
  for (const a of alliesOf(campaign)) {
    if (a.wounded) {
      allies.push({ ...a, wounded: false, going: false })
      continue
    }
    if (!a.going) {
      allies.push(a)
      continue
    }
    if (!home) {
      died.push(a.card)
      continue
    }
    const hurt = takeKnock(a.card)
    if (hurt) wounded.push(a.card)
    allies.push({ ...a, wounded: hurt, going: hurt ? false : a.going })
  }
  let nextUid = maxUid(alliesOf(campaign)) + 1
  const joined = home ? [...found] : []
  for (const card of joined) {
    const hurt = takeKnock(card)
    if (hurt) wounded.push(card)
    allies.push({ uid: `a${nextUid++}`, card, going: false, wounded: hurt })
  }
  return { allies, news: { joined, wounded, died, left: [] }, nextUid }
}

function maxUid(allies: readonly BaseAlly[]): number {
  return allies.reduce((most, a) => Math.max(most, Number(a.uid.slice(1)) || 0), 0)
}

/** Every few nights each ally eats 1 food; an ally without food leaves in the morning. */
export function feedAllies(
  allies: readonly BaseAlly[],
  food: number,
  day: number,
  balance: Balance,
): { allies: BaseAlly[]; food: number; left: CardId[] } {
  if (day % balance.campaign.allies.foodEvery !== 0) return { allies: [...allies], food, left: [] }
  const kept: BaseAlly[] = []
  const left: CardId[] = []
  let stock = food
  for (const a of allies) {
    if (stock >= 1) {
      stock -= 1
      kept.push(a)
    } else left.push(a.card)
  }
  return { allies: kept, food: stock, left }
}

/** Tonight's jobs of the allies who stayed home today (Street Kid, Bouncer). */
export function nightJobs(
  campaign: WithAllies,
  balance: Balance,
): { food: number; materials: number; guard: boolean } {
  let food = 0
  let materials = 0
  let guard = false
  for (const job of homeJobs(campaign, balance)) {
    if (job.kind === 'forage' && campaign.day % job.every === 0) food += job.food
    if (job.kind === 'build') materials += job.materials
    if (job.kind === 'guard') guard = true
  }
  return { food, materials, guard }
}

/** Is there a night raid tonight? Its own random numbers, from the campaign seed and the day. */
export function raidTonight(campaign: WithAllies, balance: Balance): boolean {
  const [roll] = nextFloat(normalizeSeed((campaign.seed + campaign.day * 7919) ^ 0x7f4a7c15))
  return roll < balance.campaign.allies.raid.chance
}
