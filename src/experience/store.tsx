import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { dishData } from '../data/dishData'
import type { TasteProfile, TasteProfileId } from '../data/types'
import type { Reward } from '../lib/reward'
import { analytics } from '../lib/services'

export const SCENES = [
  { id: 'intro', chapter: 'The Hook' },
  { id: 'reveal', chapter: 'Reveal' },
  { id: 'hunt', chapter: 'Discover' },
  { id: 'secret', chapter: 'The Secret' },
  { id: 'chef', chapter: 'Help the Chef' },
  { id: 'bite', chapter: 'Build Your Bite' },
  { id: 'profile', chapter: 'Your Taste' },
  { id: 'chefSecret', chapter: "Chef's Secret" },
  { id: 'card', chapter: 'Your Card' },
  { id: 'share', chapter: 'Share' },
  { id: 'hearts', chapter: '10 Hearts' },
  { id: 'reward', chapter: 'Reward' },
  { id: 'feedback', chapter: 'Feedback' },
  { id: 'explore', chapter: 'Discover More' },
  { id: 'finale', chapter: 'Finale' },
] as const

export type SceneId = (typeof SCENES)[number]['id']

interface ExperienceState {
  scene: SceneId
  sceneIndex: number
  go: (s: SceneId) => void
  next: () => void
  restart: () => void
  tasteId: TasteProfileId
  profile: TasteProfile
  setTaste: (id: TasteProfileId) => void
  biteIds: string[]
  setBiteIds: (ids: string[]) => void
  hearts: number
  setHearts: (n: number) => void
  reward: Reward | null
  setReward: (r: Reward | null) => void
  soundOn: boolean
  setSoundOn: (on: boolean) => void
  toast: string | null
  showToast: (msg: string) => void
  /** Increments on restart so scenes remount cleanly. */
  runId: number
}

const Ctx = createContext<ExperienceState | null>(null)

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<SceneId>('intro')
  const [tasteId, setTaste] = useState<TasteProfileId>('explorer')
  const [biteIds, setBiteIds] = useState<string[]>([])
  const [hearts, setHearts] = useState(0)
  const [reward, setReward] = useState<Reward | null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [runId, setRunId] = useState(0)
  const toastTimer = useRef<number>(0)

  const sceneIndex = SCENES.findIndex((s) => s.id === scene)

  const go = useCallback((s: SceneId) => {
    analytics.track('scene_view', { scene: s })
    setScene(s)
  }, [])

  const next = useCallback(() => {
    setScene((cur) => {
      const i = SCENES.findIndex((s) => s.id === cur)
      return SCENES[Math.min(i + 1, SCENES.length - 1)].id
    })
  }, [])

  const restart = useCallback(() => {
    setTaste('explorer')
    setBiteIds([])
    setHearts(0)
    setReward(null)
    setRunId((r) => r + 1)
    setScene('intro')
  }, [])

  const showToast = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const value = useMemo<ExperienceState>(
    () => ({
      scene,
      sceneIndex,
      go,
      next,
      restart,
      tasteId,
      profile: dishData.tasteProfiles[tasteId],
      setTaste,
      biteIds,
      setBiteIds,
      hearts,
      setHearts,
      reward,
      setReward,
      soundOn,
      setSoundOn,
      toast,
      showToast,
      runId,
    }),
    [scene, sceneIndex, go, next, restart, tasteId, biteIds, hearts, reward, soundOn, toast, showToast, runId],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useExperience() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useExperience must be used inside ExperienceProvider')
  return v
}
