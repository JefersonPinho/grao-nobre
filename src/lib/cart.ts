import type { CartLine } from "@/types/cart"
import type { Product } from "@/types/product"
import { priceForGrams } from "@/lib/pricing"
import { normalizeWeight } from "@/lib/weight"

export function createLineId(productId: string, grams: number) {
  return `${productId}:${grams}`
}

export function addToCart(items: CartLine[], productId: string, grams: number): CartLine[] {
  const weight = normalizeWeight(grams)
  const lineId = createLineId(productId, weight)
  const existing = items.find((item) => item.lineId === lineId)

  if (existing) {
    return items.map((item) =>
      item.lineId === lineId ? { ...item, quantity: item.quantity + 1 } : item,
    )
  }

  return [...items, { lineId, productId, grams: weight, quantity: 1 }]
}

export function changeQuantity(items: CartLine[], lineId: string, quantity: number): CartLine[] {
  if (quantity <= 0) {
    return items.filter((item) => item.lineId !== lineId)
  }

  return items.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
}

export function removeFromCart(items: CartLine[], lineId: string) {
  return items.filter((item) => item.lineId !== lineId)
}

export function lineUnitPrice(product: Product, grams: number) {
  return priceForGrams(product.supplierPricePerKg, grams)
}

export function lineSubtotal(product: Product, line: CartLine) {
  return lineUnitPrice(product, line.grams) * line.quantity
}

export function cartTotal(items: CartLine[], catalog: Product[]) {
  const cents = items.reduce((sum, line) => {
    const product = catalog.find((item) => item.id === line.productId)
    if (!product) return sum
    return sum + Math.round(lineSubtotal(product, line) * 100)
  }, 0)

  return cents / 100
}

export function cartItemCount(items: CartLine[]) {
  return items.reduce((sum, line) => sum + line.quantity, 0)
}

export function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false
  const line = value as Partial<CartLine>
  return (
    typeof line.lineId === "string" &&
    typeof line.productId === "string" &&
    typeof line.grams === "number" &&
    typeof line.quantity === "number" &&
    line.grams >= 50 &&
    line.quantity > 0
  )
}

export function parseStoredCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return []
  return value.filter(isCartLine)
}
