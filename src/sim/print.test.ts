import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { d6Table, printDecks, renderPrintAndPlay } from './print'

describe('print and play', () => {
  it('splits the six faces of a die by weight, every option at least one face', () => {
    const table = d6Table([
      { value: 'walker', weight: 3 },
      { value: 'brute', weight: 1 },
    ])
    expect(table).toEqual([
      { value: 'walker', from: 1, to: 5 },
      { value: 'brute', from: 6, to: 6 },
    ])
    const even = d6Table([1, 2, 3].map((value) => ({ value, weight: 1 })))
    expect(even.map((r) => [r.from, r.to])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
    const many = d6Table([5, 1, 1, 1, 1].map((weight, value) => ({ value, weight })))
    expect(many.reduce((n, r) => n + r.to - r.from + 1, 0)).toBe(6)
    expect(many.every((r) => r.to >= r.from)).toBe(true)
  })

  it('prints the start deck and one find deck per building, with weights as copies', () => {
    const cards = printDecks(defaultContent, balance)
    const start = cards.filter((c) => c.deck === 'start')
    expect(start).toHaveLength(Object.values(balance.starterDeck).reduce((a, b) => a + b, 0))
    const workshop = cards.filter((c) => c.deck === 'workshop').map((c) => c.card)
    const pool = defaultContent.locations.workshop?.lootPool ?? []
    for (const entry of pool) {
      const copies = defaultContent.cards[entry.card]?.rare ? 0 : entry.weight
      expect(workshop.filter((c) => c === entry.card)).toHaveLength(copies)
    }
    const rare = cards.filter((c) => c.deck === 'rare').map((c) => c.card)
    expect(rare.sort()).toEqual(
      Object.values(defaultContent.cards)
        .filter((c) => c.rare)
        .map((c) => c.id)
        .sort(),
    )
    expect(cards.some((c) => c.deck !== 'rare' && defaultContent.cards[c.card]?.rare)).toBe(false)
  })

  it('renders one page with every building, card and the danger table', () => {
    const html = renderPrintAndPlay(defaultContent, balance, { cards: {}, locations: {} })
    expect(html).toContain('Police Station deck')
    expect(html).toContain('Gas Station')
    expect(html).toContain('Danger: what noise brings')
    expect(html.match(/class="card front/g)).toHaveLength(
      printDecks(defaultContent, balance).length,
    )
    expect(html).toContain('class="card back')
  })

  it('can leave out the card backs for opaque sleeves, but keeps the tile backs', () => {
    const images = { cards: {}, locations: {} }
    const html = renderPrintAndPlay(defaultContent, balance, images, { cardBacks: false })
    expect(html).not.toContain('class="card back')
    expect(html).toContain('class="tile back')
  })
})
