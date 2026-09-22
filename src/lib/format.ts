export function formatCurrency(value: number) {
  const negative = value < 0
  const absolute = Math.abs(value)
  const [whole, cents] = absolute.toFixed(2).split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${negative ? "-" : ""}R$ ${grouped},${cents}`
}

export function formatWeight(grams: number) {
  if (grams > 0 && grams % 1000 === 0) {
    return `${grams / 1000} kg`
  }

  return `${grams} g`
}
