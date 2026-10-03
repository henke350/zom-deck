import type { Balance } from '../data/balance'
import type { Content } from '../game'
import type { BotInfo } from './bots'
import type { GameRecord } from './play'
import type { VariantResult } from './simulate'

/** Totals for one bot over many games. */
export interface BotSummary {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly games: number
  readonly wins: number
  /** Games won with 1, 2 and 3 stars. */
  readonly stars: readonly [number, number, number]
  readonly killed: number
  readonly darkness: number
  /** Killed while carrying enough packs to win: died on the way home. */
  readonly killedWithWin: number
  readonly avgTurns: number
  readonly avgHpOnWin: number
  readonly avgDeck: number
  readonly avgTaken: number
  readonly avgRemoved: number
  readonly avgQuickSearches: number
  readonly avgIdleTurns: number
  readonly avgServices: number
  readonly avgDamageFollowers: number
  readonly avgDamageThere: number
  readonly avgNoiseZombies: number
  readonly avgDuskZombies: number
  readonly avgKills: number
  /** Finds taken per 100 games, by card. */
  readonly taken: Readonly<Record<string, number>>
  /** Plays per 100 games, by card. */
  readonly plays: Readonly<Record<string, number>>
  readonly problems: readonly string[]
}

export function summarize(
  info: BotInfo,
  records: readonly GameRecord[],
  balance: Balance,
): BotSummary {
  const n = records.length || 1
  const avg = (f: (r: GameRecord) => number) => records.reduce((s, r) => s + f(r), 0) / n
  const won = records.filter((r) => r.result.outcome.result === 'won')
  const per100 = (counts: Record<string, number>) =>
    Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, (v * 100) / n]))

  const taken: Record<string, number> = {}
  const plays: Record<string, number> = {}
  for (const r of records) {
    for (const card of r.result.cardsFound) taken[card] = (taken[card] ?? 0) + 1
    for (const [card, count] of Object.entries(r.plays)) plays[card] = (plays[card] ?? 0) + count
  }
  const stars = (k: number) => won.filter((r) => r.result.outcome.stars === k).length
  // A follower attack costs one zombie's damage; split health lost by who attacked.
  const split = (r: GameRecord, followers: boolean) => {
    const s = r.result.stats
    const attacks = s.attacksByFollowers + s.attacksByZombiesThere
    if (attacks === 0) return 0
    const share = (followers ? s.attacksByFollowers : s.attacksByZombiesThere) / attacks
    return s.damageFromZombies * share
  }

  return {
    id: info.bot.id,
    name: info.name,
    description: info.description,
    games: records.length,
    wins: won.length,
    stars: [stars(1), stars(2), stars(3)],
    killed: records.filter((r) => r.result.outcome.cause === 'killed').length,
    darkness: records.filter((r) => r.result.outcome.cause === 'darkness').length,
    killedWithWin: records.filter(
      (r) => r.result.outcome.cause === 'killed' && r.result.packs >= balance.packsToWin,
    ).length,
    avgTurns: avg((r) => r.result.turnsUsed),
    avgHpOnWin: won.length ? won.reduce((s, r) => s + r.result.hpLeft, 0) / won.length : 0,
    avgDeck: avg((r) => r.deckSize),
    avgTaken: avg((r) => r.result.cardsFound.length),
    avgRemoved: avg((r) => r.result.stats.cardsRemoved),
    avgQuickSearches: avg((r) => r.quickSearches),
    avgIdleTurns: avg((r) => r.idleTurns),
    avgServices: avg((r) => r.servicesUsed),
    avgDamageFollowers: avg((r) => split(r, true)),
    avgDamageThere: avg((r) => split(r, false)),
    avgNoiseZombies: avg((r) => r.result.stats.zombiesFromNoise),
    avgDuskZombies: avg((r) => r.result.stats.zombiesFromDusk),
    avgKills: avg((r) => r.result.stats.zombiesKilled),
    taken: per100(taken),
    plays: per100(plays),
    problems: records.flatMap((r) => r.problems.map((p) => `seed ${r.seed}: ${p}`)),
  }
}

