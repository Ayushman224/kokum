import type { TasteProfile } from '../data/types'
import { dishData } from '../data/dishData'

/**
 * Renders the Kokum Card to a 1080×1920 PNG (Instagram-story size).
 * Drawn directly on canvas so the page's loaded web fonts are used and no
 * cross-origin stylesheet reads are needed (html-to-image would need those).
 */
export async function renderCardPng(profile: TasteProfile): Promise<string> {
  try {
    await document.fonts?.ready
  } catch {
    /* ignore */
  }
  const W = 1080
  const H = 1920
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const c = cv.getContext('2d')!

  // background
  const bg = c.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#171210')
  bg.addColorStop(1, '#0b0908')
  c.fillStyle = bg
  c.fillRect(0, 0, W, H)
  const glow = c.createRadialGradient(W / 2, 720, 20, W / 2, 720, 800)
  glow.addColorStop(0, hexA(profile.accent, 0.35))
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  c.fillStyle = glow
  c.fillRect(0, 0, W, H)

  // frame
  c.strokeStyle = hexA('#d8b06a', 0.55)
  c.lineWidth = 2
  c.strokeRect(60, 60, W - 120, H - 120)
  c.strokeStyle = hexA('#d8b06a', 0.2)
  c.strokeRect(80, 80, W - 160, H - 160)

  const serif = '"Cormorant Garamond", Georgia, serif'
  const sans = 'Manrope, system-ui, sans-serif'
  c.textAlign = 'center'
  c.fillStyle = '#f4ecdf'

  spaced(c, 'KOKUM', W / 2, 250, `500 64px ${serif}`, 26)
  c.fillStyle = hexA('#d8b06a', 0.9)
  spaced(c, 'MY TASTE', W / 2, 360, `600 28px ${sans}`, 12)

  // sigil
  const cx = W / 2
  const cy = 700
  c.strokeStyle = hexA(profile.accent, 0.8)
  c.lineWidth = 2
  for (const r of [230, 180, 130]) {
    c.beginPath()
    c.arc(cx, cy, r, 0, Math.PI * 2)
    c.stroke()
  }
  c.lineWidth = 1.5
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const r2 = i % 3 === 0 ? 300 : 265
    c.beginPath()
    c.moveTo(cx + Math.cos(a) * 240, cy + Math.sin(a) * 240)
    c.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2)
    c.stroke()
  }
  c.font = `120px ${sans}`
  c.textBaseline = 'middle'
  c.fillText(profile.traits[0].emoji, cx, cy + 6)
  c.textBaseline = 'alphabetic'

  // title
  c.fillStyle = '#f4ecdf'
  c.font = `400 124px ${serif}`
  const words = profile.title.split(' ')
  const last = words.pop()!
  c.fillText(words.join(' '), W / 2, 1150)
  const gold = c.createLinearGradient(W / 2 - 250, 0, W / 2 + 250, 0)
  gold.addColorStop(0, '#b98a4a')
  gold.addColorStop(0.45, '#f0d49a')
  gold.addColorStop(1, '#9d6a39')
  c.fillStyle = gold
  c.font = `italic 400 140px ${serif}`
  c.fillText(last, W / 2, 1290)

  // traits
  c.fillStyle = '#f4ecdf'
  const traitY = 1420
  const spacing = 300
  profile.traits.forEach((t, i) => {
    const x = W / 2 + (i - 1) * spacing
    c.font = `44px ${sans}`
    c.fillText(t.emoji, x, traitY)
    c.fillStyle = hexA('#f4ecdf', 0.85)
    spaced(c, t.label.toUpperCase(), x, traitY + 62, `600 24px ${sans}`, 6)
    c.fillStyle = '#f4ecdf'
  })

  // divider
  const hl = c.createLinearGradient(200, 0, W - 200, 0)
  hl.addColorStop(0, 'rgba(216,176,106,0)')
  hl.addColorStop(0.5, 'rgba(216,176,106,.7)')
  hl.addColorStop(1, 'rgba(216,176,106,0)')
  c.fillStyle = hl
  c.fillRect(200, 1545, W - 400, 2)

  c.fillStyle = hexA('#f4ecdf', 0.55)
  spaced(c, 'DISH DISCOVERED', W / 2, 1620, `600 24px ${sans}`, 8)
  c.fillStyle = '#f4ecdf'
  c.font = `400 64px ${serif}`
  c.fillText('Appam & Stew', W / 2, 1700)
  c.fillStyle = hexA('#d8b06a', 0.85)
  spaced(c, dishData.shareHashtag.toUpperCase(), W / 2, 1790, `600 26px ${sans}`, 8)

  return cv.toDataURL('image/png')
}

function spaced(c: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, tracking: number) {
  c.font = font
  const chars = [...text]
  const widths = chars.map((ch) => c.measureText(ch).width)
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1)
  let cur = x - total / 2
  const align = c.textAlign
  c.textAlign = 'left'
  chars.forEach((ch, i) => {
    c.fillText(ch, cur, y)
    cur += widths[i] + tracking
  })
  c.textAlign = align
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
