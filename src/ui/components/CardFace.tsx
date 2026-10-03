import { texts } from '../../data/texts.en'
import type { CardId, Content, GameState } from '../../game'
import { isFollowUpActive, modeNoise, noisePreview } from '../../game'
import { cardText } from '../names'

interface CardFaceProps {
  readonly card: CardId
  readonly state: GameState
  readonly content: Content
  /** Show "Follow-up ready" when a mode would trigger its Follow-up now. */
  readonly showFollowUp?: boolean
}

/** Cost, name, noise, rules text and tags of a card. Used in the hand and in the find dialog. */
export function CardFace({ card, state, content, showFollowUp = false }: CardFaceProps) {
  const def = content.cards[card]
  const info = cardText(card)
  const firstMode = def?.modes[0]
  const noise = firstMode ? modeNoise(state, firstMode) : 0
  const followUpReady =
    showFollowUp && (def?.modes.some((m) => isFollowUpActive(state, m)) ?? false)

  return (
    <div className="card-face">
      <div className="card-head">
        <span className="cost" aria-label={texts.ui.cost(def?.cost ?? 0)}>
          {def?.kind === 'junk' ? '–' : (def?.cost ?? 0)}
        </span>
        <h3>{info.name}</h3>
        {noise > 0 && (
          <span className="noise">
            {texts.ui.noiseBadge(noise, noisePreview(state, noise).arrivals)}
          </span>
        )}
      </div>
      <p className="card-text">{info.text}</p>
      <p className="card-tags">
        {def?.tags.map((t) => texts.tags[t]).join(' · ')}
        {followUpReady && <span className="follow-up">{texts.ui.followUpActive}</span>}
      </p>
    </div>
  )
}
