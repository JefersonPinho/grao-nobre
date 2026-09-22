import { describe, expect, it } from "vitest"
import { addToCart, cartTotal, lineSubtotal } from "@/lib/cart"
import type { Product } from "@/types/product"

const sugar: Product = {
  id: "teste-acucar",
  code: "teste-acucar",
  name: "Açúcar",
  slug: "acucar",
  category: "Adoçantes",
  supplierPricePerKg: 8,
  image: "",
  description: "",
  active: true,
}

const cashew: Product = {
  id: "teste-caju",
  code: "teste-caju",
  name: "Castanha de Caju W1 Natural",
  slug: "castanha",
  category: "Castanhas de caju",
  supplierPricePerKg: 60,
  image: "",
  description: "",
  active: true,
}

describe("carrinho", () => {
  it("soma a quantidade quando o produto e o peso são os mesmos", () => {
    const once = addToCart([], sugar.id, 250)
    const twice = addToCart(once, sugar.id, 250)

    expect(twice).toHaveLength(1)
    expect(twice[0]?.quantity).toBe(2)
    expect(twice[0]?.grams).toBe(250)
  })

  it("cria linhas separadas quando o peso é diferente", () => {
    const first = addToCart([], sugar.id, 250)
    const second = addToCart(first, sugar.id, 500)

    expect(second).toHaveLength(2)
    expect(second.map((line) => line.grams)).toEqual([250, 500])
  })

  it("calcula o total pelos preços arredondados de cada pacote", () => {
    const lines = addToCart(addToCart([], sugar.id, 250), cashew.id, 500)
    const withTwoCashew = lines.map((line) =>
      line.productId === cashew.id ? { ...line, quantity: 2 } : line,
    )

    const sugarLine = withTwoCashew[0]
    const cashewLine = withTwoCashew[1]
    expect(lineSubtotal(sugar, sugarLine)).toBe(2.5)
    expect(lineSubtotal(cashew, cashewLine)).toBe(74)
    expect(cartTotal(withTwoCashew, [sugar, cashew])).toBe(76.5)
  })
})
