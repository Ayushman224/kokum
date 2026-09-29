import type { RewardSettings } from '../data/types'

export interface Reward {
  code: string
  percentOff: number
  issuedAt: string
  expiresAt: string
  /** Always true in the prototype — codes are generated on-device and not redeemable. */
  prototype: boolean
}

/**
 * Production: implement with a server that issues single-use codes and a POS/staff
 * endpoint that validates + burns them. The UI only depends on this interface.
 */
export interface RewardService {
  issue(settings: RewardSettings): Promise<Reward>
  validate(code: string): Promise<{ valid: boolean; reason?: string }>
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I for readability at the counter

function randomBlock(len: number) {
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

export const prototypeRewardService: RewardService = {
  async issue(settings) {
    const now = new Date()
    const expires = new Date(now.getTime() + settings.validityDays * 86_400_000)
    return {
      code: `${settings.codePrefix}-${randomBlock(4)}`,
      percentOff: settings.percentOff,
      issuedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      prototype: true,
    }
  },
  async validate() {
    return { valid: false, reason: 'Prototype codes cannot be redeemed.' }
  },
}
