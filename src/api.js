// Central place for all Forbidden West merchant API calls.
// Served by the local Express server under /api/v1 (proxied by Vite in dev).
const BASE_URL = '/api/v1'

async function handle(res) {
  if (!res.ok) {
    // Try to surface the server's error message when present.
    let detail = `${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      if (body?.error) detail = body.error
    } catch {
      /* response had no JSON body */
    }
    throw new Error(detail)
  }
  return res.json()
}

export function getProducts() {
  return fetch(`${BASE_URL}/products`).then(handle)
}

export function getProductsByCategory(category, subtype) {
  const url = subtype
    ? `${BASE_URL}/products/category/${category}?subtype=${subtype}`
    : `${BASE_URL}/products/category/${category}`
  return fetch(url).then(handle)
}

export function getProduct(id) {
  return fetch(`${BASE_URL}/products/${id}`).then(handle)
}

export function createProduct(product) {
  return fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  }).then(handle)
}

export function updateProduct(id, product) {
  return fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  }).then(handle)
}

export function deleteProduct(id) {
  return fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' }).then(handle)
}

// Merchant taxonomy — categories and their subtypes.
// Mirrors the server's CATEGORY_META (also available at GET /api/v1/categories).
export const TAXONOMY = [
  {
    slug: 'bows',
    label: 'Bows',
    subtypes: [
      { slug: 'hunter', label: 'Hunter' },
      { slug: 'sharpshot', label: 'Sharpshot' },
      { slug: 'warrior', label: 'Warrior' },
    ],
  },
  {
    slug: 'outfits',
    label: 'Outfits',
    subtypes: [
      { slug: 'nora', label: 'Nora' },
      { slug: 'carja', label: 'Carja' },
      { slug: 'tenakth', label: 'Tenakth' },
      { slug: 'utaru', label: 'Utaru' },
      { slug: 'banuk', label: 'Banuk' },
      { slug: 'oseram', label: 'Oseram' },
    ],
  },
  {
    slug: 'gadgets',
    label: 'Gadgets',
    subtypes: [
      { slug: 'traversal', label: 'Tools' },
      { slug: 'combat', label: 'Heavy Arms' },
    ],
  },
  {
    slug: 'boosts',
    label: 'Boosts',
    subtypes: [
      { slug: 'potions', label: 'Potions' },
      { slug: 'food', label: 'Food' },
    ],
  },
  {
    slug: 'ammo',
    label: 'Ammo',
    subtypes: [
      { slug: 'arrows', label: 'Arrows' },
      { slug: 'resources', label: 'Resources' },
    ],
  },
]

// Convenience helpers for forms / labels.
export const CATEGORIES = TAXONOMY.map(({ slug, label }) => ({ slug, label }))

export function subtypesFor(categorySlug) {
  return TAXONOMY.find((c) => c.slug === categorySlug)?.subtypes ?? []
}

export function subtypeLabel(categorySlug, subtypeSlug) {
  return (
    subtypesFor(categorySlug).find((s) => s.slug === subtypeSlug)?.label ?? subtypeSlug
  )
}
