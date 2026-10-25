import type { Balance, ZombieKind } from '../data/balance'
import { texts } from '../data/texts.en'
import type { CardDef, CardId, Content, LocationDef, LocationId, ZombieMix } from '../game/types'

/**
 * Print-and-play: the game as cards, tiles, tokens and a board, built from the same data as
 * the browser game, so the paper version always matches it. `npm run print` writes one HTML
 * file that prints on A4 (fronts, then mirrored backs for double-sided printing).
 *
 * Paper rules that differ from the screen:
 * - Weighted random picks become d6 tables (`d6Table`).
 * - A building's find weights become copies in its own find deck.
 * - Rare finds only come from locked stashes (one card cannot be "a quarter as likely").
 * - A building's zombies are rolled when you first enter or scout it.
 */

/** Art as data URIs, keyed by card or location id. Missing art gets a plain panel. */
export interface PrintImages {
  readonly cards: Readonly<Record<string, string>>
  readonly locations: Readonly<Record<string, string>>
}

export interface D6Row<T> {
  readonly value: T
  readonly from: number
  readonly to: number
}

/**
 * Splits the six faces of a die between weighted options (largest remainder, every option
 * gets at least one face). Options beyond six are dropped, lightest first.
 */
export function d6Table<T>(options: readonly { value: T; weight: number }[]): D6Row<T>[] {
  const used = [...options]
    .filter((o) => o.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6)
  if (used.length === 0) return []
  const total = used.reduce((sum, o) => sum + o.weight, 0)
  const exact = used.map((o) => (o.weight / total) * 6)
  const faces = exact.map((x) => Math.max(1, Math.floor(x)))
  const byRemainder = exact
    .map((x, i) => ({ i, rest: x - Math.floor(x) }))
    .sort((a, b) => b.rest - a.rest)
  for (let k = 0; faces.reduce((s, f) => s + f, 0) < 6; k++) {
    const pick = byRemainder[k % byRemainder.length]
    if (pick) faces[pick.i] = (faces[pick.i] ?? 0) + 1
  }
  while (faces.reduce((s, f) => s + f, 0) > 6) {
    const i = faces.indexOf(Math.max(...faces))
    faces[i] = (faces[i] ?? 1) - 1
  }
  // Keep the original order of the options on the die.
  const order = options.map((o) => used.indexOf(o as (typeof used)[number])).filter((i) => i >= 0)
  let from = 1
  return order.map((i) => {
    const row = { value: used[i]!.value, from, to: from + (faces[i] ?? 0) - 1 }
    from = row.to + 1
    return row
  })
}

export function d6Range(row: D6Row<unknown>): string {
  return row.from === row.to ? `${row.from}` : `${row.from}–${row.to}`
}

/** One printed card, with the deck it belongs to (drives the colour and the back). */
export interface PrintCard {
  readonly card: CardId
  readonly deck: string
}

/** Every card to print: the start deck, one find deck per building, the rare deck and junk. */
export function printDecks(content: Content, balance: Balance): PrintCard[] {
  const out: PrintCard[] = []
  for (const [card, count] of Object.entries(balance.starterDeck)) {
    for (let i = 0; i < count; i++) out.push({ card, deck: 'start' })
  }
  for (const building of buildings(content)) {
    for (const entry of building.lootPool ?? []) {
      if (content.cards[entry.card]?.rare) continue
      for (let i = 0; i < entry.weight; i++) out.push({ card: entry.card, deck: building.id })
    }
  }
  for (const entry of content.bodyLoot ?? []) {
    if (content.cards[entry.card]?.rare) continue
    for (let i = 0; i < entry.weight; i++) out.push({ card: entry.card, deck: 'body' })
  }
  for (const card of Object.values(content.cards).filter((c) => c.rare)) {
    out.push({ card: card.id, deck: 'rare' })
  }
  for (let i = 0; i < balance.packsOnMap * balance.heavyLoadPerPack; i++) {
    out.push({ card: content.packCard, deck: 'junk' })
  }
  for (let i = 0; i < 4; i++) out.push({ card: content.woundCard, deck: 'junk' })
  return out
}

/** Every building a city can use, classic slots first. */
function buildings(content: Content): Omit<LocationDef, 'mapPos'>[] {
  const classic = Object.values(content.locations).filter((l) => l.kind === 'building')
  return [...classic, ...Object.values(content.extraBuildings ?? {})]
}

