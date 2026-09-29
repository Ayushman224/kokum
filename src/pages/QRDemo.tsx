import { Link } from 'react-router-dom'
import { QRCodeCard } from '../components/QRCodeCard'
import { brand, dishData } from '../data/dishData'

export default function QRDemo() {
  const url = `${window.location.origin}/`

  return (
    <div className="h-full overflow-y-auto bg-charcoal px-6 py-16 text-ivory">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <p className="font-serif text-sm tracking-[0.42em]">{brand.name}</p>
        <p className="mt-3 text-[10px] tracking-[0.32em] text-copper uppercase">
          Table card
        </p>
        <p className="mt-6 max-w-sm text-center font-serif text-lg text-ivory-muted italic">
          Print this card and place it beside the dish. Guests scan to enter the
          story.
        </p>

        <div className="mt-12 print:mt-0">
          <QRCodeCard url={url} />
        </div>

        <p className="mt-8 text-center text-xs tracking-wide text-ivory-muted">
          {dishData.tableCardHint}
        </p>
        <p className="mt-3 text-center text-[10px] tracking-wide text-ivory-muted/80">
          {url}
        </p>

        <div className="no-print mt-12 flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-copper px-8 py-3 text-[11px] tracking-[0.28em] text-copper uppercase transition-colors hover:bg-copper hover:text-charcoal"
          >
            Print table card
          </button>
          <Link
            to="/"
            className="text-[11px] tracking-[0.28em] text-ivory-muted uppercase transition-colors hover:text-ivory"
          >
            Open the story
          </Link>
        </div>
      </div>
    </div>
  )
}
