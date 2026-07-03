import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "AI Workspace - Your AI-Powered Productivity Suite",
  description:
    "A comprehensive AI-powered platform with tools for chat, writing, coding, image generation, resume building, translation, and document analysis.",
  keywords: ["AI", "workspace", "chat", "writer", "code generator", "image generator"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-surface text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
