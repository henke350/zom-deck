import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { totalCount } from './deck'
import { applyAction } from './engine'
import { cardsIn, makeState, uidsIn } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'

function play(state: GameState, action: Action): GameState {
  return applyAction(state, action).state
}

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

describe('action points', () => {
  it('playing a card costs its AP', () => {
    const state = makeState({ hand: ['bandage'], hp: 5 })
    expect(play(state, { type: 'playCard', uid: 'h1' }).player.ap).toBe(balance.apPerTurn - 1)
  })

  it('refuses a card that costs more AP than you have', () => {
    const state = makeState({ hand: ['bandage'], ap: 0 })
    expect(reasonFor(state, { type: 'playCard', uid: 'h1' })).toBe(texts.reasons.notEnoughAp(1, 0))
  })

  it('allows 0-cost cards with 0 AP', () => {
    const state = makeState({ hand: ['adrenaline'], ap: 0 })
    expect(play(state, { type: 'playCard', uid: 'h1' }).player.ap).toBe(2)
  })

  it('resets AP at the start of the next turn', () => {
    const state = makeState({ hand: ['bandage'], draw: ['run', 'run', 'run', 'run', 'run'], hp: 5 })
    const after = play(play(state, { type: 'playCard', uid: 'h1' }), { type: 'endTurn' })
    expect(after.player.ap).toBe(balance.apPerTurn)
  })
})

describe('playing cards', () => {
  it('moves a played card to "in play", then to the discard pile at end of turn', () => {
    const state = makeState({
      hand: ['bandage', 'run'],
      draw: ['sneak', 'sneak', 'sneak', 'sneak', 'sneak'],
      hp: 5,
    })
    const played = play(state, { type: 'playCard', uid: 'h1' })
    expect(uidsIn(played.piles.inPlay)).toEqual(['h1'])
    expect(uidsIn(played.piles.hand)).toEqual(['h2'])
    const ended = play(played, { type: 'endTurn' })
    expect(ended.piles.inPlay).toHaveLength(0)
    expect(uidsIn(ended.piles.discard)).toEqual(expect.arrayContaining(['h1', 'h2']))
  })

  it('refuses junk cards', () => {
    const state = makeState({ hand: ['nerves', 'heavyLoad'] })
    expect(reasonFor(state, { type: 'playCard', uid: 'h1' })).toBe(texts.reasons.unplayable)
    expect(reasonFor(state, { type: 'playCard', uid: 'h2' })).toBe(texts.reasons.unplayable)
  })

  it('refuses cards that are not in hand and modes that do not exist', () => {
    const state = makeState({ hand: ['bandage'], draw: ['bandage'] })
    expect(reasonFor(state, { type: 'playCard', uid: 'd1' })).toBe(texts.reasons.notInHand)
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', mode: 2 })).toBe(
      texts.reasons.noSuchMode,
    )
  })

  it('refuses effects that are not built yet (map, search, zombies)', () => {
    const state = makeState({ hand: ['search', 'run', 'sneak', 'crowbar'] })
    for (const uid of ['h1', 'h2', 'h3', 'h4']) {
      expect(reasonFor(state, { type: 'playCard', uid })).toBe(texts.reasons.notBuiltYet)
    }
    // Crowbar's second mode (pry open) works already.
    expect(reasonFor(state, { type: 'playCard', uid: 'h4', mode: 1 })).toBeUndefined()
  })

  it('throws on an illegal action and never changes the input state', () => {
    const state = makeState({ hand: ['nerves'] })
    const before = structuredClone(state)
    expect(() => applyAction(state, { type: 'playCard', uid: 'h1' })).toThrow(/Illegal/)
    expect(state).toEqual(before)
  })

  it('does not mutate the input state on a legal action', () => {
    const state = makeState({ hand: ['painkillers', 'nerves'], draw: ['run'] })
    const before = structuredClone(state)
    applyAction(state, { type: 'playCard', uid: 'h1', target: { trash: 'h2' } })
    expect(state).toEqual(before)
  })
})

describe('health', () => {
  it('heals up to max health only', () => {
    const state = makeState({ hand: ['bandage'], hp: balance.maxHp - 1 })
    const result = applyAction(state, { type: 'playCard', uid: 'h1', mode: 1 })
    expect(result.state.player.hp).toBe(balance.maxHp)
    expect(result.events).toContainEqual({ type: 'healed', amount: 1 })
  })

  it('Adrenaline gives 2 AP and costs 1 health', () => {
    const next = play(makeState({ hand: ['adrenaline'], hp: 5 }), { type: 'playCard', uid: 'h1' })
    expect(next.player).toMatchObject({ ap: balance.apPerTurn + 2, hp: 4 })
  })

  it('ends the game at once when health reaches 0', () => {
    const result = applyAction(makeState({ hand: ['adrenaline', 'bandage'], hp: 1 }), {
      type: 'playCard',
      uid: 'h1',
    })
    expect(result.state.phase).toBe('gameOver')
    expect(result.state.outcome).toEqual({ result: 'lost', cause: 'killed' })
    expect(result.events.at(-1)).toEqual({
      type: 'gameOver',
      outcome: { result: 'lost', cause: 'killed' },
    })
    expect(reasonFor(result.state, { type: 'playCard', uid: 'h2' })).toBe(texts.reasons.gameOver)
  })
})