const kindName = (k: ZombieKind) => texts.zombieKinds[k].name
const kindShort = (k: ZombieKind) => texts.zombieKinds[k].short
const locName = (id: LocationId) =>
  (texts.locations as Record<string, { name: string } | undefined>)[id]?.name ?? id
const cardInfo = (id: CardId) =>
  (texts.cards as Record<string, { name: string; text: string } | undefined>)[id] ?? {
    name: id,
    text: '',
  }

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Zombie tokens: enough for the worst start in the most crowded city plus arrivals. */
export const zombieTokens: Readonly<Record<ZombieKind, number>> = {
  walker: 12,
  runner: 6,
  brute: 4,
  screamer: 4,
}

const DECK_COLORS = [
  '#7a4f2a',
  '#2f4f7a',
  '#5a7a2f',
  '#7a2f5a',
  '#2f7a6e',
  '#7a6a2f',
  '#4a2f7a',
  '#7a3a2f',
  '#2f6a7a',
  '#5f5f5f',
]

function deckColor(deck: string, content: Content): string {
  if (deck === 'start') return '#2a7462'
  if (deck === 'rare') return '#b8860b'
  if (deck === 'junk') return '#555555'
  if (deck === 'body') return '#8a2f2a'
  const i = buildings(content).findIndex((b) => b.id === deck)
  return DECK_COLORS[i % DECK_COLORS.length] ?? '#444'
}

function deckLabel(deck: string): string {
  if (deck === 'start') return 'Start deck'
  if (deck === 'rare') return 'Rare find'
  if (deck === 'junk') return 'Junk'
  if (deck === 'body') return 'Body finds'
  return `${locName(deck)} finds`
}

function cardFront(pc: PrintCard, content: Content, images: PrintImages): string {
  const def: CardDef | undefined = content.cards[pc.card]
  const info = cardInfo(pc.card)
  const color = deckColor(pc.deck, content)
  const art = images.cards[pc.card]
  const tags = (def?.tags ?? []).map((t) => texts.tags[t]).join(' · ')
  const cost = def && def.kind === 'action' ? `<div class="cost">${def.cost}</div>` : ''
  return `<div class="card front${def?.rare ? ' rare' : ''}" style="--deck:${color}">
  <div class="card-head">${cost}<div class="card-name">${esc(info.name)}</div></div>
  <div class="card-art">${art ? `<div class="art" style="background-image:var(--art-card-${pc.card})"></div>` : `<div class="no-art">${esc(info.name[0] ?? '?')}</div>`}</div>
  ${tags ? `<div class="card-tags">${esc(tags)}</div>` : '<div class="card-tags">&nbsp;</div>'}
  <div class="card-text">${esc(info.text)}</div>
  <div class="card-foot">${esc(deckLabel(pc.deck))}${def?.rare ? ' ★' : ''}</div>
</div>`
}

function cardBack(pc: PrintCard, content: Content): string {
  const color = deckColor(pc.deck, content)
  return `<div class="card back" style="--deck:${color}">
  <div class="back-title">One More<br>Building</div>
  <div class="back-deck">${esc(deckLabel(pc.deck))}</div>
</div>`
}

/** Pages of `perPage` items, each followed by its mirrored back page (long-edge duplex). */
function sheets<T>(
  items: readonly T[],
  cols: number,
  perPage: number,
  front: (item: T) => string,
  back: ((item: T) => string) | undefined,
  pageClass: string,
  title: string,
): string {
  const pages: string[] = []
  for (let p = 0; p * perPage < items.length; p++) {
    const chunk = items.slice(p * perPage, (p + 1) * perPage)
    pages.push(
      `<section class="page ${pageClass}"><div class="page-label">${esc(title)} · front ${p + 1}</div><div class="grid" style="--cols:${cols}">${chunk.map(front).join('')}</div></section>`,
    )
    if (back) {
      const rows: string[] = []
      for (let r = 0; r * cols < chunk.length; r++) {
        const row = chunk.slice(r * cols, (r + 1) * cols).map(back)
        while (row.length < cols) row.push('<div class="blank"></div>')
        rows.push(...row.reverse())
      }
      pages.push(
        `<section class="page ${pageClass}"><div class="page-label">${esc(title)} · back ${p + 1} (mirrored for double-sided printing)</div><div class="grid" style="--cols:${cols}">${rows.join('')}</div></section>`,
      )
    }
  }
  return pages.join('\n')
}

