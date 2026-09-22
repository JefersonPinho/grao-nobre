"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ALL_CATEGORIES, categories } from "@/data/categories"
import { cn } from "cn"

type CategoryFilterProps = {
  value: string
  onChange: (category: string) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const options = [ALL_CATEGORIES, ...categories]
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return

    const selected = rootRef.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')
    const list = rootRef.current?.querySelector<HTMLElement>('[role="listbox"]')
    if (selected && list) {
      const top = selected.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop
      list.scrollTop = Math.max(0, top - 6)
    }
    selected?.focus({ preventScroll: true })

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  function moveOption(current: HTMLElement, direction: 1 | -1 | "start" | "end") {
    const items = [...(rootRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])]
    const index = items.indexOf(current)
    const next =
      direction === "start" ? items[0] : direction === "end" ? items.at(-1) : items[index + direction]
    next?.focus()
  }

  return (
    <div>
      <p id="categoria-label" className="mb-1.5 text-lg font-bold lg:hidden">
        Categoria
      </p>
      <div ref={rootRef} className="relative lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          id="categoria"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby="categoria-label"
          className="flex h-14 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 text-left text-lg font-semibold text-foreground"
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              setOpen(true)
            }
          }}
        >
          {value}
          <ChevronDown className={cn("size-6 shrink-0 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
        {open ? (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby="categoria-label"
            className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg"
            onKeyDown={(event) => {
              const current = event.target instanceof HTMLElement ? event.target : null
              if (!current) return
              if (event.key === "ArrowDown") {
                event.preventDefault()
                moveOption(current, 1)
              } else if (event.key === "ArrowUp") {
                event.preventDefault()
                moveOption(current, -1)
              } else if (event.key === "Home") {
                event.preventDefault()
                moveOption(current, "start")
              } else if (event.key === "End") {
                event.preventDefault()
                moveOption(current, "end")
              }
            }}
          >
            {options.map((category) => {
              const selected = value === category
              return (
                <li key={category} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={cn(
                      "flex min-h-12 w-full items-center rounded-lg px-3 text-left text-lg font-semibold",
                      selected ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
                    )}
                    onClick={() => {
                      onChange(category)
                      setOpen(false)
                      triggerRef.current?.focus()
                    }}
                  >
                    {category}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>

      <div className="hidden lg:block">
        <h2 className="mb-2 text-lg font-bold">Categorias</h2>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categorias">
          {options.map((category) => {
            const selected = value === category
            return (
              <Button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                variant={selected ? "default" : "secondary"}
                size="xl"
                className="rounded-full"
                onClick={() => onChange(category)}
              >
                {category}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
