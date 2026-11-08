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
      horde: (size: number, place: string) =>
        `A HORDE of ${size} is shambling towards the ${place}. It gets there when your turn ends. Run, hide, or make it rain bullets.`,
      close: 'Got it',
    },
    tougherZombie: 'tougher than usual',
    asleep: 'asleep',
    ammoStat: 'Ammo',
    ammoBadge: (n: number) => `${n} bullet${n === 1 ? '' : 's'}`,
    poisonStat: 'Poison',
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
      horde: (size: number, place: string) =>
        `THE HORDE: ${size} zombies pour into the ${place}, hunting you!`,
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
    packBanner: (packs: number, kind?: string) =>
      kind
        ? `You found ${kind.toUpperCase()}! A supply pack of ${kind}: you now carry ${packs} packs. It adds a Heavy Load to your deck.`
        : `You found a supply pack! You now carry ${packs}. It adds a Heavy Load to your deck.`,
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
      campaignHome:
        'You carry food and water for tonight. Walk back to the Shelter, or push on for more and for Salvage.',
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
    gearLeft: (lasts: 'absorbs' | 'untilHit' | 'turns' | 'uses' | 'health', n: number) =>
      lasts === 'health'
        ? `${n} health`
        : lasts === 'absorbs'
          ? `takes ${n} more damage`
          : lasts === 'untilHit'
            ? 'until a zombie hurts you'
            : lasts === 'uses'
              ? `${n} ${n === 1 ? 'bolt' : 'bolts'} left`
              : n === 1
                ? 'last turn'
                : `${n} turns left`,
    shoot: (cost: number) => `Shoot (${cost} AP)`,
    dog: 'Dog',
    dogStatus: (hp: number, max: number) => `Stray Dog · ${hp}/${max} health`,
    sic: 'Sic (0 AP)',
    chooseDogTarget: 'Choose a zombie for your dog.',
    dogSmells: 'Your dog smells supplies here',
    scentMark: 'sniff',
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
    spitter: {
      name: 'Spitter',
      short: 'P',
      text: 'Never moves, but once it has seen you it spits from up to 1 step away: 1 damage and 1 poison.',
    },
    hound: {
      name: 'Hound',
      short: 'H',
      text: 'A dead dog: fragile, but follows you up to three steps.',
    },
    bloater: {
      name: 'Bloater',
      short: 'O',
      text: 'Bursts when it dies where you stand: 2 damage to you. Kill it from a distance.',
    },
    sleeper: {
      name: 'Sleeper',
      short: 'Z',
      text: 'Asleep: it does not notice you. A hit, or a full noise meter where you stand, wakes it: then it hits for 2.',
    },
    bat: {
      name: 'Bat',
      short: 'V',
      text: 'Flies and follows you two steps. Only shots and fire can hit it: guns, bows, the Crossbow, Molotov.',
    },
    boss: {
      name: 'Boss',
      short: 'X',
      text: 'A huge, bloated thing that guards its building. Very tough, hits for 2, never leaves.',
    },
  },

  /** Events of the day (balance.events). */
  dayEvents: {
    label: 'Today',
    quiet: { name: 'A quiet morning', text: 'Nothing unusual today.' },
    rain: {
      name: 'Pouring rain',
      text: 'The rain drowns out sound: every noise threshold is 1 higher.',
    },
    fullMoon: { name: 'Full moon', text: 'The dead get restless early: dusk comes 1 turn sooner.' },
    foundMap: {
      name: 'A survivor’s map',
      text: 'Two buildings are marked on it: you know what is inside.',
    },
    restless: { name: 'Restless dead', text: 'Every building holds 1 more zombie than usual.' },
    supplyDrop: {
      name: 'Supply drop',
      text: 'A helicopter dropped supplies: 1 more pack in the city.',
    },
    cache: {
      name: 'Weapons cache',
      text: 'You found a Pistol at the shelter: it is in your deck.',
    },
    fog: { name: 'Thick fog', text: 'Zombies lose you more easily: they follow 1 step less.' },
    close: 'Got it',
  },
  /** Survivors: who goes out (`balance.survivors`). */
  survivors: {
    heading: 'Who goes out?',
    intro:
      'Each survivor starts with a slightly different deck and has one ability. In a campaign, the same survivor goes out every day.',
    choose: 'Choose',
    back: 'Back',
    scavenger: { name: 'Scavenger', text: 'Knows the streets. The classic start.' },
    firefighter: { name: 'Firefighter', text: 'Strong, and hard to stop.' },
    hunter: { name: 'Hunter', text: 'Quiet, and watches before going in.' },
    medic: { name: 'Medic', text: 'Steady hands, and a full kit.' },
    mechanic: { name: 'Mechanic', text: 'Keeps every tool working.' },
    noChange: 'No changes',
    swap: (to: string, from: string) => `${to} instead of ${from}`,
    maxHp: (n: number) => `+${n} max health`,
    heal: (n: number) => `Every heal gives +${n} health`,
    scout: (n: number) => `Sees ${n} building${n === 1 ? '' : 's'} from the start`,
    gear: (n: number) => `Gear lasts ${n} longer`,
  },
  /** Allies at the campaign base (src/game/baseAllies.ts). */
  allies: {
    heading: 'Allies',
    intro: (max: number, every: number) =>
      `Take up to ${max} along (their card is in your deck), or leave them home to work. Each eats 1 food every ${every} nights. Knocked out, they rest a day. Lose the day and the allies with you are lost.`,
    none: 'No allies yet. People you find and bring home move in here.',
    going: 'Going out',
    home: 'At home',
    resting: 'Wounded: resting today',
    takeAlong: (name: string) => `Take ${name} along`,
    leaveHome: (name: string) => `Leave ${name} home`,
    take: 'Take along',
    leave: 'Leave home',
    jobs: {
      heal: (hp: number, wounds: number) =>
        `At home: tends you, +${hp} health and ${wounds} Wound fewer today.`,
      guard: 'At home: stands guard, so no night raid.',
      scout: (n: number) => `At home: scouts ahead, ${n} buildings known at the start.`,
      forage: (food: number, every: number) =>
        `At home: scrounges ${food} food every ${every} nights.`,
      build: (n: number) => `At home: builds, +${n} material every night.`,
    },
    news: {
      joined: (names: string) => `${names} moved into the base.`,
      wounded: (names: string) => `${names} came home wounded and must rest tomorrow.`,
      died: (names: string) => `${names} did not make it back.`,
      left: (names: string) => `There was not enough food: ${names} left in the night.`,
      food: (n: number) => `Your allies scrounged ${n} food.`,
      materials: (n: number) => `Your allies built up ${n} material.`,
      raided: (food: number, water: number) =>
        `Raiders came in the night and took up to ${food} food and ${water} water.`,
      stopped: 'Raiders came in the night, but your guard drove them off.',
    },
    reasons: {
      unknown: 'No such ally.',
      wounded: 'Wounded: resting today.',
      full: (max: number) => `You can take ${max} allies at most.`,
    },
  },
  /** Campaign missions (`balance.campaign.missions`). */
  missions: {
    label: 'Mission',
    rescue: {
      name: 'Rescue',
      text: (place: string) => `Someone is trapped in the ${place}. Reach it, then get home.`,
    },
    clear: {
      name: 'Clear out',
      text: (place: string) => `Clear the ${place}: stand in it with no zombies there.`,
    },
    boss: {
      name: 'The Boss',
      text: (place: string) => `Something huge has made the ${place} its nest. Kill it.`,
    },
    done: 'Done: get home to collect the reward.',
    reward: (r: { food: number; water: number; materials: number }) =>
      [
        r.food ? `${r.food} food` : '',
        r.water ? `${r.water} water` : '',
        r.materials ? `${r.materials} materials` : '',
      ]
        .filter(Boolean)
        .join(', '),
    rewardLine: (reward: string) => `Reward when you get home: ${reward}.`,
    report: (name: string, reward: string) => `Mission done (${name}): ${reward}.`,
    marker: 'Mission',
    hordeMarker: (n: number) => `HORDE ${n}`,
  },
  /** Special places (`feature` on a location). */
  places: {
    infirmary: {
      name: 'Infirmary',
      text: (p: Balance['places']) =>
        `End your turn here: +${p.infirmaryHeal} health, and poison is cured.`,
      log: (n: number) => `You rest in the infirmary: +${n} health.`,
    },
    armory: {
      name: 'Armory',
      text: (p: Balance['places']) => `First time in: ${p.armoryAmmo} bullets in a locker.`,
      log: (n: number) => `A locker full of bullets: +${n}.`,
    },
    fuel: {
      name: 'Fuel and tools',
      text: (p: Balance['places']) =>
        `First time in: your next search here finds +${p.fuelSearchBonus}.`,
      log: (n: number) => `Plenty to look through here: +${n} find on your next search.`,
    },
    trap: {
      name: 'Booby-trapped',
      text: (p: Balance['places']) => `First time in: a trap hurts you for ${p.trapDamage}.`,
      log: (n: number) => `A tripwire! You lose ${n} health.`,
    },
    sanctuary: {
      name: 'Sanctuary',
      text: (p: Balance['places']) => `End your turn here: noise drops by ${p.sanctuaryQuiet}.`,
      log: (n: number) => `The thick walls muffle everything: noise −${n}.`,
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
          `Spitter: never moves; once it has seen you it spits from up to ${b.zombies.spitter.spit ?? 1} step away (+${b.zombies.spitter.poison ?? 1} poison: 1 damage a turn, fading by 1; any healing cures it). Hound: follows up to ${b.zombies.hound.followSteps} steps. Bloater: bursts for ${b.zombies.bloater.burst ?? 2} damage when it dies where you stand. Sleeper: asleep until a hit or a full noise meter where you stand wakes it, then hits for ${b.zombies.sleeper.damage}. Bat: only shots and fire can hit it.`,
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
      {
        heading: 'Allies',
        items: [
          'Some finds are people: the Nurse, the Soldier, the Scout, the Street Kid and the Bouncer. Play one (1 AP) and they stay in front of you, like gear, with their own health and ability. In the zombie phase they take damage for you. At 0 health they are knocked out and go to your discard pile, so you can play them again later.',
          'In a campaign, allies you bring home move into the base. Each morning you choose who goes out (up to 2; their card is in your start deck) and who stays home to work: the Nurse tends you, the Soldier stands guard against night raids, the Scout scouts ahead, the Street Kid scrounges food and the Bouncer builds. Allies knocked out come home wounded and rest a day; lose the day and the allies with you are lost. Every ally eats 1 food every 2 nights, or leaves.',
        ],
      },
      {
        heading: 'Survivors',
        items: [
          'Before you set out you choose who goes: the Scavenger (the classic start), the Firefighter (more health, an Axe), the Hunter (a Bow, and sees one building from the start), the Medic (healing instead of Nerves, and heals better) or the Mechanic (a Flashlight, and gear lasts longer). The choice page lists exactly what each one changes.',
        ],
      },
      {
        heading: 'Campaign missions',
        items: [
          'In a campaign every day has an optional mission in a marked building (★ on the map): a rescue (reach the building), clearing it out (stand in it with no zombies there) or, near the end, the Boss (kill it). Do it and get home, and the base gets the reward shown on the base page.',
        ],
      },
      {
        heading: 'Events of the day',
        items: [
          'Every expedition starts with an event that changes the day: pouring rain (noise carries less), a full moon (earlier dusk), a survivor’s map, restless dead, a supply drop, a weapons cache or thick fog. It shows above your hand at the start and in the top bar.',
        ],
      },
      {
        heading: 'Big guns and hordes',
        items: [
          'Some weapons hit many zombies at once: the Machine Gun (every zombie here), the Bazooka (every zombie in a place here or next door; fire it where you stand and you get singed too) and the Leaf Blower (blows every zombie here to a place next door). They are loud, so expect company.',
          'When danger reaches the top level, a HORDE is announced: a big group heading for a place next to you (marked on the map). It arrives when your turn ends and comes straight for you. Run, hide, or blow it up.',
        ],
      },
      {
        heading: 'Special places',
        items: [
          'Some buildings do something by themselves: the Hospital heals you when you end your turn there, the Police station has bullets, the petrol station is full of things to search, the Apartments are booby-trapped, and the Church lets noise die down. The side panel says what each one does.',
          `Guns (Pistol, Shotgun, Head Shot) use bullets. You start with ${b.ammo.start}; each Ammunition you find gives ${b.ammo.perFind}, up to ${b.ammo.max}.`,
        ],
      },
      {
        heading: 'The Stray Dog',
        items: [
          `Sometimes a search in a house or the church finds a scared dog. It is not a card: it walks with you (${b.dog.hp} health).`,
          `Sic: once a turn, for 0 AP, it deals ${b.dog.biteDamage} damage to a zombie where you stand, barking (+${b.dog.biteNoise} noise).`,
          `In each zombie phase it takes ${b.dog.guardPerPhase} damage for you. At 0 health it dies.`,
          'It smells supply packs: buildings here and next door get a "sniff" mark on the map.',
          `In a campaign it comes home with you, gets ${b.dog.healPerNight} health back each night and eats 1 food every ${b.dog.foodEvery} nights. No food, and it runs away.`,
        ],
      },
      {
        heading: 'Campaign',
        items: [
          `A campaign is ${b.campaign.days} days in one city; each day is one expedition. You may go home with whatever you have. The city stays the same, so buildings you have seen stay known, and searched buildings get only ${b.campaign.searchesRegrowPerNight} search back each night: the supplies move further out.`,
          `Every pack is food or water. Each evening you eat ${b.campaign.foodPerNight} food and drink ${b.campaign.waterPerNight} water. No food: ${b.campaign.hungerNerves} extra Nerves the next day. No water: ${b.campaign.thirstHp} less health the next day.`,
          'Salvage is a find only in campaigns: material for the base. It weighs like a Heavy Load until you are home. Build upgrades at the base between days.',
          `Not home (killed or caught by the dark): today's finds are lost and the next day starts with ${b.campaign.woundsAfterLoss} Wound. After ${b.campaign.lossesAllowed + 1} lost days the campaign is over.`,
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
    start: 'Start campaign',
    continue: (day: number) => `Continue campaign (day ${day})`,
    restart: 'New campaign',
    startNote: 'A campaign is several days in one city. Each day is one expedition.',
    dayStat: 'Day',
    dayHeading: (day: number, days: number) => `Day ${day} of ${days}`,
    intro:
      'Your base. Every evening you eat 1 food and drink 1 water. Build with materials, then set out again. The city stays the same, so what you learn about it stays known.',
    stock: { food: 'Food', water: 'Water', materials: 'Materials' },
    stockLabel: 'Your store',
    carryingLabel: 'Food · Water · Salvage',
    carrying: (food: number, water: number, salvage: number) => `${food} · ${water} · ${salvage}`,
    bringingHome: (food: number, water: number, salvage: number) =>
      `You bring home ${food} food, ${water} water and ${salvage} Salvage.`,
    yesterdayHeading: 'Last night',
    cameHome: (day: number, food: number, water: number, materials: number) =>
      `Day ${day}: you came home with ${food} food, ${water} water and ${materials} materials.`,
    lostDay: (day: number) => `Day ${day}: you did not make it home. Everything you found is lost.`,
    ate: 'You ate.',
    hungry: 'There was nothing to eat.',
    drank: 'You drank.',
    thirsty: 'There was nothing to drink.',
    produced: (food: number, water: number) =>
      `Overnight the base made ${[food ? `${food} food` : '', water ? `${water} water` : ''].filter(Boolean).join(' and ')}.`,
    todayHeading: 'Today',
    penaltyHungry: (n: number) => `Hungry: ${n} extra Nerves in your deck.`,
    penaltyThirsty: (n: number) => `Thirsty: you start with ${n} less health.`,
    penaltyWounds: (n: number) => `Hurt: ${n} Wounds in your deck.`,
    noPenalty: 'You are fed, watered and ready.',
    lossesLeft: (n: number) =>
      n === 0
        ? 'One more lost day ends the campaign.'
        : `You can survive ${n} more lost ${n === 1 ? 'day' : 'days'}.`,
    baseHeading: 'Build',
    build: (cost: number) => `Build (${cost})`,
    built: 'Built',
    lockerHeading: 'Locker: take one of yesterday’s finds along',
    keepNone: 'Take none',
    setOut: (day: number) => `Set out on day ${day}`,
    backToTitle: 'Back to title',
    backToBase: 'Back to the base',
    dayOverTip:
      'At the base you eat, drink and build. Packs are food or water; Salvage is material for building.',
    survived: (days: number) => `You survived ${days} days`,
    lostCampaign: 'The campaign is over',
    overSummary: (days: number, food: number, water: number, upgrades: number) =>
      `You lasted ${days} ${days === 1 ? 'day' : 'days'} and built ${upgrades} ${upgrades === 1 ? 'upgrade' : 'upgrades'}. Left in the store: ${food} food and ${water} water.`,
    packKind: { food: 'food', water: 'water' },
    dogAtBase: (hp: number, max: number, every: number) =>
      `Your Stray Dog is here (${hp}/${max} health). It eats 1 food every ${every} nights.`,
    dogNews: {
      joined: 'A stray dog followed you home.',
      died: 'Your dog did not come home.',
      ate: 'Your dog ate 1 food.',
      ranAway: 'There was no food for your dog. In the morning it was gone.',
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
    dayBody: (day: number, food: number, water: number, materials: number) =>
      `Walking into the Shelter ends day ${day}. You bring home ${food} food, ${water} water and ${materials} Salvage.`,
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
    poisonHurts: (n: number) => `The poison burns: you lose ${n} health.`,
    poisoned: (n: number, total: number) => `Spit hits you: +${n} poison (${total} in all).`,
    zombieWoke: 'A Sleeper wakes up.',
    missionDone: (mission: string) => `Mission done: ${mission}. Get home to collect the reward.`,
    ammoFound: (n: number, total: number) => `You pocket ${n} bullets (${total} in all).`,
    ammoUsed: (left: number) => `Bang. ${left} bullet${left === 1 ? '' : 's'} left.`,
    zombieBurst: (n: number) => `It bursts all over you: ${n} damage.`,
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
    packFound: (packs: number, kind?: string) =>
      `You find a supply pack${kind ? ` of ${kind}` : ''}! You carry ${packs}.`,
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
    gearAbsorbed: (card: string, n: number, ally: boolean) =>
      ally ? `${card} takes ${n} damage for you.` : `Your ${card} takes ${n} damage.`,
    gearLost: (card: string, reason: 'absorbs' | 'untilHit' | 'turns' | 'uses' | 'health') =>
      reason === 'health'
        ? `${card} is knocked out and falls back (to your discard pile).`
        : reason === 'absorbs'
          ? `${card} is worn out.`
          : reason === 'untilHit'
            ? `You stumble: ${card} comes off.`
            : reason === 'uses'
              ? `${card} is out of bolts.`
              : `${card} runs out.`,
    gearUsed: (card: string, ally: boolean) =>
      ally ? `${card} fires: the shot echoes.` : `You shoot with the ${card}. Not a sound.`,
    allyHealed: (card: string, n: number) => `${card} patches you up: +${n} health.`,
    dogFound: (hp: number) => `A scared dog creeps out and follows you. (${hp} health)`,
    dogBit: (damage: number) => `Your dog attacks, barking: ${damage} damage.`,
    dogGuarded: (n: number, left: number) =>
      `Your dog throws itself in the way and takes ${n} damage (${left} health left).`,
    dogDied: 'Your dog does not get up again.',
    bodySearched: (n: number) =>
      `You search the body: ${n === 1 ? '1 find' : `${n} finds`} to choose from.`,
    damageBlocked: (n: number) => `You block ${n} damage.`,
    zombieHit: (damage: number, hpLeft: number) =>
      hpLeft > 0
        ? `You hit a zombie for ${damage}. It has ${hpLeft} health left.`
        : `You hit a zombie for ${damage}.`,
    zombieKilled: 'The zombie goes down.',
    hordeWarned: (size: number, place: string) =>
      `You hear it before you see it: a horde of ${size} is coming to the ${place}. It arrives when your turn ends.`,
    blasted: (place: string, self: number) =>
      self > 0
        ? `KA-BOOM! The ${place} is a crater, and so are your eyebrows: −${self} health. Should have read the manual.`
        : `KA-BOOM! The ${place} lights up like New Year's Eve.`,
    zombiesBlown: (n: number, place: string) =>
      n === 1
        ? `WHOOOSH! One zombie tumbles away to the ${place}, very confused.`
        : `WHOOOSH! ${n} zombies tumble away to the ${place} like autumn leaves.`,
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
    pistol: { name: 'Pistol', text: 'Uses 1 bullet. Deal 3 damage. +2 noise.' },
    ammunition: {
      name: 'Ammunition',
      text: 'Not a card: a box of bullets for your guns (Pistol, Shotgun, Head Shot).',
    },
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
    shotgun: {
      name: 'Shotgun',
      text: 'Uses 1 bullet. Deal 2 damage to every zombie here. +2 noise.',
    },
    chainsaw: { name: 'Chainsaw', text: 'Deal 4 damage to every zombie here. +3 noise.' },
    bicycle: { name: 'Bicycle', text: 'Move up to 3.' },
    firstAidKit: {
      name: 'First Aid Kit',
      text: 'Heal 3. Use up: heal 6 instead.',
      modes: ['Heal 3', 'Use up: heal 6'],
    },
    headShot: {
      name: 'Head Shot',
      text: 'Uses 1 bullet. Deal 1 damage. Follow-up Weapon: kill a zombie here instead, whatever its health.',
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
    machineGun: {
      name: 'Machine Gun',
      text: '1 bullet: 1 damage to every zombie here (Bats too), +3 noise. Or full auto, 3 bullets: 2 damage to every zombie here, +4 noise. Subtle it is not.',
      modes: ['Burst', 'Full auto'],
    },
    bazooka: {
      name: 'Bazooka',
      text: 'One rocket (used up): 3 damage to every zombie in a place here or 1 step away, +4 noise. Fire it where you stand and you take 1 damage too.',
    },
    leafBlower: {
      name: 'Leaf Blower',
      text: 'Blow every zombie here to a place next door. They lose track of you. +2 noise. Nobody expects the Leaf Blower.',
    },
    nurse: {
      name: 'Nurse',
      text: 'Ally (2 health): stays in front of you. Heals you 1 at the end of each turn and cures poison. Takes 1 damage for you each zombie phase.',
    },
    soldier: {
      name: 'Soldier',
      text: 'Ally (3 health): stays in front of you. Pay 1 AP: deal 2 damage to a zombie here or 1 step away (no bullets, +1 noise). Takes 1 damage for you each zombie phase.',
    },
    scout: {
      name: 'Scout',
      text: 'Ally (2 health): stays in front of you. You see the zombies and pack in every building next to you. Takes 1 damage for you each zombie phase.',
    },
    streetKid: {
      name: 'Street Kid',
      text: 'Ally (1 health): stays in front of you. Every search reveals +1 find. Takes 1 damage for you each zombie phase.',
    },
    bouncer: {
      name: 'Bouncer',
      text: 'Ally (4 health): stays in front of you and takes up to 2 damage for you each zombie phase.',
    },
    crossbow: {
      name: 'Crossbow',
      text: 'Gear with 3 bolts: pay 1 AP to deal 3 damage to a zombie here or 1 step away. Silent.',
    },
    painkillers: {
      name: 'Painkillers',
      text: 'Trash a Nerves or Wound from your hand. Draw 1 card.',
    },
    dog: {
      name: 'Stray Dog',
      text: 'Not a card: a dog that walks with you. Once a turn, Sic: 1 damage to a zombie here (+1 noise). It takes 1 damage for you each zombie phase, and smells packs next door. It can die.',
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
    choosePlace: 'Choose a place on the map.',
    tooFarToHit: (range: number) =>
      range === 0 ? 'Only where you stand.' : `At most ${range} step away.`,
    blowNextDoor: 'Blow them to a place next door.',
    notIntoShelter: 'Not into your own Shelter!',
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
    noDog: 'You have no dog.',
    onlyShotsHitFlying: 'Bats fly: only a shot or fire can hit them.',
    noAmmo: (need: number, have: number) =>
      `Needs ${need} bullet${need === 1 ? '' : 's'}. You have ${have}. Find Ammunition.`,
    dogBitten: 'Your dog has already attacked this turn.',
  },
} as const

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`
}
