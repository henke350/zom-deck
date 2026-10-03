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
