import type { Content } from '../game/types'
import { cards } from './cards'
import { connections, locations, startLocation } from './locations'

/** The game's content. Tests and the campaign can pass their own. */
export const defaultContent: Content = {
  cards,
  locations,
  connections,
  startLocation,
  packCard: 'heavyLoad',
  woundCard: 'wound',
}
