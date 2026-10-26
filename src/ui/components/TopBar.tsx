import { texts } from '../../data/texts.en'
import type { GameState } from '../../game'
import { dangerLevel, noiseThreshold, packsCarried } from '../../game'

interface StatProps {
  readonly label: string
  readonly value: string
  readonly tone?: 'danger' | 'warn' | 'good'
  readonly hint?: string
  /** A small note next to the value (what comes next). */
  readonly note?: string
}

function Stat({ label, value, tone, hint, note }: StatProps) {
  return (
    <div className={`stat${tone ? ` stat-${tone}` : ''}`} title={hint}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {value}
        {note && <small className="stat-note"> {note}</small>}
      </span>
    </div>
  )
}

export function TopBar({ state, onShowRules }: { state: GameState; onShowRules: () => void }) {
  const { player, balance, piles, turn } = state
  const dusk = turn >= balance.duskFromTurn
  const lowHp = player.hp <= Math.ceil(balance.maxHp / 3)
  const ui = texts.ui
  const threshold = noiseThreshold(state)
  // What raises danger next: a pack, or the next few finds.
  const every = balance.danger.perFindsTaken
  const dangerNote =
    state.danger < balance.danger.levels.length && every > 0
      ? ui.dangerNext(
          every - (state.stats.cardsTaken.length % every),
          player.packs < balance.danger.calmPacks,
        )
      : undefined
  const extraFinds = dangerLevel(state).extraFinds
  // Campaign: the day, and what the packs you carry are (food or water).
  const day = state.campaignDay
  const { food, water } = packsCarried(state)
  const c = texts.campaign

  return (
    <header className="topbar" aria-label="Status">
      {day !== undefined && <Stat label={c.dayStat} value={`${day}/${balance.campaign.days}`} />}
      <Stat
        label={ui.health}
        value={`${player.hp}/${balance.maxHp}`}
        tone={lowHp ? 'danger' : undefined}
      />
      <Stat label={ui.ap} value={`${player.ap}/${balance.apPerTurn}`} />
      <Stat
        label={ui.noiseLabel}
        value={`${state.noise}/${threshold}`}
        tone={state.noise >= threshold - 1 ? 'warn' : undefined}
      />
      {balance.danger.enabled && (
        <Stat
          label={extraFinds > 0 ? ui.dangerBonus(extraFinds) : ui.dangerLabel}
          value={`${state.danger}/${balance.danger.levels.length}`}
          note={dangerNote}
          tone={
            state.danger >= balance.danger.levels.length
              ? 'danger'
              : state.danger > 1
                ? 'warn'
                : undefined
          }
        />
      )}
      <Stat
        label={dusk ? `${ui.turn} · ${ui.dusk}` : ui.turn}
        value={`${turn}/${balance.turnLimit}`}
        tone={dusk ? 'warn' : undefined}
      />
      {day !== undefined ? (
        <Stat
          label={`${c.stock.food} · ${c.stock.water}`}
          value={`${food} · ${water}`}
          tone={food > 0 && water > 0 ? 'good' : undefined}
        />
      ) : (
        <Stat
          label={ui.packs}
          value={`${player.packs}/${balance.packsToWin}`}
          tone={player.packs >= balance.packsToWin ? 'good' : undefined}
          hint={ui.starsHint(balance.starThresholds)}
        />
      )}
      <div className="piles" aria-label="Deck">
        <span>
          {ui.drawPile} <b>{piles.draw.length}</b>
        </span>
        <span>
          {ui.discardPile} <b>{piles.discard.length}</b>
        </span>
        <span>
          {ui.removedPile} <b>{piles.removed.length}</b>
        </span>
      </div>
      {day === undefined && (
        <span className="seed">
          {ui.seed} {state.seed}
        </span>
      )}
      <button type="button" className="btn btn-quiet btn-small" onClick={onShowRules}>
        {texts.rules.short}
      </button>
    </header>
  )
}
