/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  KOKUM DIGITAL DINING LAYER — SERVICE BOUNDARIES
 * ─────────────────────────────────────────────────────────────────────────────
 *  The prototype runs fully in the browser. Every place that will later talk to
 *  a backend goes through one of the interfaces below, so the UI does not change
 *  when real services are plugged in.
 *
 *  PRODUCTION ROADMAP (not implemented in this prototype)
 *   1. Unique QR per dish        — /s/:restaurantId/:dishId resolves a DishStory from a CMS.
 *   2. Real backend              — REST/GraphQL API behind these interfaces.
 *   3. Customer sessions         — anonymous session id per scan, upgradeable to a profile.
 *   4. Real referral links       — signed share URLs that attribute visits to the sharer.
 *   5. Verified social actions   — count hearts from real link opens / platform APIs, not taps.
 *   6. Real reward validation    — server-issued, single-use codes verified at the POS.
 *   7. Customer profiles         — taste history across visits and dishes.
 *   8. Restaurant analytics      — scans, completion funnel, time-per-scene.
 *   9. Dish popularity analytics — which stories are scanned, shared, finished.
 *  10. Feedback dashboard        — ratings + comments routed to the owner, with alerts.
 *  11. Loyalty program           — stories collected → tiers → perks.
 *  12. Personalised recommendations — next dish suggested from taste profile.
 *  13. Push / WhatsApp campaigns — opt-in follow-ups with the guest's own card.
 *  14. Admin dashboard           — owner edits dishes, stories, rewards without code.
 *  15. Multiple restaurants      — multi-tenant content, branding and rewards.
 */

import type { TasteProfileId } from '../data/types'

export interface FeedbackEntry {
  dishId: string
  rating: number
  comment?: string
  createdAt: string
}

export interface FeedbackService {
  submit(entry: FeedbackEntry): Promise<void>
}

export interface AnalyticsService {
  track(event: string, props?: Record<string, unknown>): void
}

export interface SessionState {
  dishId: string
  tasteProfile?: TasteProfileId
  hearts: number
}

/** Prototype: feedback stays on this device only. */
export const feedbackService: FeedbackService = {
  async submit(entry) {
    try {
      const key = 'kokum.feedback'
      const list = JSON.parse(localStorage.getItem(key) ?? '[]') as FeedbackEntry[]
      list.push(entry)
      localStorage.setItem(key, JSON.stringify(list))
    } catch {
      /* storage unavailable (private mode / sandbox) — feedback is simply not persisted */
    }
  },
}

/** Prototype: analytics is a no-op. Swap for a real sink (e.g. PostHog, own API). */
export const analytics: AnalyticsService = {
  track() {},
}
