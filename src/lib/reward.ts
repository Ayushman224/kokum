/**
 * DEMO ONLY.
 * Production must mint and validate reward codes on a backend after
 * verified share / referral actions, tied to a customer session.
 */
export function createRewardCode(prefix: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `${prefix}-${suffix}`
}
