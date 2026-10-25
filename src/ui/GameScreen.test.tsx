// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { newGame, zombiesAt, type GameState } from '../game'
import { classicBalance, makeState } from '../game/testkit'
import { GameScreen } from './GameScreen'
import { setTipsHidden } from './storage'

afterEach(cleanup)

/** Exactly five cards, so the whole deck is in the first hand. */
const startDeck = ['run', 'search', 'toolbox', 'nerves', 'bandage']

function renderGame() {
  const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
  const view = render(
    <GameScreen seed={7} setup={{ startDeck }} balance={classicBalance} {...handlers} />,
  )
  const card = (id: string) => {
    const el = view.container.querySelector<HTMLElement>(`[data-card="${id}"]`)
    if (!el) throw new Error(`Card ${id} is not in hand`)
    return within(el)
  }
  const node = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}`) })
  const log = () => within(screen.getByRole('region', { name: texts.ui.log }))
  return { ...handlers, card, node, log, user: userEvent.setup() }
}

describe('GameScreen', () => {
  it('shows turn, health and the hand', () => {
    const { card } = renderGame()
    expect(screen.getByText(`1/${balance.turnLimit}`)).toBeTruthy()
    expect(screen.getByText(`${balance.maxHp}/${balance.maxHp}`)).toBeTruthy()
    expect(card('run').getByText(texts.cards.run.name)).toBeTruthy()
  })

  it('walks to a neighbour with the free move', async () => {
    const { node, log, user } = renderGame()
    await user.click(node('Street'))
    expect(log().getByText(texts.log.moved('Street', '', 0))).toBeTruthy()
    expect(node('Street').getAttribute('aria-label')).toContain(texts.ui.youAreHere)
  })

  it('on a touch screen, a first tap only shows the place; a second tap goes there', () => {
    const { node, log } = renderGame()
    const tap = (el: HTMLElement) => {
      fireEvent.pointerDown(el, { pointerType: 'touch' })
      fireEvent.click(el)
    }
    tap(node('Street'))
    expect(log().queryByText(texts.log.moved('Street', '', 0))).toBeNull()
    expect(screen.getByRole('heading', { name: 'Street' })).toBeTruthy()
    tap(node('Street'))
    expect(log().getByText(texts.log.moved('Street', '', 0))).toBeTruthy()
  })

  it('goes to the shown place with Go here', async () => {
    const { node, log, user } = renderGame()
    fireEvent.pointerDown(node('Street'), { pointerType: 'touch' })
    fireEvent.click(node('Street'))
    await user.click(screen.getByRole('button', { name: texts.ui.goHere }))
    expect(log().getByText(texts.log.moved('Street', '', 0))).toBeTruthy()
  })

  it('shows a hovered place on top of the panel without replacing where you are', async () => {
    const { node, user } = renderGame()
    await user.hover(node('Police Station'))
    const panels = screen.getAllByRole('region', { name: texts.ui.location })
    expect(panels).toHaveLength(2)
    expect(within(panels[0]!).getByText(texts.ui.youAreHere)).toBeTruthy()
    expect(within(panels[1]!).getByText(texts.ui.stepsAway(3))).toBeTruthy()
    await user.unhover(node('Police Station'))
    expect(screen.getAllByRole('region', { name: texts.ui.location })).toHaveLength(1)
  })

  it('explains why a card cannot be played yet', () => {
    const { card } = renderGame()
    const play = card('search').getByRole('button', { name: texts.ui.play }) as HTMLButtonElement
    expect(play.disabled).toBe(true)
    expect(card('search').getByText(texts.reasons.nothingToSearch)).toBeTruthy()
    expect(card('nerves').getByText(texts.reasons.unplayable)).toBeTruthy()
  })

  it('plays Run by picking a destination on the map', async () => {
    const { card, node, log, user } = renderGame()
    await user.click(card('run').getByRole('button', { name: texts.ui.play }))
    expect(screen.getByRole('status').textContent).toContain(texts.ui.chooseOnMap)
    await user.click(node('House A'))
    expect(log().getByText(texts.log.moved('House A', 'Run', 0))).toBeTruthy()
    expect(screen.getByText(`${balance.apPerTurn - 1}/${balance.apPerTurn}`)).toBeTruthy()
  })

  it('plays Toolbox by picking a card to trash', async () => {
    const { card, log, user } = renderGame()
    await user.click(card('toolbox').getByRole('button', { name: texts.ui.play }))
    await user.click(card('nerves').getByRole('button', { name: texts.ui.trash }))
    expect(log().getByText(texts.log.cardTrashed('Nerves'))).toBeTruthy()
  })

  it('lets you cancel a card that needs a choice', async () => {
    const { card, user } = renderGame()
    await user.click(card('run').getByRole('button', { name: texts.ui.play }))
    expect(screen.getByText(texts.ui.chooseOnMap, { exact: false })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: texts.ui.cancel }))
    expect(screen.queryByText(texts.ui.chooseOnMap, { exact: false })).toBeNull()
  })

  it('keeps a card and ends the turn', async () => {
    const { card, log, user } = renderGame()
    await user.click(card('bandage').getByRole('button', { name: texts.ui.keep }))
    await user.click(screen.getByRole('button', { name: texts.ui.endTurnKeeping('Bandage') }))
    expect(screen.getByText(`2/${balance.turnLimit}`)).toBeTruthy()
    expect(log().getByText(texts.log.cardsKept('Bandage'))).toBeTruthy()
    expect(card('bandage').getByText(texts.cards.bandage.name)).toBeTruthy()
  })

  it('ends in darkness after the last turn and offers a restart', async () => {
    const { onRestart, user } = renderGame()
    for (let i = 0; i < balance.turnLimit; i++) {
      await user.click(screen.getByRole('button', { name: texts.ui.endTurn }))
    }
    const dialog = screen.getByRole('region', { name: texts.ui.outcomeTitle.darkness })
    await user.click(within(dialog).getByRole('button', { name: texts.ui.sameCity }))
    expect(onRestart).toHaveBeenCalledOnce()
  })
})

describe('GameScreen: searching', () => {
  /** "Take <card>" buttons, not the "Take nothing" button. */
  const takeFindButton = new RegExp(`^${texts.ui.take} (?!nothing)`)
  const deck = ['search', 'search', 'nerves', 'bandage', 'run']

  /** First seed where House A has (or lacks) a pack and holds this many zombies. */
  function seedWhere(houseAHasPack: boolean, zombies: number, startDeck: string[]) {
    for (let seed = 1; seed < 500; seed++) {
      const game = newGame(seed, { setup: { startDeck }, balance: classicBalance })
      if (
        game.sites.houseA?.hasPack === houseAHasPack &&
        zombiesAt(game, 'houseA').length === zombies
      ) {
        return seed
      }
    }
    throw new Error('no matching seed')
  }

  function renderAt(houseAHasPack: boolean, zombies = 0, startDeck = deck) {
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    const seed = seedWhere(houseAHasPack, zombies, startDeck)
    const view = render(
      <GameScreen seed={seed} setup={{ startDeck }} balance={classicBalance} {...handlers} />,
    )
    const log = () => within(screen.getByRole('region', { name: texts.ui.log }))
    const houseA = () => screen.getByRole('button', { name: /^House A/ })
    return { view, log, houseA, user: userEvent.setup() }
  }

  it('searches with a card and takes a find', async () => {
    const { view, log, houseA, user } = renderAt(false)
    await user.click(houseA())
    const searchCard = view.container.querySelector<HTMLElement>('[data-card="search"]')
    await user.click(within(searchCard!).getByRole('button', { name: texts.ui.play }))
    const dialog = screen.getByRole('region', { name: texts.ui.findTitle })
    const takes = within(dialog).getAllByRole('button', { name: takeFindButton })
    // No zombies in House A, so the search is "in peace": +1 find.
    expect(takes).toHaveLength(balance.searchOptions + balance.peacefulSearchBonus)
    await user.click(takes[0]!)
    expect(screen.queryByRole('region', { name: texts.ui.findTitle })).toBeNull()
    expect(log().getByText(/^You take .+ It goes into your discard pile\.$/)).toBeTruthy()
    expect(houseA().textContent).toContain(texts.ui.mapSearches(1, 2))
  })

  it('quick-searches without a card and can take nothing', async () => {
    const { log, houseA, user } = renderAt(false)
    await user.click(houseA())
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    const dialog = screen.getByRole('region', { name: texts.ui.findTitle })
    expect(within(dialog).getAllByRole('button', { name: takeFindButton })).toHaveLength(
      balance.quickSearch.options + balance.peacefulSearchBonus,
    )
    await user.click(within(dialog).getByRole('button', { name: texts.ui.takeNothing }))
    expect(log().getByText(texts.log.findDeclined)).toBeTruthy()
  })

  it('offers no scrapping while choosing finds', async () => {
    const { houseA, user } = renderAt(false)
    await user.click(houseA())
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    const dialog = screen.getByRole('region', { name: texts.ui.findTitle })
    expect(within(dialog).queryByText(texts.ui.scrapHeading)).toBeNull()
    expect(within(dialog).queryByRole('button', { name: texts.ui.scrap('Nerves') })).toBeNull()
  })

  it('finds a supply pack and shows it', async () => {
    const { houseA, user } = renderAt(true)
    await user.click(houseA())
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    const dialog = screen.getByRole('region', { name: texts.ui.findTitle })
    expect(within(dialog).getByText(texts.ui.packBanner(1))).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: texts.ui.takeNothing }))
    expect(screen.getByText(`1/${balance.packsToWin}`)).toBeTruthy()
  })

  it('shows the zombie range until you go in, then the exact zombies', async () => {
    const { houseA, user } = renderAt(false, 1)
    expect(houseA().textContent).toContain(texts.ui.zombiesRange(0, 1))
    await user.click(houseA())
    expect(houseA().textContent).not.toContain('?')
    const labels = Object.values(texts.zombieKinds).map((k) => texts.ui.zombieKindLabel(k.name, 1))
    expect(screen.getAllByText((text) => labels.includes(text)).length).toBeGreaterThan(0)
  })

  it('previews the attack and lets you hit the zombie', async () => {
    const startDeck = ['crowbar', 'search', 'nerves', 'bandage', 'run']
    const { view, log, houseA, user } = renderAt(false, 1, startDeck)
    expect(screen.getByText(texts.ui.preview.safe)).toBeTruthy()
    await user.click(houseA())
    expect(screen.getByText(texts.ui.preview.attack(1, 1, 0))).toBeTruthy()
    const crowbar = view.container.querySelector<HTMLElement>('[data-card="crowbar"]')
    await user.click(within(crowbar!).getByRole('button', { name: 'Hit' }))
    expect(log().getByText(texts.log.zombieHit(1, 1))).toBeTruthy()
  })

  it('raises the noise meter after a search', async () => {
    const { houseA, user } = renderAt(false)
    await user.click(houseA())
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    const dialog = screen.getByRole('region', { name: texts.ui.findTitle })
    expect(within(dialog).getByText(texts.ui.findNoise(1, 0))).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: texts.ui.takeNothing }))
    const noiseStat = screen.getByText(texts.ui.noiseLabel).parentElement!
    expect(within(noiseStat).getByText(`1/${balance.noiseThreshold}`)).toBeTruthy()
  })
})

describe('GameScreen: tips for new players', () => {
  it('shows a tip that fits the moment, and can be hidden and shown again', async () => {
    setTipsHidden(false)
    const { user } = renderGame()
    expect(screen.getByText(texts.ui.hints.walk)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: texts.ui.hideTips }))
    expect(screen.queryByText(texts.ui.hints.walk)).toBeNull()
    expect(screen.getByText(texts.ui.keepHint(balance.keepCards))).toBeTruthy()
    await user.click(screen.getByRole('button', { name: texts.rules.short }))
    await user.click(screen.getByRole('button', { name: texts.ui.showTips }))
    await user.click(screen.getByRole('button', { name: texts.rules.close }))
    expect(screen.getByText(texts.ui.hints.walk)).toBeTruthy()
  })
})

describe('GameScreen: gear', () => {
  it('shows gear in front of you and how long it lasts', async () => {
    const state = makeState({ hand: ['kevlarVest', 'search'], gear: ['flashlight'] })
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    const view = render(<GameScreen seed={1} initialState={state} {...handlers} />)
    const gear = () => within(screen.getByRole('list', { name: texts.ui.gear }))
    expect(gear().getByText(texts.cards.flashlight.name)).toBeTruthy()
    expect(gear().getByText(texts.ui.gearLeft('turns', 2))).toBeTruthy()
    const vest = view.container.querySelector<HTMLElement>('[data-card="kevlarVest"]')!
    await userEvent.setup().click(within(vest).getByRole('button', { name: texts.ui.play }))
    expect(gear().getByText(texts.cards.kevlarVest.name)).toBeTruthy()
    expect(gear().getByText(texts.ui.gearLeft('absorbs', 3))).toBeTruthy()
  })
})

describe('GameScreen: ranged weapons', () => {
  it('shoots with the Crossbow from the gear row', async () => {
    const state = makeState({ gear: ['crossbow'], zombies: [{ at: 'street' }] })
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    render(<GameScreen seed={1} initialState={state} {...handlers} />)
    const gear = within(screen.getByRole('list', { name: texts.ui.gear }))
    await userEvent.setup().click(gear.getByRole('button', { name: texts.ui.shoot(1) }))
    const log = within(screen.getByRole('region', { name: texts.ui.log }))
    expect(log.getByText(texts.log.gearUsed(texts.cards.crossbow.name))).toBeTruthy()
  })

  it('lets you pick a target next door for the Bow', async () => {
    const state = makeState({ hand: ['bow'], zombies: [{ at: 'street' }, { at: 'street' }] })
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    const view = render(<GameScreen seed={1} initialState={state} {...handlers} />)
    const user = userEvent.setup()
    const bow = view.container.querySelector<HTMLElement>('[data-card="bow"]')!
    await user.click(within(bow).getByRole('button', { name: texts.ui.play }))
    expect(screen.getByText(texts.ui.chooseZombieInRange, { exact: false })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /^Street/ }))
    const targets = screen.getAllByRole('button', { name: new RegExp(`^${texts.ui.target}`) })
    await user.click(targets[0]!)
    const log = within(screen.getByRole('region', { name: texts.ui.log }))
    expect(log.getByText(texts.log.zombieHit(2, 0))).toBeTruthy()
  })
})

describe('GameScreen: the danger ramp', () => {
  it('says only finds raise danger next while the first pack is still calm', () => {
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    render(<GameScreen seed={1} initialState={makeState({})} {...handlers} />)
    const every = balance.danger.perFindsTaken
    expect(screen.getByText(texts.ui.dangerNext(every, true), { exact: false })).toBeTruthy()
  })

  it('shows a notice when danger rises, says what raises it next, and marks tougher zombies', async () => {
    const state = makeState({
      location: 'pharmacy',
      packsAt: ['pharmacy'],
      packs: 1,
      danger: 2,
      zombies: [{ at: 'street' }],
    })
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    const view = render(<GameScreen seed={1} initialState={state} {...handlers} />)
    const every = balance.danger.perFindsTaken
    expect(screen.getByText(texts.ui.dangerNext(every), { exact: false })).toBeTruthy()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    expect(screen.getByText(texts.ui.dangerBanner.title(3))).toBeTruthy()
    expect(screen.getByText(texts.ui.dangerBanner.tougher(1))).toBeTruthy()
    expect(view.container.querySelector('.ztough')).not.toBeNull()
    await user.click(screen.getByRole('button', { name: texts.ui.dangerBanner.close }))
    expect(screen.queryByText(texts.ui.dangerBanner.title(3))).toBeNull()
  })
})

describe('GameScreen: rules and the end of an expedition', () => {
  const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']

  function renderState(state: GameState, showRulesOnStart = false) {
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    render(
      <GameScreen
        seed={state.seed}
        initialState={state}
        showRulesOnStart={showRulesOnStart}
        {...handlers}
      />,
    )
    const node = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}`) })
    return { ...handlers, node, user: userEvent.setup() }
  }

  it('opens the rules from the status bar and closes them with Escape', async () => {
    const { user } = renderState(makeState({ draw }))
    expect(screen.queryByRole('region', { name: texts.rules.title })).toBeNull()
    await user.click(screen.getByRole('button', { name: texts.rules.short }))
    const rules = screen.getByRole('region', { name: texts.rules.title })
    expect(within(rules).getByRole('heading', { name: 'Zombies' })).toBeTruthy()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: texts.rules.title })).toBeNull()
  })

  it('can show the rules as soon as the game starts', async () => {
    const { user } = renderState(makeState({ draw }), true)
    const rules = screen.getByRole('region', { name: texts.rules.title })
    await user.click(within(rules).getByRole('button', { name: texts.rules.close }))
    expect(screen.queryByRole('region', { name: texts.rules.title })).toBeNull()
  })

  it('asks before a move home ends the expedition', async () => {
    const { node, user } = renderState(makeState({ draw, location: 'street', packs: 3 }))
    await user.click(node('Shelter'))
    let ask = screen.getByRole('group', { name: texts.confirmHome.title })
    expect(within(ask).getByText(texts.confirmHome.body(3, 2))).toBeTruthy()
    expect(within(ask).getByText(texts.confirmHome.next(4))).toBeTruthy()

    await user.click(within(ask).getByRole('button', { name: texts.confirmHome.no }))
    expect(screen.queryByRole('group', { name: texts.confirmHome.title })).toBeNull()
    expect(node('Street').getAttribute('aria-label')).toContain(texts.ui.youAreHere)

    await user.click(node('Shelter'))
    ask = screen.getByRole('group', { name: texts.confirmHome.title })
    await user.click(within(ask).getByRole('button', { name: texts.confirmHome.yes }))
    const end = screen.getByRole('region', { name: texts.ui.outcomeTitle.home })
    expect(within(end).getByText(texts.ui.outcomeStars(2, 3))).toBeTruthy()
    expect(within(end).getByText(texts.end.home(1, 3))).toBeTruthy()
    expect(within(end).getByText(texts.end.tips.moreStars(4))).toBeTruthy()
  })

  it('plays Repack by picking a card to discard, then draws 1', async () => {
    const { user } = renderState(makeState({ draw, hand: ['repack', 'nerves', 'run'] }))
    const repack = document.querySelector<HTMLElement>('[data-card="repack"]')!
    await user.click(within(repack).getByRole('button', { name: texts.ui.play }))
    expect(screen.getByRole('status').textContent).toContain(texts.ui.chooseDiscardTarget)
    const nerves = document.querySelector<HTMLElement>('[data-card="nerves"]')!
    await user.click(within(nerves).getByRole('button', { name: texts.ui.discard }))
    const log = within(screen.getByRole('region', { name: texts.ui.log }))
    expect(log.getByText(texts.log.cardDiscarded('Nerves'))).toBeTruthy()
    expect(document.querySelectorAll('[data-card="bandage"]')).toHaveLength(1)
  })

  it('never opens a pop-up window over the game', async () => {
    const { user } = renderState(makeState({ draw, location: 'street', packs: 3 }))
    await user.click(screen.getByRole('button', { name: /^Shelter/ }))
    // The question about going home sits above the hand, with the hand and map still there.
    expect(screen.getByRole('group', { name: texts.confirmHome.title })).toBeTruthy()
    expect(screen.getByRole('list', { name: texts.ui.hand })).toBeTruthy()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.querySelector('[aria-modal]')).toBeNull()
  })

  it('uses the Workshop service to trash a card from your hand', async () => {
    const { user } = renderState(makeState({ draw, location: 'workshop', hand: ['nerves', 'run'] }))
    const name = texts.services.dismantle.name
    await user.click(screen.getByRole('button', { name: texts.ui.useService(name, 1) }))
    expect(screen.getByRole('status').textContent).toContain(texts.ui.chooseTrashTarget)
    expect(screen.getByRole('button', { name: texts.ui.endTurn })).toHaveProperty('disabled', true)
    const nerves = document.querySelector<HTMLElement>('[data-card="nerves"]')!
    await user.click(within(nerves).getByRole('button', { name: texts.ui.trash }))
    const log = within(screen.getByRole('region', { name: texts.ui.log }))
    expect(log.getByText(texts.log.serviceUsed(name, 'Workshop'))).toBeTruthy()
    expect(log.getByText(texts.log.cardTrashed('Nerves'))).toBeTruthy()
    expect(document.querySelector('[data-card="nerves"]')).toBeNull()
  })

  it('opens a found stash with a Tool card and shows rare finds', async () => {
    const state = makeState({
      draw,
      location: 'houseA',
      hand: ['crowbar', 'run'],
      stashAt: { houseA: 'found' },
    })
    const { user } = renderState(state)
    expect(screen.getByText(texts.ui.stashStatus.found)).toBeTruthy()
    expect(
      screen.getByRole('button', { name: texts.ui.forceStash(2, 2) }).hasAttribute('disabled'),
    ).toBe(false)
    await user.click(screen.getByRole('button', { name: texts.ui.openStashWith('Crowbar', 1) }))
    const dialog = screen.getByRole('region', { name: texts.ui.stashTitle })
    expect(within(dialog).getAllByText(texts.ui.rare)).toHaveLength(2)
    const log = within(screen.getByRole('region', { name: texts.ui.log }))
    expect(log.getByText(texts.log.stashOpened('Crowbar'))).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: texts.ui.takeNothing }))
    expect(screen.getByText(texts.ui.stashStatus.opened)).toBeTruthy()
  })

  it('explains why a service cannot be used', () => {
    renderState(makeState({ draw, location: 'pharmacy', hand: ['run', 'search'] }))
    const button = screen.getByRole('button', {
      name: texts.ui.useService(texts.services.patchUp.name, 1),
    })
    expect(button).toHaveProperty('disabled', true)
    expect(screen.getByText(texts.reasons.noTrashTarget)).toBeTruthy()
  })

  it('does not ask when walking home without enough packs', async () => {
    const { node, user } = renderState(makeState({ draw, location: 'street', packs: 1 }))
    await user.click(node('Shelter'))
    expect(screen.queryByRole('group', { name: texts.confirmHome.title })).toBeNull()
    expect(node('Shelter').getAttribute('aria-label')).toContain(texts.ui.youAreHere)
  })

  it('explains a death and shows the numbers', async () => {
    const state = makeState({ draw, hp: 1, location: 'houseA', zombies: [{ at: 'houseA' }] })
    const { onNewExpedition, user } = renderState(state)
    await user.click(screen.getByRole('button', { name: texts.ui.endTurn }))
    const end = screen.getByRole('region', { name: texts.ui.outcomeTitle.killed })
    expect(within(end).getByText(texts.end.killed(1))).toBeTruthy()
    expect(within(end).getByText(texts.end.zombieDamage(1, 0, 1))).toBeTruthy()
    expect(within(end).getByText(texts.end.tips.attacked)).toBeTruthy()
    const stats = within(end).getByRole('region', { name: texts.end.statsHeading })
    expect(within(stats).getByText(texts.end.stats.health).nextSibling?.textContent).toBe('0')
    expect(within(end).getByText(texts.end.seed(state.seed))).toBeTruthy()
    await user.click(within(end).getByRole('button', { name: texts.ui.newExpedition }))
    expect(onNewExpedition).toHaveBeenCalledOnce()
  })
})
