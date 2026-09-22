"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/catalog/product-image"
import { WeightSelector } from "@/components/catalog/weight-selector"
import { formatCurrency, formatWeight } from "@/lib/format"
import { priceForGrams, priceForUnit } from "@/lib/pricing"
import { preferredVariant, type ProductGroup } from "@/lib/product-groups"
import type { Product } from "@/types/product"

type ProductCardProps = {
  group: ProductGroup
  query: string
  onAdd: (product: Product, grams: number) => void
}

export function ProductCard({ group, query, onAdd }: ProductCardProps) {
  const [grams, setGrams] = useState(100)
  const [added, setAdded] = useState(false)
  const [productId, setProductId] = useState(() => preferredVariant(group, query).product.id)
  const selected = group.variants.find((variant) => variant.product.id === productId) ?? group.variants[0]
  const product = selected.product
  const image = product.image || group.variants.find((variant) => variant.product.image)?.product.image || ""
  const byUnit = product.soldBy === "unit"
  const selectedPrice = byUnit ? priceForUnit(product.supplierPricePerKg) : priceForGrams(product.supplierPricePerKg, grams)
  const choosingType = group.variants.length > 1

  useEffect(() => {
    setProductId(preferredVariant(group, query).product.id)
  }, [group, query])

  useEffect(() => {
    if (!added) return
    const timeout = window.setTimeout(() => setAdded(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [added])

  return (
    <article className="flex h-full scroll-mb-40 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <ProductImage
        src={image}
        name={group.name}
        className="h-36 w-full rounded-none md:aspect-[4/3] md:h-auto"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-base font-semibold text-copper">{product.category}</p>
          <h3 className="mt-1 text-xl leading-snug font-bold">{group.name}</h3>
        </div>
        {choosingType ? (
          <fieldset className="space-y-2">
            <legend className="text-base font-semibold">Tipo</legend>
            <div className="grid gap-2">
              {group.variants.map((variant) => {
                const pressed = variant.product.id === product.id
                return (
                  <Button
                    key={variant.product.id}
                    type="button"
                    variant={pressed ? "default" : "outline"}
                    size="xl"
                    aria-pressed={pressed}
                    className="h-auto min-h-12 w-full justify-start px-4 py-3 text-left text-base whitespace-normal"
                    onClick={() => {
                      setProductId(variant.product.id)
                      setAdded(false)
                    }}
                  >
                    {variant.label}
                  </Button>
                )
              })}
            </div>
          </fieldset>
        ) : null}
        {byUnit ? null : <WeightSelector productId={product.id} grams={grams} onChange={setGrams} />}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <p className="text-base text-muted-foreground">{byUnit ? `1 unidade · ${product.unitLabel}` : formatWeight(grams)}</p>
          <p className="text-2xl leading-none font-extrabold" aria-live="polite">
            {formatCurrency(selectedPrice)}
          </p>
        </div>
        <Button
          type="button"
          size="xl"
          className="h-14 w-full text-lg"
          onClick={() => {
            onAdd(product, byUnit ? 1 : grams)
            setAdded(true)
          }}
        >
          {added ? "Adicionado" : "Adicionar ao pedido"}
        </Button>
      </div>
    </article>
  )
}
