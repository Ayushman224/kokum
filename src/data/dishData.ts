/**
 * KOKUM — Digital Dining Experience
 * ---------------------------------
 * DEMO CONTENT ONLY. Not Kokum’s real recipes, chef notes, or loyalty programme.
 *
 * Production (do not implement now):
 * 1. Unique QR per dish
 * 2. Real backend + customer sessions
 * 3. Referral links and verified social actions
 * 4. Reward validation (never trust the client)
 * 5. Customer profiles + loyalty
 * 6. Restaurant / dish analytics
 * 7. Feedback dashboard
 * 8. Personalized recommendations
 * 9. WhatsApp / campaign follow-ups
 * 10. Admin dashboard
 * 11. Multi-restaurant support
 */

export type Ingredient = {
  id: string
  name: string
  symbol: string
  story: string
  image: string
  imageAlt: string
}

export type SecretOption = {
  id: string
  name: string
  symbol: string
  correct: boolean
}

export type BiteItem = {
  id: string
  name: string
  symbol: string
}

export type TasteProfile = {
  id: string
  name: string
  line: string
  aftertaste: string
  notes: { symbol: string; label: string }[]
}

export type UpcomingStory = {
  storyNumber: string
  title: string
  discovered: boolean
}

function photo(id: string, w = 1400): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`
}

export const brand = {
  name: 'KOKUM',
  productName: 'KOKUM DIGITAL DINING EXPERIENCE',
  tagline: 'EVERY DISH HAS A STORY.',
  taglineLines: ['EVERY DISH', 'HAS A STORY.'] as const,
  closeLine: 'See you at the next bite.',
}

export const dishData = {
  id: 'story-01-appam-vegetable-stew',
  storyNumber: '01',
  storyLabel: 'STORY 01',
  nameLines: ['APPAM', '&', 'VEGETABLE STEW'] as const,
  shortName: 'Appam & Vegetable Stew',
  cardDishName: 'APPAM & STEW',

  heroImage: photo('photo-1455619452474-d2be8b1e70cd', 1600),
  heroImageAlt: 'A creamy coconut stew in a dark bowl',
  introImage: photo('photo-1504674900247-0877df9cc836', 1800),
  introImageAlt: 'A warmly lit table of plated food',
  chefImage: photo('photo-1559339352-11d035aa65de', 1400),
  chefImageAlt: 'A chef in a restaurant kitchen',
  kitchenImage: photo('photo-1556910103-1c02745aae4d', 1400),
  kitchenImageAlt: 'A restaurant kitchen',

  hookWhisper: 'Something is waiting for you.',
  hookInvite: 'Want to discover yours?',
  touchLabel: 'TOUCH TO BEGIN',

  revealPrompt: 'YOUR DISH\nIS WAITING.',
  revealHint: 'Swipe to reveal.',

  huntPrompt: 'Something here makes this dish special.',
  huntHint: 'Find 3 ingredients.',
  huntDone: 'YOU FOUND THEM.',
  huntNeed: 3,

  ingredients: [
    {
      id: 'coconut',
      name: 'Coconut',
      symbol: '🥥',
      story: 'Natural richness. A creamy body.',
      image: photo('photo-1551754655-cd27e38d2076', 800),
      imageAlt: 'Split coconut',
    },
    {
      id: 'rice',
      name: 'Rice',
      symbol: '🍚',
      story: 'The quiet foundation of the appam.',
      image: photo('photo-1516684669134-de6f7c473a2a', 800),
      imageAlt: 'Rice grains',
    },
    {
      id: 'curry-leaves',
      name: 'Curry Leaves',
      symbol: '🌿',
      story: 'Perfume after a brief heat.',
      image: photo('photo-1466637574441-749b8f19452f', 800),
      imageAlt: 'Green leaves',
    },
    {
      id: 'green-chilli',
      name: 'Green Chilli',
      symbol: '🌶️',
      story: 'Clean warmth, not noise.',
      image: photo('photo-1589927986089-35812388d1f4', 800),
      imageAlt: 'Green chillies',
    },
    {
      id: 'spices',
      name: 'Spices',
      symbol: '✨',
      story: 'A restrained blend.',
      image: photo('photo-1596040033229-a9821ebd058d', 800),
      imageAlt: 'Spices',
    },
  ] satisfies Ingredient[],

  secretLead: 'But there is one more.',
  secretTitle: 'THE SECRET.',
  secretSuccess: 'YOU FOUND THE SECRET.',
  secretFail: 'Not this one.',
  secretIngredient: {
    options: [
      { id: 'coconut', name: 'Coconut', symbol: '🥥', correct: true },
      { id: 'tomato', name: 'Tomato', symbol: '🍅', correct: false },
      { id: 'cream', name: 'Cream', symbol: '🥛', correct: false },
    ] satisfies SecretOption[],
  },

  chefNeed: ['THE CHEF NEEDS', 'ONE LAST HAND.'] as const,
  chefSuccess: 'PERFECT.',
  chefSweet: "THAT'S THE SWEET SPOT.",
  chefIngredients: [
    { id: 'coconut', name: 'Coconut', symbol: '🥥', correct: true },
    { id: 'tomato', name: 'Tomato', symbol: '🍅', correct: false },
    { id: 'cream', name: 'Cream', symbol: '🥛', correct: false },
  ] satisfies SecretOption[],
  cook: {
    low: 'LOW',
    high: 'HIGH',
    sweetMin: 0.58,
    sweetMax: 0.74,
  },

  biteHeading: 'YOUR TURN.',
  bitePrompt: "Build the bite you'd choose.",
  biteCta: 'GENERATE MY BITE',
  biteNeed: 3,
  biteItems: [
    { id: 'appam', name: 'Appam', symbol: '🫓' },
    { id: 'stew', name: 'Stew', symbol: '🍲' },
    { id: 'coconut', name: 'Coconut', symbol: '🥥' },
    { id: 'spice', name: 'Spice', symbol: '🌶️' },
    { id: 'herbs', name: 'Herbs', symbol: '🌿' },
  ] satisfies BiteItem[],

  tasteHeading: 'YOUR KOKUM TASTE',
  tasteCta: 'CREATE MY KOKUM CARD',
  tasteProfiles: {
    explorer: {
      id: 'explorer',
      name: 'THE EXPLORER',
      line: 'You like layered flavours and unexpected combinations.',
      aftertaste: "Looks like you don't play it safe.",
      notes: [
        { symbol: '🌿', label: 'Aromatic' },
        { symbol: '🥥', label: 'Rich' },
        { symbol: '🌶️', label: 'Curious' },
      ],
    },
    balanced: {
      id: 'balanced',
      name: 'THE BALANCED ONE',
      line: 'You want comfort, with just enough character.',
      aftertaste: 'Poise on a plate.',
      notes: [
        { symbol: '🍲', label: 'Warm' },
        { symbol: '🥥', label: 'Soft' },
        { symbol: '✨', label: 'Even' },
      ],
    },
    bold: {
      id: 'bold',
      name: 'THE BOLD ONE',
      line: 'You chase heat and leave a mark.',
      aftertaste: 'Quiet is not your flavour.',
      notes: [
        { symbol: '🌶️', label: 'Bold' },
        { symbol: '✨', label: 'Sharp' },
        { symbol: '🔥', label: 'Alive' },
      ],
    },
    comfort: {
      id: 'comfort',
      name: 'THE COMFORT SEEKER',
      line: 'You come back to what feels like home.',
      aftertaste: 'Soft, familiar, enough.',
      notes: [
        { symbol: '🫓', label: 'Gentle' },
        { symbol: '🥥', label: 'Creamy' },
        { symbol: '🍲', label: 'Warm' },
      ],
    },
  } satisfies Record<string, TasteProfile>,

  chefSecretHeading: ['EVERY DISH HAS', 'A SECRET.'] as const,
  chefNoteLabel: "CHEF'S NOTE",
  chefStory: {
    isSample: true as const,
    sampleLabel: 'SAMPLE STORY',
    paragraphs: [
      "Some dishes aren't created just to impress.",
      "They're created to bring back a feeling.",
    ],
  },

  cardEyebrow: 'MY TASTE',
  cardHashtag: '#KOKUMSTORIES',
  cardDiscovered: 'DISH DISCOVERED',
  saveCard: 'SAVE MY CARD',
  shareCard: 'SHARE MY CARD',
  copyLink: 'COPY SHARE LINK',

  socialHeading: ['YOUR STORY', "DOESN'T HAVE TO END HERE."] as const,
  socialPrompt: 'Share it with your friends.',
  shareMessage: (profile: string) =>
    `I just discovered my Kokum Taste 👀\nI got ${profile}.\nWhat would you get?\n#KokumStories`,
  instagramSoon:
    'Instagram sharing will be connected in the production version.',

  heartHeading: '10 HEARTS.',
  heartPrompt: 'Get 10 people to like your Kokum Story.',
  heartDisclaimer: 'Demo hearts — not Instagram data.',
  heartUnlock: 'YOU UNLOCKED IT.',
  heartTarget: 10,

  reward: {
    heading: "YOU'VE UNLOCKED",
    offerLabel: '5% OFF',
    codePrefix: 'KOKUM-5',
    copyCta: 'COPY CODE',
    staffCta: 'SHOW TO STAFF',
    prototypeNote: 'Prototype reward code.',
  },

  feedbackHeading: ['HOW WAS YOUR', 'KOKUM EXPERIENCE?'] as const,
  feedbackMore: 'Want to tell us more?',
  writeReview: 'WRITE A REVIEW',
  skipReview: 'SKIP',
  reviewPlaceholder: 'Tell us what you loved...',
  submitReview: 'SUBMIT',
  thanks: 'THANK YOU FOR SHARING.',

  explorerHeading: ['YOU\'VE DISCOVERED', 'ONE STORY.'] as const,
  explorerPrompt: 'Which story will you discover next?',
  scanAnother: 'Scan the QR beside another dish to unlock its story.',
  totalStories: 8,
  discoveredCount: 1,
  upcomingStories: [
    { storyNumber: '01', title: 'YOUR DISH', discovered: true },
    { storyNumber: '02', title: 'STORY 02', discovered: false },
    { storyNumber: '03', title: 'STORY 03', discovered: false },
    { storyNumber: '04', title: 'STORY 04', discovered: false },
  ] satisfies UpcomingStory[],

  qrCaption: 'SCAN.\nDISCOVER.\nTASTE.',
  tableCardHint: 'Place this card beside the dish.',
  loadingLine: 'Setting the table...',
}

export type DishData = typeof dishData

export const SCENES = [
  { id: 'hook', label: 'Begin' },
  { id: 'reveal', label: 'Reveal' },
  { id: 'hunt', label: 'Hunt' },
  { id: 'secret', label: 'Secret' },
  { id: 'chef', label: 'Chef' },
  { id: 'bite', label: 'Bite' },
  { id: 'profile', label: 'Taste' },
  { id: 'letter', label: 'Note' },
  { id: 'card', label: 'Card' },
  { id: 'share', label: 'Share' },
  { id: 'hearts', label: 'Hearts' },
  { id: 'reward', label: 'Reward' },
  { id: 'feedback', label: 'Rate' },
  { id: 'explorer', label: 'World' },
  { id: 'finale', label: 'Close' },
] as const

export type SceneId = (typeof SCENES)[number]['id']
