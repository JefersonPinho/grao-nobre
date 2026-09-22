"use client"

import { Scale } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomWeightInput } from "@/components/catalog/custom-weight-input"
import { formatWeight } from "@/lib/format"
import { QUICK_WEIGHTS } from "@/lib/weight"
import { cn } from "cn"

type WeightSelectorProps = {
  productId: string
  grams: number
  onChange: (grams: number) => void
}

export function WeightSelector({ productId, grams, onChange }: WeightSelectorProps) {
  const [custom, setCustom] = useState(false)

  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-semibold">Quantidade</legend>
      <div className="grid grid-cols-4 gap-2">
        {QUICK_WEIGHTS.map((weight) => {
          const selected = !custom && grams === weight
          return (
            <Button
              key={weight}
              type="button"
              variant={selected ? "default" : "outline"}
              size="xl"
              aria-pressed={selected}
              className="w-full px-1"
              onClick={() => {
                setCustom(false)
                onChange(weight)
              }}
            >
              {formatWeight(weight)}
            </Button>
          )
        })}
      </div>
      <Button
        type="button"
        variant={custom ? "default" : "outline"}
        size="xl"
        aria-expanded={custom}
        aria-controls={`peso-${productId}`}
        className={cn("h-12 w-full text-base font-bold", !custom && "bg-secondary text-primary")}
        onClick={() => setCustom((current) => !current)}
      >
        <Scale aria-hidden="true" />
        Outra quantidade
      </Button>
      {custom ? (
        <CustomWeightInput
          id={`peso-${productId}`}
          grams={grams}
          onChange={onChange}
        />
      ) : null}
    </fieldset>
  )
}
