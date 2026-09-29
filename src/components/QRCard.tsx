import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { dishData } from '../data/dishData'
import { Printer, X } from 'lucide-react'

/**
 * Printable A6 table card (105×148mm). Print uses @media print rules in index.css.
 * Production: one QR per dish/table, e.g. https://kokum.app/s/<restaurant>/<dish>?t=<table>.
 */
export function experienceUrl() {
  try {
    const { origin, pathname } = window.location
    if (origin && origin !== 'null' && origin.startsWith('http')) return `${origin}${pathname}?story=${dishData.id}`
  } catch {
    /* sandboxed */
  }
  return `https://kokum.example/stories?story=${dishData.id}`
}

export function TableCard({ className = '' }: { className?: string }) {
  const [qr, setQr] = useState<string>('')
  const url = experienceUrl()

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 0, width: 520, errorCorrectionLevel: 'M', color: { dark: '#0b0908', light: '#f4ecdf' } }).then(setQr)
  }, [url])

  return (
    <div
      id="print-card"
      className={`relative flex aspect-[105/148] flex-col items-center overflow-hidden rounded-[10px] px-[8%] text-center ${className}`}
      style={{ background: 'radial-gradient(80% 45% at 50% 30%, rgba(216,150,80,.25), transparent 70%), linear-gradient(180deg, #1a1411, #0b0908)', containerType: 'inline-size' }}
    >
      <div className="pointer-events-none absolute inset-[3%] rounded-[6px] border border-gold/50" />
      <div className="pointer-events-none absolute inset-[4.5%] rounded-[4px] border border-gold/15" />
      <div className="mt-[13%] font-serif tracking-[0.5em] text-ivory" style={{ fontSize: '6.5cqw' }}>
        KOKUM
      </div>
      <div className="hairline mt-[5%] w-1/3" />
      <div className="display mt-[6%] text-ivory" style={{ fontSize: '11cqw' }}>
        Every dish
        <br />
        <span className="gold-text italic">has a story.</span>
      </div>
      <div className="mt-[8%] rounded-[6px] bg-ivory p-[3.5%] shadow-[0_0_40px_rgba(216,176,106,.25)]" style={{ width: '46%' }}>
        {qr ? <img src={qr} alt={`QR code linking to the Kokum story: ${url}`} className="block w-full" /> : <div className="aspect-square w-full" />}
      </div>
      <div className="mt-[8%] font-semibold uppercase text-gold" style={{ fontSize: '3.4cqw', letterSpacing: '0.4em' }}>
        Scan. Discover. Taste.
      </div>
      <div className="mt-auto mb-[9%] font-serif italic text-ivory/50" style={{ fontSize: '3.6cqw' }}>
        {dishData.subtitle} · {dishData.name}
      </div>
    </div>
  )
}

export default function QRCardModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-black/85 p-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Printable QR table card"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }} onClick={(e) => e.stopPropagation()} className="w-[min(360px,80vw,calc((100dvh-160px)*105/148))]">
        <TableCard className="w-full shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]" />
      </motion.div>
      <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => window.print()} className="eyebrow flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-b from-[#f1d9a4] via-[#d8b06a] to-[#a8763f] px-6 text-ink">
          <Printer className="h-4 w-4" aria-hidden="true" /> Print card
        </button>
        <button type="button" onClick={onClose} className="eyebrow flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-ivory">
          <X className="h-4 w-4" aria-hidden="true" /> Close
        </button>
      </div>
    </motion.div>
  )
}
