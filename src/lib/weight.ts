export const MIN_GRAMS = 50
export const GRAM_STEP = 50
export const QUICK_WEIGHTS = [100, 250, 500, 1000] as const

export function normalizeWeight(value: number) {
  if (!Number.isFinite(value) || value < MIN_GRAMS) {
    return MIN_GRAMS
  }

  return Math.ceil((value - Number.EPSILON) / GRAM_STEP) * GRAM_STEP
}
