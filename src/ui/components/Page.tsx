import { useEffect, type ReactNode } from 'react'

interface PageProps {
  readonly labelledBy: string
  /** Called when the player presses Escape. Leave out for pages that must be answered. */
  readonly onEscape?: () => void
  readonly children: ReactNode
}

/**
 * A full screen in place of the game (rules, end of the expedition). The game has no pop-up
 * windows: a page fills the screen until the player leaves it.
 */
export function Page({ labelledBy, onEscape, children }: PageProps) {
  useEffect(() => {
    if (!onEscape) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onEscape])

  return (
    <section className="page" aria-labelledby={labelledBy}>
      <div className="page-body">{children}</div>
    </section>
  )
}