function countTable(def: Omit<LocationDef, 'mapPos'>, balance: Balance): string {
  const z = def.startZombies
  if (!z) return ''
  const extra = balance.extraStartZombies
  const counts: { value: number; weight: number }[] = []
  for (let n = z.min + extra; n <= z.max + extra; n++) counts.push({ value: n, weight: 1 })
  const countRows = d6Table(counts)
    .map((r) => `${d6Range(r)}: ${r.value}`)
    .join(' · ')
  const kindRows = d6Table((z.kinds ?? []).map((m) => ({ value: m.kind, weight: m.weight })))
    .map((r) => `${d6Range(r)} ${kindShort(r.value)}`)
    .join(' · ')
  const fixed = z.min === z.max
  const range = fixed ? `${z.min + extra}` : `${z.min + extra}–${z.max + extra}`
  return `<div class="tile-row"><b>Zombies ${range}</b> (roll on entering)</div>
  ${fixed ? '' : `<div class="tile-row">How many: ${countRows}</div>`}
  <div class="tile-row">Each one: ${kindRows || '1–6 W'}</div>`
}

function tileFront(
  def: Omit<LocationDef, 'mapPos'>,
  balance: Balance,
  images: PrintImages,
): string {
  const art = images.locations[def.id]
  const service = def.service
    ? `<div class="tile-row"><b>${esc(texts.services[def.service.id].name)}</b> (${balance.locationServiceCost} AP): ${esc(texts.services[def.service.id].text)}</div>`
    : ''
  const pack = def.alwaysHasPack
    ? '<div class="tile-row"><b>Always has a supply pack.</b></div>'
    : ''
  return `<div class="tile front">
  <div class="tile-art">${art ? `<div class="art" style="background-image:var(--art-loc-${def.id})"></div>` : ''}<div class="tile-name">${esc(locName(def.id))}</div></div>
  <div class="tile-body">
    ${countTable(def, balance)}
    <div class="tile-row">Finds: <b>${esc(locName(def.id))} deck</b> · ${balance.searchesPerBuilding} searches</div>
    ${service}${pack}
  </div>
</div>`
}

function tileBack(content: Content, balance: Balance): string {
  const ranges = buildings(content).flatMap((b) => (b.startZombies ? [b.startZombies] : []))
  const min = Math.min(...ranges.map((r) => r.min)) + balance.extraStartZombies
  const max = Math.max(...ranges.map((r) => r.max)) + balance.extraStartZombies
  return `<div class="tile back"><div class="back-title">Unknown</div><div class="back-deck">${min}–${max} zombies?</div></div>`
}

function zombieToken(kind: ZombieKind, balance: Balance, alerted: boolean): string {
  const s = balance.zombies[kind]
  const follow = s.followSteps === 0 ? 'never follows' : `follows ${s.followSteps}`
  const extra = s.screamNoise > 0 ? `+${s.screamNoise} noise` : `${s.damage} dmg`
  return `<div class="token zombie z-${kind}${alerted ? ' alerted' : ''}">
  <div class="z-letter">${kindShort(kind)}</div>
  <div class="z-name">${esc(kindName(kind))}</div>
  <div class="z-stats">${s.hp} hp · ${extra}</div>
  <div class="z-stats">${alerted ? 'HAS SEEN YOU' : follow}</div>
</div>`
}

function simpleToken(label: string, sub: string, cls: string): string {
  return `<div class="token ${cls}"><div class="t-label">${esc(label)}</div><div class="t-sub">${esc(sub)}</div></div>`
}

interface TokenSpec {
  readonly front: string
  readonly back: string
}

function tokenSpecs(content: Content, balance: Balance): TokenSpec[] {
  const out: TokenSpec[] = []
  for (const kind of Object.keys(zombieTokens) as ZombieKind[]) {
    for (let i = 0; i < zombieTokens[kind]; i++) {
      out.push({ front: zombieToken(kind, balance, false), back: zombieToken(kind, balance, true) })
    }
  }
  const slots = Object.values(content.locations).filter((l) => l.kind === 'building').length
  const fixedPacks = buildings(content).filter((b) => b.alwaysHasPack).length
  const randomPacks = balance.packsOnMap - fixedPacks
  const packBack = simpleToken('?', 'pack?', 't-hidden')
  for (let i = 0; i < randomPacks; i++) {
    out.push({ front: simpleToken('PACK', 'supply pack', 't-pack'), back: packBack })
  }
  for (let i = 0; i < slots - fixedPacks - randomPacks; i++) {
    out.push({ front: simpleToken('—', 'nothing', 't-empty'), back: packBack })
  }
  const stashBack = simpleToken('?', 'stash?', 't-hidden')
  for (let i = 0; i < balance.stashesOnMap; i++) {
    out.push({ front: simpleToken('STASH', 'locked', 't-stash'), back: stashBack })
  }
  for (let i = 0; i < slots - balance.stashesOnMap; i++) {
    out.push({ front: simpleToken('—', 'no stash', 't-empty'), back: stashBack })
  }
  const plain = (label: string, sub: string, cls: string, n: number) => {
    for (let i = 0; i < n; i++) out.push({ front: simpleToken(label, sub, cls), back: '' })
  }
  plain('S', 'searched', 't-search', slots * balance.searchesPerBuilding)
  plain('1', 'damage', 't-damage', 12)
  plain('B', 'block', 't-block', 4)
  plain('X', 'burned', 't-burned', 2)
  plain('+1', 'find', 't-bonus', 2)
  return out
}

