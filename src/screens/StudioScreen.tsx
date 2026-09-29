import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, ImagePlus, RefreshCcw, SwitchCamera, X } from 'lucide-react'
import StoryCard, { LAYOUTS } from '../ui/StoryCard'
import { MagneticButton } from '../ui/Effects'
import { menu } from '../data/restaurant'
import { useStore, type CardLayout } from '../state/store'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const
type Step = 'choose' | 'camera' | 'preview' | 'card'

/** Make the story card: selfie / dish photo via camera, upload, or skip — then pick a layout. */
export default function StudioScreen() {
  const { dishId, photo, setPhoto, layout, setLayout, go, showToast } = useStore()
  const dish = menu.find((d) => d.id === dishId)!
  const [step, setStep] = useState<Step>(photo ? 'card' : 'choose')
  const [shot, setShot] = useState<string | null>(null)
  const [facing, setFacing] = useState<'user' | 'environment'>('user')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }
  useEffect(() => stop, [])

  const openCamera = async (mode = facing) => {
    stop()
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode, width: { ideal: 1080 }, height: { ideal: 1440 } }, audio: false })
      streamRef.current = s
      setStep('camera')
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play().catch(() => {})
        }
      })
    } catch {
      showToast('Camera not available here — upload a photo instead.')
      fileRef.current?.click()
    }
  }

  const capture = () => {
    const v = videoRef.current
    if (!v || !v.videoWidth) return
    const c = document.createElement('canvas')
    c.width = v.videoWidth
    c.height = v.videoHeight
    const ctx = c.getContext('2d')!
    if (facing === 'user') {
      ctx.translate(c.width, 0)
      ctx.scale(-1, 1) // keep selfies un-mirrored the way people expect
    }
    ctx.drawImage(v, 0, 0)
    setShot(c.toDataURL('image/jpeg', 0.9))
    sound.reveal()
    haptic(20)
    stop()
    setStep('preview')
  }

  const onFile = (f: File | undefined) => {
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      setShot(String(r.result))
      setStep('preview')
    }
    r.readAsDataURL(f)
  }

  const usePhoto = () => {
    setPhoto(shot)
    sound.success()
    setStep('card')
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 40% at 50% 30%, rgba(216,150,80,.16), transparent 70%)' }} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <motion.div key="choose" className="absolute inset-0 flex flex-col items-center px-7 text-center" style={{ paddingTop: 'calc(var(--top) + 52px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="eyebrow text-gold">Make your Kokum story</div>
            <h2 className="display mt-3 text-[40px] text-ivory">
              Make this story
              <br />
              <span className="gold-text italic">yours.</span>
            </h2>
            <p className="mt-2 max-w-[280px] text-[13.5px] text-ivory/55">Add a selfie or a photo of your table. It goes straight into your card.</p>
            <motion.div className="relative mt-6 w-[46%]" initial={{ rotate: -6, y: 20, opacity: 0 }} animate={{ rotate: -4, y: 0, opacity: 1 }} transition={{ duration: 1, ease }}>
              <StoryCard layout={layout} photo={null} dish={dish} className="shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)]" />
            </motion.div>
            <div className="mt-auto mb-7 flex w-full flex-col gap-2.5">
              <MagneticButton onClick={() => openCamera()} className="shimmer">
                <Camera className="h-4 w-4" /> Open camera
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => fileRef.current?.click()}>
                <ImagePlus className="h-4 w-4" /> Upload a photo
              </MagneticButton>
              <button type="button" onClick={() => setStep('card')} className="eyebrow min-h-11 text-ivory/45 hover:text-ivory">
                Skip photo
              </button>
            </div>
          </motion.div>
        )}

        {step === 'camera' && (
          <motion.div key="camera" className="absolute inset-0 z-[85] flex flex-col items-center bg-black px-6" style={{ paddingTop: 'calc(var(--top) + 8px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex w-full items-center justify-between">
              <button type="button" onClick={() => { stop(); setStep('choose') }} className="grid h-11 w-11 place-items-center rounded-full text-ivory/80" aria-label="Close camera">
                <X className="h-5 w-5" />
              </button>
              <span className="eyebrow text-[10px] text-gold">Make this story yours</span>
              <span className="w-11" />
            </div>
            <div className="relative mt-6 aspect-[3/4] w-full overflow-hidden rounded-[36px] ring-1 ring-gold/40">
              <video ref={videoRef} playsInline muted className="h-full w-full object-cover" style={{ transform: facing === 'user' ? 'scaleX(-1)' : undefined }} />
              <div className="pointer-events-none absolute inset-4 rounded-[28px] border border-white/15" />
            </div>
            <div className="mt-auto mb-10 flex w-full items-center justify-around">
              <span className="w-12" />
              <button type="button" onClick={capture} className="grid h-[78px] w-[78px] place-items-center rounded-full border-4 border-ivory/80" aria-label="Take photo">
                <span className="h-[60px] w-[60px] rounded-full bg-ivory" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = facing === 'user' ? 'environment' : 'user'
                  setFacing(m)
                  openCamera(m)
                }}
                className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-ivory"
                aria-label="Switch camera"
              >
                <SwitchCamera className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'preview' && shot && (
          <motion.div key="preview" className="absolute inset-0 z-[85] flex flex-col items-center bg-black px-6 text-center" style={{ paddingTop: 'calc(var(--top) + 48px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.img src={shot} alt="Your photo" className="aspect-[3/4] w-full rounded-[36px] object-cover ring-1 ring-gold/40" initial={{ scale: 0.95 }} animate={{ scale: 1 }} />
            <div className="mt-auto mb-10 flex w-full gap-3">
              <MagneticButton variant="ghost" className="flex-1" onClick={() => { setShot(null); openCamera() }}>
                <RefreshCcw className="h-4 w-4" /> Retake
              </MagneticButton>
              <MagneticButton className="flex-1" onClick={usePhoto}>
                Use photo
              </MagneticButton>
            </div>
          </motion.div>
        )}

        {step === 'card' && (
          <motion.div key="card" className="absolute inset-0 flex flex-col items-center px-6" style={{ paddingTop: 'calc(var(--top) + 46px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="eyebrow text-gold">Your Kokum story</div>
            <motion.div className="relative mt-3 h-[62%]" style={{ aspectRatio: '9/16' }} initial={{ y: 40, rotateX: 20, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }} transition={{ duration: 1, ease }}>
              <AnimatePresence mode="wait">
                <motion.div key={layout} className="h-full" initial={{ opacity: 0, scale: 0.96, rotateY: -12 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0, scale: 0.96, rotateY: 12 }} transition={{ duration: 0.45 }}>
                  <StoryCard layout={layout} photo={photo} dish={dish} className="h-full shadow-[0_30px_80px_-20px_rgba(0,0,0,.95)]" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Card style">
              {(Object.keys(LAYOUTS) as CardLayout[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="radio"
                  aria-checked={layout === l}
                  onClick={() => {
                    setLayout(l)
                  }}
                  className={`min-h-10 rounded-full px-4 text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors ${layout === l ? 'bg-gold text-ink' : 'border border-white/15 text-ivory/65'}`}
                >
                  {LAYOUTS[l].label}
                </button>
              ))}
            </div>
            <div className="mt-auto mb-6 flex w-full items-center gap-3">
              <button type="button" onClick={() => setStep('choose')} className="eyebrow min-h-12 px-3 text-[10px] text-ivory/50">
                {photo ? 'Change photo' : 'Add photo'}
              </button>
              <MagneticButton className="shimmer flex-1" onClick={() => go('share')}>
                Share my story
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
