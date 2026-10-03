import { useEffect, useState } from 'react'
import { GameScreen } from './GameScreen'
import { TitleScreen } from './components/TitleScreen'
import { randomSeed, readSeedFromSearch } from './seed'

type Screen =
  | { readonly kind: 'title' }
  | { readonly kind: 'game'; readonly seed: number; readonly run: number }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ kind: 'title' })

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

  if (screen.kind === 'title') {
    return (
      <TitleScreen
        onStart={() =>
          setScreen({
            kind: 'game',
            seed: readSeedFromSearch(window.location.search) ?? randomSeed(),
            run: 1,
          })
        }
      />
    )
  }

  return (
    <GameScreen
      key={`${screen.seed}-${screen.run}`}
      seed={screen.seed}
      onNewExpedition={() => setScreen({ kind: 'game', seed: randomSeed(), run: screen.run + 1 })}
      onRestart={() => setScreen({ ...screen, run: screen.run + 1 })}
      onExit={() => setScreen({ kind: 'title' })}
    />
  )
}