function tokenPages(content: Content, balance: Balance): string {
  const specs = tokenSpecs(content, balance)
  const cols = 8
  const perPage = 80
  return sheets(
    specs,
    cols,
    perPage,
    (t) => t.front,
    (t) => t.back || '<div class="token t-blankback"></div>',
    'tokens',
    'Tokens',
  )
}

// Board: the classic map's slots and roads, on A4 landscape (tile slots 80 × 57 mm, 281 × 185 mm in all).
function boardPage(content: Content): string {
  const xs = [...new Set(Object.values(content.locations).map((l) => l.mapPos.x))].sort(
    (a, b) => a - b,
  )
  const ys = [...new Set(Object.values(content.locations).map((l) => l.mapPos.y))].sort(
    (a, b) => a - b,
  )
  const W = 80
  const H = 57
  const gapX = 14
  const gapY = 6
  const left = (281 - (3 * W + 2 * gapX)) / 2
  const top = 1
  const center = (id: LocationId) => {
    const p = content.locations[id]!.mapPos
    return {
      x: left + xs.indexOf(p.x) * (W + gapX) + W / 2,
      y: top + ys.indexOf(p.y) * (H + gapY) + H / 2,
    }
  }
  const roads = content.connections
    .map(([a, b]) => {
      const p = center(a)
      const q = center(b)
      return `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" />`
    })
    .join('')
  const slots = Object.values(content.locations)
    .map((l) => {
      const c = center(l.id)
      const x = c.x - W / 2
      const y = c.y - H / 2
      if (l.kind === 'building') {
        return `<rect class="slot" x="${x}" y="${y}" width="${W}" height="${H}" rx="2" /><text class="slot-label" x="${c.x}" y="${c.y}">building</text>`
      }
      return `<rect class="fixed ${l.kind}" x="${x}" y="${y}" width="${W}" height="${H}" rx="2" /><text class="fixed-label" x="${c.x}" y="${c.y - 4}">${esc(locName(l.id))}</text><text class="slot-label" x="${c.x}" y="${c.y + 8}">${l.kind === 'shelter' ? 'start and goal · zombies never enter' : 'nothing to search'}</text>`
    })
    .join('')
  return `<section class="page landscape board">
  <svg viewBox="0 0 281 185"><text class="board-title" x="${left + 1.5 * W + gapX}" y="${top + 22}">One More Building</text><text class="slot-label" x="${left + 1.5 * W + gapX}" y="${top + 44}">Lay a building tile face down on every dashed slot.</text><g class="roads">${roads}</g>${slots}</svg>
</section>`
}

function track(label: string, from: number, to: number, mark?: (n: number) => string): string {
  const boxes: string[] = []
  for (let n = from; n <= to; n++) {
    boxes.push(`<div class="box">${n}${mark ? `<span>${mark(n)}</span>` : ''}</div>`)
  }
  return `<div class="track"><div class="track-label">${esc(label)}</div><div class="boxes">${boxes.join('')}</div></div>`
}

function mixRow(mix: ZombieMix | undefined): string {
  return d6Table((mix ?? []).map((m) => ({ value: m.kind, weight: m.weight })))
    .map((r) => `${d6Range(r)} ${kindName(r.value)}`)
    .join(' · ')
}