describe('Use up', () => {
  it('removes the card from the game instead of discarding it', () => {
    const state = makeState({ hand: ['bandage'], draw: ['run', 'run', 'run', 'run', 'run'], hp: 5 })
    const used = applyAction(state, { type: 'playCard', uid: 'h1', mode: 1 })
    expect(used.state.player.hp).toBe(8)
    expect(uidsIn(used.state.piles.removed)).toEqual(['h1'])
    expect(used.state.piles.inPlay).toHaveLength(0)
    expect(used.events).toContainEqual(
      expect.objectContaining({ type: 'cardPlayed', usedUp: true }),
    )
    const ended = play(used.state, { type: 'endTurn' })
    expect(uidsIn(ended.piles.discard)).not.toContain('h1')
    expect(totalCount(ended.piles)).toBe(totalCount(state.piles))
  })
})

describe('Follow-up', () => {
  it('only triggers after a card with the tag was played earlier this turn', () => {
    const state = makeState({
      hand: ['toolbox', 'toolbox', 'nerves', 'nerves'],
      draw: ['run', 'run'],
    })
    const first = applyAction(state, { type: 'playCard', uid: 'h1', target: { trash: 'h3' } })
    expect(first.events).toContainEqual(
      expect.objectContaining({ type: 'cardPlayed', followUp: false }),
    )
    expect(first.state.piles.hand).toHaveLength(2) // toolbox + nerves, nothing drawn

    const second = applyAction(first.state, {
      type: 'playCard',
      uid: 'h2',
      target: { trash: 'h4' },
    })
    expect(second.events).toContainEqual(
      expect.objectContaining({ type: 'cardPlayed', followUp: true }),
    )
    expect(cardsIn(second.state.piles.hand)).toEqual(['run']) // trashed nerves, drew 1
    expect(cardsIn(second.state.piles.removed)).toEqual(['nerves', 'nerves'])
  })

  it('uses the tags of different cards (Flashlight is a Tool)', () => {
    const state = makeState({ hand: ['flashlight', 'toolbox', 'nerves'], draw: ['run'] })
    const lit = play(state, { type: 'playCard', uid: 'h1' })
    expect(lit.tagsPlayedThisTurn).toEqual(expect.arrayContaining(['tool', 'quiet']))
    const boxed = applyAction(lit, { type: 'playCard', uid: 'h2', target: { trash: 'h3' } })
    expect(boxed.events).toContainEqual(expect.objectContaining({ type: 'cardsDrawn' }))
  })

  it('forgets tags when the turn ends', () => {
    const state = makeState({
      hand: ['flashlight'],
      draw: ['toolbox', 'nerves', 'run', 'run', 'run'],
    })
    const next = play(play(state, { type: 'playCard', uid: 'h1' }), { type: 'endTurn' })
    expect(next.tagsPlayedThisTurn).toEqual([])
  })

  it('Kevlar Vest blocks 3 instead of 2 after a Weapon', () => {
    const plain = play(makeState({ hand: ['kevlarVest'] }), { type: 'playCard', uid: 'h1' })
    expect(plain.player.block).toBe(2)
    const armed = play(makeState({ hand: ['kevlarVest'], tags: ['weapon'] }), {
      type: 'playCard',
      uid: 'h1',
    })
    expect(armed.player.block).toBe(3)
  })
})

