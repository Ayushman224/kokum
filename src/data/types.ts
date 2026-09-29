/**
 * Content model for a single Kokum "story" (one dish).
 * Every dish-specific string, image and rule lives in a DishStory object so the
 * restaurant can swap in real content without touching components.
 */

export type IconKey =
  | 'coconut'
  | 'coconutMilk'
  | 'rice'
  | 'curryLeaves'
  | 'chilli'
  | 'spices'
  | 'tomato'
  | 'cream'
  | 'butter'
  | 'appam'
  | 'stew'
  | 'herbs'

export interface Ingredient {
  id: string
  label: string
  icon: IconKey
  /** One-line note revealed when the guest discovers it. */
  note: string
}

export interface SecretIngredient {
  prompt: string
  options: { id: string; label: string; icon: IconKey }[]
  correctId: string
  wrongMessage: string
  revealTitle: string
  revealNote: string
}

export interface CookingSteps {
  heading: string
  prompt: string
  options: { id: string; label: string; icon: IconKey }[]
  correctId: string
  wrongMessage: string
  /** Heat slider sweet spot, 0–100. */
  sweetSpot: [number, number]
  tooLow: string
  tooHigh: string
  sweetMessage: string
}

export type TasteAxis = 'comfort' | 'rich' | 'bold' | 'aromatic'

export interface BiteItem {
  id: string
  label: string
  icon: IconKey
  weights: Partial<Record<TasteAxis, number>>
}

export type TasteProfileId = 'explorer' | 'balanced' | 'bold' | 'comfort'

export interface TasteProfile {
  id: TasteProfileId
  title: string
  description: string
  line: string
  traits: { emoji: string; label: string }[]
  /** Accent colour used for the profile sigil + card glow. */
  accent: string
}

export interface ChefStory {
  /** SAMPLE CONTENT — replace with Kokum's real chef story. */
  isSample: boolean
  heading: string
  note: string[]
  signature: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
}

export interface ReviewSettings {
  heading: string
  placeholder: string
  maxLength: number
  /**
   * Optional public review link (e.g. Google). Intentionally NOT used to redirect
   * in the prototype — feedback is collected in-app first and never gated on rating.
   */
  publicReviewUrl?: string
}

export interface RewardSettings {
  heartsGoal: number
  percentOff: number
  codePrefix: string
  validityDays: number
  terms: string
}

export interface DishStory {
  id: string
  storyNumber: number
  totalStories: number
  name: string
  nameLines: string[]
  subtitle: string
  /**
   * Hero photograph. Leave null to use the built-in illustrated plate.
   * Drop a real photo in /public (e.g. '/dishes/appam-stew.jpg') and set it here.
   */
  heroImage: string | null
  chefImage: string | null
  ingredients: Ingredient[]
  ingredientsToFind: number
  secretIngredient: SecretIngredient
  cookingSteps: CookingSteps
  biteItems: BiteItem[]
  chefStory: ChefStory
  quiz: QuizQuestion[]
  tasteProfiles: Record<TasteProfileId, TasteProfile>
  reviewSettings: ReviewSettings
  rewardSettings: RewardSettings
  shareHashtag: string
}