function playerBoard(content: Content, balance: Balance): string {
  const levels = balance.danger.levels
  const byDanger = content.arrivals?.byDanger ?? []
  const maxThreshold = Math.max(balance.noiseThreshold, ...levels.map((l) => l.noiseThreshold))
  const dangerRows = balance.danger.enabled
    ? levels
        .map(
          (l, i) =>
            `<tr><td><b>${i + 1}</b></td><td>${l.arrivals === 1 ? '1 zombie' : `${l.arrivals} zombies`} every ${l.noiseThreshold} noise</td><td>${mixRow(byDanger[i])}</td><td>${l.extraFinds > 0 ? `+${l.extraFinds} find` : '–'}</td><td>${l.zombieHpBonus > 0 ? `+${l.zombieHpBonus} health` : '–'}</td></tr>`,
        )
        .join('')
    : ''
  const stars = (n: number) => {
    const i = balance.starThresholds.indexOf(n)
    return i >= 0 ? '★'.repeat(i + 1) : ''
  }
  return `<section class="page landscape player">
  <div class="page-label">Player board · put a marker on each track</div>
  <h2>One More Building</h2>
  ${track('Health', 0, balance.maxHp)}
  ${track('AP', 0, balance.apPerTurn)}
  ${track('Noise', 0, maxThreshold - 1)}
  ${track('Turn', 1, balance.turnLimit, (n) => (n >= balance.duskFromTurn ? 'dusk' : ''))}
  ${track('Packs', 0, balance.packsOnMap, stars)}
  ${balance.danger.enabled ? track('Danger', 1, levels.length) : ''}
  <div class="tables">
    ${
      balance.danger.enabled
        ? `<table><caption>Danger: what noise brings (roll d6 for each zombie) and what searches give</caption><tr><th>Level</th><th>Noise</th><th>Kind</th><th>Search</th><th>Zombies</th></tr>${dangerRows}</table>`
        : `<table><caption>Noise brings (roll d6)</caption><tr><td>${mixRow(content.arrivals?.noise)}</td></tr></table>`
    }
    <table><caption>Dusk brings (roll d6)</caption><tr><td>${mixRow(content.arrivals?.dusk)}</td></tr></table>
    <table><caption>Zombies</caption>${(Object.keys(balance.zombies) as ZombieKind[])
      .map(
        (k) =>
          `<tr><td><b>${kindShort(k)}</b> ${kindName(k)}</td><td>${esc(texts.zombieKinds[k].text)}</td></tr>`,
      )
      .join('')}</table>
  </div>
  <ol class="turn">
    <li><b>Start:</b> draw up to ${balance.handSize} cards, set AP to ${balance.apPerTurn}.</li>
    <li><b>Act:</b> play cards (pay AP), one free step, quick search (${balance.quickSearch.cost} AP), services.</li>
    <li><b>Zombies:</b> seen-you zombies follow (or lose track) → zombies here attack → Screamers shriek.</li>
    <li><b>Dusk</b> (turn ${balance.duskFromTurn}+): +${balance.duskNoise} noise.</li>
    <li><b>Clean up:</b> keep ${balance.keepCards} card, discard the rest and everything played; flip neutralized zombies back.</li>
  </ol>
</section>`
}

