import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import AppShell from "@/components/app-shell"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language"
import HighlightProvider from "@/components/highlight-provider"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "AgriNetra - Smart Crop Advisory System",
  description: "AI-powered agricultural guidance for farmers",
  icons: {
    icon: '/placeholder-logo.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans antialiased">
        <HighlightProvider>
          <ErrorBoundary>
            <LanguageProvider>
              <AppShell>
                <Suspense fallback={null}>{children}</Suspense>
              </AppShell>
            </LanguageProvider>
          </ErrorBoundary>
          <Analytics />
        </HighlightProvider>
      </body>
    </html>
  )
}