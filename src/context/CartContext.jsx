import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'hfw-cart'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial)

  // Persist the cart so it survives reloads.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable — cart simply won't persist */
    }
  }, [items])

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty,
        },
      ]
    })
  }

  const setQty = (id, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    )
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  )
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items],
  )

  const value = {
    items,
    addItem,
    setQty,
    removeItem,
    clear,
    totalCount,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
