import type { TasteProfile } from '../data/types'

/**
 * Prototype share link. Production: a signed referral URL per guest
 * (e.g. https://kokum.app/s/<token>) so opens can be attributed and counted.
 */
export function buildShareUrl(dishId: string, profile: TasteProfile) {
  let base = 'https://kokum.example/stories'
  try {
    const { origin, pathname } = window.location
    if (origin && origin !== 'null' && !origin.startsWith('blob:')) base = origin + pathname
  } catch {
    /* sandboxed frame — keep placeholder base */
  }
  const url = new URL(base)
  url.searchParams.set('story', dishId)
  url.searchParams.set('taste', profile.id)
  return url.toString()
}

export function buildShareText(profile: TasteProfile, hashtag: string) {
  return `I just discovered my Kokum Taste 👀\nI got ${profile.title.toUpperCase()}.\nWhat would you get?\n${hashtag}`
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
    /* fall through to legacy path (clipboard can be blocked inside iframes) */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
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
