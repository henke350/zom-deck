import type { CardId } from '../../game'
import { cardIcons } from '../cardIcons'

/**
 * Card illustration: a game-icons.net icon (see `cardIcons.ts` for the licence).
 * It is drawn in the theme's ink colour, so it works in light and dark mode.
 * Purely decorative: the card name and text carry the meaning, so the art is
 * hidden from screen readers. Cards without an icon yet show nothing.
 */
export function CardArt({ card }: { readonly card: CardId }) {
  const icon = cardIcons[card]
  if (!icon) return null
  return (
    <svg className="card-art" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  )
}
