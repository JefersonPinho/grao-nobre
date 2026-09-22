import { describe, expect, it } from "vitest"
import { priceForGrams, roundUpToFiftyCents, sellingPricePerKg } from "@/lib/pricing"

describe("preço de venda", () => {
  it("arredonda sempre para cima no próximo múltiplo de R$ 0,50", () => {
    expect(roundUpToFiftyCents(7.32)).toBe(7.5)
    expect(roundUpToFiftyCents(5.01)).toBe(5.5)
    expect(roundUpToFiftyCents(5.5)).toBe(5.5)
    expect(roundUpToFiftyCents(5)).toBe(5)
    expect(roundUpToFiftyCents(0.01)).toBe(0.5)
  })

  it("aplica 22% sobre o preço da fornecedora", () => {
    expect(sellingPricePerKg(60)).toBeCloseTo(73.2, 5)
    expect(sellingPricePerKg(8)).toBeCloseTo(9.76, 5)
  })

  it("calcula o preço da quantidade e depois arredonda", () => {
    expect(priceForGrams(60, 100)).toBe(7.5)
    expect(priceForGrams(8, 250)).toBe(2.5)
    expect(priceForGrams(60, 500)).toBe(37)
    expect(priceForGrams(8, 50)).toBe(0.5)
  })
})
