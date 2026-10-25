import type { Balance } from './balance'

/**
 * All player-facing text (the game is in English). Keep wording here so a
 * translation can be added later without touching rules or UI code.
 */
export const texts = {
  title: 'One More Building',
  workingTitleNote: 'Working title',
  tagline: 'Head home with what you have, or risk one more building?',
  statusLine: 'Prototype · milestone M8 (polish and release)',
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
    houseA: { name: 'House A', description: 'A quiet family home.' },
    houseB: { name: 'House B', description: 'A home with a garage full of junk.' },
    supermarket: { name: 'Supermarket', description: 'Always holds one supply pack.' },
    pharmacy: { name: 'Pharmacy', description: 'Medicine, bandages, and a place to patch up.' },
    workshop: { name: 'Workshop', description: 'Tools, and a bench to dismantle junk.' },
    police: {
      name: 'Police Station',
      description: 'The best gear and the most danger.',
    },
    gasStation: { name: 'Gas Station', description: 'Fuel, snacks and a few tools.' },
    school: { name: 'School', description: 'Long corridors. Maps, first aid and lockers.' },
    hospital: {
      name: 'Hospital',
      description: 'Plenty of medicine, plenty of the dead. You can patch up here.',
    },
    apartments: {
      name: 'Apartment Block',
      description: 'Many small flats, many locked doors. Medicine cabinets and noisy neighbours.',
    },
    church: {
      name: 'Church',
      description: 'Quiet and cool. A good place to calm your nerves (patch up).',
    },
    sportsShop: {
      name: 'Sports Shop',
      description: 'Shoes, bats and bikes. Runners like it here too.',
    },
    square: {
      name: 'Town Square',
      description: 'An open square with roads in four directions. Nothing to search.',
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
    dangerLabel: 'Danger',
    dangerNext: (finds: number, calmPack = false) =>
      `next: ${calmPack ? '' : 'a pack or '}${finds} ${finds === 1 ? 'find' : 'finds'}`,
    dangerBanner: {
      title: (level: number) => `Danger ${level}`,
      intro: 'You are getting stronger, and so is the city.',
      tougher: (n: number) => `Every zombie now has +${n} health.`,
      noise: (threshold: number, arrivals: number) =>
        `Every ${threshold} noise brings ${arrivals === 1 ? 'a zombie' : `${arrivals} zombies`}.`,
      newKinds: (kinds: string) => `New zombies can be ${kinds}.`,
      finds: (n: number) => `Every search finds +${n}.`,
      close: 'Got it',
    },
    tougherZombie: 'tougher than usual',
    dangerBonus: (finds: number) => `Danger · +${finds} find`,
    noiseBadge: (n: number, arrivals: number) =>
      arrivals > 0 ? `+${n} noise · zombie!` : `+${n} noise`,
    zombiesRange: (min: number, max: number) => (min === max ? `${min}?` : `${min}–${max}?`),
    zombiesHeading: 'Zombies here',
    zombiesUnknown: (min: number, max: number) =>
      `Zombies: ${min === max ? min : `${min}–${max}`} (exact number unknown until you go in)`,
    zombiesNone: 'No zombies here.',
    zombieKindLabel: (kind: string, n: number) => `${kind} ${n}`,
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
      scream: (noise: number, arrivals: number) =>
        `Screamers: +${noise} noise${arrivals > 0 ? ', and a zombie arrives' : ''}.`,
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
    findIntro: (place: string) =>
      `You searched ${place}. Take one find into your hand, or take nothing.`,
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
    tipLabel: 'Tip',
    hideTips: 'Hide tips',
    showTips: 'Show tips for new players',
    hints: {
      goHome:
        'You have enough supplies. Walk back to the Shelter to win, or risk one more building for more stars.',
      zombies: 'Zombies here attack when you end the turn. Hit them, sneak, or walk away first.',
      search:
        'Play Search (or Quick search in the panel) to look for supplies. The first search finds a hidden pack.',
      walk: 'Pick a highlighted place on the map to walk there for free. "0–3?" is how many zombies might be inside.',
      endTurn: (n: number) => `Nothing more to do? End the turn. You may keep ${n} card.`,
    },
    cancel: 'Cancel',
    chooseDestination: 'Choose where to go on the map.',
    goHere: 'Go here',
    gear: 'Gear',
    gearLeft: (lasts: 'absorbs' | 'untilHit' | 'turns' | 'uses', n: number) =>
      lasts === 'absorbs'
        ? `takes ${n} more damage`
        : lasts === 'untilHit'
          ? 'until a zombie hurts you'
          : lasts === 'uses'
            ? `${n} ${n === 1 ? 'bolt' : 'bolts'} left`
            : n === 1
              ? 'last turn'
              : `${n} turns left`,
    shoot: (cost: number) => `Shoot (${cost} AP)`,
    chooseZombieInRange:
      'Choose the zombie to hit. Tap a nearby place on the map to see zombies there.',
    chooseTrashTarget: 'Choose a card in your hand to trash.',
    chooseDiscardTarget: 'Choose a card in your hand to discard.',
    discard: 'Discard',
    useService: (name: string, cost: number) => `${name} (${cost} AP)`,
    rare: 'Rare',
    unknownBuilding: 'Unknown building',
    unknownShort: '?',
    unknownMapName: 'Unknown',
    unknownDescription: 'Walk next to it to see what it is. A District Map shows it from afar.',
    stashHeading: 'Locked stash',
    stashText: 'Rare finds inside. Open it with a Tool card, or force it open.',
    openStashWith: (name: string, cost: number) => `Open with ${name} (${cost} AP)`,
    forceStash: (cost: number, noise: number) => `Force it open (${cost} AP, +${noise} noise)`,
    stashStatus: {
      found: 'Locked stash: found, still closed',
      opened: 'Locked stash: opened',
      lost: 'Locked stash: lost in the fire',
      scouted: 'Locked stash: yes (scouted)',
    },
    stashBanner: 'You also found a locked stash! Open it from the side panel.',
    stashTitle: 'Inside the stash',
    bodyTitle: 'Search the body',
    bodyIntro: 'It carried something. Take one find into your hand, or take nothing.',
    stashIntro: 'Take one rare find, or take nothing.',
    youAreHere: 'You are here',
    stepsAway: (n: number) => `${n} step${n === 1 ? '' : 's'} away`,
    freeMoveAvailable: 'Free move available: choose a highlighted neighbour.',
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

  zombieKinds: {
    walker: { name: 'Walker', short: 'W', text: 'Follows you one step.' },
    runner: { name: 'Runner', short: 'R', text: 'Fast and fragile: follows you up to two steps.' },
    brute: { name: 'Brute', short: 'B', text: 'Tough and hits for 2, but never leaves its place.' },
    screamer: {
      name: 'Screamer',
      short: 'S',
      text: 'Does not bite, but while it has seen you it shrieks: +2 noise every turn.',
    },
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
          ...(b.randomCity
            ? [
                'Every city is different: the roads stay, but the buildings are picked and placed at random, and some buildings are missing.',
              ]
            : []),
          ...(b.hiddenBuildings
            ? [
                'A building shows as Unknown until you stand next to it. The Supermarket always has a pack, but first you have to find it.',
              ]
            : []),
        ],
      },
      {
        heading: 'Your turn',
        items: [
          `Draw up to ${b.handSize} cards and get ${b.apPerTurn} AP. Play a card by paying its AP cost.`,
          'Once per turn you may walk one step for free: choose a highlighted neighbour on the map (on a touch screen, tap it twice or use Go here).',
          `When you end the turn you may keep ${b.keepCards} unplayed card. The rest are discarded.`,
        ],
      },
      {
        heading: 'Searching',
        items: [
          `Play Search in a building to see ${b.searchOptions} finds, or ${b.searchOptions + b.peacefulSearchBonus} if no zombie is there. Take one ${b.findsToHand ? 'straight into your hand' : 'into your deck'}${b.scrapInFinds ? ', scrap a card from your hand for good,' : ''} or take nothing.`,
          `No Search card? A quick search costs ${b.quickSearch.cost} AP and shows ${b.quickSearch.options} finds. Each building can be searched ${b.searchesPerBuilding} times.`,
          `The first search in a building that hides a pack gives you the pack and a Heavy Load card that clogs your deck. The Supermarket always has a pack.`,
          `Rare finds (marked Rare) seldom turn up. ${b.stashesOnMap} buildings hide a locked stash, found by searching there: open it with a Tool card for ${b.stashToolCost} AP, or force it for ${b.stashForce.cost} AP and +${b.stashForce.noise} noise, and pick 1 of ${b.stashOptions} rare finds.`,
        ],
      },
      {
        heading: 'Zombies',
        items: [
          `When you end your turn, zombies that have seen you follow you. Then every zombie where you stand attacks. Block soaks up damage.`,
          `Walker: ${b.zombies.walker.hp} health, hits for ${b.zombies.walker.damage}, follows ${b.zombies.walker.followSteps} step. Runner: ${b.zombies.runner.hp} health, follows up to ${b.zombies.runner.followSteps} steps. Brute: ${b.zombies.brute.hp} health, hits for ${b.zombies.brute.damage}, never follows. Screamer: does not bite, but adds ${b.zombies.screamer.screamNoise} noise every turn while it has seen you.`,
          `Kill a zombie and you can search its body: pick from ${b.zombies.walker.loot} find (a Brute: ${b.zombies.brute.loot}), up to ${b.bodyLootMax} when one card kills several. No noise.`,
          'Zombies two steps away lose track of you, and they never enter the Shelter.',
          'Bow and Crossbow are silent and can hit a zombie one step away, if you can see it (a street, or a building you have been in or scouted). Knife is silent too.',
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
      ...(b.danger.enabled
        ? [
            {
              heading: 'Danger',
              items: [
                `The city gets wilder the better you do, and richer. Danger starts at 1 and rises by one for every pack${b.danger.calmPacks > 0 ? ` (not the first${b.danger.calmPacks === 1 ? '' : ` ${b.danger.calmPacks}`})` : ''} and every rare find you take${b.danger.perFindsTaken > 0 ? `, and for every ${b.danger.perFindsTaken} finds you add to your deck` : ''}, up to ${b.danger.levels.length}.`,
                ...b.danger.levels.flatMap((l, i) =>
                  l.zombieHpBonus > 0 &&
                  (b.danger.levels[i - 1]?.zombieHpBonus ?? 0) < l.zombieHpBonus
                    ? [`From danger ${i + 1}, every zombie has +${l.zombieHpBonus} health.`]
                    : [],
                ),
                ...(b.danger.rollOnReveal
                  ? [
                      'The zombies inside a building are only decided when you first walk in or scout it, so buildings you leave for later can hold tougher kinds.',
                    ]
                  : []),
                `${b.danger.levels.map((l, i) => `Danger ${i + 1}: ${l.arrivals === 1 ? 'a zombie' : `${l.arrivals} zombies`} every ${l.noiseThreshold} noise${l.extraFinds > 0 ? `, +${l.extraFinds} find in every search` : ''}`).join('. ')}.`,
                'At low danger the noise brings Walkers; higher up come Runners, Screamers and at last Brutes. Rare finds turn up more often the higher the danger.',
                ...(b.danger.hordeSize > 0
                  ? [
                      `Each time danger rises, ${b.danger.hordeSize === 1 ? 'a zombie gathers' : `${b.danger.hordeSize} zombies gather`} on the street.`,
                    ]
                  : []),
              ],
            },
          ]
        : []),
      {
        heading: 'Your deck',
        items: [
          'Trash weak cards so your good cards come up more often. Nerves and Wound are junk. Heavy Load cannot be trashed.',
          'Follow-up: a card gets stronger if you already played a card with the named tag this turn.',
          'Use up: the card is removed for good after you play it.',
          'Gear (Kevlar Vest, Running Shoes, Flashlight) stays in front of you after you play it and keeps working until it wears out. Then it goes to your discard pile, and you can draw it again.',
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

  /** Version 2: the campaign and the base between days. */
  campaign: {
    upgrades: {
      lookout: {
        name: 'Lookout',
        text: 'At the start of each expedition, see the exact zombies (and any pack) in 2 buildings.',
      },
      workbench: { name: 'Workbench', text: 'Start each expedition with one Nerves fewer.' },
      infirmary: { name: 'Infirmary', text: 'Start each expedition with +2 health.' },
      locker: { name: 'Locker', text: 'Keep 1 card you found for the next expedition.' },
      rainCollector: { name: 'Rain Collector', text: '+1 water every second night.' },
      garden: { name: 'Garden', text: '+1 food every second night.' },
    },
    reasons: {
      over: 'The campaign is over.',
      built: 'Already built.',
      materials: (cost: number, have: number) => `Needs ${cost} materials. You have ${have}.`,
    },
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
    resultHeading: 'Playtest result',
    resultHint: 'Copy this line into the playtest form.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Select the line and copy it yourself.',
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
    cardDiscarded: (name: string) => `You discard ${name}.`,
    serviceUsed: (service: string, place: string) => `You use ${service} at the ${place}.`,
    stashFound: (place: string) => `You find a locked stash in ${place}.`,
    stashOpened: (tool: string) =>
      tool ? `You open the stash with ${tool}.` : 'You force the stash open.',
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
    zombieArrived: (place: string, reason: 'noise' | 'dusk' | 'scream' | 'horde', kind: string) =>
      reason === 'dusk'
        ? `Dusk falls: a ${kind} arrives at ${place}.`
        : reason === 'scream'
          ? `The shrieking draws a ${kind} to ${place}!`
          : reason === 'horde'
            ? `A ${kind} gathers at ${place}.`
            : `The noise draws a ${kind} to ${place}!`,
    dangerRose: (level: number, reason: 'pack' | 'rare' | 'deck') =>
      `${reason === 'pack' ? 'Word of your haul spreads' : reason === 'rare' ? 'Your lucky find draws attention' : 'You are getting stronger, and so is the city'}: danger rises to ${level}.`,
    zombiesToughened: (n: number) => `The dead grow tougher: every zombie has +${n} health.`,
    zombieFollowed: (place: string, kind: string) => `A ${kind} follows you to ${place}.`,
    zombieLostTrack: (kind: string) => `A ${kind} loses track of you.`,
    zombieAttacked: (damage: number, kind: string) => `A ${kind} attacks you (${damage} damage).`,
    zombieScreamed: (noise: number) => `A Screamer shrieks: +${noise} noise.`,
    gearEquipped: (card: string) => `You put on ${card}. It stays in front of you.`,
    gearAbsorbed: (n: number) => `Your vest takes ${n} damage.`,
    gearLost: (card: string, reason: 'absorbs' | 'untilHit' | 'turns' | 'uses') =>
      reason === 'absorbs'
        ? `${card} is worn out.`
        : reason === 'untilHit'
          ? `You stumble: ${card} comes off.`
          : reason === 'uses'
            ? `${card} is out of bolts.`
            : `${card} runs out.`,
    gearUsed: (card: string) => `You shoot with the ${card}. Not a sound.`,
    bodySearched: (n: number) =>
      `You search the body: ${n === 1 ? '1 find' : `${n} finds`} to choose from.`,
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
    salvage: {
      name: 'Salvage',
      text: "Material for your base. Unplayable. Can't be trashed. While it's in your hand, your free move costs 1 AP.",
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
      text: 'Gear: every search reveals +1 find. Lasts this turn and the next.',
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
      text: 'Gear: takes 1 damage in each zombie phase. Wears out after 3 damage.',
    },
    runningShoes: {
      name: 'Running Shoes',
      text: 'Gear: your free move may go 2 steps. Lost when a zombie hurts you.',
    },
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
    shotgun: { name: 'Shotgun', text: 'Deal 2 damage to every zombie here. +2 noise.' },
    chainsaw: { name: 'Chainsaw', text: 'Deal 4 damage to every zombie here. +3 noise.' },
    bicycle: { name: 'Bicycle', text: 'Move up to 3.' },
    firstAidKit: {
      name: 'First Aid Kit',
      text: 'Heal 3. Use up: heal 6 instead.',
      modes: ['Heal 3', 'Use up: heal 6'],
    },
    headShot: {
      name: 'Head Shot',
      text: 'Deal 1 damage. Follow-up Weapon: kill a zombie here instead, whatever its health.',
    },
    silentTakedown: {
      name: 'Silent Takedown',
      text: 'Kill a zombie here that has not seen you (or is distracted). Silent.',
    },
    knife: { name: 'Knife', text: 'Deal 1 damage. Silent. Follow-up Quiet: deal 2 instead.' },
    bow: {
      name: 'Bow',
      text: 'Deal 2 damage to a zombie here or 1 step away (where you can see it). Silent.',
    },
    crossbow: {
      name: 'Crossbow',
      text: 'Gear with 3 bolts: pay 1 AP to deal 3 damage to a zombie here or 1 step away. Silent.',
    },
    painkillers: {
      name: 'Painkillers',
      text: 'Trash a Nerves or Wound from your hand. Draw 1 card.',
    },
    repack: {
      name: 'Repack',
      text: 'Discard a card from your hand. Draw 1 card.',
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
    chooseDiscard: 'Choose a card in your hand to discard.',
    discardNotInHand: 'The card to discard must be in your hand.',
    discardSelf: "A card can't discard itself.",
    noDiscardTarget: 'You have no other card in hand to discard.',
    noServiceHere: 'There is nothing to use here.',
    noStashHere: 'There is no locked stash here to open.',
    notATool: 'Only a Tool card can open a stash.',
    nothingToSearch: 'There is nothing to search here.',
    searchedOut: 'This building has no searches left.',
    chooseFindFirst: 'Choose a find first: take one, or take nothing.',
    noScrapInFinds:
      'You cannot scrap cards while choosing finds. Use Toolbox, Painkillers or a service.',
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
    noZombiesInRange: (range: number) =>
      `No zombie you can see here or ${range === 1 ? '1 step' : `${range} steps`} away.`,
    zombieOutOfRange: (range: number) =>
      `That zombie is out of range (here or ${range === 1 ? '1 step' : `${range} steps`} away, where you can see it).`,
    noSuchGear: 'That gear is not in front of you.',
    zombieSeesYou: 'That zombie has seen you. Sneak, distract it or arrive unnoticed first.',
    gearNotUsable: 'This gear works by itself; there is nothing to use.',
  },
} as const

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`
}
