import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { locationImages } from './locationImages'

/** Buildings added after the illustrations were made. They show without a picture until art arrives. */
const awaitingArt = ['apartments', 'church', 'sportsShop', 'square']

describe('location images', () => {
  it('has an illustration for every place, except the ones still waiting for art', () => {
    const all = [
      ...Object.keys(defaultContent.locations),
      ...Object.keys(defaultContent.extraBuildings ?? {}),
      'square',
    ]
    const missing = all.filter((id) => !locationImages[id])
    expect(missing.sort()).toEqual([...awaitingArt].sort())
  })
})
