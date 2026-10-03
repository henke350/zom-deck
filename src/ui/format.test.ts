import { describe, expect, it } from 'vitest'
import { texts } from '../data/texts.en'
import { makeState } from '../game/testkit'
import { formatEvent } from './format'

describe('formatEvent', () => {
  const state = makeState({ hand: ['bandage'] })

  it('names cards and places in English', () => {
    expect(
      formatEvent({ type: 'moved', from: 'shelter', to: 'police', by: 'run', apCost: 0 }, state),
    ).toBe('You go to Police Station with Run.')
    expect(
      formatEvent(
        { type: 'cardPlayed', uid: 'h1', card: 'bandage', mode: 1, followUp: false, usedUp: true },
        state,
      ),
    ).toBe('You play Bandage and use it up.')
  })

  it('mentions the AP cost of a heavy free move', () => {
    expect(
      formatEvent({ type: 'moved', from: 'shelter', to: 'street', by: 'free', apCost: 1 }, state),
    ).toBe('You go to Street (1 AP).')
  })

  it('looks up kept cards by uid', () => {
    expect(formatEvent({ type: 'cardsKept', uids: ['h1'] }, state)).toBe(
      texts.log.cardsKept('Bandage'),
    )
  })

  it('describes the outcome', () => {
    expect(
      formatEvent({ type: 'gameOver', outcome: { result: 'lost', cause: 'darkness' } }, state),
    ).toBe(texts.ui.outcomeTitle.darkness)
  })
})
