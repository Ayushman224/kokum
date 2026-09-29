import { useState } from 'react'

type StoryImageProps = {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function StoryImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
}: StoryImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`bg-linear-to-br from-charcoal-soft via-charcoal-mid to-copper/20 ${className}`}
        role="img"
        aria-label={alt}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      crossOrigin="anonymous"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}
