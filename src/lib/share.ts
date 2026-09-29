import { restaurant } from '../data/restaurant'

/**
 * Prototype share link. Production: a signed per-guest URL so opens/likes can be
 * attributed and verified (that is what would unlock the "10 likes" reward automatically).
 */
export function storyUrl(dishId: string, code: string) {
  let base = 'https://kokum.example/'
  try {
    const { origin, pathname } = window.location
    if (origin.startsWith('http')) base = origin + pathname
  } catch {
    /* sandboxed */
  }
  const u = new URL(base)
  u.searchParams.set('story', dishId)
  u.searchParams.set('ref', code.toLowerCase())
  return u.toString()
}

export function shareText(dishName: string) {
  return `I just discovered the story behind my dish at Kokum 🍛\nMy ${dishName} story is ready.\nWhat would yours be?\n${restaurant.instagramHandle} ${restaurant.hashtag}`
}

export function whatsappUrl(text: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/** Native share sheet with the card image when the phone supports it (iOS/Android). */
export async function nativeShareImage(dataUrl: string, text: string): Promise<boolean> {
  try {
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'kokum-story.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text })
      return true
    }
  } catch {
    /* cancelled or unsupported */
  }
  return false
}

export function downloadDataUrl(dataUrl: string, name = 'kokum-story.png') {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}
