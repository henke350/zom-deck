import { useEffect } from 'react'
import type { Balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import type { Content } from '../../game'

/** How long the banner stays before it closes by itself. */
const SHOW_MS = 6000

/**
 * A short notice when the danger meter rises: what changed at the new level. Like moving the
 * marker on a board game's danger track, so the ramp-up is felt, not just logged.
 */
export function DangerBanner({
  level,
  balance,
  content,
  onClose,
}: {
  level: number
  balance: Balance
  content: Content
  onClose: () => void
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, SHOW_MS)
    return () => window.clearTimeout(timer)
  }, [level, onClose])

  const b = texts.ui.dangerBanner
  const levels = balance.danger.levels
  const now = levels[level - 1]
  const before = levels[level - 2]
  const lines: string[] = []
  if (now) {
    const tougher = now.zombieHpBonus - (before?.zombieHpBonus ?? 0)
    if (tougher > 0) lines.push(b.tougher(tougher))
    lines.push(b.noise(now.noiseThreshold, now.arrivals))
    if (now.extraFinds > (before?.extraFinds ?? 0)) lines.push(b.finds(now.extraFinds))
  }
  const byDanger = content.arrivals?.byDanger ?? []
  const kindsBefore = new Set((byDanger[level - 2] ?? []).map((m) => m.kind))
  const newKinds = (byDanger[level - 1] ?? [])
    .map((m) => m.kind)
    .filter((k) => !kindsBefore.has(k))
    .map((k) => `${texts.zombieKinds[k].name}s`)
  if (newKinds.length > 0) lines.push(b.newKinds(newKinds.join(', ')))

  return (
    <div className="danger-banner" role="status" onClick={onClose}>
      <b>{b.title(level)}</b> <span>{b.intro}</span>
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <button type="button" className="btn btn-small" onClick={onClose}>
        {b.close}
      </button>
    </div>
  )
}
