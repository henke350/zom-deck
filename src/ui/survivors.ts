import type { Survivor } from '../data/balance'
import { texts } from '../data/texts.en'
import { cardText } from './names'

/** What a survivor changes, one line each, built from the balance numbers. */
export function survivorLines(survivor: Survivor): string[] {
  const t = texts.survivors
  const lines = survivor.swaps.map((s) => t.swap(cardText(s.to).name, cardText(s.from).name))
  if (survivor.maxHp) lines.push(t.maxHp(survivor.maxHp))
  if (survivor.healBonus) lines.push(t.heal(survivor.healBonus))
  if (survivor.scout) lines.push(t.scout(survivor.scout))
  if (survivor.gearBonus) lines.push(t.gear(survivor.gearBonus))
  return lines.length > 0 ? lines : [t.noChange]
}
