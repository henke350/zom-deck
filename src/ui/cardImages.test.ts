import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { cardImages } from './cardImages'

describe('card images', () => {
  it('has an illustration for every card', () => {
    const missing = Object.keys(defaultContent.cards).filter((id) => !cardImages[id])
    expect(missing).toEqual([])
  })

  it('loads the illustrations for the three new weapons by card ID', () => {
    for (const id of ['machineGun', 'bazooka', 'leafBlower']) {
      expect(cardImages[id], id).toBeTruthy()
    }
  })
})
