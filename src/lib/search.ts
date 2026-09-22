export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function matchesSearch(name: string, query: string) {
  const normalizedQuery = normalizeSearch(query)
  if (!normalizedQuery) return true
  return normalizeSearch(name).includes(normalizedQuery)
}
