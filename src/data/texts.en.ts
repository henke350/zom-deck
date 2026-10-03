/**
 * All player-facing text (the game is in English). Keep wording here so a
 * translation can be added later without touching rules or UI code.
 */
export const texts = {
  title: 'One More Building',
  workingTitleNote: 'Working title',
  tagline: 'Head home with what you have, or risk one more building?',
  statusLine: 'Prototype in progress · milestone M3 (search, finds and supply packs)',
  startExpedition: 'Start expedition',
  prototypeNote:
    'Early prototype: walk the city, search buildings and bring supply packs home. Zombies arrive in M4.',
  factsHeading: 'Starting values',
  facts: {
    turns: 'turns before dark',
    health: 'health',
    hand: 'cards in hand',
    ap: 'action points per turn',
  },

  locations: {
    shelter: { name: 'Shelter', description: 'Your safe base. Come back with supplies to win.' },
    street: { name: 'Street', description: 'A hub with routes to five places. Nothing to search.' },
    houseA: { name: 'House A', description: 'A quiet home close to the shelter.' },
    houseB: { name: 'House B', description: 'A home between the pharmacy and the street.' },
    supermarket: { name: 'Supermarket', description: 'Always holds one supply pack.' },
    pharmacy: { name: 'Pharmacy', description: 'Medicine and bandages.' },
    workshop: { name: 'Workshop', description: 'Tools, and a bench to dismantle junk.' },
    police: {
      name: 'Police Station',
      description: 'The best gear, the most danger, the longest walk.',
    },
  },

  locationKinds: {
    shelter: 'Shelter',
    street: 'Street',
    building: 'Building',
  },

  ui: {
    health: 'Health',
    ap: 'AP',
    turn: 'Turn',
    dusk: 'Dusk',
    packs: 'Packs',
    starsHint: (thresholds: readonly number[]) =>
      thresholds.map((n, i) => `${'★'.repeat(i + 1)} ${n}`).join(' · '),
    drawPile: 'Draw',
    discardPile: 'Discard',
    removedPile: 'Removed',
    seed: 'Seed',
    hand: 'Your hand',
    endTurn: 'End turn',
    endTurnKeeping: (name: string) => `End turn (keep ${name})`,
    keep: 'Keep',
    quickSearch: (cost: number, options: number) =>
      `Quick search (${cost} AP, ${options} finds, no card needed)`,
    searchesLeft: (left: number, max: number) => `Searches left: ${left} of ${max}`,
    searchedOutShort: 'Searched out',
    mapSearches: (left: number, max: number) => `${left}/${max} searches`,
    packStatus: {
      always: 'Supply pack: always one here',
      unknown: 'Supply pack: unknown until you search',
      found: 'Supply pack: found',
      none: 'Supply pack: none here',
    },
    findTitle: 'Choose a find',
    findIntro: (place: string) => `You searched ${place}. Take one find, or scrap a card instead.`,
    packBanner: (packs: number) =>
      `You found a supply pack! You now carry ${packs}. It adds a Heavy Load to your deck.`,
    take: 'Take',
    scrapHeading: 'Or scrap one card from your hand for good',
    scrap: (name: string) => `Scrap ${name}`,
    takeNothing: 'Take nothing',
    noFinds: 'Nothing useful here.',
    play: 'Play',
    trash: 'Trash',
    youToken: 'You',
    keeping: 'Keeping',
    keepHint: (n: number) => `You may keep ${n} unplayed card for next turn.`,
    cancel: 'Cancel',
    chooseDestination: 'Choose where to go on the map.',
    chooseTrashTarget: 'Choose a card in your hand to trash.',
    youAreHere: 'You are here',
    stepsAway: (n: number) => `${n} step${n === 1 ? '' : 's'} away`,
    freeMoveAvailable: 'Free move available: click a highlighted neighbour.',
    freeMoveCosts: (ap: number) => `Free move costs ${ap} AP (Heavy Load in hand).`,
    freeMoveUsed: 'Free move used this turn.',
    log: 'Log',
    map: 'City map',
    location: 'Location',
    newExpedition: 'New expedition',
    sameCity: 'Same city again',
    backToTitle: 'Title screen',
    cost: (ap: number) => `${ap} AP`,
    noise: (n: number) => `+${n} noise`,
    followUpActive: 'Follow-up ready',
    useUp: 'Use up',
    playMode: (n: number) => `Option ${n}`,
    outcomeTitle: {
      home: 'You made it home!',
      killed: 'You did not survive.',
      darkness: 'Darkness fell before you got home.',
    },
    outcomeStars: (stars: number) => `${'★'.repeat(stars)} (${stars} of 3)`,
  },

  log: {
    turnStarted: (turn: number) => `Turn ${turn} begins.`,
    deckShuffled: 'Your discard pile is shuffled into a new draw pile.',
    cardsDrawn: (n: number) => `You draw ${n} card${n === 1 ? '' : 's'}.`,
    cardPlayed: (name: string, followUp: boolean, usedUp: boolean) =>
      `You play ${name}${followUp ? ' (Follow-up)' : ''}${usedUp ? ' and use it up' : ''}.`,
    moved: (to: string, by: string, apCost: number) =>
      `You go to ${to}${by ? ` with ${by}` : ''}${apCost > 0 ? ` (${apCost} AP)` : ''}.`,
    apGained: (n: number) => `You gain ${n} AP.`,
    healed: (n: number) => `You heal ${n}.`,
    hpLost: (n: number) => `You lose ${n} health.`,
    cardTrashed: (name: string) => `You trash ${name}.`,
    searchBonusAdded: (n: number) => `Your next search reveals +${n}.`,
    blockAdded: (n: number) => `You will block ${n} damage this turn.`,
    cardsKept: (names: string) => `You keep ${names} for next turn.`,
    searched: (place: string, n: number, quick: boolean) =>
      `You ${quick ? 'quickly search' : 'search'} ${place} and find ${n} thing${n === 1 ? '' : 's'}.`,
    packFound: (packs: number) => `You find a supply pack! You carry ${packs}.`,
    heavyLoadGained: 'A Heavy Load goes into your discard pile.',
    findTaken: (name: string) => `You take ${name}. It goes into your discard pile.`,
    cardScrapped: (name: string) => `You scrap ${name} for good.`,
    findDeclined: 'You leave the finds behind.',
    turnEnded: (turn: number) => `Turn ${turn} ends.`,
  },

  tags: {
    quiet: 'Quiet',
    weapon: 'Weapon',
    move: 'Move',
    tool: 'Tool',
    med: 'Med',
  },

  cards: {
    search: { name: 'Search', text: 'Search here: reveal 3 finds, keep 1.' },
    crowbar: {
      name: 'Crowbar',
      text: 'Deal 1 damage. Or: your next search this turn reveals +1 find.',
      modes: ['Hit', 'Pry open'],
    },
    run: { name: 'Run', text: 'Move to an adjacent location.' },
    sneak: {
      name: 'Sneak',
      text: "One zombie here doesn't attack this turn and loses track of you.",
    },
    nerves: { name: 'Nerves', text: 'Unplayable.' },
    heavyLoad: {
      name: 'Heavy Load',
      text: "Unplayable. Can't be trashed. While it's in your hand, your free move costs 1 AP.",
    },
    wound: {
      name: 'Wound',
      text: 'Unplayable. You gain one when you lose 2+ health in one zombie phase.',
    },
    softSoles: {
      name: 'Soft Soles',
      text: "Move 1. Zombies where you arrive don't notice you this turn.",
    },
    lockpick: {
      name: 'Lockpick',
      text: 'Search here with no noise. Follow-up Quiet: reveal +1 find.',
    },
    flashlight: {
      name: 'Flashlight',
      text: 'Your next search this turn reveals +1 find. Follow-up Tool: draw 1 card.',
    },
    alarmClock: {
      name: 'Alarm Clock',
      text: "Use up: zombies here don't attack this turn and lose track of you.",
    },
    baseballBat: { name: 'Baseball Bat', text: 'Deal 1 damage. Draw 1 card.' },
    axe: { name: 'Axe', text: 'Deal 2 damage. Follow-up Weapon: +1 damage.' },
    pistol: { name: 'Pistol', text: 'Deal 3 damage. +2 noise.' },
    molotov: {
      name: 'Molotov',
      text: "Use up: deal 2 damage to every zombie here. +2 noise. This building can't be searched again.",
    },
    kevlarVest: {
      name: 'Kevlar Vest',
      text: 'Prevent up to 2 damage this turn. Follow-up Weapon: prevent 3 instead.',
    },
    runningShoes: { name: 'Running Shoes', text: 'Move up to 2. Follow-up Move: draw 1 card.' },
    adrenaline: { name: 'Adrenaline', text: 'Gain 2 AP. Lose 1 health.' },
    travelLight: {
      name: 'Travel Light',
      text: 'If you own 10 or fewer cards: gain 1 AP and draw 1 card.',
    },
    toolbox: { name: 'Toolbox', text: 'Trash a card from your hand. Follow-up Tool: draw 1 card.' },
    districtMap: {
      name: 'District Map',
      text: 'See the exact zombies in a building within 2 steps, and whether it has a pack. Use up: see all buildings.',
      modes: ['Scout one', 'Use up: scout all'],
    },
    bandage: {
      name: 'Bandage',
      text: 'Heal 1. Use up: heal 3 instead.',
      modes: ['Heal 1', 'Use up: heal 3'],
    },
    painkillers: {
      name: 'Painkillers',
      text: 'Trash a Nerves or Wound from your hand. Draw 1 card.',
    },
  },

  /** Why an action is not allowed. Shown next to disabled controls. */
  reasons: {
    gameOver: 'The expedition is over.',
    notInHand: 'That card is not in your hand.',
    unknownCard: 'Unknown card.',
    unplayable: "This card can't be played.",
    noSuchMode: 'This card has no such option.',
    notEnoughAp: (cost: number, ap: number) => `Needs ${cost} AP. You have ${ap}.`,
    ownedTooMany: (max: number, owned: number) =>
      `Only works if you own ${max} or fewer cards. You own ${owned}.`,
    notBuiltYet: 'This effect is not built yet.',
    chooseTrash: 'Choose a card in your hand to trash.',
    trashNotInHand: 'The card to trash must be in your hand.',
    trashSelf: "A card can't trash itself.",
    notTrashable: "That card can't be trashed.",
    trashJunkOnly: 'Only Nerves or Wound can be trashed with this card.',
    keepTooMany: (max: number) => `You can keep at most ${max} card${max === 1 ? '' : 's'}.`,
    keepNotInHand: 'You can only keep cards from your hand.',
    noTrashTarget: 'You have no card in hand that this can trash.',
    nothingToSearch: 'There is nothing to search here.',
    searchedOut: 'This building has no searches left.',
    chooseFindFirst: 'Choose a find first: take one, scrap a card, or take nothing.',
    noFindToChoose: 'There is no find to choose right now.',
    notAFind: 'That card is not one of the finds.',
    unknownLocation: 'Unknown location.',
    alreadyHere: 'You are already here.',
    notAdjacent: 'Not next to where you are. The free move is one step.',
    freeMoveUsed: 'You have already used your free move this turn.',
    freeMoveNeedsAp: (cost: number, ap: number) =>
      `Heavy Load makes the free move cost ${cost} AP. You have ${ap}.`,
    chooseDestination: 'Choose where to go.',
    tooFar: (max: number) =>
      `Too far. This card moves you up to ${max} step${max === 1 ? '' : 's'}.`,
    noDestination: 'There is nowhere this card can take you.',
  },
} as const
