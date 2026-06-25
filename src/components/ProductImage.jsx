import { useState, useEffect } from 'react'

// Renders a product image with a graceful fallback to the store emblem if the
// source fails to load (e.g. a hotlinked URL gets blocked). `referrerPolicy`
// avoids referrer-based hotlink protection on external image hosts.
const FALLBACK = '/sun.svg'

function ProductImage({ src, alt, className, loading = 'lazy' }) {
  const [current, setCurrent] = useState(src || FALLBACK)

  // Reset when the source changes (e.g. navigating between products).
  useEffect(() => {
    setCurrent(src || FALLBACK)
  }, [src])

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK)
      }}
    />
  )
}

export default ProductImage
