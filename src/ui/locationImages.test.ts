import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { locationImages } from './locationImages'

/** Buildings added after the illustrations were made. They show without a picture until art arrives. */
const awaitingArt = ['gasStation', 'school', 'hospital']

describe('location images', () => {
  it('has an illustration for every place, except the ones still waiting for art', () => {
    const all = [
      ...Object.keys(defaultContent.locations),
      ...Object.keys(defaultContent.extraBuildings ?? {}),
    ]
    const missing = all.filter((id) => !locationImages[id])
    expect(missing.sort()).toEqual([...awaitingArt].sort())
  })
})
