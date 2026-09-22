"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { CartSheet } from "@/components/catalog/cart-sheet"
import { CategoryFilter } from "@/components/catalog/category-filter"
import { EmptyState } from "@/components/catalog/empty-state"
import { Header } from "@/components/catalog/header"
import { ProductGrid } from "@/components/catalog/product-grid"
import { ALL_CATEGORIES } from "@/data/categories"
import { products } from "@/data/products"
import { useCart } from "@/hooks/use-cart"
import { addToCart, cartItemCount, cartTotal } from "@/lib/cart"
import { formatCurrency } from "@/lib/format"
import { matchesSearch } from "@/lib/search"
import type { Product } from "@/types/product"

const PAGE_SIZE = 24

export function Catalog() {
  const { items, setItems } = useCart()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState("")

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (!product.active) return false
      if (category !== ALL_CATEGORIES && product.category !== category) return false
      return matchesSearch(product.name, query)
    })
  }, [category, query])

  const visibleProducts = filtered.slice(0, visible)
  const count = cartItemCount(items)
  const total = cartTotal(items, products)
  const hasFilters = query.trim().length > 0 || category !== ALL_CATEGORIES

  function updateQuery(value: string) {
    setQuery(value)
    setVisible(PAGE_SIZE)
  }

  function updateCategory(value: string) {
    setCategory(value)
    setVisible(PAGE_SIZE)
  }

  function clearFilters() {
    setQuery("")
    setCategory(ALL_CATEGORIES)
    setVisible(PAGE_SIZE)
  }

  function handleAdd(product: Product, grams: number) {
    setItems((current) => addToCart(current, product.id, grams))
    setNotice(`${product.name} adicionado ao pedido`)
  }

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(""), 2200)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const foundLabel =
    filtered.length === 1 ? "1 produto encontrado" : `${filtered.length} produtos encontrados`

  return (
    <div className="min-h-full bg-background">
      <a href="#produtos" className="skip-link">
        Ir para os produtos
      </a>
      <Header
        query={query}
        onQueryChange={updateQuery}
        count={count}
        total={total}
        onOpenCart={() => setCartOpen(true)}
      />
      <main id="produtos" className="mx-auto w-full max-w-7xl px-4 pt-3 pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:pt-4 md:pb-12">
        <CategoryFilter value={category} onChange={updateCategory} />
        <div className="mt-3 mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-semibold">{foundLabel}</p>
          {hasFilters ? (
            <Button type="button" variant="outline" size="xl" onClick={clearFilters}>
              Limpar busca e filtros
            </Button>
          ) : null}
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Tente outro nome ou escolha a categoria Todos."
            actionLabel="Limpar busca e filtros"
            onAction={clearFilters}
          />
        ) : (
          <>
            <h2 className="sr-only">Produtos</h2>
            <ProductGrid products={visibleProducts} onAdd={handleAdd} />
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-base text-muted-foreground">
                Mostrando {visibleProducts.length} de {filtered.length}
              </p>
              {visible < filtered.length ? (
                <Button type="button" size="xl" className="h-14 w-full max-w-md text-lg" onClick={() => setVisible((current) => current + PAGE_SIZE)}>
                  Carregar mais produtos
                </Button>
              ) : null}
            </div>
          </>
        )}
      </main>
      <div className="sr-only" aria-live="polite">
        {notice}
      </div>
      {cartOpen ? null : (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-3 pt-2 shadow-[0_-8px_24px_rgba(28,36,31,0.12)] md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {notice ? (
            <p className="mb-2 rounded-xl bg-primary px-4 py-2 text-center text-base font-semibold text-primary-foreground">
              {notice}
            </p>
          ) : null}
          <Button type="button" size="xl" className="h-14 w-full text-lg" onClick={() => setCartOpen(true)}>
            <span className="flex w-full items-center justify-between gap-3">
              <span>Ver pedido</span>
              <span>
                {count === 1 ? "1 item" : `${count} itens`} · {formatCurrency(total)}
              </span>
            </span>
          </Button>
        </div>
      )}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={items}
        catalog={products}
        onItemsChange={setItems}
      />
    </div>
  )
}
