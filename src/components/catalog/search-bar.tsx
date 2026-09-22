"use client"

import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <label htmlFor="busca" className="sr-only">
        Buscar produto
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        id="busca"
        type="text"
        role="searchbox"
        value={value}
        placeholder="Buscar pelo nome"
        autoComplete="off"
        enterKeyHint="search"
        className="h-12 pr-14 pl-12 text-base md:h-14 md:text-lg"
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xl"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          aria-label="Limpar busca"
          onClick={() => onChange("")}
        >
          <X />
        </Button>
      ) : null}
    </div>
  )
}
