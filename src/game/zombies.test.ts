import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { applyAction } from './engine'
import { newGame } from './setup'
import { cardsIn, makeState, type StateSpec } from './testkit'
import type { Action, GameEvent, GameState } from './types'
import { validate } from './validate'
import { addNoise, noisePreview, previewEndTurn, zombieInfo, zombiesAt } from './zombies'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']

function play(state: GameState, action: Action): GameState {
  return applyAction(state, action).state
}

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

function types(events: readonly GameEvent[]): string[] {
  return events.map((e) => e.type)
}

describe('starting zombies', () => {
  it('are rolled inside each building’s range and nowhere else (500 seeds)', () => {
    const seen: Record<string, Set<number>> = {}
    for (let seed = 1; seed <= 500; seed++) {
      const state = newGame(seed)
      for (const loc of Object.values(defaultContent.locations)) {
        const count = zombiesAt(state, loc.id).length
        if (!loc.startZombies) {
          expect(count).toBe(0)
          continue
        }
        expect(count).toBeGreaterThanOrEqual(loc.startZombies.min)
        expect(count).toBeLessThanOrEqual(loc.startZombies.max)
        ;(seen[loc.id] ??= new Set()).add(count)
      }
      for (const z of state.zombies) {
        expect(z).toMatchObject({ hp: balance.zombie.hp, alerted: false, neutralized: false })
      }
    }
    expect([...(seen.houseA ?? [])].sort()).toEqual([0, 1])
    expect([...(seen.police ?? [])].sort()).toEqual([2, 3])
  })

  it('can be raised for every building with the extra start zombies knob', () => {
    const more = { ...balance, extraStartZombies: 1 }
    for (let seed = 1; seed <= 100; seed++) {
      const state = newGame(seed, { balance: more })
      expect(zombiesAt(state, 'police').length).toBeGreaterThanOrEqual(3)
      expect(zombiesAt(state, 'houseA').length).toBeGreaterThanOrEqual(1)
      expect(zombiesAt(state, 'street')).toHaveLength(0)
    }
    const state = makeState({ balance: more })
    expect(zombieInfo(state, defaultContent, 'police')).toEqual({ known: false, min: 3, max: 4 })
  })

  it('are only a range until you visit or scout the building', () => {
    const state = makeState({ zombies: [{ at: 'pharmacy' }] })
    expect(zombieInfo(state, defaultContent, 'pharmacy')).toEqual({ known: false, min: 1, max: 2 })
    const visited = { ...state, visited: [...state.visited, 'pharmacy'] }
    expect(zombieInfo(visited, defaultContent, 'pharmacy')).toEqual({ known: true, count: 1 })
    const open = { ...state, balance: { ...balance, hiddenDanger: false } }
    expect(zombieInfo(open, defaultContent, 'pharmacy')).toEqual({ known: true, count: 1 })
    expect(zombieInfo(state, defaultContent, 'street')).toEqual({ known: true, count: 0 })
  })
})

describe('noticing', () => {
  it('zombies notice you when you walk in', () => {
    const state = makeState({ zombies: [{ at: 'houseA', alerted: false }] })
    const next = play(state, { type: 'freeMove', to: 'houseA' })
    expect(next.zombies[0]?.alerted).toBe(true)
    expect(next.visited).toContain('houseA')
  })

  it('Soft Soles: zombies where you arrive don’t notice you and don’t attack', () => {
    const state = makeState({
      hand: ['softSoles'],
      draw,
      zombies: [{ at: 'houseA', alerted: false }],
    })
    const moved = play(state, { type: 'playCard', uid: 'h1', target: { location: 'houseA' } })
    expect(moved.zombies[0]).toMatchObject({ alerted: false, neutralized: true })
    const ended = play(moved, { type: 'endTurn' })
    expect(ended.player.hp).toBe(balance.maxHp)
    // Next turn it notices you, because you are still there.
    expect(ended.zombies[0]).toMatchObject({ alerted: true, neutralized: false })
  })
})

