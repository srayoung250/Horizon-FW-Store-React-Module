# Horizon Forbidden West Store

A themed e-commerce demo built with **React**, **React Router**, and **React Bootstrap**,
backed by a custom **Express "merchant" API**. Styled after the world of
*Horizon Forbidden West* — dark teals, machine-gold accents, and tribal-futuristic type.
Shopping here is meant to feel like visiting a merchant in Chainscrape or Thornmarsh.

## Architecture

```
┌─────────────┐   /api/v1 (Vite proxy)   ┌──────────────────────┐
│  React app  │ ───────────────────────▶ │  Express API (3001)  │
│  (Vite 5173)│                          │  in-memory inventory │
└─────────────┘                          └──────────────────────┘
```

## Frontend pages

| Page | Route | What it does |
|------|-------|--------------|
| Home | `/` | Welcome message + button to the catalog |
| Product Listing | `/products` | Inventory grid with **category + subtype** filters and quick add-to-cart |
| Product Details | `/products/:id` | Single product via `useParams`; quantity selector, add to cart, edit, delete |
| Add Product | `/add-product` | Form that POSTs a new product (category → subtype cascade) |
| Edit Product | `/edit-product/:id` | Pre-filled form that PUTs an update |
| Cart | `/cart` | Quantity steppers, line/total pricing, clear & mock checkout |

Plus: a responsive React Bootstrap **Navbar** with a live **cart badge**, a
**confirmation modal** before delete, loading **spinners**, and friendly
**error messages** with retry.

### Categories & subtypes

| Category | Subtypes |
|----------|----------|
| Bows | Hunter · Sharpshot · Warrior |
| Outfits | Nora · Carja · Tenakth · Utaru |
| Gadgets | Traversal · Combat |
| Boosts | Potions · Food |

The **cart** is a React Context persisted to `localStorage`, so quantities survive reloads.

## Merchant API endpoints

Base URL: `/api/v1` (Express server on port `3001`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Fetches the entire inventory |
| GET | `/api/v1/products/:id` | A single item |
| GET | `/api/v1/categories` | Category + subtype taxonomy |
| GET | `/api/v1/products/category/bows` | Hunter, Sharpshot, and Warrior bows |
| GET | `/api/v1/products/category/outfits` | Tribal armor (Nora, Carja, Tenakth, Utaru) |
| GET | `/api/v1/products/category/gadgets` | Tools like the Pullcaster, Shieldwing, Ropecaster |
| GET | `/api/v1/products/category/boosts` | Health/stamina potions and food items |
| GET | `/api/v1/products/category/:slug?subtype=:sub` | Filter a category by subtype |
| GET | `/api/v1/products/category/:slug/:subtype` | Same filter via nested path |
| POST | `/api/v1/products` | Add a new item |
| PUT | `/api/v1/products/:id` | Update an item |
| DELETE | `/api/v1/products/:id` | Remove an item |

> The inventory lives in memory, so POST/PUT/DELETE **really do** change the catalog
> for the session — they reset when the server restarts. Product images are generated
> as themed SVGs per category, so nothing is fetched from external hosts.

## Getting started

```bash
npm install
npm run dev      # runs BOTH the API (3001) and the Vite client (5173)
```

Then open the URL Vite prints (usually http://localhost:5173).

Other scripts:

```bash
npm run server   # API only
npm run client   # frontend only
npm run build    # production build of the frontend
npm run preview  # preview the production build
```

## Tech stack

- React 18 + Vite
- react-router-dom 6
- react-bootstrap 2 + bootstrap 5
- Express 4 + cors (API)
- concurrently (runs API + client together)
