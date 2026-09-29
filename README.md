# KOKUM Digital Dining

A table-side experience. Guests scan a QR, then play with the dish — reveal, hunt, cook, personalize, share, unlock a demo reward.

This is not a restaurant website.

## Run

```bash
npm install
npm run dev
```

- Experience: `/`
- Table card: `/qr`

Laptop demo: the experience sits in a phone frame with **Demo mode** on the side (`+1 Heart`, Restart).

## Gestures, not Next buttons

Touch to begin → swipe to reveal → tap ingredients → drag the secret → cook → build a bite → taste card → share → 10 hearts (demo) → reward → rate → discover more.

## Content

Everything replaceable lives in `src/data/dishData.ts`.

Demo dish: **Appam & Vegetable Stew** (sample only).

Hearts and the 5% code are **local demo data**, not Instagram. Production needs a backend to validate rewards.
