import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import AppClientWrapper from "./components/AppClientWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SysTAB",
  description: "Sistema de Gerenciamento de Tablets da Secretaria de Saúde",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AppClientWrapper>{children}</AppClientWrapper>
      </body>
    </html>
  )
}
