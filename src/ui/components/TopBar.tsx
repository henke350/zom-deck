import { texts } from '../../data/texts.en'
import type { GameState } from '../../game'

interface StatProps {
  readonly label: string
  readonly value: string
  readonly tone?: 'danger' | 'warn' | 'good'
  readonly hint?: string
}

function Stat({ label, value, tone, hint }: StatProps) {
  return (
    <div className={`stat${tone ? ` stat-${tone}` : ''}`} title={hint}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  )
}

export function TopBar({ state }: { state: GameState }) {
  const { player, balance, piles, turn } = state
  const dusk = turn >= balance.duskFromTurn
  const lowHp = player.hp <= Math.ceil(balance.maxHp / 3)
  const ui = texts.ui

  return (
    <header className="topbar" aria-label="Status">
      <Stat
        label={ui.health}
        value={`${player.hp}/${balance.maxHp}`}
        tone={lowHp ? 'danger' : undefined}
      />
      <Stat label={ui.ap} value={`${player.ap}/${balance.apPerTurn}`} />
      <Stat
        label={dusk ? `${ui.turn} · ${ui.dusk}` : ui.turn}
        value={`${turn}/${balance.turnLimit}`}
        tone={dusk ? 'warn' : undefined}
      />
      <Stat
        label={ui.packs}
        value={`${player.packs}/${balance.packsToWin}`}
        tone={player.packs >= balance.packsToWin ? 'good' : undefined}
        hint={ui.starsHint(balance.starThresholds)}
      />
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
      <span className="seed">
        {ui.seed} {state.seed}
      </span>
    </header>
  )
}
