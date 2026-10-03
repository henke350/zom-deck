import { describe, expect, it } from 'vitest'
import { balance } from './balance'
import { cards, starterCardIds } from './cards'
import type { CardDef } from '../game/types'
import { texts } from './texts.en'

const all = Object.entries(cards)

describe('card catalog', () => {
  it('uses the key as the card id', () => {
    for (const [key, def] of all) expect(def.id).toBe(key)
  })

  it('has a name and rules text for every card, and no text without a card', () => {
    expect(Object.keys(texts.cards).sort()).toEqual(Object.keys(cards).sort())
    for (const entry of Object.values(texts.cards)) {
      expect(entry.name.length).toBeGreaterThan(0)
      expect(entry.text.length).toBeGreaterThan(0)
    }
  })

  it('labels every option of cards that can be played in more than one way', () => {
    const entries: Readonly<
      Record<string, { readonly name: string; readonly modes?: readonly string[] }>
    > = texts.cards
    for (const [id, def] of all) {
      const modes = entries[id]?.modes
      if (def.modes.length > 1) expect(modes).toHaveLength(def.modes.length)
      else expect(modes).toBeUndefined()
    }
  })

  it('makes junk unplayable and every other card playable', () => {
    for (const [, def] of all) {
      if (def.kind === 'junk') expect(def.modes).toHaveLength(0)
      else expect(def.modes.length).toBeGreaterThan(0)
      for (const mode of def.modes) expect(mode.effects.length).toBeGreaterThan(0)
    }
  })

  it('has whole, non-negative costs', () => {
    for (const [, def] of all) {
      expect(Number.isInteger(def.cost)).toBe(true)
      expect(def.cost).toBeGreaterThanOrEqual(0)
    }
  })

  it('builds the starter deck from known cards', () => {
    for (const id of Object.keys(balance.starterDeck)) expect(cards).toHaveProperty(id)
  })

  it('only searches as the last effect, because the game then waits for a choice', () => {
    const defs: readonly CardDef[] = Object.values(cards)
    for (const def of defs) {
      for (const mode of def.modes) {
        for (const effects of [mode.effects, mode.followUp?.effects ?? []]) {
          const at = effects.findIndex((e) => e.kind === 'search')
          if (at >= 0) expect(at).toBe(effects.length - 1)
        }
      }
    }
  })

  it('has 16 find cards', () => {
    const starters = new Set<string>(starterCardIds)
    const finds = all.filter(([id, def]) => def.kind === 'action' && !starters.has(id))
    expect(finds).toHaveLength(16)
  })

  it('makes Heavy Load impossible to trash and slow to carry', () => {
    expect(cards.heavyLoad.trashable).toBe(false)
    expect(cards.heavyLoad.freeMoveCostWhileInHand).toBe(1)
  })
})
