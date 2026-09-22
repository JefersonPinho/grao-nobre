"use client"

import { useEffect, useState } from "react"
import { parseStoredCart } from "@/lib/cart"
import type { CartLine } from "@/types/cart"

const STORAGE_KEY = "catalogo-produtos-naturais-pedido"

export function useCart() {
  const [items, setItems] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let stored: CartLine[] = []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) stored = parseStoredCart(JSON.parse(raw) as unknown)
    } catch {
      stored = []
    }
    // O pedido só pode ser lido no navegador, depois da hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(stored)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, ready])

  return { items, setItems, ready }
}
