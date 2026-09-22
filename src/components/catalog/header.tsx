"use client"

import { CartButton } from "@/components/catalog/cart-button"
import { SearchBar } from "@/components/catalog/search-bar"

type HeaderProps = {
  query: string
  onQueryChange: (value: string) => void
  count: number
  total: number
  onOpenCart: () => void
}

export function Header({ query, onQueryChange, count, total, onOpenCart }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2.5 px-4 py-2.5 md:gap-3 md:py-3">
        <div className="flex items-center justify-center gap-3 md:justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo-horizontal.png"
            alt="Grão Nobre - Produtos Naturais"
            className="h-14 w-auto md:h-16"
          />
          <CartButton count={count} total={total} onClick={onOpenCart} className="hidden shrink-0 md:inline-flex" />
        </div>
        <SearchBar value={query} onChange={onQueryChange} />
      </div>
    </header>
  )
}
