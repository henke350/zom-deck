import type { CardId } from '../../game'
import { cardImages } from '../cardImages'

/**
 * Card illustration: the picture from `src/assets/cards/<card id>.*`, or nothing if
 * the card has none. Purely decorative: the card name and text carry the meaning,
 * so the art is hidden from screen readers.
 */
export function CardArt({ card }: { readonly card: CardId }) {
  const image = cardImages[card]
  if (!image) return null
  return <img className="card-art" src={image} alt="" loading="lazy" />
}