function rulesPages(content: Content, balance: Balance, cardBacks: boolean): string {
  const b = balance
  const slots = Object.values(content.locations).filter((l) => l.kind === 'building').length
  const pool = buildings(content).length
  const levels = b.danger.levels
  return `<section class="page rules">
  <h1>One More Building · print and play</h1>
  <p class="lead">One city, one deck, ten turns. Bring supplies home before dark. Solo, 20–30 minutes. You need one six-sided die (d6) and a few cubes or coins as track markers.</p>
  <div class="cols">
  <h3>What to print</h3>
  <ul>
    <li><b>Cards</b>, 63 × 88 mm: start deck, one find deck per building, body deck, rare deck, junk. ${cardBacks ? 'Print double-sided (flip on long edge) or glue the backs on. Sleeves help.' : 'No backs: use sleeves with opaque backs. Each card names its deck at the bottom.'}</li>
    <li><b>Building tiles</b>, 80 × 57 mm, ${pool} buildings with an "Unknown" back.</li>
    <li><b>Tokens</b>: zombies (back: <i>has seen you</i>), packs, stashes, search, damage, block, burned and +1 find markers.</li>
    <li><b>Board</b> and <b>player board</b> (A4 landscape).</li>
  </ul>
  <h3>Set-up</h3>
  <ol>
    <li>Place the board. Take the Supermarket tile, shuffle the other building tiles and draw ${slots - 1}. Shuffle these ${slots} tiles face down and put one on each dashed slot. The rest go back in the box.</li>
    <li>Shuffle the pack tokens (${b.packsOnMap - 1} packs, ${slots - b.packsOnMap} empty) face down onto the buildings that are not the Supermarket. The Supermarket always has a pack: mark it with a face-up pack token once you know where it is.</li>
    <li>Shuffle the stash tokens (${b.stashesOnMap} locked, ${slots - b.stashesOnMap} empty) face down, one on every building.</li>
    <li>Shuffle each building's find deck, the body deck and the rare deck. Shuffle your start deck (${Object.entries(
      b.starterDeck,
    )
      .map(([c, n]) => `${cardInfo(c).name} ×${n}`)
      .join(', ')}).</li>
    <li>Markers: Health ${b.maxHp}, Noise 0, Turn 1, Packs 0${b.danger.enabled ? ', Danger 1' : ''}. Your figure starts in the Shelter. Flip the tiles next to the Shelter face up.</li>
  </ol>
  <h3>Goal</h3>
  <p>Find at least ${b.packsToWin} supply packs and step back into the Shelter before the end of turn ${b.turnLimit}. Stars: ${b.starThresholds.map((n, i) => `${'★'.repeat(i + 1)} for ${n}`).join(', ')}. You lose at 0 health, or if you are not home when turn ${b.turnLimit} ends.</p>
  <h3>Your turn</h3>
  <p>Draw up to ${b.handSize} cards (shuffle your discard pile into a new deck when it runs out) and set AP to ${b.apPerTurn}. Play cards by paying their cost in AP. Once per turn you may walk one step along a road for free (1 AP while a Heavy Load is in your hand). Walking next to a face-down tile flips it face up.</p>
  <p>When you end the turn, run the zombie phase (player board). Then keep ${b.keepCards} card in hand and discard the rest.</p>
  <h3>Buildings and zombies</h3>
  <p>The first time you step into a building or scout it, roll for its zombies on the tile: first how many, then one roll per zombie for its kind. Zombies where you stand <b>see you</b> when you arrive: flip them to <i>has seen you</i>. Sneak, Alarm Clock and Soft Soles stop that for this turn.</p>
  <p>In the zombie phase, zombies that have seen you move to you if you are within their follow range; the others lose track (flip back). Then every zombie where you stand attacks for its damage; Block takes damage first. Zombies never enter the Shelter. Damage you deal hits one zombie of your choice (Shotgun and Chainsaw: all of them); extra damage is lost. Bow and Crossbow may also hit a zombie one step away where you can see the zombies (a street, or a building whose zombies you have rolled). The Crossbow is gear: pay 1 AP per shot and track its 3 bolts with a die. Mark damage with damage tokens.</p>
  <p><b>Search the body:</b> when a card kills zombies, draw ${b.zombies.walker.loot} card per zombie (a Brute: ${b.zombies.brute.loot}) from the body deck, at most ${b.bodyLootMax}. Take one into your hand, trash a card from your hand, or take nothing; shuffle the rest back. No noise.</p>
  <h3>Searching</h3>
  <p>Play Search in a building: draw ${b.searchOptions} cards from its find deck, or ${b.searchOptions + b.peacefulSearchBonus} if no zombie is there. Choose one: ${b.findsToHand ? 'put one find into your hand' : 'put one find in your discard pile'}, or trash a card from your hand for good, or take nothing. Shuffle the rest back. +${b.searchNoise} noise. Quick search (no card): ${b.quickSearch.cost} AP and only ${b.quickSearch.options} finds. Each building can be searched ${b.searchesPerBuilding} times (search markers).</p>
  <p>On the first search, turn its pack token: a pack moves to your Packs track and puts a Heavy Load into your discard pile. Turn its stash token too: a locked stash opens with a Tool card (${b.stashToolCost} AP, the card goes to your discard pile) or by force (${b.stashForce.cost} AP, +${b.stashForce.noise} noise). Draw ${b.stashOptions} rare finds and keep one.</p>
  <h3>Noise</h3>
  <p>When the noise marker reaches the threshold, zombies arrive where you stand (on the Street if you are in the Shelter) and the marker drops by the threshold. Roll d6 for each zombie's kind. They have seen you (unless they wait on the Street while you are in the Shelter).</p>
  ${
    b.danger.enabled
      ? `<h3>Danger</h3><p>Danger starts at 1 and rises by one for every pack and every rare find you take${b.danger.perFindsTaken > 0 ? `, and for every ${b.danger.perFindsTaken} finds you add to your deck` : ''}, up to ${levels.length}. The table on the player board shows how much noise brings zombies at each level, which kinds come, and how many extra cards every search draws.${b.danger.hordeSize > 0 ? ` Each rise sends ${b.danger.hordeSize === 1 ? 'one zombie' : `${b.danger.hordeSize} zombies`} to the Street (roll its kind on the danger table).` : ''}</p>`
      : ''
  }
  <h3>Services</h3>
  <p>Workshop (Dismantle) and Pharmacy or Hospital (Patch up): pay ${b.locationServiceCost} AP to trash a card from your hand. Patch up only takes Nerves and Wound.</p>
  <h3>Card words</h3>
  <p><b>Follow-up X:</b> stronger if you already played a card with tag X this turn. <b>Use up:</b> trash the card after playing it. <b>Gear:</b> lay the card in front of you; it works every turn until it wears out (track it with a die), then put it in your discard pile. <b>Heavy Load</b> can't be trashed. <b>Wound</b> cards are only used in the Wound variant (lose ${b.wounds.damageInOnePhase}+ health in one zombie phase: take a Wound).</p>
  <h3>Differences from the screen version</h3>
  <p>Rare finds only come from stashes. Random picks are d6 tables, so the odds are rounded.</p>
  </div>
</section>`
}

