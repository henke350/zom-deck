import type { CampaignState, GameState } from '../game'

const RULES_SEEN = 'one-more-building:rules-seen'

// Remembered for this page visit too, in case the browser blocks storage.
let seenThisVisit = false

/** Has the player already seen the rules (on this device)? */
export function rulesSeen(): boolean {
  if (seenThisVisit) return true
  try {
    return window.localStorage.getItem(RULES_SEEN) === 'yes'
  } catch {
    return false
  }
}

export function markRulesSeen(): void {
  seenThisVisit = true
  try {
    window.localStorage.setItem(RULES_SEEN, 'yes')
  } catch {
    // Private windows and some embedded pages refuse storage. Then the rules show once per visit.
  }
}

/** For tests. */
export function forgetRulesSeen(): void {
  seenThisVisit = false
  try {
    window.localStorage.removeItem(RULES_SEEN)
  } catch {
    // Nothing to forget.
  }
}

const TIPS_HIDDEN = 'one-more-building:tips-hidden'
let tipsHiddenThisVisit: boolean | undefined

/** Has the player turned off the tips for new players? */
export function tipsHidden(): boolean {
  if (tipsHiddenThisVisit !== undefined) return tipsHiddenThisVisit
  try {
    return window.localStorage.getItem(TIPS_HIDDEN) === 'yes'
  } catch {
    return false
  }
}

export function setTipsHidden(hidden: boolean): void {
  tipsHiddenThisVisit = hidden
  try {
    if (hidden) window.localStorage.setItem(TIPS_HIDDEN, 'yes')
    else window.localStorage.removeItem(TIPS_HIDDEN)
  } catch {
    // Storage refused: the choice holds for this visit.
  }
}

const CAMPAIGN = 'one-more-building:campaign'
const CAMPAIGN_VERSION = 1

/** A campaign saved in the browser: the base, and today's expedition while it is going. */
export interface SavedCampaign {
  readonly campaign: CampaignState
  readonly expedition?: GameState
}

/** The saved campaign, or null when there is none (or storage is blocked or the save is old). */
export function loadCampaign(): SavedCampaign | null {
  try {
    const raw = window.localStorage.getItem(CAMPAIGN)
    if (!raw) return null
    const saved = JSON.parse(raw) as { version?: number } & Partial<SavedCampaign>
    if (saved.version !== CAMPAIGN_VERSION || !saved.campaign) return null
    return saved.expedition
      ? { campaign: saved.campaign, expedition: saved.expedition }
      : { campaign: saved.campaign }
  } catch {
    return null
  }
}

export function saveCampaign(saved: SavedCampaign): void {
  try {
    window.localStorage.setItem(CAMPAIGN, JSON.stringify({ version: CAMPAIGN_VERSION, ...saved }))
  } catch {
    // Storage refused (private window): the campaign lasts as long as this page is open.
  }
}

export function clearCampaign(): void {
  try {
    window.localStorage.removeItem(CAMPAIGN)
  } catch {
    // Nothing to clear.
  }
}
