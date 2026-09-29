import type { BiteItem, TasteAxis, TasteProfileId } from '../data/types'

const AXES: TasteAxis[] = ['comfort', 'rich', 'bold', 'aromatic']

/**
 * Simple, transparent front-end taste calculation.
 * Production: replace with a model that also uses past visits / other dishes.
 */
export function computeTaste(items: BiteItem[]): TasteProfileId {
  const score: Record<TasteAxis, number> = { comfort: 0, rich: 0, bold: 0, aromatic: 0 }
  for (const it of items) for (const a of AXES) score[a] += it.weights[a] ?? 0

  const ids = new Set(items.map((i) => i.id))
  if (items.length >= 4 && ids.has('spice') && ids.has('herbs')) return 'explorer'

  const values = AXES.map((a) => score[a])
  const max = Math.max(...values)
  const min = Math.min(...values)
  if (max - min <= 1.25) return 'balanced'

  const top = AXES[values.indexOf(max)]
  if (top === 'bold') return 'bold'
  if (top === 'aromatic') return 'explorer'
  return 'comfort'
}
