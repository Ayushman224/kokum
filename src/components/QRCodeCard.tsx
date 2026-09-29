import { QRCodeSVG } from 'qrcode.react'
import { brand, dishData } from '../data/dishData'

type QRCodeCardProps = {
  url: string
  compact?: boolean
}

export function QRCodeCard({ url, compact = false }: QRCodeCardProps) {
  const size = compact ? 132 : 176

  return (
    <article
      className={`relative overflow-hidden bg-ivory text-charcoal shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${
        compact ? 'w-[240px] px-6 py-7' : 'w-[280px] px-8 py-10 sm:w-[300px]'
      }`}
    >
      <div className="pointer-events-none absolute inset-3 border border-copper/35" />
      <div className="relative text-center">
        <p className="font-serif text-[13px] tracking-[0.42em]">
          {brand.name}
        </p>
        <div className="mt-5 text-[10px] tracking-[0.28em] text-copper-deep uppercase">
          {brand.taglineLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mx-auto mt-7 flex justify-center bg-ivory p-2">
          <QRCodeSVG
            value={url}
            size={size}
            bgColor="#F4EDE1"
            fgColor="#0B0A09"
            level="M"
            title="Scan to open this Kokum story"
          />
        </div>
        <p className="mt-6 font-serif text-[15px] leading-relaxed">
          {dishData.qrCaption.split('\n').map((line) => (
            <span key={line} className="block tracking-[0.28em]">
              {line}
            </span>
          ))}
        </p>
      </div>
    </article>
  )
}