const CSS = `
@page { size: A4; margin: 8mm; }
@page wide { size: A4 landscape; margin: 5mm 8mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "DejaVu Sans", Arial, sans-serif; color: #1b201e; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { page-break-after: always; break-after: page; position: relative; }
.page.landscape { page: wide; }
.page-label { font-size: 7pt; color: #777; margin-bottom: 2mm; }
.grid { display: grid; grid-template-columns: repeat(var(--cols), auto); justify-content: center; gap: 0; }
.cards .grid > * { width: 63mm; height: 88mm; }
.tiles .grid > * { width: 80mm; height: 57mm; }
.tokens .grid { gap: 2mm; }
.blank { border: none; }
.card { border: 0.2mm solid #bbb; padding: 2.5mm; display: flex; flex-direction: column; background: #fff; position: relative; overflow: hidden; border-top: 4mm solid var(--deck); }
.card.rare { box-shadow: inset 0 0 0 1.2mm #d4a017; }
.card-head { display: flex; align-items: center; gap: 2mm; margin-bottom: 1.5mm; }
.cost { width: 7mm; height: 7mm; border-radius: 50%; background: var(--deck); color: #fff; font-weight: 700; font-size: 11pt; display: flex; align-items: center; justify-content: center; flex: none; }
.card-name { font-weight: 700; font-size: 11pt; }
.card-art { height: 40mm; border-radius: 1mm; overflow: hidden; background: #eee; }
.art { width: 100%; height: 100%; background-size: cover; background-position: center; }
.no-art { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40pt; color: var(--deck); background: repeating-linear-gradient(45deg, #f3efe4, #f3efe4 3mm, #ebe5d6 3mm, #ebe5d6 6mm); }
.card-tags { font-size: 7pt; text-transform: uppercase; letter-spacing: 0.3mm; color: #666; margin: 1.2mm 0; }
.card-text { font-size: 8.5pt; line-height: 1.3; flex: 1; }
.card-foot { font-size: 6.5pt; color: var(--deck); font-weight: 700; text-transform: uppercase; border-top: 0.2mm solid #ddd; padding-top: 1mm; }
.card.back, .tile.back { background: var(--deck, #333); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 0.2mm solid #bbb; }
.tile.back { --deck: #2b2f2d; }
.back-title { font-weight: 800; font-size: 18pt; line-height: 1.1; }
.back-deck { margin-top: 4mm; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.4mm; }
.tile { border: 0.2mm solid #bbb; display: flex; flex-direction: column; overflow: hidden; background: #fff; }
.tile-art { height: 26mm; position: relative; background: #ddd; }
.tile-name { position: absolute; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.9); font-weight: 700; font-size: 10pt; padding: 0.6mm 2mm; }
.tile-body { padding: 1.5mm 2mm; font-size: 6.8pt; line-height: 1.3; }
.tile-row { margin-bottom: 0.4mm; }
.token { width: 21mm; height: 21mm; border-radius: 50%; border: 0.3mm solid #999; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: #fff; }
.zombie { background: #f6dcd8; }
.zombie.alerted { background: #a5312a; color: #fff; }
.z-brute { background: #d9d4cf; } .z-screamer { background: #f6e7c4; } .z-runner { background: #f2cfc3; }
.zombie.alerted.z-brute { background: #3b3330; } .zombie.alerted.z-screamer { background: #a86a00; }
.z-letter { font-size: 13pt; font-weight: 800; line-height: 1; }
.z-name { font-size: 6pt; font-weight: 700; }
.z-stats { font-size: 5pt; }
.t-label { font-size: 11pt; font-weight: 800; }
.t-sub { font-size: 5.5pt; text-transform: uppercase; }
.t-pack { background: #dcefe6; } .t-stash { background: #f6e7c4; } .t-hidden { background: #2b2f2d; color: #fff; }
.t-empty { background: #f2f2f2; color: #777; } .t-search { background: #e6e9f2; } .t-damage { background: #f6dcd8; }
.t-block { background: #dde8f3; } .t-burned { background: #f3e0d0; } .t-bonus { background: #eef3dc; } .t-blankback { border-style: dotted; }
.board svg { display: block; width: 281mm; height: 185mm; }
.roads line { stroke: #9a9f9b; stroke-width: 4; stroke-linecap: round; }
.slot { fill: #fff; stroke: #555; stroke-width: 0.5; stroke-dasharray: 2 1.5; }
.fixed { fill: #f3f4f0; stroke: #2a7462; stroke-width: 0.8; }
.fixed.street { stroke: #555; stroke-dasharray: 3 1.5; }
.board-title { font-size: 9px; font-weight: 800; text-anchor: middle; }
.fixed-label { font-size: 7px; font-weight: 700; text-anchor: middle; }
.slot-label { font-size: 3.6px; fill: #666; text-anchor: middle; }
.player h2 { margin: 0 0 3mm; font-size: 14pt; }
.track { display: flex; align-items: center; margin-bottom: 2mm; }
.track-label { width: 22mm; font-weight: 700; font-size: 9pt; }
.boxes { display: flex; gap: 1mm; }
.box { width: 12mm; height: 11mm; border: 0.3mm solid #555; border-radius: 1mm; font-size: 9pt; font-weight: 700; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.box span { font-size: 5.5pt; font-weight: 400; color: #a86a00; }
.tables { display: grid; grid-template-columns: 1.4fr 1fr; gap: 3mm 6mm; margin-top: 3mm; font-size: 7.5pt; }
.tables table { border-collapse: collapse; width: 100%; }
.tables caption { text-align: left; font-weight: 700; padding-bottom: 1mm; }
.tables td, .tables th { border: 0.2mm solid #ccc; padding: 0.8mm 1.5mm; text-align: left; vertical-align: top; }
.turn { font-size: 8pt; margin: 3mm 0 0; padding-left: 5mm; }
.rules h1 { font-size: 15pt; margin: 0 0 2mm; }
.rules .lead { font-size: 9.5pt; margin: 0 0 3mm; }
.rules .cols { column-count: 2; column-gap: 8mm; font-size: 8.3pt; line-height: 1.35; }
.rules h3 { font-size: 9.5pt; margin: 2.5mm 0 1mm; break-after: avoid; }
.rules p, .rules ul, .rules ol { margin: 0 0 1.5mm; }
.rules ul, .rules ol { padding-left: 4.5mm; }
`