// ---------------------------------------------------------------- Markdown (Danish: the user reads it)

const pct = (part: number, whole: number) => `${Math.round((part * 100) / (whole || 1))} %`
const num = (x: number, digits = 1) => x.toFixed(digits).replace('.', ',')

export interface ReportInput {
  readonly summaries: readonly BotSummary[]
  readonly balance: Balance
  readonly content: Content
  /** Balance values changed for this run, e.g. ["maxHp=12"]. Empty: the standard balance. */
  readonly overrides: readonly string[]
  readonly command: string
  /** The plan's limit for the rush-home bot: above this the game is too easy. */
  readonly rushLimit?: number
  /** "What if" runs with other balance values, compared with the standard run. */
  readonly variants?: readonly VariantResult[]
}

export function renderReport(input: ReportInput): string {
  const { summaries, balance, content, overrides, command } = input
  const rushLimit = input.rushLimit ?? 80
  const by = (id: string) => summaries.find((s) => s.id === id)
  const lines: string[] = []
  const games = summaries[0]?.games ?? 0

  lines.push('# Balancerapport')
  lines.push('')
  lines.push(
    `Lavet af simulatoren (\`${command}\`). ${games} spil pr. bot, samme byer (seed 1–${games}) for alle bots. ` +
      (overrides.length
        ? `Ændrede balancetal: \`${overrides.join(' ')}\`.`
        : 'Standardtallene fra `src/data/balance.ts`.'),
  )
  lines.push('')
  lines.push(
    'Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. ' +
      'De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.',
  )
  lines.push('')

  // Short conclusions computed from the numbers.
  lines.push('## Kort fortalt')
  lines.push('')
  for (const line of conclusions(summaries, rushLimit)) lines.push(`- ${line}`)
  lines.push('')

  lines.push('## Resultat pr. bot')
  lines.push('')
  lines.push(
    '| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |',
  )
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |')
  for (const s of summaries) {
    lines.push(
      `| ${s.name} | ${pct(s.wins, s.games)} | ${pct(s.stars[0], s.games)} | ${pct(s.stars[1], s.games)} | ` +
        `${pct(s.stars[2], s.games)} | ${pct(s.killed, s.games)} | ${pct(s.darkness, s.games)} | ` +
        `${num(s.avgTurns)} | ${num(s.avgHpOnWin)} | ${num(s.avgDeck)} | ${num(s.avgTaken)} | ${num(s.avgRemoved)} |`,
    )
  }
  lines.push('')
  lines.push(
    '_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har ' +
      `${Object.values(balance.starterDeck).reduce((a, b) => a + b, 0)}). _Fjernet_: kort skrottet, brugt op eller fjernet.`,
  )
  lines.push('')

  lines.push('## Hvor kommer faren fra?')
  lines.push('')
  lines.push(
    '| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Dræbte zombier |',
  )
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: |')
  for (const s of summaries) {
    lines.push(
      `| ${s.name} | ${pct(s.killedWithWin, s.games)} | ${num(s.avgDamageFollowers)} | ${num(s.avgDamageThere)} | ` +
        `${num(s.avgNoiseZombies)} | ${num(s.avgDuskZombies)} | ${num(s.avgKills)} |`,
    )
  }
  lines.push('')
  lines.push(
    '_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.',
  )
  lines.push('')

  lines.push('## Døde hænder og tjenester')
  lines.push('')
  lines.push(
    '| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil |',
  )
  lines.push('| --- | ---: | ---: | ---: |')
  for (const s of summaries) {
    lines.push(
      `| ${s.name} | ${num(s.avgQuickSearches)} | ${num(s.avgIdleTurns)} | ${num(s.avgServices)} |`,
    )
  }
  lines.push('')
  lines.push('_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge.')
  lines.push('')

  lines.push('## Fundkort')
  lines.push('')
  const thinking = summaries.filter((s) => s.id !== 'random' && s.id !== 'rush')
  lines.push(
    `Pr. 100 spil. "Taget" er summen for ${thinking.map((s) => s.name).join(', ')}; "spillet" ligeså.`,
  )
  lines.push('')
  lines.push(`| Kort | Taget | Spillet | ${thinking.map((s) => s.name).join(' | ')} |`)
  lines.push(`| --- | ---: | ---: | ${thinking.map(() => '---:').join(' | ')} |`)
  const finds = Object.values(content.cards)
    .filter((c) => c.kind === 'action' && !(c.id in balance.starterDeck))
    .map((c) => c.id)
  const sum = (s: readonly BotSummary[], f: (b: BotSummary) => number) =>
    s.reduce((t, b) => t + f(b), 0)
  const rows = finds
    .map((id) => ({
      id,
      taken: sum(thinking, (b) => b.taken[id] ?? 0),
      played: sum(thinking, (b) => b.plays[id] ?? 0),
    }))
    .sort((a, b) => b.taken - a.taken)
  for (const r of rows) {
    lines.push(
      `| ${r.id} | ${num(r.taken, 0)} | ${num(r.played, 0)} | ${thinking.map((b) => num(b.taken[r.id] ?? 0, 0)).join(' | ')} |`,
    )
  }
  lines.push('')

  lines.push('## Spørgsmålene fra planen (afsnit 7)')
  lines.push('')
  const rush = by('rush')
  const greedy = by('greedy')
  if (rush) {
    lines.push(
      `- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder ${pct(rush.wins, rush.games)} ` +
        `(grænsen er cirka ${rushLimit} %).`,
    )
  }
  if (greedy) {
    const third = greedy.stars[1] + greedy.stars[2]
    lines.push(
      `- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i ${pct(third, greedy.games)} ` +
        `og med 4 i ${pct(greedy.stars[2], greedy.games)}, men dør på vej hjem i ${pct(greedy.killedWithWin, greedy.games)}.`,
    )
  }
  const styles = summaries.filter((s) => ['quiet', 'fighter', 'runner', 'light'].includes(s.id))
  if (styles.length > 0) {
    lines.push(
      `- **Kan flere spillestile vinde?** ${styles.map((s) => `${s.name} ${pct(s.wins, s.games)}`).join(', ')}.`,
    )
    const top = styles.map((s) => `${s.name}: ${topCards(s.taken, 3).join(', ')}`)
    lines.push(`- **Bliver dækkene forskellige?** Mest tagne fund: ${top.join(' · ')}.`)
  }
  const unused = rows.filter((r) => r.taken < 5).map((r) => r.id)
  lines.push(
    `- **Er der kort, ingen bruger?** ${unused.length ? `Sjældent taget (under 5 pr. 100 spil): ${unused.join(', ')}.` : 'Alle fundkort bliver taget.'}`,
  )
  const idle = thinking.length ? sum(thinking, (b) => b.avgIdleTurns) / thinking.length : 0
  lines.push(
    `- **Kan dårlige hænder håndteres?** ${num(idle)} tomme ture pr. spil i gennemsnit for de tænkende bots.`,
  )
  lines.push('')

  if (input.variants && input.variants.length > 0) {
    lines.push(...renderVariants(summaries, input.variants))
  }

  lines.push('## Botterne')
  lines.push('')
  for (const s of summaries) lines.push(`- **${s.name}** (\`${s.id}\`): ${s.description}`)
  lines.push('')

  const problems = summaries.flatMap((s) => s.problems.map((p) => `${s.id} ${p}`))
  lines.push('## Fejl')
  lines.push('')
  lines.push(
    problems.length === 0
      ? 'Ingen. Alle regler blev tjekket efter hver handling i alle spil.'
      : problems
          .slice(0, 20)
          .map((p) => `- ${p}`)
          .join('\n'),
  )
  lines.push('')
  return lines.join('\n')
}

