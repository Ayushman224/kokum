import { useEffect, useState, type ComponentType } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { StoreProvider, useStore, type Screen } from './state/store'
import Header from './ui/Header'
import MenuScreen from './screens/MenuScreen'
import StoryScreen from './screens/StoryScreen'
import GateScreen from './screens/GateScreen'
import KitchenScreen from './screens/KitchenScreen'
import QuizScreen from './screens/QuizScreen'
import StudioScreen from './screens/StudioScreen'
import ShareScreen from './screens/ShareScreen'
import ReviewScreen from './screens/ReviewScreen'
import RewardScreen from './screens/RewardScreen'
import FinaleScreen from './screens/FinaleScreen'
import { maxDiscount } from './data/restaurant'
import { sound } from './lib/sound'

const SCREENS: Record<Screen, ComponentType> = {
  menu: MenuScreen,
  story: StoryScreen,
  gate: GateScreen,
  kitchen: KitchenScreen,
  quiz: QuizScreen,
  studio: StudioScreen,
  share: ShareScreen,
  review: ReviewScreen,
  reward: RewardScreen,
  finale: FinaleScreen,
}

export default function App() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const forceMobile = new URLSearchParams(window.location.search).get('mode') === 'mobile'
  const framed = !forceMobile && vp.w >= 820 && vp.h >= 560

  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <SoundBoot />
        {framed ? <DesktopFrame vp={vp} /> : <div className="fixed inset-0"><Stage /></div>}</StoreProvider>
    </MotionConfig>
  )
}

/**
 * Turns the click sound on with the guest's first touch (browsers block audio before that),
 * unless they muted it on a previous visit. Every button then gets a soft tap sound.
 */
function SoundBoot() {
  const { setSoundOn } = useStore()
  useEffect(() => {
    const first = () => {
      if (!sound.prefersMuted && !sound.enabled) {
        sound.setEnabled(true)
        setSoundOn(true)
      }
    }
    const tap = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest('button, a, [role="radio"]')
      if (el && !el.closest('[aria-label="Turn sound on"], [aria-label="Turn sound off"]')) sound.tap()
    }
    document.addEventListener('pointerdown', first, { once: true })
    document.addEventListener('click', tap)
    return () => {
      document.removeEventListener('pointerdown', first)
      document.removeEventListener('click', tap)
    }
  }, [setSoundOn])
  return null
}

/** The phone-sized stage every screen renders into. No page scroll; screens cross-dissolve. */
function Stage({ framed = false }: { framed?: boolean }) {
  const { screen, runId, toast } = useStore()
  const S = SCREENS[screen]
  return (
    <main className="grain relative h-full w-full touch-manipulation overflow-clip bg-ink text-ivory" style={{ ['--top' as string]: framed ? '48px' : 'max(12px, env(safe-area-inset-top))' }}>
      <AnimatePresence initial={false}>
        <motion.section
          key={`${screen}-${runId}`}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <S />
        </motion.section>
      </AnimatePresence>
      <Header />
      <AnimatePresence>
        {toast && (
          <motion.div className="pointer-events-none absolute inset-x-5 bottom-8 z-[90] flex justify-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} role="status">
            <div className="rounded-2xl border border-gold/30 bg-[#1b1512]/95 px-5 py-3 text-center text-[13px] leading-snug text-ivory shadow-2xl backdrop-blur-md">{toast}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

/** Desktop demo: the real mobile experience inside a phone, for showing the owner on a laptop. */
function DesktopFrame({ vp }: { vp: { w: number; h: number } }) {
  const phoneH = Math.min(868, vp.h - 40)
  const phoneW = Math.round((phoneH * 414) / 868)
  return (
    <div className="grain fixed inset-0 overflow-clip bg-[#080706]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(40% 55% at 50% 50%, rgba(192,122,76,.16), transparent 70%), radial-gradient(30% 40% at 15% 20%, rgba(138,39,72,.12), transparent 70%)' }} />
      <div className="relative flex h-full items-center justify-center gap-[6vw] px-8">
        {vp.w >= 1100 && (
          <aside className="w-[300px] shrink-0">
            <div className="font-serif text-[15px] tracking-[0.5em] text-ivory">KOKUM</div>
            <div className="eyebrow mt-2 text-[9.5px] text-gold/80">Digital dining experience</div>
            <h1 className="display mt-6 text-[44px] text-ivory">
              Scan. Play.
              <br />
              <span className="gold-text italic">Save up to {maxDiscount}%.</span>
            </h1>
            <p className="mt-5 text-[13.5px] leading-relaxed text-ivory/55">
              Guests scan the table QR, pick a dish from the menu, uncover its secret ingredients, cook it in a mini-game, guess the first bite, make a selfie story card and share it — collecting discounts before they pay.
            </p>
            <ol className="mt-6 space-y-1.5 text-[12px] text-ivory/60">
              {['Menu', 'Secret ingredients', 'Play the kitchen (or skip)', 'First-bite quiz · +2%', 'Selfie story card', 'Share · +2%  ·  10 likes · +1%', 'Review · +2%', 'Show staff before paying'].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="w-4 font-serif text-gold/70">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[11px] leading-relaxed text-ivory/35">Prototype — demo dish content. Social likes are not tracked yet; staff verify shares at the table.</p>
          </aside>
        )}
        <div className="relative shrink-0" style={{ width: phoneW, height: phoneH }}>
          <div className="absolute inset-0 rounded-[58px] p-[12px]" style={{ background: 'linear-gradient(145deg, #3a3430 0%, #16130f 35%, #0b0908 60%, #2c2622 100%)', boxShadow: '0 0 0 1px rgba(216,176,106,.18), 0 60px 120px -30px rgba(0,0,0,.95), 0 0 120px -20px rgba(192,122,76,.25)' }}>
            <div className="relative h-full w-full overflow-clip rounded-[46px] bg-ink" style={{ transform: 'translateZ(0)' }}>
              <Stage framed />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-[95] flex h-[44px] items-center justify-between px-[30px] text-[13px] font-semibold text-ivory/90">
                <span>9:41</span>
                <span className="absolute left-1/2 top-[11px] h-[28px] w-[104px] -translate-x-1/2 rounded-full bg-black" />
                <span className="h-[11px] w-[24px] rounded-[3px] border border-ivory/60 p-[1.5px]">
                  <span className="block h-full w-[75%] rounded-[1.5px] bg-ivory/90" />
                </span>
              </div>
              <span className="pointer-events-none absolute bottom-[8px] left-1/2 z-[95] h-[5px] w-[130px] -translate-x-1/2 rounded-full bg-ivory/70" />
            </div>
          </div>
        </div>
        {vp.w >= 1100 && <div className="w-[300px] shrink-0" aria-hidden="true" />}
      </div>
      <div className="absolute right-6 top-5 flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span className="eyebrow text-[9px] text-gold">Demo</span>
      </div>
    </div>
  )
}
