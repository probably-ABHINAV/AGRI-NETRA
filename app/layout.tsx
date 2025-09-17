import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import AppShell from "@/components/app-shell"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language"

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
  title: "AgriNetra - Premium Smart Crop Advisory System",
  description:
    "World-class AI-powered crop recommendations, pest detection, and smart farming solutions for modern agriculture. Transform your farming with cutting-edge technology.",
  generator: "AgriNetra",
  keywords: [
    "agriculture",
    "farming",
    "AI",
    "crop advisory",
    "smart farming",
    "pest detection",
    "IoT sensors",
    "precision agriculture",
    "sustainable farming",
    "agricultural technology",
  ],
  authors: [{ name: "AgriNetra Team" }],
  creator: "AgriNetra",
  publisher: "AgriNetra",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agrinetra.com",
    title: "AgriNetra - Premium Smart Crop Advisory System",
    description: "Transform your farming with world-class AI-powered agricultural solutions",
    siteName: "AgriNetra",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriNetra - Premium Smart Crop Advisory System",
    description: "Transform your farming with world-class AI-powered agricultural solutions",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <LanguageProvider>
            <AppShell>
              <Suspense fallback={null}>{children}</Suspense>
            </AppShell>
          </LanguageProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}