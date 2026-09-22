"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buildOrderMessage, buildWhatsAppUrl, type WhatsAppLine } from "@/lib/whatsapp"

type CheckoutFormProps = {
  lines: WhatsAppLine[]
  total: number
  disabled: boolean
}

export function CheckoutForm({ lines, total, disabled }: CheckoutFormProps) {
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const customerName = name.trim()
    if (!customerName) {
      setError("Informe seu nome para enviar o pedido.")
      document.getElementById("cliente")?.focus()
      return
    }
    if (disabled || lines.length === 0) {
      setError("Adicione um produto antes de enviar o pedido.")
      return
    }

    setError("")
    const message = buildOrderMessage({
      customerName,
      notes,
      lines,
      total,
    })
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer")
  }

  return (
    <form className="space-y-3" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="cliente" className="text-base">
          Seu nome
        </Label>
        <Input
          id="cliente"
          name="nome"
          autoComplete="name"
          enterKeyHint="next"
          value={name}
          aria-invalid={error && !name.trim() ? true : undefined}
          aria-describedby={error ? "erro-pedido" : undefined}
          className="h-12 text-base"
          onChange={(event) => {
            setName(event.target.value)
            if (error) setError("")
          }}
        />
      </div>
      {showNotes ? (
        <div className="space-y-2">
          <Label htmlFor="observacoes" className="text-base">
            Observações (opcional)
          </Label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={notes}
            rows={2}
            className="w-full rounded-xl border border-input bg-transparent px-3 py-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      ) : (
        <Button type="button" variant="ghost" size="xl" className="w-full text-primary" onClick={() => setShowNotes(true)}>
          Escrever uma observação
        </Button>
      )}
      {error ? (
        <p id="erro-pedido" role="alert" className="text-base font-semibold text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="xl" className="h-14 w-full text-lg" disabled={disabled}>
        Enviar pedido pelo WhatsApp
      </Button>
      <p className="text-base text-muted-foreground">Sem pagamento aqui. A confirmação é no WhatsApp.</p>
    </form>
  )
}
