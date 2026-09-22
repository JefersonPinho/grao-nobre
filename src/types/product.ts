export type Product = {
  id: string
  code: string
  name: string
  slug: string
  category: string
  supplierPricePerKg: number
  image: string
  description: string
  active: boolean
  soldBy?: "unit"
  unitLabel?: string
}