describe('trashing', () => {
  const state = makeState({
    hand: ['toolbox', 'painkillers', 'heavyLoad', 'nerves', 'search'],
    draw: ['run'],
  })

  it('needs a target in hand that is not the card itself', () => {
    expect(reasonFor(state, { type: 'playCard', uid: 'h1' })).toBe(texts.reasons.chooseTrash)
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { trash: 'h1' } })).toBe(
      texts.reasons.trashSelf,
    )
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { trash: 'd1' } })).toBe(
      texts.reasons.trashNotInHand,
    )
  })

  it('can never trash Heavy Load', () => {
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { trash: 'h3' } })).toBe(
      texts.reasons.notTrashable,
    )
  })

  it('Painkillers only trash junk, then draw', () => {
    expect(reasonFor(state, { type: 'playCard', uid: 'h2', target: { trash: 'h5' } })).toBe(
      texts.reasons.trashJunkOnly,
    )
    const next = play(state, { type: 'playCard', uid: 'h2', target: { trash: 'h4' } })
    expect(cardsIn(next.piles.removed)).toEqual(['nerves'])
    expect(cardsIn(next.piles.hand)).toContain('run')
  })

  it('Toolbox can trash any trashable card', () => {
    const next = play(state, { type: 'playCard', uid: 'h1', target: { trash: 'h5' } })
    expect(cardsIn(next.piles.removed)).toEqual(['search'])
    expect(totalCount(next.piles)).toBe(totalCount(state.piles))
  })
})

describe('Travel Light', () => {
  const tenCards = ['travelLight', 'run', 'run', 'run', 'run'] as const
  const fillers = ['sneak', 'sneak', 'sneak', 'sneak', 'sneak']

  it('works when you own 10 or fewer cards', () => {
    const state = makeState({ hand: [...tenCards], draw: fillers })
    const next = play(state, { type: 'playCard', uid: 'h1' })
    expect(next.player.ap).toBe(balance.apPerTurn + 1)
    expect(next.piles.hand).toHaveLength(5)
  })

  it('is refused when you own more than 10 cards', () => {
    const state = makeState({ hand: [...tenCards], draw: [...fillers, 'sneak'] })
    expect(reasonFor(state, { type: 'playCard', uid: 'h1' })).toBe(
      texts.reasons.ownedTooMany(10, 11),
    )
  })
})

describe('temporary effects', () => {
  it('search bonus and block add up and reset when the turn ends', () => {
    const state = makeState({
      hand: ['crowbar', 'flashlight', 'kevlarVest'],
      draw: ['run', 'run', 'run', 'run', 'run'],
    })
    let next = play(state, { type: 'playCard', uid: 'h1', mode: 1 })
    next = play(next, { type: 'playCard', uid: 'h2' })
    next = play(next, { type: 'playCard', uid: 'h3' })
    // Tags belong to the card, not the mode: the prying Crowbar is still a Tool
    // and a Weapon. Flashlight follows the Tool (+1 search, draws a card) and
    // Kevlar Vest follows the Weapon (blocks 3 instead of 2).
    expect(next.player.searchBonus).toBe(2)
    expect(next.player.block).toBe(3)
    const ended = play(next, { type: 'endTurn' })
    expect(ended.player).toMatchObject({ searchBonus: 0, block: 0 })
  })
})

describe('ending the turn', () => {
  const draw = ['run', 'run', 'run', 'run', 'run', 'run']

  it('discards the hand and draws a new one', () => {
    const state = makeState({ hand: ['sneak', 'sneak'], draw })
    const next = play(state, { type: 'endTurn' })
    expect(next.turn).toBe(2)
    expect(cardsIn(next.piles.hand)).toEqual(['run', 'run', 'run', 'run', 'run'])
    expect(cardsIn(next.piles.discard)).toEqual(['sneak', 'sneak'])
  })

  it('keeps one chosen card and draws up to a full hand', () => {
    const state = makeState({ hand: ['bandage', 'sneak'], draw })
    const next = play(state, { type: 'endTurn', keep: ['h1'] })
    expect(next.piles.hand).toHaveLength(balance.handSize)
    expect(uidsIn(next.piles.hand)[0]).toBe('h1')
    expect(uidsIn(next.piles.discard)).toEqual(['h2'])
  })

  it('refuses to keep too many cards or cards outside the hand', () => {
    const state = makeState({ hand: ['bandage', 'sneak'], draw })
    expect(reasonFor(state, { type: 'endTurn', keep: ['h1', 'h2'] })).toBe(
      texts.reasons.keepTooMany(1),
    )
    expect(reasonFor(state, { type: 'endTurn', keep: ['d1'] })).toBe(texts.reasons.keepNotInHand)
  })

  it('ends the expedition in darkness after the last turn', () => {
    const state = makeState({ hand: ['sneak'], draw, turn: balance.turnLimit })
    const result = applyAction(state, { type: 'endTurn' })
    expect(result.state.phase).toBe('gameOver')
    expect(result.state.outcome).toEqual({ result: 'lost', cause: 'darkness' })
    expect(result.state.turn).toBe(balance.turnLimit)
  })

  it('lets you end the turn even with nothing useful to do', () => {
    const state = makeState({ hand: ['nerves', 'heavyLoad', 'search'], ap: 0, draw })
    expect(validate(state, { type: 'endTurn' }).ok).toBe(true)
  })
})
