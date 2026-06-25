import express from 'express'
import cors from 'cors'
import {
  buildInventory,
  CATEGORIES,
  CATEGORY_META,
  SUBTYPES_BY_CATEGORY,
} from './inventory.js'
import { productImage } from './icon.js'

const app = express()
// Use a dedicated var so the API stays on its own port even when a parent
// process (e.g. a preview harness) sets the generic PORT for the web client.
const PORT = process.env.API_PORT || 3001

app.use(cors())
app.use(express.json())

// In-memory store. Mutations (POST/PUT/DELETE) persist until the server restarts,
// so the merchant's ledger feels real during a session.
let products = buildInventory()
let nextId = products.length + 1

const router = express.Router()

// GET /api/v1/products — the entire inventory.
router.get('/products', (req, res) => {
  res.json(products)
})

// GET /api/v1/categories — taxonomy of categories and their subtypes.
router.get('/categories', (req, res) => {
  res.json(CATEGORY_META)
})

// GET /api/v1/products/category/:slug — stock filtered by merchant category.
// Optional ?subtype=<slug> narrows further (e.g. .../category/bows?subtype=warrior).
// Defined before /:id so "category" isn't mistaken for a product id.
router.get('/products/category/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase()
  if (!CATEGORIES.includes(slug)) {
    return res.status(404).json({
      error: `Unknown category "${slug}". Try one of: ${CATEGORIES.join(', ')}.`,
    })
  }

  const subtype = req.query.subtype?.toLowerCase()
  if (subtype && !SUBTYPES_BY_CATEGORY[slug].includes(subtype)) {
    return res.status(404).json({
      error: `Unknown subtype "${subtype}" for ${slug}. Try: ${SUBTYPES_BY_CATEGORY[slug].join(', ')}.`,
    })
  }

  let result = products.filter((p) => p.category === slug)
  if (subtype) result = result.filter((p) => p.subtype === subtype)
  res.json(result)
})

// GET /api/v1/products/category/:slug/:subtype — same filter via a nested path.
router.get('/products/category/:slug/:subtype', (req, res) => {
  const slug = req.params.slug.toLowerCase()
  const subtype = req.params.subtype.toLowerCase()
  if (!CATEGORIES.includes(slug)) {
    return res.status(404).json({
      error: `Unknown category "${slug}". Try one of: ${CATEGORIES.join(', ')}.`,
    })
  }
  if (!SUBTYPES_BY_CATEGORY[slug].includes(subtype)) {
    return res.status(404).json({
      error: `Unknown subtype "${subtype}" for ${slug}. Try: ${SUBTYPES_BY_CATEGORY[slug].join(', ')}.`,
    })
  }
  res.json(products.filter((p) => p.category === slug && p.subtype === subtype))
})

// GET /api/v1/products/:id — a single item.
router.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id))
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' })
  }
  res.json(product)
})

// POST /api/v1/products — add a new item to the merchant's stock.
router.post('/products', (req, res) => {
  const { title, price, description, category, subtype } = req.body || {}
  if (!title || price == null || !description || !category) {
    return res
      .status(400)
      .json({ error: 'title, price, description, and category are all required.' })
  }
  const product = {
    id: nextId++,
    title,
    price: Number(price),
    description,
    category,
    subtype: subtype || null,
    image: productImage(category),
    rating: { rate: 0, count: 0 },
  }
  products.push(product)
  res.status(201).json(product)
})

// PUT /api/v1/products/:id — update an existing item.
router.put('/products/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found.' })
  }
  const { title, price, description, category, subtype } = req.body || {}
  const updated = {
    ...products[idx],
    ...(title != null && { title }),
    ...(price != null && { price: Number(price) }),
    ...(description != null && { description }),
    ...(category != null && { category, image: productImage(category) }),
    ...(subtype !== undefined && { subtype: subtype || null }),
  }
  products[idx] = updated
  res.json(updated)
})

// DELETE /api/v1/products/:id — remove an item from stock.
router.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found.' })
  }
  const [removed] = products.splice(idx, 1)
  res.json(removed)
})

app.use('/api/v1', router)

// Friendly root so hitting the API host directly isn't a blank 404.
app.get('/', (req, res) => {
  res.json({
    merchant: 'Forbidden West Trade Post',
    endpoints: [
      'GET /api/v1/products',
      'GET /api/v1/products/:id',
      'GET /api/v1/categories',
      ...CATEGORIES.map((c) => `GET /api/v1/products/category/${c}`),
      'GET /api/v1/products/category/:slug?subtype=:subtype',
      'GET /api/v1/products/category/:slug/:subtype',
      'POST /api/v1/products',
      'PUT /api/v1/products/:id',
      'DELETE /api/v1/products/:id',
    ],
  })
})

app.listen(PORT, () => {
  console.log(`🏹 Forbidden West merchant API running at http://localhost:${PORT}`)
})
