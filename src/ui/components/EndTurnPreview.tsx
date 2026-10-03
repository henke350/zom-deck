import { texts } from '../../data/texts.en'
import type { EndTurnPreview as Preview } from '../../game'

/** What ending the turn will do: followers, attacks and dusk noise. */
export function EndTurnPreview({ preview }: { preview: Preview }) {
  const p = texts.ui.preview
  const lines = [
    preview.followers > 0 ? p.followers(preview.followers) : '',
    preview.lethal
      ? p.lethal
      : preview.attackers > 0
        ? p.attack(preview.attackers, preview.damage, preview.blocked)
        : p.safe,
    preview.wound && !preview.lethal ? p.wound : '',
    preview.duskNoise > 0 ? p.dusk(preview.duskNoise, preview.duskArrivals) : '',
  ].filter(Boolean)
  const tone = preview.lethal ? 'danger' : preview.attackers > 0 ? 'warn' : 'safe'
  return (
    <p id="end-turn-preview" className={`preview preview-${tone}`}>
      {lines.join(' ')}
    </p>
  )
}