function renderVariants(
  standard: readonly BotSummary[],
  variants: readonly VariantResult[],
): string[] {
  const ids = ['rush', 'greedy', 'quiet', 'fighter', 'runner', 'light']
  const names = ids.map((id) => standard.find((s) => s.id === id)?.name ?? id)
  const games = variants[0]?.summaries[0]?.games ?? 0
  const cell = (list: readonly BotSummary[], id: string) => {
    const s = list.find((b) => b.id === id)
    if (!s) return '–'
    const win = pct(s.wins, s.games)
    return id === 'greedy' ? `${win} (★★★ ${pct(s.stars[2], s.games)})` : win
  }
  const lines = ['## Hvad hvis?', '']
  lines.push(
    `Sejrsrate med ét eller flere balancetal ændret (${games} spil pr. bot). ` +
      'Prøv selv med fx `npm run sim -- --set maxHp=9`.',
  )
  lines.push('')
  lines.push(`| Ændring | ${names.join(' | ')} |`)
  lines.push(`| --- | ${ids.map(() => '---:').join(' | ')} |`)
  lines.push(`| Ingen (standard) | ${ids.map((id) => cell(standard, id)).join(' | ')} |`)
  for (const v of variants) {
    lines.push(
      `| ${v.variant.name} (\`${v.variant.overrides.join(' ')}\`) | ${ids.map((id) => cell(v.summaries, id)).join(' | ')} |`,
    )
  }
  lines.push('')
  return lines
}

