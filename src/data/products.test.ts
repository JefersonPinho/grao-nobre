import { describe, expect, it } from "vitest"
import { categories } from "@/data/categories"
import { products } from "@/data/products"

const banned = ["cura", "combate", "glicemia", "circulação", "emagrece", "doença"]

describe("catálogo importado", () => {
  it("contém os 302 produtos da tabela", () => {
    expect(products).toHaveLength(302)
  })

  it("tem código, nome, categoria e preço por quilo em todos os itens", () => {
    for (const product of products) {
      expect(product.id.length).toBeGreaterThan(0)
      expect(product.code).toMatch(/^\d+\.\d+$/)
      expect(product.name.trim().length).toBeGreaterThan(0)
      expect(categories).toContain(product.category)
      expect(product.supplierPricePerKg).toBeGreaterThan(0)
      expect(product.image).toBe(`/products/${product.id}.webp`)
      expect(product.active).toBe(true)
    }
  })

  it("mantém identificadores únicos mesmo quando a tabela repete um código", () => {
    expect(new Set(products.map((product) => product.id)).size).toBe(302)
    const repeated = ["7.023", "23.033"]
    for (const code of repeated) {
      expect(products.filter((product) => product.code === code)).toHaveLength(2)
    }
  })

  it("não usa promessas de saúde nas descrições", () => {
    for (const product of products) {
      const text = product.description.toLowerCase()
      for (const word of banned) {
        expect(text).not.toContain(word)
      }
    }
  })
})
