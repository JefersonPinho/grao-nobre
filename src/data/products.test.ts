import { describe, expect, it } from "vitest"
import { categories } from "@/data/categories"
import { products } from "@/data/products"

const banned = ["cura", "combate", "glicemia", "circulação", "emagrece", "doença"]

describe("catálogo importado", () => {
  it("contém os produtos da tabela de 02/09/2026", () => {
    expect(products).toHaveLength(296)
  })

  it("tem código, nome, categoria e preço por quilo em todos os itens", () => {
    for (const product of products) {
      expect(product.id.length).toBeGreaterThan(0)
      expect(product.code).toMatch(/^\d+[-.]\d+$/)
      expect(product.name.trim().length).toBeGreaterThan(0)
      expect(categories).toContain(product.category)
      expect(product.supplierPricePerKg).toBeGreaterThan(0)
      if (product.image) {
        expect(product.image).toMatch(/^\/products\/.+\.webp$/)
      }
      expect(product.active).toBe(true)
    }
  })

  it("mantém identificadores únicos quando a tabela repete um código", () => {
    expect(new Set(products.map((product) => product.id)).size).toBe(296)
    expect(products.filter((product) => product.code === "25.013")).toHaveLength(2)
  })

  it("não vende embalagem, castanha W3, castanha W4 nem pasta de castanha", () => {
    for (const product of products) {
      expect(product.category).not.toBe("Embalagens")
      expect(product.name).not.toMatch(/\bW3\b/)
      expect(product.name).not.toMatch(/\bW4\b/)
      expect(product.name).not.toContain("W1S")
      expect(product.name.toLowerCase()).not.toContain("pasta de castanha")
    }
  })

  it("usa o preço da fornecedora da tabela nova", () => {
    const coconutSugar = products.find((product) => product.code === "1.005")
    const natural = products.find((product) => product.code === "5.010")
    expect(coconutSugar?.supplierPricePerKg).toBe(33)
    expect(natural?.name).toBe("Castanha de Caju W1 Natural")
    expect(natural?.supplierPricePerKg).toBe(64)
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
