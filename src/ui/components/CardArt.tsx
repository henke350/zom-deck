import type { CardId } from '../../game'
import { cardIcons } from '../cardIcons'
import { cardImages } from '../cardImages'

/**
 * Card illustration: the picture from `src/assets/cards/<card id>.*` if there is one,
 * otherwise a game-icons.net icon (see `cardIcons.ts` for the licence).
 * Purely decorative: the card name and text carry the meaning, so the art is
 * hidden from screen readers. Cards with neither show nothing.
 */
export function CardArt({ card }: { readonly card: CardId }) {
  const image = cardImages[card]
  if (image) {
    return <img className="card-art card-art-image" src={image} alt="" loading="lazy" />
  }
  const icon = cardIcons[card]
  if (!icon) return null
  return (
    <svg className="card-art" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  )
}
