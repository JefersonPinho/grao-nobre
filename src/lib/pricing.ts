export const SELLING_MARGIN = 1.22

export function roundUpToFiftyCents(value: number) {
  return Math.ceil((value - Number.EPSILON) * 2) / 2
}

export function sellingPricePerKg(supplierPricePerKg: number) {
  return supplierPricePerKg * SELLING_MARGIN
}

export function priceForGrams(supplierPricePerKg: number, grams: number) {
  const exactPrice = sellingPricePerKg(supplierPricePerKg) * (grams / 1000)
  return roundUpToFiftyCents(exactPrice)
}

export function priceForUnit(supplierPrice: number) {
  return roundUpToFiftyCents(sellingPricePerKg(supplierPrice))
}
