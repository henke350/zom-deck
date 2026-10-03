import { texts } from '../../data/texts.en'
import type { Action, CardInstance, Content, GameState, ModeOption } from '../../game'
import { cardText } from '../names'
import { CardFace } from './CardFace'

export interface PendingPlay {
  readonly uid: string
  readonly mode: number
  readonly kind: 'location' | 'trash' | 'zombie'
  readonly options: ModeOption
}

interface HandProps {
  readonly state: GameState
  readonly content: Content
  readonly optionsByUid: ReadonlyMap<string, readonly ModeOption[]>
  readonly pending: PendingPlay | null
  /** While a card or a service waits for a card to trash: the action for each card you can pick. */
  readonly trashTargets: ReadonlyMap<string, Action> | null
  readonly keepUid: string | null
  readonly onPlay: (uid: string, option: ModeOption) => void
  readonly onTrash: (uid: string) => void
  readonly onToggleKeep: (uid: string) => void
}

export function Hand(props: HandProps) {
  const { state } = props
  return (
    <ul className="hand" aria-label={texts.ui.hand}>
      {state.piles.hand.map((card) => (
        <CardView key={card.uid} card={card} {...props} />
      ))}
    </ul>
  )
}

function CardView({
  card,
  state,
  content,
  optionsByUid,
  pending,
  trashTargets,
  keepUid,
  onPlay,
  onTrash,
  onToggleKeep,
}: HandProps & { card: CardInstance }) {
  const def = content.cards[card.card]
  const info = cardText(card.card)
  const options = optionsByUid.get(card.uid) ?? []
  const isPendingCard = pending?.uid === card.uid
  const trashTarget = trashTargets?.has(card.uid) ?? false
  // A card or service is waiting for a choice: other buttons are off until it is made or cancelled.
  const choosing = pending !== null || trashTargets !== null
  const reasons = [
    ...new Set(
      options.flatMap((o) => {
        if (!o.reason) return []
        // On two-way cards, say which option the reason is about.
        const prefix = options.length > 1 ? `${info.modes?.[o.mode] ?? ''}: ` : ''
        return [`${prefix}${o.reason}`]
      }),
    ),
  ]
  const kept = keepUid === card.uid

  const classes = [
    'card',
    def?.kind === 'junk' && 'card-junk',
    isPendingCard && 'card-pending',
    trashTarget && 'card-target',
    kept && 'card-kept',
  ]
    .filter(Boolean)
    .join(' ')

  const label = (option: ModeOption) =>
    options.length > 1
      ? (info.modes?.[option.mode] ?? texts.ui.playMode(option.mode + 1))
      : texts.ui.play

  return (
    <li className={classes} data-card={card.card}>
      <CardFace card={card.card} state={state} content={content} showFollowUp />

      <div className="card-actions">
        {trashTargets ? (
          trashTarget && (
            <button type="button" className="btn btn-danger" onClick={() => onTrash(card.uid)}>
              {texts.ui.trash}
            </button>
          )
        ) : (
          <>
            {options
              .filter((o) => def && def.modes.length > 0 && o.mode < def.modes.length)
              .map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  className="btn"
                  disabled={option.actions.length === 0 || choosing}
                  onClick={() => onPlay(card.uid, option)}
                >
                  {label(option)}
                </button>
              ))}
            <button
              type="button"
              className="btn btn-quiet"
              aria-pressed={kept}
              disabled={choosing}
              onClick={() => onToggleKeep(card.uid)}
            >
              {kept ? texts.ui.keeping : texts.ui.keep}
            </button>
          </>
        )}
      </div>
      {reasons.length > 0 && !choosing && <p className="reason">{reasons.join(' ')}</p>}
    </li>
  )
}
