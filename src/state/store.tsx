import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { rewardRules } from '../data/restaurant'

export type Screen = 'menu' | 'story' | 'gate' | 'kitchen' | 'quiz' | 'studio' | 'share' | 'review' | 'reward' | 'finale'

/** Order of the dish journey (menu sits outside it). */
export const JOURNEY: Screen[] = ['story', 'gate', 'kitchen', 'quiz', 'studio', 'share', 'review', 'reward', 'finale']

export type RewardId = 'quiz' | 'share' | 'likes' | 'review'
/** earned = confirmed by the app; pending = guest claimed it, staff verifies at the table. */
export type RewardStatus = 'locked' | 'pending' | 'earned'

export type CardLayout = 'editorial' | 'dark' | 'gold'

interface State {
  screen: Screen
  go: (s: Screen) => void
  dishId: string
  openDish: (id: string) => void
  backToMenu: () => void
  rewards: Record<RewardId, RewardStatus>
  setReward: (id: RewardId, s: RewardStatus) => void
  /** Confirmed % (earned only). */
  confirmed: number
  /** Confirmed + pending %. */
  potential: number
  photo: string | null
  setPhoto: (p: string | null) => void
  layout: CardLayout
  setLayout: (l: CardLayout) => void
  rewardCode: string
  toast: string | null
  showToast: (m: string) => void
  soundOn: boolean
  setSoundOn: (on: boolean) => void
  runId: number
}

const Ctx = createContext<State | null>(null)

function code() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const b = new Uint8Array(4)
  crypto.getRandomValues(b)
  return 'KOKUM-' + Array.from(b, (x) => A[x % A.length]).join('')
}

const EMPTY: Record<RewardId, RewardStatus> = { quiz: 'locked', share: 'locked', likes: 'locked', review: 'locked' }

export function StoreProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('menu')
  const [dishId, setDishId] = useState('appam-stew')
  const [rewards, setRewards] = useState(EMPTY)
  const [photo, setPhoto] = useState<string | null>(null)
  const [layout, setLayout] = useState<CardLayout>('gold')
  const [rewardCode, setRewardCode] = useState(code)
  const [toast, setToast] = useState<string | null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [runId, setRunId] = useState(0)
  const t = useRef(0)

  const setReward = useCallback((id: RewardId, s: RewardStatus) => setRewards((r) => ({ ...r, [id]: s })), [])
  const showToast = useCallback((m: string) => {
    window.clearTimeout(t.current)
    setToast(m)
    t.current = window.setTimeout(() => setToast(null), 2800)
  }, [])
  const openDish = useCallback((id: string) => {
    setDishId(id)
    setRewards(EMPTY)
    setPhoto(null)
    setRewardCode(code())
    setRunId((n) => n + 1)
    setScreen('story')
  }, [])
  const backToMenu = useCallback(() => setScreen('menu'), [])

  const confirmed = rewardRules.filter((r) => rewards[r.id] === 'earned').reduce((s, r) => s + r.percent, 0)
  const potential = rewardRules.filter((r) => rewards[r.id] !== 'locked').reduce((s, r) => s + r.percent, 0)

  const value = useMemo<State>(
    () => ({ screen, go: setScreen, dishId, openDish, backToMenu, rewards, setReward, confirmed, potential, photo, setPhoto, layout, setLayout, rewardCode, toast, showToast, soundOn, setSoundOn, runId }),
    [screen, dishId, openDish, backToMenu, rewards, setReward, confirmed, potential, photo, layout, rewardCode, toast, showToast, soundOn, runId],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside StoreProvider')
  return v
}
