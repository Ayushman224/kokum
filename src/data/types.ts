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
  | 'carrot'

export interface SecretIngredient {
  id: string
  label: string
  icon: IconKey
  /** Short story revealed when the guest taps it. */
  note: string
}

export interface Dish {
  id: string
  storyNumber: string
  name: string
  shortName: string
  tagline: string
  /** Real photo URL (put files in /public). null → built-in illustration. */
  image: string | null
  /** Only live dishes open the full experience; the rest show "coming soon". */
  live: boolean
  /** Colour of the illustrated bowl for dishes without a photo. */
  tone: string
}

export interface KitchenGame {
  /** Ingredients hidden in the kitchen — guest finds and drags them into the pan. */
  ingredients: { id: string; label: string; icon: IconKey }[]
  /** Heat slider sweet spot, 0–100. */
  sweetSpot: [number, number]
  tooLow: string
  tooHigh: string
}

export interface FirstBiteQuiz {
  question: string
  options: { id: string; label: string; icon: IconKey }[]
  correctId: string
  attempts: number
  explanation: string
}

export interface RewardRule {
  id: 'quiz' | 'share' | 'likes' | 'review'
  percent: number
  title: string
  how: string
}
