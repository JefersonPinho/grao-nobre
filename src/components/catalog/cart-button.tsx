"use client"

import { ShoppingBasket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/format"

type CartButtonProps = {
  count: number
  total: number
  onClick: () => void
  className?: string
}

export function CartButton({ count, total, onClick, className }: CartButtonProps) {
  const itemLabel = count === 1 ? "1 item" : `${count} itens`

  return (
    <Button type="button" size="xl" className={className} onClick={onClick}>
      <ShoppingBasket aria-hidden="true" />
      <span>Meu pedido</span>
      <span className="font-bold">{itemLabel}</span>
      <span className="sr-only">Total {formatCurrency(total)}</span>
    </Button>
  )
}
