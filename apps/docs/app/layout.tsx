import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SitePreferences } from "@/components/site-preferences"
import { source } from "@/lib/source"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./global.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

const DESCRIPTION =
  "An open source library of behaviors that an agent can use to build components. Written in TypeScript. Available for all frameworks."

export const metadata: Metadata = {
  metadataBase: new URL("https://ui-sdk.dev"),
  title: { default: "UI SDK", template: "%s · UI SDK" },
  description: DESCRIPTION,
  openGraph: {
    title: "UI SDK",
    description: DESCRIPTION,
    url: "https://ui-sdk.dev",
    siteName: "UI SDK",
  },
  twitter: { card: "summary_large_image" },
}

export default function Layout({ children }: LayoutProps<"/">) {
  const urls = source.getPages().map((page) => page.url)

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-canvas font-sans text-foreground">
        <SitePreferences>
          <SiteHeader urls={urls} />
          {children}
          <SiteFooter />
        </SitePreferences>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
