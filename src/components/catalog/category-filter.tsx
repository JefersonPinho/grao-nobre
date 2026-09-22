"use client"

import { useState } from "react"
import { ChevronLeft, Nut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { cn } from "cn"

type CategoryPickerProps = {
  onSelect: (category: string) => void
}

function productCount(category: string) {
  return products.filter((product) => product.active && product.category === category).length
}

function countLabel(count: number) {
  return count === 1 ? "1 produto" : `${count} produtos`
}

const categoryCovers: Record<string, string> = {
  Adoçantes: "/categories/adocantes.webp",
  Caramelizados: "/categories/caramelizados.webp",
  "Castanhas do Pará": "/categories/castanhas-do-para.webp",
  "Castanhas de caju": "/categories/castanhas-de-caju.webp",
  "Chás e ervas": "/categories/chas.webp",
  Drageados: "/categories/drageados.webp",
  Chips: "/categories/chips.webp",
  "Temperos e especiarias": "/categories/temperos.webp",
  Coco: "/categories/coco.webp",
}

export function categoryImage(category: string) {
  const cover = categoryCovers[category]
  if (cover) return cover
  const images = products
    .filter((product) => product.active && product.category === category && product.image)
    .map((product) => product.image)
  if (images.length === 0) return ""
  return images[Math.min(2, images.length - 1)] ?? images[0]
}

export function CategoryPicker({ onSelect }: CategoryPickerProps) {
  const [missing, setMissing] = useState<Record<string, boolean>>({})

  return (
    <section aria-labelledby="escolha-categoria">
      <h2 id="escolha-categoria" className="text-3xl font-bold">
        Escolha uma categoria
      </h2>
      <p className="mt-1 mb-4 text-lg text-muted-foreground">Toque no que você procura.</p>
      <div className="grid max-w-xl grid-cols-1 gap-4">
        {categories.map((category) => {
          const image = categoryImage(category)
          const showImage = Boolean(image) && !missing[category]
          return (
            <button
              key={category}
              type="button"
              className="flex min-h-24 flex-col overflow-hidden rounded-3xl border border-border bg-card text-left text-foreground"
              onClick={() => onSelect(category)}
            >
              <span className="relative block h-44 w-full overflow-hidden bg-secondary">
                {showImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    ref={(node) => {
                      if (node?.complete && node.naturalWidth === 0) {
                        setMissing((current) => (current[category] ? current : { ...current, [category]: true }))
                      }
                    }}
                    onLoad={(event) => {
                      if (event.currentTarget.naturalWidth === 0) {
                        setMissing((current) => (current[category] ? current : { ...current, [category]: true }))
                      }
                    }}
                    onError={() => setMissing((current) => (current[category] ? current : { ...current, [category]: true }))}
                  />
                ) : (
                  <Nut className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-primary" aria-hidden="true" />
                )}
              </span>
              <span className="flex flex-col gap-1 px-5 py-4">
                <span className="text-2xl leading-snug font-bold">{category}</span>
                <span className="text-lg text-muted-foreground">{countLabel(productCount(category))}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

type CategoryHeroProps = {
  title: string
  count: string
  image: string
  onBack: () => void
}

export function CategoryHero({ title, count, image, onBack }: CategoryHeroProps) {
  const [missing, setMissing] = useState(false)
  const showImage = Boolean(image) && !missing

  return (
    <div className="mb-5">
      <Button type="button" variant="outline" size="xl" className="mb-3" onClick={onBack}>
        <ChevronLeft className="size-6" aria-hidden="true" />
        Voltar
      </Button>
      <div
        className={cn(
          "relative flex h-32 items-end justify-center overflow-hidden rounded-3xl md:h-auto md:items-start md:justify-start md:overflow-visible md:rounded-none md:bg-transparent md:text-foreground",
          showImage ? "text-white" : "bg-primary text-primary-foreground",
        )}
      >
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover md:hidden"
              onLoad={(event) => {
                if (event.currentTarget.naturalWidth === 0) setMissing(true)
              }}
              onError={() => setMissing(true)}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:hidden" />
          </>
        ) : null}
        <div className="relative z-10 px-5 pb-5 text-center md:px-0 md:pb-0 md:text-left">
          <h2 className="text-3xl leading-tight font-bold">{title}</h2>
          <p className="mt-1 text-base font-semibold">{count}</p>
        </div>
      </div>
    </div>
  )
}
