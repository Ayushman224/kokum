import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BuildYourBite } from '../components/BuildYourBite'
import { ChefGame } from '../components/ChefGame'
import { ChefSecret } from '../components/ChefSecret'
import { DishExplorer } from '../components/DishExplorer'
import { DishReveal } from '../components/DishReveal'
import { Feedback } from '../components/Feedback'
import { Finale } from '../components/Finale'
import { HeartChallenge } from '../components/HeartChallenge'
import { IngredientHunt } from '../components/IngredientHunt'
import { IntroScene } from '../components/IntroScene'
import { LoadingScreen } from '../components/LoadingScreen'
import { PhoneFrame } from '../components/PhoneFrame'
import { ProgressIndicator } from '../components/ProgressIndicator'
import { Reward } from '../components/Reward'
import { SecretIngredient } from '../components/SecretIngredient'
import { SocialShare } from '../components/SocialShare'
import { TasteCard } from '../components/TasteCard'
import { TasteProfileScene } from '../components/TasteProfile'
import { dishData, SCENES, type SceneId, type TasteProfile } from '../data/dishData'
import { createRewardCode } from '../lib/reward'
import { resolveTaste } from '../lib/taste'

export default function DishStory() {
  const reduce = useReducedMotion()
  const [booting, setBooting] = useState(true)
  const [loadProgress, setLoadProgress] = useState(12)
  const [index, setIndex] = useState(0)
  const [found, setFound] = useState<string[]>([])
  const [bite, setBite] = useState<string[]>([])
  const [profile, setProfile] = useState<TasteProfile>(dishData.tasteProfiles.explorer)
  const [hearts, setHearts] = useState(0)
  const [code, setCode] = useState('')

  const scene = SCENES[index]?.id ?? 'hook'
  const storyUrl = useMemo(() => `${window.location.origin}/`, [])

  const advancing = useRef(false)
  const next = useCallback(() => {
    if (advancing.current) return
    advancing.current = true
    setIndex((value) => Math.min(value + 1, SCENES.length - 1))
    window.setTimeout(() => {
      advancing.current = false
    }, 700)
  }, [])

  useEffect(() => {
    let cancelled = false
    const urls = [dishData.introImage, dishData.heroImage]
    let done = 0
    const started = Date.now()

    function finishOne() {
      done += 1
      if (cancelled) return
      setLoadProgress(Math.round((done / urls.length) * 100))
      if (done < urls.length) return
      const hold = Math.max(0, 320 - (Date.now() - started))
      window.setTimeout(() => {
        if (!cancelled) setBooting(false)
      }, hold)
    }

    urls.forEach((src) => {
      const image = new Image()
      image.onload = finishOne
      image.onerror = finishOne
      image.src = src
    })

    const fallback = window.setTimeout(() => {
      if (!cancelled) setBooting(false)
    }, 4000)

    return () => {
      cancelled = true
      window.clearTimeout(fallback)
    }
  }, [])

  function addHeart() {
    setHearts((value) => {
      const nextValue = value + 1
      if (nextValue >= dishData.heartTarget && !code) {
        setCode(createRewardCode(dishData.reward.codePrefix))
      }
      return nextValue
    })
  }

  function restart() {
    setIndex(0)
    setFound([])
    setBite([])
    setProfile(dishData.tasteProfiles.explorer)
    setHearts(0)
    setCode('')
    setBooting(false)
  }

  function render(id: SceneId) {
    switch (id) {
      case 'hook':
        return <IntroScene onBegin={next} />
      case 'reveal':
        return <DishReveal onComplete={next} />
      case 'hunt':
        return (
          <IngredientHunt
            found={found}
            onFind={(item) =>
              setFound((current) =>
                current.includes(item) ? current : [...current, item],
              )
            }
            onComplete={next}
          />
        )
      case 'secret':
        return <SecretIngredient onComplete={next} />
      case 'chef':
        return <ChefGame onComplete={next} />
      case 'bite':
        return (
          <BuildYourBite
            selected={bite}
            onDrop={(item) =>
              setBite((current) =>
                current.includes(item) ? current : [...current, item],
              )
            }
            onGenerate={() => {
              setProfile(resolveTaste(bite))
              next()
            }}
          />
        )
      case 'profile':
        return <TasteProfileScene profile={profile} onCreate={next} />
      case 'letter':
        return <ChefSecret onComplete={next} />
      case 'card':
        return <TasteCard profile={profile} url={storyUrl} onShare={next} />
      case 'share':
        return <SocialShare profile={profile} url={storyUrl} onContinue={next} />
      case 'hearts':
        return (
          <HeartChallenge hearts={hearts} onDemoHeart={addHeart} onComplete={next} />
        )
      case 'reward':
        return (
          <Reward
            code={code}
            onContinue={next}
          />
        )
      case 'feedback':
        return <Feedback onComplete={next} />
      case 'explorer':
        return <DishExplorer onFinish={next} />
      case 'finale':
        return <Finale />
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <PhoneFrame demoHearts={hearts} onDemoHeart={addHeart} onRestart={restart}>
        <div className="experience relative h-full">
          {!booting ? <ProgressIndicator index={index} /> : null}
          <AnimatePresence mode="wait">
            {booting ? (
              <motion.div
                key="boot"
                className="h-full"
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.01 : 0.45 }}
              >
                <LoadingScreen progress={loadProgress} />
              </motion.div>
            ) : (
              <motion.div
                key={scene}
                className="h-full"
                initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {render(scene)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PhoneFrame>
    </MotionConfig>
  )
}
