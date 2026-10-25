import { useCallback, useEffect, useState } from 'react'
import { balance } from '../data/balance'
import { build, chooseLocker, dayBalance, daySeed, daySetup, finishDay, newCampaign } from '../game'
import type { CampaignState, GameState } from '../game'
import { GameScreen } from './GameScreen'
import { BaseScreen } from './components/BaseScreen'
import { TitleScreen } from './components/TitleScreen'
import { randomSeed, readSeedFromSearch } from './seed'
import { clearCampaign, loadCampaign, rulesSeen, saveCampaign } from './storage'

type Screen =
  | { readonly kind: 'title' }
  | {
      readonly kind: 'game'
      readonly seed: number
      readonly run: number
      /** First expedition on this device: show the rules over the map. */
      readonly showRules: boolean
    }
  /** Campaign: the base between days. */
  | { readonly kind: 'base'; readonly campaign: CampaignState }
  /** Campaign: today's expedition, possibly resumed from a save. */
  | {
      readonly kind: 'day'
      readonly campaign: CampaignState
      readonly resume?: GameState
      readonly showRules: boolean
    }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ kind: 'title' })
  const [saved, setSaved] = useState(() => loadCampaign())

  // Keep the seed in the address so a game can be reloaded or shared.
  useEffect(() => {
    if (screen.kind !== 'game') return
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('seed', String(screen.seed))
      window.history.replaceState(null, '', url)
    } catch {
      // Some hosts (e.g. an embedded page) don't allow changing the address. The seed is
      // still shown in the status bar.
    }
  }, [screen])

  const toBase = (campaign: CampaignState) => {
    saveCampaign({ campaign })
    setSaved({ campaign })
    setScreen({ kind: 'base', campaign })
  }
  const campaignDay = screen.kind === 'day' ? screen.campaign : undefined
  // Save today's expedition after every action, so closing the page loses nothing.
  const saveDay = useCallback(
    (expedition: GameState) => {
      if (!campaignDay || expedition.outcome) return
      saveCampaign({ campaign: campaignDay, expedition })
    },
    [campaignDay],
  )

  if (screen.kind === 'title') {
    return (
      <TitleScreen
        onStart={() =>
          setScreen({
            kind: 'game',
            seed: readSeedFromSearch(window.location.search) ?? randomSeed(),
            run: 1,
            showRules: !rulesSeen(),
          })
        }
        onNewCampaign={() => {
          clearCampaign()
          toBase(newCampaign(randomSeed(), balance))
        }}
        {...(saved
          ? {
              savedCampaign: {
                day: saved.campaign.day,
                onContinue: () =>
                  saved.expedition
                    ? setScreen({
                        kind: 'day',
                        campaign: saved.campaign,
                        resume: saved.expedition,
                        showRules: false,
                      })
                    : setScreen({ kind: 'base', campaign: saved.campaign }),
              },
            }
          : {})}
      />
    )
  }

  if (screen.kind === 'base') {
    const { campaign } = screen
    return (
      <BaseScreen
        campaign={campaign}
        balance={balance}
        onBuild={(id) => toBase(build(campaign, id, balance))}
        onLocker={(card) => toBase(chooseLocker(campaign, card))}
        onSetOut={() => setScreen({ kind: 'day', campaign, showRules: !rulesSeen() })}
        onNewCampaign={() => {
          clearCampaign()
          toBase(newCampaign(randomSeed(), balance))
        }}
        onExit={() => setScreen({ kind: 'title' })}
      />
    )
  }

  if (screen.kind === 'day') {
    const { campaign } = screen
    return (
      <GameScreen
        key={`day-${campaign.seed}-${campaign.day}`}
        seed={daySeed(campaign)}
        balance={dayBalance(campaign, balance)}
        setup={daySetup(campaign, balance)}
        {...(screen.resume ? { initialState: screen.resume } : {})}
        showRulesOnStart={screen.showRules}
        onStateChange={saveDay}
        onDayOver={(final) => toBase(finishDay(campaign, final, balance))}
        onNewExpedition={() => setScreen({ kind: 'base', campaign })}
        onRestart={() => setScreen({ kind: 'base', campaign })}
        onExit={() => setScreen({ kind: 'title' })}
      />
    )
  }

  return (
    <GameScreen
      key={`${screen.seed}-${screen.run}`}
      seed={screen.seed}
      showRulesOnStart={screen.showRules}
      onNewExpedition={() =>
        setScreen({ kind: 'game', seed: randomSeed(), run: screen.run + 1, showRules: false })
      }
      onRestart={() => setScreen({ ...screen, run: screen.run + 1, showRules: false })}
      onExit={() => setScreen({ kind: 'title' })}
    />
  )
}
