"use client"

import { Leaf } from "lucide-react"
import { useState } from "react"
import { cn } from "cn"

type ProductImageProps = {
  src: string
  name: string
  className?: string
}

function syncImageStatus(image: HTMLImageElement, setStatus: (status: "ready" | "missing") => void) {
  if (!image.complete) return
  setStatus(image.naturalWidth > 0 ? "ready" : "missing")
}

export function ProductImage({ src, name, className }: ProductImageProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading")
  const letter = name.trim().charAt(0).toLocaleUpperCase("pt-BR")

  return (
    <div className={cn("relative aspect-[4/3] w-full overflow-hidden bg-secondary", className)}>
      {status !== "missing" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${status === "ready" ? "opacity-100" : "opacity-0"}`}
          ref={(node) => {
            if (node) syncImageStatus(node, setStatus)
          }}
          onLoad={(event) => syncImageStatus(event.currentTarget, setStatus)}
          onError={() => setStatus("missing")}
        />
      ) : null}
      {status !== "ready" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-primary" aria-hidden="true">
          <Leaf className="size-8 opacity-80" />
          <span className="text-4xl leading-none font-bold">{letter}</span>
        </div>
      ) : null}
    </div>
  )
}
