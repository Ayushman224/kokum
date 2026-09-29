import { useEffect, useState } from 'react'
import { dishData } from '../data/dishData'
import { Screen } from './Screen'

type FeedbackProps = {
  onComplete: () => void
}

export function Feedback({ onComplete }: FeedbackProps) {
  const [rating, setRating] = useState(0)
  const [writing, setWriting] = useState(false)
  const [text, setText] = useState('')
  const [thanks, setThanks] = useState(false)
  const max = 180

  useEffect(() => {
    if (!thanks) return
    const timer = window.setTimeout(onComplete, 1400)
    return () => window.clearTimeout(timer)
  }, [thanks, onComplete])

  function finish() {
    setThanks(true)
  }

  if (thanks) {
    return (
      <Screen className="bg-charcoal">
        <div className="flex h-full items-center justify-center px-8 text-center">
          <p className="font-serif text-3xl text-ivory italic">{dishData.thanks}</p>
        </div>
      </Screen>
    )
  }

  return (
    <Screen className="bg-charcoal">
      <div className="flex h-full flex-col px-6 pt-16 pb-10">
        <h2 className="font-serif text-[40px] leading-[0.94] text-ivory">
          {dishData.feedbackHeading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-10 flex justify-center gap-3" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value > 1 ? 's' : ''}`}
              className={`text-4xl transition-transform ${
                value <= rating ? 'scale-110 text-copper' : 'text-ivory/25'
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {rating > 0 && !writing ? (
          <div className="mt-auto space-y-5">
            <p className="font-serif text-lg text-ivory-muted italic">
              {dishData.feedbackMore}
            </p>
            <button
              type="button"
              onClick={() => setWriting(true)}
              className="block text-[11px] tracking-[0.26em] text-copper uppercase"
            >
              {dishData.writeReview}
            </button>
            <button
              type="button"
              onClick={finish}
              className="block text-[11px] tracking-[0.26em] text-ivory-muted uppercase"
            >
              {dishData.skipReview}
            </button>
          </div>
        ) : null}

        {writing ? (
          <div className="mt-auto">
            <label className="sr-only" htmlFor="kokum-review">
              Review
            </label>
            <textarea
              id="kokum-review"
              value={text}
              maxLength={max}
              onChange={(event) => setText(event.target.value)}
              placeholder={dishData.reviewPlaceholder}
              className="h-32 w-full resize-none bg-charcoal-soft px-4 py-3 font-serif text-lg text-ivory outline-none ring-1 ring-line"
            />
            <p className="mt-2 text-right text-[10px] text-ivory-muted">
              {text.length} / {max}
            </p>
            <button
              type="button"
              onClick={finish}
              className="mt-4 text-[11px] tracking-[0.26em] text-copper uppercase"
            >
              {dishData.submitReview}
            </button>
          </div>
        ) : null}
      </div>
    </Screen>
  )
}
