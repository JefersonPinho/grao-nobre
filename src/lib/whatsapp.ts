import { formatCurrency } from "@/lib/format"

export const WHATSAPP_PHONE = "5585982255592"

export type WhatsAppLine = {
  name: string
  grams: number
  quantity: number
  subtotal: number
  quantityLabel?: string
}

export function buildOrderMessage(input: {
  customerName: string
  notes?: string
  lines: WhatsAppLine[]
  total: number
}) {
  const items = input.lines
    .map((line) => {
      const weight = line.quantityLabel ?? (line.grams % 1000 === 0 ? `${line.grams / 1000}kg` : `${line.grams}g`)
      const price = formatCurrency(line.subtotal)
      return [`*${line.name}*`, `* *Quantidade:* ${line.quantity} x ${weight}`, `* *Valor:* ${price}`].join("\n")
    })
    .join("\n\n")

  const parts = [
    "*PEDIDO — PRODUTOS NATURAIS*",
    "",
    `*Cliente:* ${input.customerName.trim()}`,
    "",
    items,
  ]

  const notes = input.notes?.trim()
  if (notes) {
    parts.push("", `*Observações:* ${notes}`)
  }

  parts.push("", `*TOTAL: ${formatCurrency(input.total)}*`)
  return parts.join("\n")
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}
