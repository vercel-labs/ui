import type { Metadata } from "next"
import type { ReactNode } from "react"
import { listIssues } from "@/app/data"
import { Header } from "@/components/header"
import { Confirmer } from "@/components/ui/alert-dialog"
import { Toaster } from "@/components/ui/toast"
import "./globals.css"

const metadata: Metadata = {
  title: "Tracker",
  description: "An issue tracker built with ui-sdk.",
}

async function RootLayout({ children }: { children: ReactNode }) {
  const issues = await listIssues()
  return (
    <html lang="en">
      <body className="flex h-dvh flex-col overflow-hidden font-sans text-sm">
        <Header issues={issues.map(({ id, title }) => ({ id, title }))} />
        {children}
        <Toaster />
        <Confirmer />
      </body>
    </html>
  )
}

export default RootLayout
export { metadata }
