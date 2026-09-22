import { describe, expect, it } from "vitest"
import { products } from "@/data/products"
import { catalogGroups, groupProducts } from "@/lib/product-groups"

function groupNamed(name: string) {
  return catalogGroups.filter((group) => group.name === name)
}

describe("grupos de tipo", () => {
  it("junta sabores do mesmo produto quando o preço é igual", () => {
    const cashew = groupNamed("Castanha de Caju Caramelizada")
    expect(cashew).toHaveLength(1)
    expect(cashew[0]?.variants).toHaveLength(22)
    expect(cashew[0]?.variants[0]?.label).toBe("Tradicional")
    expect(cashew[0]?.variants.map((variant) => variant.label)).toContain("Açaí")
    expect(cashew[0]?.variants.map((variant) => variant.label)).toContain("Gergelim")
    expect(new Set(cashew[0]?.variants.map((variant) => variant.product.supplierPricePerKg))).toEqual(new Set([35]))

    const banana = groupNamed("Banana Chips")
    expect(banana).toHaveLength(1)
    expect(banana[0]?.variants).toHaveLength(15)
    expect(banana[0]?.variants[0]?.label).toBe("Tradicional")
    expect(banana[0]?.variants[1]?.label).toBe("Salgada")
    expect(banana[0]?.variants.map((variant) => variant.product.name)).not.toContain("Banana Palha")
  })

  it("junta os sabores do biscoito de arroz", () => {
    expect(groupNamed("Biscoito de Arroz")[0]?.variants.map((variant) => variant.label)).toEqual([
      "Cebola e Salsa",
      "Churrasco Barbecue",
      "Mostarda e Mel",
      "Queijo",
      "Tomate",
    ])
  })

  it("não junta produtos parecidos que não são sabor", () => {
    expect(catalogGroups.filter((group) => group.name.startsWith("Amendoim com Pele"))).toHaveLength(2)
    expect(catalogGroups.some((group) => group.category === "Chips" && group.name.toLowerCase().includes("coco"))).toBe(false)
  })

  it("junta batata-doce e macaxeira chips com tradicional e salgada na frente", () => {
    for (const name of ["Batata-doce Chips", "Macaxeira Chips"]) {
      const group = groupNamed(name)
      expect(group).toHaveLength(1)
      expect(group[0]?.variants[0]?.label).toBe("Tradicional")
      expect(group[0]?.variants[1]?.label).toBe("Salgada")
      expect(group[0]?.variants.map((variant) => variant.product.name).some((productName) => productName.includes("Palha"))).toBe(false)
    }
    expect(groupNamed("Macaxeira Chips")[0]?.variants.map((variant) => variant.label)).toContain("Churrasco")
    expect(groupNamed("Macaxeira Chips")[0]?.variants.map((variant) => variant.label)).toContain("Lemon Pepper")
    expect(groupNamed("Batata-doce Chips")[0]?.variants).toHaveLength(6)
    const macaxeira = groupNamed("Macaxeira Chips")[0]
    expect(macaxeira?.variants).toHaveLength(9)
    expect(macaxeira?.variants.map((variant) => variant.label)).toContain("Tempero Ana Maria")
    expect(catalogGroups.some((group) => group.name === "Macaxeira com Tempero Ana Maria")).toBe(false)
  })

  it("junta os drageados do mesmo produto", () => {
    expect(groupNamed("Amêndoa Drageada")[0]?.variants.map((variant) => variant.label)).toEqual([
      "Blend",
      "Chocolate 70% Cacau",
      "Chocolate Branco",
      "Limão Siciliano",
    ])
    expect(groupNamed("Banana Drageada")[0]?.variants.map((variant) => variant.label)).toEqual([
      "Chocolate 70% Cacau",
      "Chocolate Branco e Coco",
    ])
    expect(groupNamed("Castanha de Caju Drageada")[0]?.variants.map((variant) => variant.label)).toEqual([
      "Blend",
      "Chocolate 70% Cacau",
      "Chocolate Branco",
      "Limão Siciliano",
    ])
    expect(groupNamed("Morango Drageado")[0]?.variants.map((variant) => variant.label)).toEqual([
      "Blend",
      "Chocolate 70% Cacau",
      "Chocolate Branco",
    ])
    expect(groupNamed("Morango Liofilizado Drageado")[0]?.variants).toHaveLength(2)
    expect(groupNamed("Gotas de Chocolate")[0]?.variants.map((variant) => variant.label)).toEqual([
      "70% Cacau",
      "ao Leite",
      "Branco",
    ])
  })

  it("mantém todos os produtos do catálogo, cada um em um grupo só", () => {
    const ids = catalogGroups.flatMap((group) => group.variants.map((variant) => variant.product.id))
    expect(ids).toHaveLength(products.length)
    expect(new Set(ids).size).toBe(products.length)
  })

  it("junta os tipos da castanha em banda, SLW1 e W1, sem W1S", () => {
    const types = ["Natural", "Caseira", "Torrada com sal", "Torrada sem sal"]
    for (const name of ["Castanha de Caju em Banda", "Castanha de Caju SLW1", "Castanha de Caju W1"]) {
      const group = groupNamed(name)[0]
      expect(group?.variants.map((variant) => variant.label)).toEqual(types)
    }
    expect(groupNamed("Castanha de Caju W1")[0]?.variants.find((variant) => variant.label === "Caseira")?.product.supplierPricePerKg).toBe(64)
    expect(products.some((product) => product.code === "5.034" || product.name.includes("W1S"))).toBe(false)
  })

  it("deixa o coco só na categoria Coco, como integral ou queimado", () => {
    expect(groupNamed("Coco Chips")).toHaveLength(0)
    expect(products.some((product) => product.name.startsWith("Coco Chips"))).toBe(false)
    const flakes = groupProducts(products).find((group) => group.name === "Coco em Lascas")
    expect(flakes?.category).toBe("Coco")
    expect(flakes?.variants.map((variant) => variant.label)).toEqual(["Integral", "Queimado"])
  })
})
