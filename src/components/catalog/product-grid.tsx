"use client"

import { ProductCard } from "@/components/catalog/product-card"
import type { ProductGroup } from "@/lib/product-groups"
import type { Product } from "@/types/product"

type ProductGridProps = {
  groups: ProductGroup[]
  query: string
  onAdd: (product: Product, grams: number) => void
}

export function ProductGrid({ groups, query, onAdd }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
      {groups.map((group) => (
        <li key={group.id}>
          <ProductCard group={group} query={query} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  )
}
