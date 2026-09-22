"use client"

import { Minus, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MIN_GRAMS, normalizeWeight } from "@/lib/weight"

type CustomWeightInputProps = {
  id: string
  grams: number
  onChange: (grams: number) => void
}

export function CustomWeightInput({ id, grams, onChange }: CustomWeightInputProps) {
  const [draft, setDraft] = useState(String(grams))
  const inputRef = useRef<HTMLInputElement>(null)

  function commit(value: string) {
    const normalized = normalizeWeight(Number(value))
    setDraft(String(normalized))
    onChange(normalized)
  }

  useEffect(() => {
    const node = inputRef.current
    if (!node) return

    const handleBlur = () => {
      const normalized = normalizeWeight(Number(node.value))
      setDraft(String(normalized))
      onChange(normalized)
    }

    node.addEventListener("blur", handleBlur)
    return () => node.removeEventListener("blur", handleBlur)
  }, [onChange])

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-base font-semibold">
        Outra quantidade em gramas
      </label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-xl"
          aria-label="Diminuir 50 gramas"
          onClick={() => commit(String(grams - 50))}
        >
          <Minus />
        </Button>
        <Input
          ref={inputRef}
          id={id}
          inputMode="numeric"
          min={MIN_GRAMS}
          step={50}
          value={draft}
          aria-describedby={`${id}-ajuda`}
          className="h-12 text-center text-lg font-semibold md:text-lg"
          onChange={(event) => {
            const digits = event.target.value.replace(/[^\d]/g, "")
            setDraft(digits)
            if (!digits) return
            onChange(normalizeWeight(Number(digits)))
          }}
          onBlur={() => commit(draft)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon-xl"
          aria-label="Aumentar 50 gramas"
          onClick={() => commit(String(grams + 50))}
        >
          <Plus />
        </Button>
      </div>
      <p id={`${id}-ajuda`} className="text-base text-muted-foreground">
        Mínimo de 50 g, de 50 em 50 g
      </p>
    </div>
  )
}
