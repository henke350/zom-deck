import type { Content } from '../game/types'
import { cards } from './cards'

/** The game's content. Tests and the campaign can pass their own. */
export const defaultContent: Content = { cards }
