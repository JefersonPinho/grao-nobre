"use client"

import { ProductCard } from "@/components/catalog/product-card"
import type { Product } from "@/types/product"

type ProductGridProps = {
  products: Product[]
  onAdd: (product: Product, grams: number) => void
}

export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  )
}
