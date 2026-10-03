/**
 * All player-facing text (the game is in English). Keep wording here so a
 * translation can be added later without touching rules or UI code.
 */
export const texts = {
  title: 'One More Building',
  workingTitleNote: 'Working title',
  tagline: 'Head home with what you have, or risk one more building?',
  statusLine: 'Prototype in progress · milestone M1 (rules core: deck and turns)',
  startExpedition: 'Start expedition',
  startExpeditionDisabled: 'Available from milestone M2, when the city map is playable.',
  factsHeading: 'Starting values',
  facts: {
    turns: 'turns before dark',
    health: 'health',
    hand: 'cards in hand',
    ap: 'action points per turn',
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
    },
    bandage: { name: 'Bandage', text: 'Heal 1. Use up: heal 3 instead.' },
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
  },
} as const
