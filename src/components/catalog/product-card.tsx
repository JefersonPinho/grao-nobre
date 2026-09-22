"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/catalog/product-image"
import { WeightSelector } from "@/components/catalog/weight-selector"
import { formatCurrency, formatWeight } from "@/lib/format"
import { priceForGrams } from "@/lib/pricing"
import type { Product } from "@/types/product"

type ProductCardProps = {
  product: Product
  onAdd: (product: Product, grams: number) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [grams, setGrams] = useState(100)
  const [added, setAdded] = useState(false)
  const selectedPrice = priceForGrams(product.supplierPricePerKg, grams)

  useEffect(() => {
    if (!added) return
    const timeout = window.setTimeout(() => setAdded(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [added])

  return (
    <article className="flex h-full scroll-mb-40 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <ProductImage
        src={product.image}
        name={product.name}
        className="h-36 w-full rounded-none md:aspect-[4/3] md:h-auto"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-base font-semibold text-copper">{product.category}</p>
          <h3 className="mt-1 text-xl leading-snug font-bold">{product.name}</h3>
        </div>
        <WeightSelector productId={product.id} grams={grams} onChange={setGrams} />
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <p className="text-base text-muted-foreground">{formatWeight(grams)}</p>
          <p className="text-2xl leading-none font-extrabold" aria-live="polite">
            {formatCurrency(selectedPrice)}
          </p>
        </div>
        <Button
          type="button"
          size="xl"
          className="h-14 w-full text-lg"
          onClick={() => {
            onAdd(product, grams)
            setAdded(true)
          }}
        >
          {added ? "Adicionado" : "Adicionar ao pedido"}
        </Button>
      </div>
    </article>
  )
}
