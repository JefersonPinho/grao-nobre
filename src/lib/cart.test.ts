import { describe, expect, it } from "vitest"
import { addToCart, cartTotal, lineSubtotal } from "@/lib/cart"
import { products } from "@/data/products"
import type { Product } from "@/types/product"

const demerara = products.find((product) => product.code === "1.001") as Product
const w1 = products.find((product) => product.code === "5.010") as Product

describe("carrinho", () => {
  it("soma a quantidade quando o produto e o peso são os mesmos", () => {
    const once = addToCart([], demerara.id, 250)
    const twice = addToCart(once, demerara.id, 250)

    expect(twice).toHaveLength(1)
    expect(twice[0]?.quantity).toBe(2)
    expect(twice[0]?.grams).toBe(250)
  })

  it("cria linhas separadas quando o peso é diferente", () => {
    const first = addToCart([], demerara.id, 250)
    const second = addToCart(first, demerara.id, 500)

    expect(second).toHaveLength(2)
    expect(second.map((line) => line.grams)).toEqual([250, 500])
  })

  it("calcula o total pelos preços arredondados de cada pacote", () => {
    const lines = addToCart(addToCart([], demerara.id, 250), w1.id, 500)
    const withTwoCashew = lines.map((line) =>
      line.productId === w1.id ? { ...line, quantity: 2 } : line,
    )

    const demeraraLine = withTwoCashew[0]
    const cashewLine = withTwoCashew[1]
    expect(lineSubtotal(demerara, demeraraLine)).toBe(2.5)
    expect(lineSubtotal(w1, cashewLine)).toBe(74)
    expect(cartTotal(withTwoCashew, products)).toBe(76.5)
  })
})