describe('noise', () => {
  it('a search makes noise after you choose, not before', () => {
    const state = makeState({ location: 'workshop', hand: ['search'] })
    const searched = play(state, { type: 'playCard', uid: 'h1' })
    expect(searched.noise).toBe(0)
    expect(play(searched, { type: 'declineFind' }).noise).toBe(balance.searchNoise)
  })

  it('Lockpick searches without noise', () => {
    const state = makeState({ location: 'workshop', hand: ['lockpick'] })
    const done = play(play(state, { type: 'playCard', uid: 'h1' }), { type: 'declineFind' })
    expect(done.noise).toBe(0)
  })

  it('brings a zombie to you at the threshold and keeps the overflow', () => {
    const state = makeState({
      location: 'street',
      hand: ['pistol'],
      noise: 3,
      zombies: [{ at: 'street' }],
    })
    const result = applyAction(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(result.state.noise).toBe(1)
    expect(result.state.zombies).toHaveLength(1) // z1 died, z2 arrived
    expect(result.state.zombies[0]).toMatchObject({ uid: 'z2', location: 'street', alerted: true })
    expect(types(result.events)).toEqual([
      'cardPlayed',
      'zombieHit',
      'zombieKilled',
      'noiseAdded',
      'zombieArrived',
    ])
  })

  it('brings one zombie for every full threshold', () => {
    const state = makeState({ location: 'street', noise: 3 })
    const events: GameEvent[] = []
    const next = addNoise(state, 5, defaultContent, 'noise', events)
    expect(next.noise).toBe(0)
    expect(zombiesAt(next, 'street')).toHaveLength(2)
    expect(noisePreview(state, 5)).toEqual({ before: 3, after: 0, arrivals: 2 })
  })

  it('sends zombies to the street instead of into the Shelter', () => {
    const state = makeState({ noise: 3 })
    const next = addNoise(state, 1, defaultContent, 'noise', [])
    expect(next.zombies[0]).toMatchObject({ location: 'street', alerted: false })
  })

  it('new zombies only attack in the zombie phase', () => {
    const state = makeState({ location: 'workshop', hand: ['search'], noise: 3, draw })
    const chosen = play(play(state, { type: 'playCard', uid: 'h1' }), { type: 'declineFind' })
    expect(chosen.zombies).toHaveLength(1)
    expect(chosen.player.hp).toBe(balance.maxHp)
    expect(play(chosen, { type: 'endTurn' }).player.hp).toBe(balance.maxHp - balance.zombie.damage)
  })
})

describe('zombie phase', () => {
  const endTurn = (spec: StateSpec) =>
    applyAction(makeState({ draw, ...spec }), { type: 'endTurn' })

  it('zombies at your location attack', () => {
    const { state, events } = endTurn({
      location: 'houseA',
      zombies: [{ at: 'houseA' }, { at: 'houseA' }],
    })
    expect(state.player.hp).toBe(balance.maxHp - 2 * balance.zombie.damage)
    expect(types(events).slice(0, 3)).toEqual(['zombieAttacked', 'zombieAttacked', 'hpLost'])
  })

  it('zombies that have seen you follow one step, then attack', () => {
    const { state, events } = endTurn({
      location: 'street',
      zombies: [{ at: 'houseA', alerted: true }],
    })
    expect(state.zombies[0]?.location).toBe('street')
    expect(state.player.hp).toBe(balance.maxHp - balance.zombie.damage)
    expect(types(events).slice(0, 2)).toEqual(['zombieFollowed', 'zombieAttacked'])
  })

  it('zombies two steps away lose track and stay', () => {
    const { state, events } = endTurn({
      location: 'pharmacy',
      zombies: [{ at: 'houseA', alerted: true }],
    })
    expect(state.zombies[0]).toMatchObject({ location: 'houseA', alerted: false })
    expect(state.player.hp).toBe(balance.maxHp)
    expect(types(events)).toContain('zombieLostTrack')
  })

  it('zombies that have not seen you stay put', () => {
    const { state } = endTurn({ location: 'street', zombies: [{ at: 'houseA', alerted: false }] })
    expect(state.zombies[0]?.location).toBe('houseA')
  })

  it('you shake them off by moving two steps in one turn', () => {
    let state = makeState({ location: 'houseA', hand: ['run'], draw, zombies: [{ at: 'houseA' }] })
    state = play(state, { type: 'freeMove', to: 'street' })
    state = play(state, { type: 'playCard', uid: 'h1', target: { location: 'pharmacy' } })
    const ended = play(state, { type: 'endTurn' })
    expect(ended.player.hp).toBe(balance.maxHp)
    expect(ended.zombies[0]).toMatchObject({ location: 'houseA', alerted: false })
  })

  it('zombies can’t follow you into the Shelter', () => {
    const { state } = endTurn({ location: 'shelter', zombies: [{ at: 'street', alerted: true }] })
    expect(state.zombies[0]).toMatchObject({ location: 'street', alerted: false })
    expect(state.player.hp).toBe(balance.maxHp)
  })

  it('"gentle" zombies follow but attack only next turn; "off" zombies stay', () => {
    const spec = { location: 'street', zombies: [{ at: 'houseA', alerted: true }] }
    const gentle = endTurn({ ...spec, balance: { ...balance, zombieFollow: 'gentle' } }).state
    expect(gentle.zombies[0]?.location).toBe('street')
    expect(gentle.player.hp).toBe(balance.maxHp)
    const off = endTurn({ ...spec, balance: { ...balance, zombieFollow: 'off' } }).state
    expect(off.zombies[0]?.location).toBe('houseA')
  })

  it('Kevlar Vest blocks damage', () => {
    let state = makeState({
      location: 'police',
      hand: ['kevlarVest'],
      draw,
      zombies: [{ at: 'police' }, { at: 'police' }, { at: 'police' }],
    })
    state = play(state, { type: 'playCard', uid: 'h1' })
    const result = applyAction(state, { type: 'endTurn' })
    expect(result.state.player.hp).toBe(balance.maxHp - 1)
    expect(result.events).toContainEqual({ type: 'damageBlocked', amount: 2 })
  })

  it('kills you before dusk and darkness are checked', () => {
    const { state } = endTurn({
      location: 'houseA',
      hp: 1,
      turn: balance.turnLimit,
      zombies: [{ at: 'houseA' }],
    })
    expect(state.outcome).toEqual({ result: 'lost', cause: 'killed' })
  })

  it('adds dusk noise after the attacks from the dusk turn on', () => {
    const before = endTurn({ location: 'houseA', turn: balance.duskFromTurn - 1 })
    expect(before.state.noise).toBe(0)
    const dusk = endTurn({ location: 'houseA', turn: balance.duskFromTurn, noise: 3 })
    expect(dusk.state.zombies).toHaveLength(1)
    expect(dusk.state.player.hp).toBe(balance.maxHp) // it arrived after the attacks
    expect(dusk.events).toContainEqual(
      expect.objectContaining({ type: 'zombieArrived', reason: 'dusk' }),
    )
  })
})

describe('combat cards', () => {
  const here = (hand: string[], zombies: StateSpec['zombies'] = [{ at: 'police' }]) =>
    makeState({ location: 'police', hand, draw, zombies })

  it('need a zombie at your location', () => {
    const state = makeState({
      location: 'police',
      hand: ['axe', 'molotov'],
      zombies: [{ at: 'workshop' }],
    })
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })).toBe(
      texts.reasons.noZombiesHere,
    )
    expect(reasonFor(state, { type: 'playCard', uid: 'h2' })).toBe(texts.reasons.noZombiesHere)
    const crowded = here(['axe'])
    expect(reasonFor(crowded, { type: 'playCard', uid: 'h1' })).toBe(texts.reasons.chooseZombie)
    expect(reasonFor(crowded, { type: 'playCard', uid: 'h1', target: { zombie: 'z9' } })).toBe(
      texts.reasons.zombieNotHere,
    )
  })

  it('Crowbar wounds, a second hit kills', () => {
    let state = here(['crowbar', 'crowbar'])
    state = play(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(state.zombies[0]?.hp).toBe(1)
    state = play(state, { type: 'playCard', uid: 'h2', target: { zombie: 'z1' } })
    expect(state.zombies).toHaveLength(0)
  })

  it('Axe kills a fresh zombie, and Baseball Bat then Axe clears two', () => {
    let state = here(['baseballBat', 'axe'], [{ at: 'police', hp: 1 }, { at: 'police' }])
    state = play(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    state = play(state, { type: 'playCard', uid: 'h2', target: { zombie: 'z2' } })
    expect(state.zombies).toHaveLength(0)
    expect(state.piles.hand).toHaveLength(1) // the Bat drew a card
  })

  it('Molotov hits every zombie here, burns the building and makes noise', () => {
    const state = here(['molotov', 'search'], [{ at: 'police' }, { at: 'police', hp: 3 }])
    const next = play(state, { type: 'playCard', uid: 'h1' })
    expect(next.zombies).toEqual([expect.objectContaining({ uid: 'z2', hp: 1 })])
    expect(next.sites.police).toMatchObject({ burned: true, searchesLeft: 0 })
    expect(next.noise).toBe(2)
    expect(cardsIn(next.piles.removed)).toEqual(['molotov'])
    expect(reasonFor(next, { type: 'playCard', uid: 'h2' })).toBe(texts.reasons.burned)
  })

  it('Sneak stops one zombie; the other still attacks', () => {
    let state = here(['sneak'], [{ at: 'police' }, { at: 'police' }])
    state = play(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(state.zombies[0]).toMatchObject({ neutralized: true, alerted: false })
    expect(play(state, { type: 'endTurn' }).player.hp).toBe(balance.maxHp - 1)
  })

  it('Alarm Clock stops every zombie here and is used up', () => {
    let state = here(['alarmClock'], [{ at: 'police' }, { at: 'police' }])
    state = play(state, { type: 'playCard', uid: 'h1' })
    expect(cardsIn(state.piles.removed)).toEqual(['alarmClock'])
    expect(play(state, { type: 'endTurn' }).player.hp).toBe(balance.maxHp)
  })
})

describe('District Map', () => {
  it('scouts one building within 2 steps', () => {
    const state = makeState({ hand: ['districtMap'], zombies: [{ at: 'pharmacy' }] })
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { location: 'police' } })).toBe(
      texts.reasons.tooFarToScout(2),
    )
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { location: 'street' } })).toBe(
      texts.reasons.notABuildingToScout,
    )
    const next = play(state, { type: 'playCard', uid: 'h1', target: { location: 'pharmacy' } })
    expect(next.sites.pharmacy?.scouted).toBe(true)
    expect(zombieInfo(next, defaultContent, 'pharmacy')).toEqual({ known: true, count: 1 })
  })

  it('can be used up to scout every building', () => {
    const next = play(makeState({ hand: ['districtMap'] }), {
      type: 'playCard',
      uid: 'h1',
      mode: 1,
    })
    expect(Object.values(next.sites).every((s) => s.scouted)).toBe(true)
    expect(cardsIn(next.piles.removed)).toEqual(['districtMap'])
  })
})

