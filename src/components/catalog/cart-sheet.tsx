"use client"

import { useEffect } from "react"
import { CartItem } from "@/components/catalog/cart-item"
import { CheckoutForm } from "@/components/catalog/checkout-form"
import { EmptyState } from "@/components/catalog/empty-state"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cartTotal, changeQuantity, lineSubtotal, removeFromCart } from "@/lib/cart"
import { formatCurrency } from "@/lib/format"
import type { CartLine } from "@/types/cart"
import type { Product } from "@/types/product"

type CartSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CartLine[]
  catalog: Product[]
  onItemsChange: (items: CartLine[]) => void
}

export function CartSheet({ open, onOpenChange, items, catalog, onItemsChange }: CartSheetProps) {
  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add("cart-open")
    return () => document.documentElement.classList.remove("cart-open")
  }, [open])

  const total = cartTotal(items, catalog)
  const lines = items.flatMap((line) => {
    const product = catalog.find((item) => item.id === line.productId)
    if (!product) return []
    return [
      {
        name: product.name,
        grams: line.grams,
        quantity: line.quantity,
        subtotal: lineSubtotal(product, line),
        quantityLabel: product.soldBy === "unit" ? product.unitLabel?.replace(/\s+/g, "") : undefined,
      },
    ]
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 p-0">
        <SheetHeader className="shrink-0 border-b border-border px-5 py-5 pr-16">
          <SheetTitle className="text-2xl font-bold">Meu pedido</SheetTitle>
          <SheetDescription className="text-base text-muted-foreground">
            Confira os produtos antes de enviar.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {items.length === 0 ? (
            <EmptyState
              title="Seu pedido está vazio"
              description="Escolha um produto e a quantidade em gramas para começar."
            />
          ) : (
            <div>
              {items.map((line) => {
                const product = catalog.find((item) => item.id === line.productId)
                const subtotal = product ? lineSubtotal(product, line) : 0
                return (
                  <CartItem
                    key={line.lineId}
                    line={line}
                    product={product}
                    subtotal={subtotal}
                    onIncrease={() => onItemsChange(changeQuantity(items, line.lineId, line.quantity + 1))}
                    onDecrease={() => onItemsChange(changeQuantity(items, line.lineId, line.quantity - 1))}
                    onRemove={() => onItemsChange(removeFromCart(items, line.lineId))}
                  />
                )
              })}
            </div>
          )}
          <div className="mt-6 border-t border-border pt-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <p className="text-lg font-semibold text-muted-foreground">Total</p>
              <p className="text-3xl leading-none font-extrabold">{formatCurrency(total)}</p>
            </div>
            <CheckoutForm lines={lines} total={total} disabled={items.length === 0} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