/** Each picture once, as a CSS variable; cards and tiles point at it. */
function artVariables(images: PrintImages): string {
  const vars = [
    ...Object.entries(images.cards).map(([id, uri]) => `--art-card-${id}: url("${uri}");`),
    ...Object.entries(images.locations).map(([id, uri]) => `--art-loc-${id}: url("${uri}");`),
  ]
  return `:root { ${vars.join(' ')} }`
}

/** The whole print-and-play file. */
export interface PrintOptions {
  /** Card back pages. Leave them out for opaque sleeves: the deck is also named on the front. */
  readonly cardBacks?: boolean
}

export function renderPrintAndPlay(
  content: Content,
  balance: Balance,
  images: PrintImages,
  options: PrintOptions = {},
): string {
  const cardBacks = options.cardBacks ?? true
  const cards = printDecks(content, balance)
  const tiles = buildings(content)
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>One More Building – print and play</title>
<style>${CSS}${artVariables(images)}</style></head><body>
${rulesPages(content, balance, cardBacks)}
${playerBoard(content, balance)}
${boardPage(content)}
${sheets(
  cards,
  3,
  9,
  (c) => cardFront(c, content, images),
  cardBacks ? (c) => cardBack(c, content) : undefined,
  'cards',
  'Cards',
)}
${sheets(
  tiles,
  2,
  8,
  (t) => tileFront(t, balance, images),
  () => tileBack(content, balance),
  'tiles',
  'Building tiles',
)}
${tokenPages(content, balance)}
</body></html>`
}