describe('search in peace', () => {
  it('gives +1 find only when no zombies are here', () => {
    const crowded = makeState({ location: 'police', zombies: [{ at: 'police' }] })
    expect(play(crowded, { type: 'quickSearch' }).pendingFind?.options).toHaveLength(
      balance.quickSearch.options,
    )
    const quiet = makeState({ location: 'police' })
    expect(play(quiet, { type: 'quickSearch' }).pendingFind?.options).toHaveLength(
      balance.quickSearch.options + balance.peacefulSearchBonus,
    )
  })
})

describe('end-turn preview', () => {
  const cases: [string, StateSpec][] = [
    ['nobody here', { location: 'houseA' }],
    ['two attackers', { location: 'houseA', zombies: [{ at: 'houseA' }, { at: 'houseA' }] }],
    ['a follower', { location: 'street', zombies: [{ at: 'houseA', alerted: true }] }],
    ['lethal', { location: 'police', hp: 2, zombies: [{ at: 'police' }, { at: 'police' }] }],
    ['dusk', { location: 'houseA', turn: balance.duskFromTurn, noise: 3 }],
  ]

  it.each(cases)('matches what really happens: %s', (_name, spec) => {
    const state = makeState({ draw, ...spec })
    const preview = previewEndTurn(state, defaultContent)
    const result = applyAction(state, { type: 'endTurn' })
    expect(preview.lethal).toBe(result.state.outcome?.cause === 'killed')
    if (!preview.lethal) expect(result.state.player.hp).toBe(state.player.hp - preview.damage)
    const arrivals = result.events.filter((e) => e.type === 'zombieArrived').length
    expect(preview.duskArrivals).toBe(preview.lethal ? preview.duskArrivals : arrivals)
  })

  it('counts followers, attackers and blocked damage', () => {
    const state = makeState({
      location: 'street',
      zombies: [{ at: 'houseA', alerted: true }, { at: 'street' }],
    })
    const blocked = { ...state, player: { ...state.player, block: 1 } }
    expect(previewEndTurn(blocked, defaultContent)).toMatchObject({
      followers: 1,
      attackers: 2,
      damage: 1,
      blocked: 1,
      lethal: false,
    })
  })
})
