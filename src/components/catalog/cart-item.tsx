"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatWeight } from "@/lib/format"
import type { CartLine } from "@/types/cart"
import type { Product } from "@/types/product"

type CartItemProps = {
  line: CartLine
  product: Product | undefined
  subtotal: number
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export function CartItem({
  line,
  product,
  subtotal,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const name = product?.name ?? "Produto indisponível"

  return (
    <article className="border-b border-border py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg leading-snug font-bold">{name}</h3>
        <p className="shrink-0 text-lg font-bold">{formatCurrency(subtotal)}</p>
      </div>
      <p className="mt-1 text-base text-muted-foreground">{formatWeight(line.grams)}</p>
      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-xl"
          aria-label={`Diminuir quantidade de ${name}`}
          disabled={line.quantity <= 1}
          onClick={onDecrease}
        >
          <Minus />
        </Button>
        <span className="min-w-8 text-center text-xl font-bold" aria-label={`${line.quantity} pacotes`}>
          {line.quantity}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-xl"
          aria-label={`Aumentar quantidade de ${name}`}
          onClick={onIncrease}
        >
          <Plus />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xl"
          className="ml-auto px-3 text-destructive"
          onClick={onRemove}
        >
          Remover
        </Button>
      </div>
    </article>
  )
}
