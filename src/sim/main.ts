import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { balance as standard } from '../data/balance'
import { defaultContent } from '../data/content'
import { bots } from './bots'
import { fuzz } from './fuzz'
import { applyOverrides } from './overrides'
import { renderPrintAndPlay } from './print'
import { consoleSummary, renderReport } from './report'
import { runBots, runVariants, traceGame } from './simulate'

/**
 * The simulator's command line (runs in Node, see vite.sim.config.ts):
 *
 *   npm run sim                         balance report, 1000 games per bot → docs/balance-report.md
 *   npm run sim -- --games 200          fewer games
 *   npm run sim -- --set maxHp=12       try a balance change (report goes to .sim/)
 *   npm run sim -- --variant-games 0    skip the "what if" section (faster)
 *   npm run sim -- trace greedy 7       one game, action by action
 *   npm run fuzz                        10 000 random games, every rule checked after every action
 *   npm run print                       print-and-play sheets → print/print-and-play.html
 */
function main(argv: readonly string[]): number {
  const [command = 'report', ...rest] = argv
  const games = Number(option(rest, '--games') ?? (command === 'fuzz' ? 10000 : 1000))
  if (!Number.isInteger(games) || games <= 0) throw new Error('--games must be a positive number')

  if (command === 'fuzz') {
    const result = fuzz(games)
    const e = result.endings
    console.log(
      `Fuzz: ${result.games} tilfældige spil, ${result.actions} handlinger, ${result.problems.length} fejl.\n` +
        `Slutninger: ${e.home ?? 0} hjem, ${e.killed ?? 0} døde, ${e.darkness ?? 0} mørke.`,
    )
    for (const p of result.problems) console.log(`  ${p}`)
    return result.problems.length === 0 ? 0 : 1
  }
  if (command === 'trace') {
    // npm run sim -- trace <bot id> <seed>: every action and what happened, for one game.
    const [botId = 'rush', seedText = '1'] = rest.filter((a) => !a.startsWith('--'))
    const info = bots.find((b) => b.bot.id === botId)
    if (!info) throw new Error(`Unknown bot "${botId}"`)
    const balance = applyOverrides(standard, options(rest, '--set'))
    console.log(traceGame(info.bot, Number(seedText), balance).join('\n'))
    return 0
  }
  if (command === 'print') {
    const balance = applyOverrides(standard, options(rest, '--set'))
    const images = { cards: artIn('src/assets/cards'), locations: artIn('src/assets/locations') }
    const out = option(rest, '--out') ?? 'print/print-and-play.html'
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, renderPrintAndPlay(defaultContent, balance, images))
    console.log(`Print-and-play: ${out} (åbn i en browser og udskriv, eller gem som PDF)`)
    return 0
  }
  if (command !== 'report') {
    throw new Error(`Unknown command "${command}" (use report, fuzz, trace or print)`)
  }

  const overrides = options(rest, '--set')
  const balance = applyOverrides(standard, overrides)
  const summaries = runBots(balance, games)
  // The "what if" section compares tuning knobs; it is part of the standard report only.
  const variantGames = Number(option(rest, '--variant-games') ?? (overrides.length ? 0 : 300))
  const variants = variantGames > 0 ? runVariants(balance, variantGames) : []
  const out =
    option(rest, '--out') ??
    (overrides.length === 0 ? 'docs/balance-report.md' : '.sim/balance-report.md')
  const shown = ['npm run sim', ...(rest.length ? ['--', ...rest] : [])].join(' ')
  const report = renderReport({
    summaries,
    balance,
    content: defaultContent,
    overrides,
    command: shown,
    variants,
  })
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, report)
  console.log(consoleSummary(summaries))
  console.log(`\nRapport: ${out}`)
  const problems = summaries.reduce((n, s) => n + s.problems.length, 0)
  if (problems > 0) console.log(`${problems} fejl fundet (se rapporten).`)
  return problems === 0 ? 0 : 1
}

/** Every image in a folder as a data URI, keyed by its file name without extension. */
function artIn(folder: string): Record<string, string> {
  if (!existsSync(folder)) return {}
  const types: Record<string, string> = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg' }
  return Object.fromEntries(
    readdirSync(folder).flatMap((file) => {
      const [id = '', ext = ''] = file.split('.')
      const type = types[ext]
      if (!type) return []
      const data = readFileSync(join(folder, file)).toString('base64')
      return [[id, `data:${type};base64,${data}`]]
    }),
  )
}

function option(args: readonly string[], name: string): string | undefined {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}

function options(args: readonly string[], name: string): string[] {
  return args.flatMap((a, i) => (a === name && args[i + 1] ? [args[i + 1] as string] : []))
}

process.exitCode = main(process.argv.slice(2))
