import { describe, expect, it } from "vitest"
import { buildOrderMessage, buildWhatsAppUrl, WHATSAPP_PHONE } from "@/lib/whatsapp"

describe("mensagem do WhatsApp", () => {
  it("monta o pedido no formato combinado", () => {
    const message = buildOrderMessage({
      customerName: "Maria",
      notes: "Separar em embalagens individuais.",
      total: 76.5,
      lines: [
        { name: "Açúcar Demerara", grams: 250, quantity: 1, subtotal: 2.5 },
        { name: "Castanha de Caju W1 Natural", grams: 500, quantity: 2, subtotal: 74 },
      ],
    })

    expect(message).toBe(
      [
        "*PEDIDO — PRODUTOS NATURAIS*",
        "",
        "*Cliente:* Maria",
        "",
        "*Açúcar Demerara*",
        "* *Quantidade:* 1 x 250g",
        "* *Valor:* R$ 2,50",
        "",
        "*Castanha de Caju W1 Natural*",
        "* *Quantidade:* 2 x 500g",
        "* *Valor:* R$ 74,00",
        "",
        "*Observações:* Separar em embalagens individuais.",
        "",
        "*TOTAL: R$ 76,50*",
      ].join("\n"),
    )
  })

  it("abre o WhatsApp com a mensagem codificada", () => {
    expect(WHATSAPP_PHONE).toBe("5585982255592")
    const url = buildWhatsAppUrl("Olá, pedido")
    expect(url).toBe(`https://wa.me/5585982255592?text=${encodeURIComponent("Olá, pedido")}`)
    expect(url).not.toContain("22%")
  })
})
