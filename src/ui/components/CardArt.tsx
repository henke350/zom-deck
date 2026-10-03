import type { ReactElement } from 'react'
import type { CardId } from '../../game'

/**
 * Card illustrations: small inline SVGs in one shared style (flat shapes, heavy
 * ink outlines, one amber accent). Colours come from the theme tokens, so they
 * work in light and dark mode. Purely decorative: the card name and text carry
 * the meaning, so the art is hidden from screen readers.
 */
const art: Partial<Record<CardId, ReactElement>> = {
  // A supply crate with a magnifying glass over it.
  search: (
    <>
      <path className="art-ground" d="M0 84h200" />
      <path className="art-fill" d="M38 44h72v40H38z" />
      <path className="art-lid" d="M32 34h84v12H32z" />
      <path className="art-line" d="M38 58h72M38 70h72" />
      <circle className="art-glass" cx="138" cy="44" r="22" />
      <path className="art-shine" d="M126 34a16 16 0 0 1 12-6" />
      <path className="art-handle" d="M154 60l22 24" />
    </>
  ),
  // A crowbar leaning across a plank, with the claw end up.
  crowbar: (
    <>
      <path className="art-ground" d="M0 84h200" />
      <path className="art-fill" d="M20 70h160v14H20z" />
      <path className="art-line" d="M60 70v14M120 70v14" />
      <path className="art-bar" d="M52 78L146 26" />
      <path className="art-bar" d="M146 26c10-6 22-2 26 8" />
      <path className="art-bar" d="M52 78c-8 4-14 0-16-6" />
      <circle className="art-nail" cx="170" cy="72" r="2.5" />
    </>
  ),
  // A running figure with speed lines behind it.
  run: (
    <>
      <path className="art-ground" d="M0 84h200" />
      <path className="art-speed" d="M20 40h38M10 54h42M24 68h34" />
      <circle className="art-head" cx="112" cy="26" r="9" />
      <path className="art-body" d="M106 38l-14 22 14 6" />
      <path className="art-body" d="M106 38l12 18 18 2" />
      <path className="art-body" d="M106 38l-4-8-16 4" />
      <path className="art-body" d="M118 56l-12 14-20 6" />
      <path className="art-body" d="M118 56l16 8 8 14" />
    </>
  ),
}

/** The illustration for a card, or nothing if the card has none yet. */
export function CardArt({ card }: { readonly card: CardId }) {
  const drawing = art[card]
  if (!drawing) return null
  return (
    <svg className="card-art" viewBox="0 0 200 100" aria-hidden="true" focusable="false">
      {drawing}
    </svg>
  )
}
