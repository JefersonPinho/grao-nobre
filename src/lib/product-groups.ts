import { products } from "@/data/products"
import { matchesSearch, normalizeSearch } from "@/lib/search"
import type { Product } from "@/types/product"

export type ProductVariant = {
  product: Product
  label: string
}

export type ProductGroup = {
  id: string
  name: string
  category: string
  variants: ProductVariant[]
}

const cashewBases = ["Castanha de Caju em Banda", "Castanha de Caju SLW1", "Castanha de Caju W1"]
const chipBases = new Set(["Banana Chips", "Batata-doce Chips", "Macaxeira Chips"])
const drageadoBases = new Set([
  "Amêndoa Drageada",
  "Banana Drageada",
  "Castanha de Caju Drageada",
  "Morango Drageado",
  "Morango Liofilizado Drageado",
])
const groupedAcrossPrices = new Set([...chipBases, ...drageadoBases, "Biscoito de Arroz"])
const cashewTypeOrder = ["Natural", "Caseira", "Torrada com sal", "Torrada sem sal"]

function cashewLabel(name: string, base: string) {
  const prefix = `${base} `
  if (!name.startsWith(prefix)) return null
  const rest = name.slice(prefix.length)
  if (rest === "Natural" || rest === "Caseira") return rest
  if (rest === "Torrada com Sal") return "Torrada com sal"
  if (rest === "Torrada sem Sal") return "Torrada sem sal"
  return null
}

function cashewGroupFor(list: Product[]) {
  const groups = new Map<string, ProductGroup>()
  for (const base of cashewBases) {
    const variants = list.flatMap((product) => {
      const label = cashewLabel(product.name, base)
      return label ? [{ product, label }] : []
    })
    if (variants.length < 2) continue
    variants.sort((a, b) => cashewTypeOrder.indexOf(a.label) - cashewTypeOrder.indexOf(b.label))
    const group: ProductGroup = {
      id: variants.map((variant) => variant.product.id).join("+"),
      name: base,
      category: variants[0]?.product.category ?? "Castanhas de caju",
      variants,
    }
    for (const variant of variants) groups.set(variant.product.id, group)
  }
  return groups
}

function flavorParts(name: string) {
  const match = name.match(/^(.*) (?:com|Sabor) (.+)$/)
  if (!match) return null
  const label = match[2]
  if (label.includes(" - ")) return null
  return { base: match[1], label }
}

function shortenBoardLabels(variants: ProductVariant[]) {
  const names = variants.map((variant) => variant.product.name)
  const sameBoard = names.every((name) => /borda/i.test(name) && /integral/i.test(name))
  if (!sameBoard) return variants
  return variants.map((variant) => ({
    ...variant,
    label: /queimado/i.test(variant.product.name) ? "Queimado" : "Integral",
  }))
}

