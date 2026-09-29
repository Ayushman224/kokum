import type { DishStory } from './types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DEMO CONTENT — NOT KOKUM'S REAL RECIPE OR STORY
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything below is placeholder content written for the prototype.
 *  Replace with the owner's material:
 *    • real dish name + photographs (heroImage / chefImage)
 *    • actual ingredients + preparation notes
 *    • the chef's real story (chefStory)
 *    • a real quiz, real reward terms, real review link
 *
 *  Production: this object becomes a CMS/API response keyed by the QR's dish id
 *  (see src/lib/services.ts for the roadmap).
 */
export const dishData: DishStory = {
  id: 'appam-vegetable-stew',
  storyNumber: 1,
  totalStories: 8,
  name: 'Appam & Vegetable Stew',
  nameLines: ['Appam', '&', 'Vegetable Stew'],
  subtitle: 'Story 01',

  heroImage: null,
  chefImage: null,

  ingredients: [
    { id: 'coconut', label: 'Coconut', icon: 'coconut', note: 'Pressed fresh — first milk for richness, second for body.' },
    { id: 'rice', label: 'Rice', icon: 'rice', note: 'Soaked, ground and left to ferment overnight for the lace.' },
    { id: 'curry-leaves', label: 'Curry Leaves', icon: 'curryLeaves', note: 'Crackled in hot oil — the aroma arrives before the plate.' },
    { id: 'green-chilli', label: 'Green Chilli', icon: 'chilli', note: 'Slit, never chopped. Warmth without the fire.' },
    { id: 'spices', label: 'Spices', icon: 'spices', note: 'Clove, cinnamon, cardamom — whole, bloomed, gentle.' },
  ],
  ingredientsToFind: 3,

  secretIngredient: {
    prompt: 'Drag the secret onto the dish.',
    options: [
      { id: 'coconut-milk', label: 'Coconut Milk', icon: 'coconutMilk' },
      { id: 'tomato', label: 'Tomato', icon: 'tomato' },
      { id: 'cream', label: 'Cream', icon: 'cream' },
    ],
    correctId: 'coconut-milk',
    wrongMessage: 'Not this one.',
    revealTitle: 'You found the secret.',
    revealNote: 'Thick coconut milk, stirred in last and never boiled — that is where the silk comes from.',
  },

  cookingSteps: {
    heading: 'The chef needs\none last hand.',
    prompt: 'Drop the tempering into the pan.',
    options: [
      { id: 'curry-leaves', label: 'Curry Leaves', icon: 'curryLeaves' },
      { id: 'butter', label: 'Butter', icon: 'butter' },
      { id: 'tomato', label: 'Tomato', icon: 'tomato' },
    ],
    correctId: 'curry-leaves',
    wrongMessage: 'Not for this pan.',
    sweetSpot: [32, 56],
    tooLow: 'Barely a whisper.',
    tooHigh: 'Too fierce — the milk would split.',
    sweetMessage: "That's the sweet spot.",
  },

  biteItems: [
    { id: 'appam', label: 'Appam', icon: 'appam', weights: { comfort: 2, rich: 0.5 } },
    { id: 'stew', label: 'Stew', icon: 'stew', weights: { comfort: 1.5, rich: 1.5, aromatic: 0.5 } },
    { id: 'coconut', label: 'Coconut', icon: 'coconut', weights: { rich: 2, comfort: 0.5 } },
    { id: 'spice', label: 'Spice', icon: 'spices', weights: { bold: 2.5, aromatic: 1 } },
    { id: 'herbs', label: 'Herbs', icon: 'herbs', weights: { aromatic: 2, bold: 0.5 } },
  ],

  chefStory: {
    isSample: true, // ← SAMPLE CONTENT. Replace with Kokum's real chef note.
    heading: 'Every dish has\na secret.',
    note: [
      "Some dishes aren't created just to impress.",
      "They're created to bring back a feeling.",
    ],
    signature: '— The Kitchen at Kokum',
  },

  // Reserved for a future quiz scene; kept here so real questions can be added without code changes.
  quiz: [
    { question: 'What gives appam its lacy edge?', options: ['Fermentation', 'Butter', 'Egg'], answerIndex: 0 },
  ],

  tasteProfiles: {
    explorer: {
      id: 'explorer',
      title: 'The Explorer',
      description: 'You like layered flavours and unexpected combinations.',
      line: "Looks like you don't play it safe.",
      traits: [
        { emoji: '🌿', label: 'Aromatic' },
        { emoji: '🥥', label: 'Rich' },
        { emoji: '🌶️', label: 'Curious' },
      ],
      accent: '#d8b06a',
    },
    balanced: {
      id: 'balanced',
      title: 'The Balanced One',
      description: 'A little of everything, nothing out of tune.',
      line: 'You know exactly when enough is enough.',
      traits: [
        { emoji: '⚖️', label: 'Measured' },
        { emoji: '🥥', label: 'Gentle' },
        { emoji: '🌿', label: 'Fresh' },
      ],
      accent: '#c9b89a',
    },
    bold: {
      id: 'bold',
      title: 'The Bold One',
      description: 'You chase heat, spice and a bite that talks back.',
      line: 'Mild was never on your menu.',
      traits: [
        { emoji: '🌶️', label: 'Fiery' },
        { emoji: '✨', label: 'Spiced' },
        { emoji: '🔥', label: 'Fearless' },
      ],
      accent: '#c0603e',
    },
    comfort: {
      id: 'comfort',
      title: 'The Comfort Seeker',
      description: 'Warm, soft, familiar — food that feels like home.',
      line: 'You eat with your heart first.',
      traits: [
        { emoji: '🥥', label: 'Creamy' },
        { emoji: '🍚', label: 'Soft' },
        { emoji: '🤍', label: 'Soulful' },
      ],
      accent: '#e2c9a0',
    },
  },

  reviewSettings: {
    heading: 'How was your\nKokum experience?',
    placeholder: 'Tell us what you loved...',
    maxLength: 400,
    publicReviewUrl: undefined,
  },

  rewardSettings: {
    heartsGoal: 10,
    percentOff: 5,
    codePrefix: 'KOKUM-5',
    validityDays: 30,
    terms: 'Prototype reward code. Terms set by the restaurant in production.',
  },

  shareHashtag: '#KokumStories',
}
