import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ExperienceProvider, SCENES, useExperience } from './experience/store'
import Experience from './experience/Experience'
import QRCardModal from './components/QRCard'
import { sound } from './lib/sound'
import { FlaskConical, QrCode, RotateCcw, Volume2, VolumeX } from 'lucide-react'

function useViewport() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return vp
}

export default function App() {
  const vp = useViewport()
  const forceMobile = new URLSearchParams(window.location.search).get('mode') === 'mobile'
  const presentation = !forceMobile && vp.w >= 820 && vp.h >= 560
  const [qr, setQr] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        {presentation ? (
          <PresentationShell vp={vp} onShowQR={() => setQr(true)} />
        ) : (
          <div className="fixed inset-0">
            <Experience onShowQR={() => setQr(true)} />
          </div>
        )}
        <AnimatePresence>{qr && <QRCardModal onClose={() => setQr(false)} />}</AnimatePresence>
      </ExperienceProvider>
    </MotionConfig>
  )
}

/**
 * DESKTOP PRESENTATION MODE — for demoing to the restaurant owner from a laptop.
 * The real mobile experience runs inside a phone frame; presenter controls sit beside it.
 */
function PresentationShell({ vp, onShowQR }: { vp: { w: number; h: number }; onShowQR: () => void }) {
  const { scene, go, restart, soundOn, setSoundOn } = useExperience()
  const phoneH = Math.min(844 + 24, vp.h - 40)
  const phoneW = Math.round((phoneH * 414) / 868)
  const showLeft = vp.w >= 1180
  const showRight = vp.w >= 980

  return (
    <div className="grain fixed inset-0 overflow-clip bg-[#080706]">
      {/* ambient stage */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(40% 55% at 50% 50%, rgba(192,122,76,.16), transparent 70%), radial-gradient(30% 40% at 15% 20%, rgba(138,39,72,.12), transparent 70%), radial-gradient(30% 40% at 85% 85%, rgba(216,176,106,.08), transparent 70%)' }} />
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(244,236,223,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,236,223,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <span className="font-serif text-[15px] tracking-[0.5em] text-ivory">KOKUM</span>
          <span className="hidden h-3 w-px bg-ivory/20 md:block" />
          <span className="eyebrow hidden text-[9.5px] text-ivory/50 md:block">Digital Dining Experience</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5">
          <motion.span className="h-1.5 w-1.5 rounded-full bg-gold" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <FlaskConical className="h-3 w-3 text-gold" aria-hidden="true" />
          <span className="eyebrow text-[9px] text-gold">Demo mode</span>
        </div>
      </div>

      <div className="relative flex h-full items-center justify-center gap-[5vw] px-8">
        {/* pitch */}
        {showLeft && (
          <motion.aside className="w-[300px] shrink-0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <div className="eyebrow text-gold/80">Kokum</div>
            <h1 className="display mt-3 text-[46px] text-ivory">
              A digital
              <br />
              <span className="gold-text italic">dining layer.</span>
            </h1>
            <p className="mt-5 text-[13.5px] leading-relaxed text-ivory/55">A guest scans the QR at their table and the dish in front of them comes alive — to play with, personalise, share and remember.</p>
            <div className="mt-8 space-y-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
              <div className="text-ivory/35">Food + Table + QR</div>
              <div className="h-4 w-px bg-gold/40" />
              <div className="flex flex-wrap gap-1.5">
                {['Food', 'Story', 'Play', 'Taste', 'Share', 'Reward', 'Feedback', 'Discovery'].map((t, i) => (
                  <motion.span key={t} className="rounded-full border border-gold/25 bg-white/[0.02] px-2.5 py-1 text-ivory/80" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.06 }}>
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
            <p className="mt-8 text-[11px] leading-relaxed text-ivory/35">Prototype. Dish content, chef note, hearts and reward codes are demo data — no real social or payment integrations.</p>
          </motion.aside>
        )}

        {/* phone */}
        <motion.div
          className="relative shrink-0"
          style={{ width: phoneW, height: phoneH }}
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* side buttons */}
          <span className="absolute -left-[3px] top-[18%] h-[5%] w-[4px] rounded-l bg-[#2a2522]" />
          <span className="absolute -left-[3px] top-[26%] h-[8%] w-[4px] rounded-l bg-[#2a2522]" />
          <span className="absolute -left-[3px] top-[36%] h-[8%] w-[4px] rounded-l bg-[#2a2522]" />
          <span className="absolute -right-[3px] top-[28%] h-[12%] w-[4px] rounded-r bg-[#2a2522]" />
          {/* body */}
          <div
            className="absolute inset-0 rounded-[58px] p-[12px]"
            style={{
              background: 'linear-gradient(145deg, #3a3430 0%, #16130f 35%, #0b0908 60%, #2c2622 100%)',
              boxShadow: '0 0 0 1px rgba(216,176,106,.18), 0 60px 120px -30px rgba(0,0,0,.95), 0 0 120px -20px rgba(192,122,76,.25), inset 0 0 0 2px rgba(255,255,255,.04)',
            }}
          >
            <div className="relative h-full w-full overflow-clip rounded-[46px] bg-ink" style={{ transform: 'translateZ(0)' }}>
              <Experience framed onShowQR={onShowQR} />
              {/* status bar + dynamic island */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-[80] flex h-[46px] items-center justify-between px-[30px] text-[13px] font-semibold text-ivory/90">
                <span>9:41</span>
                <span className="absolute left-1/2 top-[11px] h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
                <span className="flex items-center gap-1.5">
                  <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <rect key={i} x={i * 4.5} y={8 - i * 2.5} width="3" height={3 + i * 2.5} rx=".8" fill="currentColor" />
                    ))}
                  </svg>
                  <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
                    <rect x=".5" y=".5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".5" />
                    <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
                    <rect x="22.5" y="4" width="1.8" height="4" rx=".9" fill="currentColor" fillOpacity=".5" />
                  </svg>
                </span>
              </div>
              <span className="pointer-events-none absolute bottom-[8px] left-1/2 z-[80] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-ivory/70" />
            </div>
          </div>
        </motion.div>

        {/* presenter controls */}
        {showRight && (
          <motion.aside className="w-[220px] shrink-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }} aria-label="Presenter controls">
            <div className="eyebrow mb-4 text-ivory/40">Presenter · jump to</div>
            <ol className="max-h-[56vh] space-y-0.5 overflow-y-auto pr-2 no-scrollbar">
              {SCENES.map((s, i) => {
                const active = s.id === scene
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(s.id)}
                      className={`group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors ${active ? 'bg-gold/10' : 'hover:bg-white/[0.03]'}`}
                      aria-current={active ? 'step' : undefined}
                    >
                      <span className={`w-5 font-serif text-[13px] tabular-nums ${active ? 'text-gold' : 'text-ivory/30'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-[12px] ${active ? 'text-ivory' : 'text-ivory/50 group-hover:text-ivory/80'}`}>{s.chapter}</span>
                      {active && <motion.span layoutId="presenter-dot" className="ml-auto h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_#d8b06a]" />}
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="mt-6 space-y-2">
              <PresenterButton onClick={restart} icon={<RotateCcw className="h-3.5 w-3.5" />}>
                Restart experience
              </PresenterButton>
              <PresenterButton onClick={onShowQR} icon={<QrCode className="h-3.5 w-3.5" />}>
                QR table card
              </PresenterButton>
              <PresenterButton
                onClick={() => {
                  const on = !soundOn
                  sound.setEnabled(on)
                  setSoundOn(on)
                }}
                icon={soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              >
                Sound {soundOn ? 'on' : 'off'}
              </PresenterButton>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  )
}

function PresenterButton({ children, onClick, icon }: { children: ReactNode; onClick: () => void; icon: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-10 w-full items-center gap-2.5 rounded-full border border-white/10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory/70 transition-colors hover:border-gold/40 hover:text-ivory">
      {icon}
      {children}
    </button>
  )
}
