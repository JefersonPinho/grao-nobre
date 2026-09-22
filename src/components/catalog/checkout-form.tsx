"use client"

import { FormEvent, useEffect, useState } from "react"
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
  const [toast, setToast] = useState("")

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(""), 7000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const customerName = name.trim()
    if (!customerName) {
      const message = "Escreva seu nome para enviar o pedido."
      setError(message)
      setToast(message)
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
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="cliente" className="text-base font-semibold">
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
          className="h-12 rounded-xl bg-background text-base"
          onChange={(event) => {
            setName(event.target.value)
            if (error) setError("")
            if (toast) setToast("")
          }}
        />
      </div>
      {showNotes ? (
        <div className="space-y-2">
          <Label htmlFor="observacoes" className="text-base font-semibold">
            Observações (opcional)
          </Label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={notes}
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      ) : (
        <Button type="button" variant="outline" size="xl" className="w-full bg-background" onClick={() => setShowNotes(true)}>
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
      <p className="rounded-xl bg-secondary px-4 py-3 text-center text-base leading-snug font-semibold text-foreground">
        Sem pagamento aqui.
        <br />
        A confirmação é no WhatsApp.
      </p>
      {toast ? (
        <div
          role="alert"
          className="fixed top-4 right-4 left-4 z-[80] mx-auto max-w-md rounded-2xl border-2 border-destructive bg-card px-5 py-4 text-lg font-bold text-foreground shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </form>
  )
}
