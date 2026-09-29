import { useEffect, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SCENES, useExperience, type SceneId } from './store'
import ProgressIndicator from '../components/ProgressIndicator'
import IntroScene from '../components/scenes/IntroScene'
import DishReveal from '../components/scenes/DishReveal'
import IngredientHunt from '../components/scenes/IngredientHunt'
import SecretIngredient from '../components/scenes/SecretIngredient'
import ChefGame from '../components/scenes/ChefGame'
import BuildYourBite from '../components/scenes/BuildYourBite'
import TasteProfile from '../components/scenes/TasteProfile'
import ChefSecret from '../components/scenes/ChefSecret'
import TasteCard from '../components/scenes/TasteCard'
import SocialShare from '../components/scenes/SocialShare'
import HeartChallenge from '../components/scenes/HeartChallenge'
import Reward from '../components/scenes/Reward'
import Feedback from '../components/scenes/Feedback'
import DishExplorer from '../components/scenes/DishExplorer'
import Finale from '../components/scenes/Finale'
import { sound } from '../lib/sound'
import { Volume2, VolumeX } from 'lucide-react'

const SCENE_COMPONENTS: Record<Exclude<SceneId, 'finale'>, ComponentType> = {
  intro: IntroScene,
  reveal: DishReveal,
  hunt: IngredientHunt,
  secret: SecretIngredient,
  chef: ChefGame,
  bite: BuildYourBite,
  profile: TasteProfile,
  chefSecret: ChefSecret,
  card: TasteCard,
  share: SocialShare,
  hearts: HeartChallenge,
  reward: Reward,
  feedback: Feedback,
  explore: DishExplorer,
}

/** The phone-sized stage. Scenes cross-dissolve through a soft blur — no pages, no scroll. */
export default function Experience({ framed = false, onShowQR }: { framed?: boolean; onShowQR: () => void }) {
  const { scene, go, runId, soundOn, setSoundOn, toast } = useExperience()

  // Deep link for demos: ?scene=card
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('scene')
    if (s && SCENES.some((x) => x.id === s)) go(s as SceneId)
  }, [go])

  const Scene = scene === 'finale' ? null : SCENE_COMPONENTS[scene]
  const top = framed ? 'top-[52px]' : 'top-[max(14px,env(safe-area-inset-top))]'

  return (
    <main className="grain relative h-full w-full touch-manipulation select-none overflow-clip bg-ink text-ivory" aria-label="Kokum story experience">
      <AnimatePresence initial={false}>
        <motion.section
          key={`${scene}-${runId}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          aria-label={SCENES.find((s) => s.id === scene)?.chapter}
        >
          {Scene ? <Scene /> : <Finale onShowQR={onShowQR} />}
        </motion.section>
      </AnimatePresence>

      {/* HUD */}
      <div className={`pointer-events-none absolute inset-x-0 z-30 flex items-start justify-between px-5 ${top}`}>
        <motion.span className="font-serif text-[12px] tracking-[0.42em] text-ivory/70" animate={{ opacity: scene === 'intro' || scene === 'finale' ? 0 : 1 }}>
          KOKUM
        </motion.span>
        <ProgressIndicator />
        <button
          type="button"
          onClick={() => {
            const on = !soundOn
            sound.setEnabled(on)
            setSoundOn(on)
          }}
          className="pointer-events-auto -mr-2 -mt-2 grid h-10 w-10 place-items-center rounded-full text-ivory/60 hover:text-ivory"
          aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          aria-pressed={soundOn}
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="pointer-events-none absolute inset-x-6 bottom-8 z-[70] flex justify-center"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            role="status"
          >
            <div className="rounded-2xl border border-gold/30 bg-[#1b1512]/95 px-5 py-3 text-center text-[13px] text-ivory shadow-2xl backdrop-blur-md">{toast}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
