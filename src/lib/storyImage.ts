import { LAYOUTS } from '../ui/StoryCard'
import type { CardLayout } from '../state/store'
import type { Dish } from '../data/types'
import { restaurant } from '../data/restaurant'

/**
 * Draws the story card as a 1080×1920 PNG. Uses canvas directly (not DOM capture) so it
 * works the same on iOS/Android and uses the page's already-loaded fonts.
 * `dishSvg` is the on-screen illustrated dish, used when the guest skipped the photo.
 */
export async function renderStoryPng(layout: CardLayout, photo: string | null, dish: Dish, dishSvg: SVGSVGElement | null): Promise<string> {
  try {
    await document.fonts?.ready
  } catch {
    /* ignore */
  }
  const L = LAYOUTS[layout]
  const W = 1080
  const H = 1920
  const u = W / 100 // 1cqw
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const c = cv.getContext('2d')!
  const serif = '"Cormorant Garamond", Georgia, serif'
  const sans = 'Manrope, system-ui, sans-serif'

  // background
  if (layout === 'editorial') {
    const g = c.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#f6efe3')
    g.addColorStop(1, '#eadcc4')
    c.fillStyle = g
    c.fillRect(0, 0, W, H)
  } else {
    const g = c.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, layout === 'gold' ? '#1c1411' : '#1a1411')
    g.addColorStop(1, '#0b0908')
    c.fillStyle = g
    c.fillRect(0, 0, W, H)
    const r = c.createRadialGradient(W / 2, H * 0.38, 10, W / 2, H * 0.38, W * 0.9)
    r.addColorStop(0, layout === 'gold' ? 'rgba(216,150,80,.35)' : 'rgba(60,45,38,.8)')
    r.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = r
    c.fillRect(0, 0, W, H)
  }

  // frame
  c.strokeStyle = L.line
  c.lineWidth = 2
  roundRect(c, 3.2 * u, 3.2 * u, W - 6.4 * u, H - 6.4 * u, 2.6 * u)
  c.stroke()
  c.strokeStyle = L.lineSoft
  roundRect(c, 4.6 * u, 4.6 * u, W - 9.2 * u, H - 9.2 * u, 1.8 * u)
  c.stroke()

  c.textAlign = 'center'
  c.fillStyle = L.ink
  spaced(c, 'KOKUM', W / 2, 10 * u + 6 * u, `400 ${6.4 * u}px ${serif}`, 0.9 * 6.4 * u)
  c.fillStyle = L.accent
  spaced(c, restaurant.line.toUpperCase(), W / 2, 22 * u, `600 ${2.4 * u}px ${sans}`, 0.4 * 2.4 * u)

  // photo
  const shape = layout === 'editorial' ? { w: 70, h: 84 } : layout === 'dark' ? { w: 76, h: 84 } : { w: 72, h: 72 }
  const pw = shape.w * u
  const ph = shape.h * u
  const px = (W - pw) / 2
  const py = 28 * u
  c.save()
  c.beginPath()
  if (layout === 'gold') c.arc(W / 2, py + ph / 2, pw / 2, 0, Math.PI * 2)
  else if (layout === 'editorial') archPath(c, px, py, pw, ph, 3 * u)
  else roundRect(c, px, py, pw, ph, 3 * u)
  c.closePath()
  c.clip()
  const bgp = c.createRadialGradient(W / 2, py + ph * 0.4, 10, W / 2, py + ph * 0.4, pw)
  bgp.addColorStop(0, layout === 'editorial' ? '#3a2d25' : '#2f2622')
  bgp.addColorStop(1, '#0e0b09')
  c.fillStyle = bgp
  c.fillRect(px, py, pw, ph)
  const img = photo ? await loadImage(photo) : dishSvg ? await svgToImage(dishSvg) : null
  if (img) {
    if (photo) {
      c.filter = 'saturate(1.05) contrast(1.04) sepia(.08)'
      cover(c, img, px, py, pw, ph)
      c.filter = 'none'
    } else {
      const s = pw * 0.92
      c.drawImage(img, (W - s) / 2, py + (ph - s) / 2, s, s)
    }
  }
  const vg = c.createRadialGradient(W / 2, py + ph * 0.2, pw * 0.3, W / 2, py + ph * 0.2, pw)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,.35)')
  c.fillStyle = vg
  c.fillRect(px, py, pw, ph)
  c.restore()
  c.strokeStyle = L.line
  c.lineWidth = 2
  c.beginPath()
  if (layout === 'gold') c.arc(W / 2, py + ph / 2, pw / 2 + 1, 0, Math.PI * 2)
  else if (layout === 'editorial') archPath(c, px, py, pw, ph, 3 * u)
  else roundRect(c, px, py, pw, ph, 3 * u)
  c.stroke()

  // text block
  let y = py + ph + 12 * u
  c.fillStyle = L.muted
  spaced(c, 'MY KOKUM STORY', W / 2, y, `600 ${2.6 * u}px ${sans}`, 0.45 * 2.6 * u)
  y += 12 * u
  const [a, b] = dish.shortName.split(' & ')
  c.font = `400 ${11 * u}px ${serif}`
  const wa = c.measureText(`${a} `).width
  const wb = c.measureText(` ${b}`).width
  c.font = `italic 400 ${11 * u}px ${serif}`
  const wamp = c.measureText('&').width
  let x = W / 2 - (wa + wamp + wb) / 2
  c.textAlign = 'left'
  c.fillStyle = L.ink
  c.font = `400 ${11 * u}px ${serif}`
  c.fillText(`${a} `, x, y)
  x += wa
  c.fillStyle = L.accent
  c.font = `italic 400 ${11 * u}px ${serif}`
  c.fillText('&', x, y)
  x += wamp
  c.fillStyle = L.ink
  c.font = `400 ${11 * u}px ${serif}`
  c.fillText(` ${b}`, x, y)
  c.textAlign = 'center'
  y += 9 * u
  c.fillStyle = L.accent
  c.font = `italic 400 ${6 * u}px ${serif}`
  c.fillText('The Explorer', W / 2, y)

  // traits
  y += 9 * u
  const traits = ['🌿 AROMATIC', '🥥 RICH', '🌶️ BOLD']
  c.font = `600 ${2.5 * u}px ${sans}`
  const widths = traits.map((t) => c.measureText(t).width + 5.6 * u + t.length * 0.14 * 2.5 * u)
  const gap = 2 * u
  let tx = W / 2 - (widths.reduce((s, w) => s + w, 0) + gap * 2) / 2
  traits.forEach((t, i) => {
    c.strokeStyle = L.lineSoft
    roundRect(c, tx, y - 4 * u, widths[i], 5.8 * u, 2.9 * u)
    c.stroke()
    c.fillStyle = L.ink
    spaced(c, t, tx + widths[i] / 2, y, `600 ${2.5 * u}px ${sans}`, 0.14 * 2.5 * u)
    tx += widths[i] + gap
  })

  c.fillStyle = L.accent
  spaced(c, restaurant.hashtag.toUpperCase(), W / 2, H - 10 * u, `600 ${2.8 * u}px ${sans}`, 0.35 * 2.8 * u)

  return cv.toDataURL('image/png')
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath()
  c.moveTo(x + r, y)
  c.arcTo(x + w, y, x + w, y + h, r)
  c.arcTo(x + w, y + h, x, y + h, r)
  c.arcTo(x, y + h, x, y, r)
  c.arcTo(x, y, x + w, y, r)
  c.closePath()
}

function archPath(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = w / 2
  c.beginPath()
  c.moveTo(x, y + rr)
  c.arc(x + rr, y + rr, rr, Math.PI, 0)
  c.lineTo(x + w, y + h - r)
  c.arcTo(x + w, y + h, x + w - r, y + h, r)
  c.lineTo(x + r, y + h)
  c.arcTo(x, y + h, x, y + h - r, r)
  c.closePath()
}

function cover(c: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.width, h / img.height)
  const iw = img.width * s
  const ih = img.height * s
  c.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih)
}

function spaced(c: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, tracking: number) {
  c.font = font
  const chars = [...text]
  const ws = chars.map((ch) => c.measureText(ch).width)
  const total = ws.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1)
  let cur = x - total / 2
  const align = c.textAlign
  c.textAlign = 'left'
  chars.forEach((ch, i) => {
    c.fillText(ch, cur, y)
    cur += ws[i] + tracking
  })
  c.textAlign = align
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((res) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = () => res(null)
    i.src = src
  })
}

function svgToImage(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', '800')
  clone.setAttribute('height', '800')
  const s = new XMLSerializer().serializeToString(clone)
  return loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s))
}
