// Generates a themed SVG "product image" as a data URI so the store is fully
// self-contained (no external image hosting needed). Each category gets a
// distinct emblem drawn in its accent colour on a parchment-style background.

const ACCENTS = {
  bows: '#c9761c',
  outfits: '#2a8f8f',
  gadgets: '#5d7fa6',
  boosts: '#3fae6b',
}

function emblem(category) {
  switch (category) {
    case 'bows':
      // A drawn bow with string and a nocked arrow.
      return `
        <path d="M120 70 C 250 130, 250 270, 120 330" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        <line x1="120" y1="70" x2="120" y2="330" stroke="currentColor" stroke-width="4"/>
        <line x1="120" y1="200" x2="300" y2="200" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
        <path d="M300 200 l-26 -14 v28 z" fill="currentColor"/>
      `
    case 'outfits':
      // A tribal tunic / armour silhouette.
      return `
        <path d="M150 100 l50 -25 l50 25 l45 30 l-30 40 l-15 -10 v110 h-100 v-110 l-15 10 l-30 -40 z"
              fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/>
        <line x1="200" y1="80" x2="200" y2="270" stroke="currentColor" stroke-width="4"/>
        <circle cx="200" cy="150" r="10" fill="currentColor"/>
      `
    case 'gadgets':
      // A grappling-hook / pullcaster style gear.
      return `
        <circle cx="200" cy="200" r="55" fill="none" stroke="currentColor" stroke-width="10"/>
        <circle cx="200" cy="200" r="16" fill="currentColor"/>
        ${Array.from({ length: 8 })
          .map((_, i) => {
            const a = (i * Math.PI) / 4
            const x1 = 200 + Math.cos(a) * 55
            const y1 = 200 + Math.sin(a) * 55
            const x2 = 200 + Math.cos(a) * 78
            const y2 = 200 + Math.sin(a) * 78
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>`
          })
          .join('')}
      `
    case 'boosts':
      // A potion flask.
      return `
        <path d="M175 90 h50 v40 l45 95 a70 70 0 0 1 -65 100 a70 70 0 0 1 -65 -100 l45 -95 z"
              fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/>
        <path d="M150 230 a70 70 0 0 0 100 0 z" fill="currentColor" opacity="0.65"/>
        <line x1="165" y1="90" x2="235" y2="90" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
      `
    default:
      return `<circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" stroke-width="9"/>`
  }
}

export function productImage(category) {
  const color = ACCENTS[category] || '#c9761c'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="none"/>
    <g color="${color}">${emblem(category)}</g>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