function conclusions(summaries: readonly BotSummary[], rushLimit: number): string[] {
  const out: string[] = []
  const rush = summaries.find((s) => s.id === 'rush')
  const styles = summaries.filter((s) => ['quiet', 'fighter', 'runner', 'light'].includes(s.id))
  const greedy = summaries.find((s) => s.id === 'greedy')
  if (rush) {
    const rate = (rush.wins * 100) / rush.games
    out.push(
      rate > rushLimit
        ? `**For let:** "Skynd dig hjem" vinder ${Math.round(rate)} % uden at træffe valg (planens grænse er cirka ${rushLimit} %).`
        : `"Skynd dig hjem" vinder ${Math.round(rate)} %, under planens grænse på cirka ${rushLimit} %.`,
    )
  }
  if (styles.length > 0) {
    const rates = styles.map((s) => (s.wins * 100) / s.games)
    const low = Math.min(...rates)
    const high = Math.max(...rates)
    out.push(
      `De fire spillestile vinder mellem ${Math.round(low)} % og ${Math.round(high)} %` +
        (high - low <= 15
          ? ', så ingen stil er klart bedst.'
          : ', så stilene er ikke lige stærke.'),
    )
  }
  if (greedy) {
    out.push(
      `Grådighed koster: den grådige bot dør i ${pct(greedy.killed, greedy.games)} af spillene, ` +
        `men får ★★★ i ${pct(greedy.stars[2], greedy.games)}.`,
    )
  }
  const thinking = summaries.filter((s) => s.id !== 'random')
  if (thinking.length > 0) {
    const turns = thinking.reduce((t, s) => t + s.avgTurns, 0) / thinking.length
    const dark = thinking.reduce((t, s) => t + s.darkness, 0)
    out.push(
      `Spillene slutter i gennemsnit i tur ${num(turns)}` +
        (dark === 0 ? ', og ingen tænkende bot når at blive overrasket af mørket.' : '.'),
    )
  }
  return out
}

function topCards(counts: Readonly<Record<string, number>>, n: number): string[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([card]) => card)
}

/** A short table for the terminal. */
export function consoleSummary(summaries: readonly BotSummary[]): string {
  const rows = summaries.map(
    (s) =>
      `${s.name.padEnd(15)} sejr ${pct(s.wins, s.games).padStart(5)}  ★ ${pct(s.stars[0], s.games).padStart(5)}  ` +
      `★★ ${pct(s.stars[1], s.games).padStart(5)}  ★★★ ${pct(s.stars[2], s.games).padStart(5)}  ` +
      `død ${pct(s.killed, s.games).padStart(5)}  mørke ${pct(s.darkness, s.games).padStart(5)}  ture ${num(s.avgTurns)}`,
  )
  return rows.join('\n')
}
