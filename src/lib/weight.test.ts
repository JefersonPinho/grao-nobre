import { describe, expect, it } from "vitest"
import { MIN_GRAMS, normalizeWeight } from "@/lib/weight"

describe("peso", () => {
  it("não aceita menos de 50 g", () => {
    expect(MIN_GRAMS).toBe(50)
    expect(normalizeWeight(20)).toBe(50)
    expect(normalizeWeight(0)).toBe(50)
    expect(normalizeWeight(-10)).toBe(50)
    expect(normalizeWeight(Number.NaN)).toBe(50)
  })

  it("corrige pesos para o próximo múltiplo de 50", () => {
    expect(normalizeWeight(50)).toBe(50)
    expect(normalizeWeight(100)).toBe(100)
    expect(normalizeWeight(135)).toBe(150)
    expect(normalizeWeight(151)).toBe(200)
  })
})
