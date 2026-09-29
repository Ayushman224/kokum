import type { Dish, FirstBiteQuiz, KitchenGame, RewardRule, SecretIngredient } from './types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  KOKUM — ALL EDITABLE CONTENT LIVES HERE
 *  DEMO CONTENT: not Kokum's real recipe, story or reward terms.
 *  Replace names, photos, notes and percentages with the owner's real material.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const restaurant = {
  name: 'KOKUM',
  line: 'Every dish has a story.',
  hashtag: '#KokumStories',
  instagramHandle: '@kokum', // ← replace with the real handle
  /** Google review page. Optional — never required for a discount (see reviewSettings). */
  googleReviewUrl: '', // e.g. 'https://g.page/r/XXXX/review'
}

export const menu: Dish[] = [
  {
    id: 'appam-stew',
    storyNumber: '01',
    name: 'Appam & Vegetable Stew',
    shortName: 'Appam & Stew',
    tagline: 'Lace-edged appam, coconut-milk stew.',
    image: null,
    live: true,
    tone: '#efdcb3',
  },
  // Demo placeholders — replace with real dishes (name, photo) and set live: true when their story is ready.
  { id: 'story-02', storyNumber: '02', name: 'Story 02', shortName: 'Story 02', tagline: 'Coming soon', image: null, live: false, tone: '#c2552f' },
  { id: 'story-03', storyNumber: '03', name: 'Story 03', shortName: 'Story 03', tagline: 'Coming soon', image: null, live: false, tone: '#d9a441' },
  { id: 'story-04', storyNumber: '04', name: 'Story 04', shortName: 'Story 04', tagline: 'Coming soon', image: null, live: false, tone: '#6f8f4e' },
  { id: 'story-05', storyNumber: '05', name: 'Story 05', shortName: 'Story 05', tagline: 'Coming soon', image: null, live: false, tone: '#8a2748' },
  { id: 'story-06', storyNumber: '06', name: 'Story 06', shortName: 'Story 06', tagline: 'Coming soon', image: null, live: false, tone: '#b8744a' },
]

export const secretIngredients: SecretIngredient[] = [
  { id: 'rice', label: 'Fermented rice', icon: 'rice', note: 'Soaked, ground and rested overnight — that is where the lace edge comes from.' },
  { id: 'coconut-milk', label: 'Coconut milk', icon: 'coconutMilk', note: 'Stirred in last and never boiled, so the stew stays silky.' },
  { id: 'curry-leaves', label: 'Curry leaves', icon: 'curryLeaves', note: 'Crackled in hot oil. The aroma reaches you before the plate does.' },
  { id: 'spices', label: 'Whole spices', icon: 'spices', note: 'Clove, cinnamon, cardamom — bloomed whole, gentle, never loud.' },
]

export const kitchenGame: KitchenGame = {
  ingredients: [
    { id: 'carrot', label: 'Vegetables', icon: 'carrot' },
    { id: 'curry-leaves', label: 'Curry leaves', icon: 'curryLeaves' },
    { id: 'chilli', label: 'Green chilli', icon: 'chilli' },
    { id: 'coconut-milk', label: 'Coconut milk', icon: 'coconutMilk' },
  ],
  sweetSpot: [32, 56],
  tooLow: 'Barely a whisper.',
  tooHigh: 'Too fierce — the milk would split.',
}

export const firstBiteQuiz: FirstBiteQuiz = {
  question: 'What will you taste first?',
  options: [
    { id: 'coconut', label: 'Coconut', icon: 'coconut' },
    { id: 'curry-leaves', label: 'Curry leaf', icon: 'curryLeaves' },
    { id: 'chilli', label: 'Green chilli', icon: 'chilli' },
  ],
  correctId: 'coconut',
  attempts: 2,
  explanation: 'The first note we want you to notice is coconut — sweet and soft, before the spice arrives.',
}

/**
 * Discounts the guest can collect before paying. Max = sum of all rules.
 * Only the quiz and in-app review are confirmed by the app itself; share + likes are
 * checked by staff at the table until a real social integration exists.
 */
export const rewardRules: RewardRule[] = [
  { id: 'quiz', percent: 2, title: 'First-bite quiz', how: 'Guess the ingredient you taste first.' },
  { id: 'share', percent: 2, title: 'Share your story', how: `Post your Kokum card and tag ${restaurant.instagramHandle}.` },
  { id: 'likes', percent: 1, title: '10 likes', how: 'Reach 10 likes before you finish your meal.' },
  { id: 'review', percent: 2, title: 'Tell us how it was', how: 'Leave a quick review — any rating counts.' },
]

export const maxDiscount = rewardRules.reduce((s, r) => s + r.percent, 0)

export const reviewSettings = {
  maxLength: 400,
  placeholder: 'Tell us what you loved, what surprised you, or what we could improve.',
  /**
   * Google's policy prohibits offering incentives for Google reviews, so the review
   * discount is earned by the in-app review (any rating). The Google button is optional.
   */
  discountRequiresGoogle: false,
}
