import { useState } from 'react'
import { dishData, type TasteProfile } from '../data/dishData'
import { Screen } from './Screen'
import { StoryImage } from './StoryImage'

type SocialShareProps = {
  profile: TasteProfile
  url: string
  onContinue: () => void
}

export function SocialShare({ profile, url, onContinue }: SocialShareProps) {
  const [note, setNote] = useState<string | null>(null)
  const message = dishData.shareMessage(profile.name)
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setNote('Link copied')
    } catch {
      setNote('Could not copy')
    }
  }

  return (
    <Screen className="bg-charcoal">
      <div className="flex h-full flex-col px-6 pt-16 pb-10">
        <h2 className="font-serif text-[36px] leading-[0.95] text-ivory">
          {dishData.socialHeading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-4 font-serif text-lg text-ivory-muted italic">
          “{dishData.socialPrompt}”
        </p>

        <button type="button" onClick={onContinue} className="mt-8 w-full text-left">
          <article className="overflow-hidden ring-1 ring-copper/25">
            <div className="h-32">
              <StoryImage src={dishData.heroImage} alt="" className="h-full w-full" />
            </div>
            <div className="px-5 py-5">
              <p className="font-serif text-xl text-ivory">{profile.name}</p>
              <p className="mt-2 text-sm text-ivory-muted">{dishData.cardDishName}</p>
            </div>
          </article>
        </button>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.28em] text-copper uppercase"
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setNote(dishData.instagramSoon)}
            className="text-left text-[11px] tracking-[0.28em] text-ivory uppercase"
          >
            Instagram
          </button>
          <button
            type="button"
            onClick={() => void copyLink()}
            className="text-left text-[11px] tracking-[0.28em] text-ivory uppercase"
          >
            Copy link
          </button>
        </div>

        {note ? (
          <p className="mt-6 font-serif text-base text-ivory-muted italic">{note}</p>
        ) : null}

        <p className="mt-3 text-center text-[10px] tracking-[0.18em] text-ivory-muted uppercase">
          Tap the card to continue
        </p>
      </div>
    </Screen>
  )
}
