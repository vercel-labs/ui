import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./globals.css"

const metadata: Metadata = {
  title: "Tracker review",
  description: "Browse the tracker's code beside the running app.",
}

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-dvh flex-col overflow-hidden font-sans text-sm">{children}</body>
    </html>
  )
}

export default RootLayout
export { metadata }
