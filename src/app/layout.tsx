import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2c5c40",
}

const description =
  "Catálogo Grão Nobre. Escolha a quantidade, monte seu pedido e envie pelo WhatsApp."

export const metadata: Metadata = {
  title: {
    default: "Grão Nobre - Produtos Naturais",
    template: "%s | Grão Nobre - Produtos Naturais",
  },
  description,
  applicationName: "Grão Nobre - Produtos Naturais",
  manifest: "/logo/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/logo/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/logo/favicon/apple-touch-icon.png",
  },
  appleWebApp: {
    title: "Grão Nobre - Produtos Naturais",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Grão Nobre - Produtos Naturais",
    description,
    locale: "pt_BR",
    type: "website",
    siteName: "Grão Nobre - Produtos Naturais",
    images: [
      {
        url: "/logo/favicon/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "Grão Nobre - Produtos Naturais",
      },
    ],
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
