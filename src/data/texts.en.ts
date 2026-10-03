import type { Balance } from './balance'

/**
 * All player-facing text (the game is in English). Keep wording here so a
 * translation can be added later without touching rules or UI code.
 */
export const texts = {
  title: 'One More Building',
  workingTitleNote: 'Working title',
  tagline: 'Head home with what you have, or risk one more building?',
  statusLine: 'Prototype in progress · milestone M6 (all content, bots and balance)',
  startExpedition: 'Start expedition',
  prototypeNote:
    'Early prototype: search the city for supply packs, keep the noise down, and get home before dark.',
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
    pharmacy: { name: 'Pharmacy', description: 'Medicine, bandages, and a place to patch up.' },
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
    burnedShort: 'Burned',
    noiseLabel: 'Noise',
    noiseBadge: (n: number, arrivals: number) =>
      arrivals > 0 ? `+${n} noise · zombie!` : `+${n} noise`,
    zombiesRange: (min: number, max: number) => (min === max ? `${min}?` : `${min}–${max}?`),
    zombiesHeading: 'Zombies here',
    zombiesUnknown: (min: number, max: number) =>
      `Zombies: ${min === max ? min : `${min}–${max}`} (exact number unknown until you go in)`,
    zombiesNone: 'No zombies here.',
    zombieLabel: (n: number) => `Zombie ${n}`,
    zombieHealth: (hp: number, max: number) => `${hp}/${max} health`,
    zombieSeenYou: 'has seen you',
    zombieDistracted: 'distracted this turn',
    target: 'Target',
    chooseZombieTarget: 'Choose a zombie to target in the side panel.',
    chooseOnMap: 'Choose a place on the map.',
    packScouted: (hasPack: boolean) =>
      hasPack ? 'Supply pack: yes (scouted)' : 'Supply pack: none here (scouted)',
    preview: {
      safe: 'No zombie will attack when you end the turn.',
      attack: (n: number, damage: number, blocked: number) =>
        `${n} zombie${n === 1 ? '' : 's'} will attack: −${damage} health${blocked > 0 ? ` (${blocked} blocked)` : ''}.`,
      lethal: 'Ending the turn here will kill you!',
      wound: 'The attack will leave a Wound in your deck.',
      followers: (n: number) => `${n} zombie${n === 1 ? '' : 's'} will follow you.`,
      dusk: (noise: number, arrivals: number) =>
        `Dusk: +${noise} noise${arrivals > 0 ? ', and a zombie arrives' : ''}.`,
    },
    findNoise: (noise: number, arrivals: number) =>
      noise === 0
        ? 'This search was silent.'
        : `Choosing ends the search: +${noise} noise${arrivals > 0 ? ', and a zombie arrives!' : '.'}`,
    packStatus: {
      always: 'Supply pack: always one here',
      unknown: 'Supply pack: unknown until you search',
      found: 'Supply pack: found',
      none: 'Supply pack: none here',
      burned: 'Supply pack: lost in the fire, if there was one',
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
    useService: (name: string, cost: number) => `${name} (${cost} AP)`,
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
    outcomeStars: (stars: number, max: number) => `${'★'.repeat(stars)} (${stars} of ${max})`,
  },

  services: {
    dismantle: { name: 'Dismantle', text: 'Trash a card from your hand.' },
    patchUp: { name: 'Patch up', text: 'Trash a Nerves or Wound from your hand.' },
  },

  rules: {
    title: 'How to play',
    open: 'How to play',
    short: 'Rules',
    close: 'Got it',
    intro: 'One city, one deck, ten turns. Bring supplies home before dark.',
    sections: (b: Balance) => [
      {
        heading: 'Goal',
        items: [
          `Find at least ${b.packsToWin} supply packs and walk back into the Shelter before the end of turn ${b.turnLimit}.`,
          `More packs give more stars: ${b.starThresholds.map((n, i) => `${'★'.repeat(i + 1)} for ${n}`).join(', ')}. You decide when to go home.`,
        ],
      },
      {
        heading: 'Your turn',
        items: [
          `Draw up to ${b.handSize} cards and get ${b.apPerTurn} AP. Play a card by paying its AP cost.`,
          'Once per turn you may walk one step for free: click a highlighted neighbour on the map.',
          `When you end the turn you may keep ${b.keepCards} unplayed card. The rest are discarded.`,
        ],
      },
      {
        heading: 'Searching',
        items: [
          `Play Search in a building to see ${b.searchOptions} finds, or ${b.searchOptions + b.peacefulSearchBonus} if no zombie is there. Take one into your deck, scrap a card from your hand for good, or take nothing.`,
          `No Search card? A quick search costs ${b.quickSearch.cost} AP and shows ${b.quickSearch.options} finds. Each building can be searched ${b.searchesPerBuilding} times.`,
          `The first search in a building that hides a pack gives you the pack and a Heavy Load card that clogs your deck. The Supermarket always has a pack.`,
        ],
      },
      {
        heading: 'Zombies',
        items: [
          `When you end your turn, zombies that have seen you follow you one step. Then every zombie where you stand attacks for ${b.zombie.damage} health. Block soaks up damage.`,
          'Zombies two steps away lose track of you, and they never enter the Shelter.',
          "A building's zombies are only a guess until you go in or scout it. Next to the End turn button you can see who will attack.",
          ...(b.wounds.enabled
            ? [
                `Losing ${b.wounds.damageInOnePhase} or more health in one zombie phase adds a Wound (junk) to your deck.`,
              ]
            : []),
        ],
      },
      {
        heading: 'Noise',
        items: [
          `Searching and loud cards make noise. Every ${b.noiseThreshold} noise brings one more zombie to you.`,
          `Dusk starts on turn ${b.duskFromTurn}: from then on every turn adds ${b.duskNoise} noise.`,
        ],
      },
      {
        heading: 'Your deck',
        items: [
          'Trash weak cards so your good cards come up more often. Nerves and Wound are junk. Heavy Load cannot be trashed.',
          'Follow-up: a card gets stronger if you already played a card with the named tag this turn.',
          'Use up: the card is removed for good after you play it.',
          `Workshop: Dismantle and Pharmacy: Patch up trash a card from your hand for ${b.locationServiceCost} AP. Patch up only takes Nerves and Wound.`,
        ],
      },
      {
        heading: 'Losing',
        items: [
          `At 0 health you die. At the end of turn ${b.turnLimit} night falls and the expedition is lost.`,
        ],
      },
    ],
  },

  confirmHome: {
    title: 'Go home now?',
    body: (packs: number, stars: number) =>
      `Walking into the Shelter ends the expedition with ${packs} supply packs: ${'★'.repeat(stars)}.`,
    next: (packs: number) => `With ${packs} packs you would get one more star.`,
    yes: 'Go home',
    no: 'Not yet',
  },

  end: {
    heading: 'What happened',
    statsHeading: 'Expedition',
    tipHeading: 'Tip',
    home: (turn: number, packs: number) =>
      `You walked into the Shelter on turn ${turn} with ${packs} supply packs.`,
    killed: (turn: number) => `You died on turn ${turn}.`,
    darkness: (turn: number, packs: number, needed: number) =>
      packs >= needed
        ? `Night fell at the end of turn ${turn}. You had ${packs} supply packs, but you were not in the Shelter.`
        : `Night fell at the end of turn ${turn}. You had ${packs} of the ${needed} supply packs you needed.`,
    wounds: (n: number) => `The attacks left ${count(n, 'Wound')} in your deck.`,
    zombieDamage: (damage: number, followers: number, there: number) =>
      `Zombies took ${damage} health. ${count(followers, 'attack')} came from zombies that followed you, ${there} from zombies that were already there.`,
    cardDamage: (damage: number) => `Your own cards cost ${damage} health.`,
    blocked: (n: number) => `Block stopped ${n} damage.`,
    arrivals: (noise: number, dusk: number) => {
      if (noise > 0 && dusk > 0) return `Noise brought ${count(noise, 'zombie')} and dusk ${dusk}.`
      return noise > 0
        ? `Noise brought ${count(noise, 'zombie')}.`
        : `Dusk brought ${count(dusk, 'zombie')}.`
    },
    tips: {
      followers:
        'Zombies that have seen you follow one step each turn. Walk two steps in one turn to shake them off (a move card plus the free move), or fight them first.',
      noise: (threshold: number) =>
        `Every ${threshold} noise calls a zombie. Quiet cards, fewer searches and fewer loud weapons keep the count down.`,
      attacked:
        'Read the warning next to the End turn button. When it says zombies will attack, leave, block or fight first.',
      packsShort: (needed: number) =>
        `You need ${needed} packs. The Supermarket always holds one. Head for a pack early and save turns for the walk home.`,
      notHome:
        'You had enough packs. Start walking home earlier: dusk turns the turn counter amber.',
      moreStars: (packs: number) =>
        `Bring ${packs} packs for one more star, if you dare one more building.`,
      perfect: 'Full stars. Try a new city.',
    },
    stats: {
      turns: 'Turns',
      health: 'Health left',
      packs: 'Supply packs',
      steps: 'Steps walked',
      searches: 'Searches',
      cardsTaken: 'Cards taken',
      cardsRemoved: 'Cards removed',
      killed: 'Zombies killed',
      damage: 'Damage taken',
      damageValue: (zombies: number, cards: number, blocked: number) =>
        `${zombies} from zombies, ${cards} from your cards, ${blocked} blocked`,
      healed: 'Health healed',
      noise: 'Noise made',
      arrivals: 'Zombies drawn in',
      arrivalsValue: (noise: number, dusk: number) => `${noise} by noise, ${dusk} by dusk`,
      none: 'none',
    },
    seed: (seed: number) => `City seed ${seed}. "Same city again" replays this map.`,
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
    serviceUsed: (service: string, place: string) => `You use ${service} at the ${place}.`,
    woundGained: 'The attack leaves a Wound in your discard pile.',
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
    noiseAdded: (amount: number) => `Noise +${amount}.`,
    zombieArrived: (place: string, dusk: boolean) =>
      dusk ? `Dusk falls: a zombie arrives at ${place}.` : `The noise draws a zombie to ${place}!`,
    zombieFollowed: (place: string) => `A zombie follows you to ${place}.`,
    zombieLostTrack: 'A zombie loses track of you.',
    zombieAttacked: (damage: number) => `A zombie attacks you (${damage} damage).`,
    damageBlocked: (n: number) => `You block ${n} damage.`,
    zombieHit: (damage: number, hpLeft: number) =>
      hpLeft > 0
        ? `You hit a zombie for ${damage}. It has ${hpLeft} health left.`
        : `You hit a zombie for ${damage}.`,
    zombieKilled: 'The zombie goes down.',
    zombieNeutralized: 'A zombie loses track of you this turn.',
    scouted: (places: string) => `You scout ${places}.`,
    buildingBurned: (place: string) => `${place} burns. It can't be searched again.`,
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
    noServiceHere: 'There is nothing to use here.',
    nothingToSearch: 'There is nothing to search here.',
    searchedOut: 'This building has no searches left.',
    chooseFindFirst: 'Choose a find first: take one, scrap a card, or take nothing.',
    noFindToChoose: 'There is no find to choose right now.',
    notAFind: 'That card is not one of the finds.',
    burned: 'This building has burned. It cannot be searched again.',
    noZombiesHere: 'There are no zombies here.',
    chooseZombie: 'Choose a zombie here.',
    zombieNotHere: 'That zombie is not here.',
    chooseBuildingToScout: 'Choose a building to scout.',
    notABuildingToScout: 'Only buildings can be scouted.',
    tooFarToScout: (range: number) => `Too far. You can scout buildings up to ${range} steps away.`,
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

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`
}
