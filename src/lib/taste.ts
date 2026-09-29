import { dishData, type TasteProfile } from '../data/dishData'

export function resolveTaste(items: string[]): TasteProfile {
  const has = (id: string) => items.includes(id)
  if (has('spice') && has('herbs')) return dishData.tasteProfiles.explorer
  if (has('spice') && !has('coconut')) return dishData.tasteProfiles.bold
  if ((has('appam') || has('stew')) && has('coconut') && !has('spice')) {
    return dishData.tasteProfiles.comfort
  }
  return dishData.tasteProfiles.balanced
}
