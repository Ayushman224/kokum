import { motion } from 'framer-motion'
import { Particles } from '../ui/Effects'
import { useExperience } from '../../experience/store'
import { QrCode, RotateCcw } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

/** FINAL MOMENT — no footer. The wordmark draws itself, and the table goes quiet again. */
export default function Finale({ onShowQR }: { onShowQR: () => void }) {
  const { restart } = useExperience()

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 40% at 50% 42%, rgba(216,150,80,.22), transparent 70%)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Particles count={24} />

      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <svg viewBox="0 0 320 70" className="w-[78%]" role="img" aria-label="Kokum">
          <defs>
            <linearGradient id="wm" x1="0" x2="1">
              <stop offset="0" stopColor="#b98a4a" />
              <stop offset=".45" stopColor="#f0d49a" />
              <stop offset="1" stopColor="#9d6a39" />
            </linearGradient>
          </defs>
          <motion.text
            x="160"
            y="54"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontSize="62"
            letterSpacing="18"
            fill="url(#wm)"
            stroke="#d8b06a"
            strokeWidth=".6"
            strokeDasharray="400"
            initial={{ strokeDashoffset: 400, fillOpacity: 0 }}
            animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
            transition={{ strokeDashoffset: { duration: 2.4, ease: 'easeInOut' }, fillOpacity: { delay: 1.8, duration: 1.2 } }}
          >
            KOKUM
          </motion.text>
        </svg>
        <motion.div className="hairline mt-6 w-1/2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.2, duration: 1.2, ease }} />

        <h2 className="display mt-8 text-[46px] text-ivory">
          {['Every dish', 'has a story.'].map((l, i) => (
            <span key={l} className="block overflow-hidden pb-1">
              <motion.span className={`block ${i ? 'gold-text italic' : ''}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 2.6 + i * 0.15, duration: 1.1, ease }}>
                {l}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.p className="mt-6 font-serif text-[20px] italic text-ivory/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6, duration: 1.2 }}>
          See you at the next bite.
        </motion.p>
      </div>

      <motion.div className="absolute inset-x-0 bottom-[5%] flex justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.6 }}>
        <button type="button" onClick={restart} className="eyebrow flex min-h-11 items-center gap-2 rounded-full px-4 text-ivory/50 hover:text-ivory">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Replay
        </button>
        <button type="button" onClick={onShowQR} className="eyebrow flex min-h-11 items-center gap-2 rounded-full px-4 text-ivory/50 hover:text-ivory">
          <QrCode className="h-3.5 w-3.5" aria-hidden="true" /> Table card
        </button>
      </motion.div>
    </div>
  )
}
