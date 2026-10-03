import { texts } from '../../data/texts.en'
import type { CardInstance, Content, GameState, ModeOption } from '../../game'
import { isFollowUpActive, modeNoise } from '../../game'
import { cardText } from '../names'

export interface PendingPlay {
  readonly uid: string
  readonly mode: number
  readonly kind: 'location' | 'trash'
  readonly options: ModeOption
}

interface HandProps {
  readonly state: GameState
  readonly content: Content
  readonly optionsByUid: ReadonlyMap<string, readonly ModeOption[]>
  readonly pending: PendingPlay | null
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
  keepUid,
  onPlay,
  onTrash,
  onToggleKeep,
}: HandProps & { card: CardInstance }) {
  const def = content.cards[card.card]
  const info = cardText(card.card)
  const options = optionsByUid.get(card.uid) ?? []
  const firstMode = def?.modes[0]
  const noise = firstMode ? modeNoise(state, firstMode) : 0
  const followUpReady = def?.modes.some((m) => isFollowUpActive(state, m)) ?? false
  const isPendingCard = pending?.uid === card.uid
  const trashTarget =
    pending?.kind === 'trash' &&
    pending.options.actions.some((action) => action.target?.trash === card.uid)
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
      <div className="card-face">
        <div className="card-head">
          <span className="cost" aria-label={texts.ui.cost(def?.cost ?? 0)}>
            {def?.kind === 'junk' ? '–' : (def?.cost ?? 0)}
          </span>
          <h3>{info.name}</h3>
          {noise > 0 && <span className="noise">{texts.ui.noise(noise)}</span>}
        </div>
        <p className="card-text">{info.text}</p>
        <p className="card-tags">
          {def?.tags.map((t) => texts.tags[t]).join(' · ')}
          {followUpReady && <span className="follow-up">{texts.ui.followUpActive}</span>}
        </p>
      </div>

      <div className="card-actions">
        {pending?.kind === 'trash' ? (
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
                  disabled={option.actions.length === 0 || pending !== null}
                  onClick={() => onPlay(card.uid, option)}
                >
                  {label(option)}
                </button>
              ))}
            <button
              type="button"
              className="btn btn-quiet"
              aria-pressed={kept}
              disabled={pending !== null}
              onClick={() => onToggleKeep(card.uid)}
            >
              {kept ? texts.ui.keeping : texts.ui.keep}
            </button>
          </>
        )}
      </div>
      {reasons.length > 0 && pending === null && <p className="reason">{reasons.join(' ')}</p>}
    </li>
  )
}
