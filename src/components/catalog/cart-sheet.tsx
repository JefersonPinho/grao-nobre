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
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-4">
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
        </div>
        <div className="max-h-[58dvh] shrink-0 overflow-x-hidden overflow-y-auto border-t border-border bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="mb-3 text-xl font-bold">Total {formatCurrency(total)}</p>
          <CheckoutForm lines={lines} total={total} disabled={items.length === 0} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