export function groupProducts(list: Product[]): ProductGroup[] {
  const cashewGroups = cashewGroupFor(list)
  const buckets = new Map<string, { base: string; category: string; variants: ProductVariant[] }>()

  for (const product of list) {
    if (cashewGroups.has(product.id)) continue
    const parts = flavorParts(product.name)
    if (!parts) continue
    const key = `${product.category}\0${product.supplierPricePerKg}\0${parts.base}`
    const bucket = buckets.get(key) ?? { base: parts.base, category: product.category, variants: [] }
    bucket.variants.push({ product, label: parts.label })
    buckets.set(key, bucket)
  }

  for (const product of list) {
    if (flavorParts(product.name)) continue
    const key = `${product.category}\0${product.supplierPricePerKg}\0${product.name}`
    const bucket = buckets.get(key)
    if (!bucket) continue
    bucket.variants.unshift({ product, label: "Tradicional" })
  }

  const mergedChip = new Map<string, { base: string; category: string; variants: ProductVariant[] }>()
  for (const [key, bucket] of buckets) {
    if (!groupedAcrossPrices.has(bucket.base)) continue
    const mergeKey = `${bucket.category}\0${bucket.base}`
    const existing = mergedChip.get(mergeKey)
    if (!existing) {
      mergedChip.set(mergeKey, bucket)
      continue
    }
    existing.variants.push(...bucket.variants)
    buckets.delete(key)
  }

  for (const product of list) {
    const plain = product.name.match(/^(.*) (Tradicional|Salgada)$/)
    if (!plain || !chipBases.has(plain[1])) continue
    const bucket = [...buckets.values()].find((item) => item.category === product.category && item.base === plain[1])
    if (!bucket || bucket.variants.some((variant) => variant.product.id === product.id)) continue
    bucket.variants.push({ product, label: plain[2] })
  }

  for (const product of list) {
    const blend = product.name.match(/^(.*) Blend$/)
    if (!blend || !drageadoBases.has(blend[1])) continue
    const bucket = [...buckets.values()].find((item) => item.category === product.category && item.base === blend[1])
    if (!bucket || bucket.variants.some((variant) => variant.product.id === product.id)) continue
    bucket.variants.unshift({ product, label: "Blend" })
  }

  for (const product of list) {
    if (product.name !== "Macaxeira com Tempero Ana Maria") continue
    const bucket = [...buckets.values()].find((item) => item.base === "Macaxeira Chips")
    if (!bucket || bucket.variants.some((variant) => variant.product.id === product.id)) continue
    bucket.variants.push({ product, label: "Tempero Ana Maria" })
  }

  for (const bucket of buckets.values()) {
    const tradicional = bucket.variants.filter((variant) => variant.label === "Tradicional")
    const salgada = bucket.variants.filter((variant) => variant.label === "Salgada")
    const rest = bucket.variants.filter((variant) => variant.label !== "Tradicional" && variant.label !== "Salgada")
    bucket.variants = shortenBoardLabels([...tradicional, ...salgada, ...rest])
  }

  const gotas = list.flatMap((product) => {
    const label = product.name.match(/^Gotas de Chocolate (.+) Drageada$/)?.[1]
    return label ? [{ product, label }] : []
  })
  if (gotas.length >= 2) {
    buckets.set("gotas", {
      base: "Gotas de Chocolate",
      category: gotas[0]?.product.category ?? "Drageados",
      variants: gotas,
    })
  }

  const bucketByProductId = new Map<string, { base: string; category: string; variants: ProductVariant[] }>()
  for (const bucket of buckets.values()) {
    if (bucket.variants.length < 2) continue
    for (const variant of bucket.variants) bucketByProductId.set(variant.product.id, bucket)
  }

  const emitted = new Set<string>()
  const groups: ProductGroup[] = []

  for (const product of list) {
    if (emitted.has(product.id)) continue
    const cashew = cashewGroups.get(product.id)
    if (cashew) {
      for (const variant of cashew.variants) emitted.add(variant.product.id)
      groups.push(cashew)
      continue
    }
    const bucket = bucketByProductId.get(product.id)
    if (bucket && bucket.variants.length >= 2 && bucket.variants.some((variant) => variant.product.id === product.id)) {
      for (const variant of bucket.variants) emitted.add(variant.product.id)
      groups.push({
        id: bucket.variants.map((variant) => variant.product.id).join("+"),
        name: bucket.base,
        category: bucket.category,
        variants: bucket.variants,
      })
      continue
    }
    emitted.add(product.id)
    groups.push({
      id: product.id,
      name: product.name,
      category: product.category,
      variants: [{ product, label: product.name }],
    })
  }

  return groups
}

export const catalogGroups = groupProducts(products.filter((product) => product.active))

export function preferredVariant(group: ProductGroup, query: string) {
  const normalized = normalizeSearch(query)
  if (!normalized) return group.variants[0]
  const byLabel = group.variants.find((variant) => normalizeSearch(variant.label).includes(normalized))
  if (byLabel) return byLabel
  return group.variants.find((variant) => matchesSearch(variant.product.name, query)) ?? group.variants[0]
}

export function groupMatchesSearch(group: ProductGroup, query: string) {
  if (matchesSearch(group.name, query)) return true
  return group.variants.some((variant) => matchesSearch(variant.product.name, query) || matchesSearch(variant.label, query))
}
