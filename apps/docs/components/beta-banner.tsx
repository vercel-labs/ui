"use client"

import { ArrowUpRightIcon } from "lucide-react"
import { usePathname } from "next/navigation"

const betaTerms = "https://vercel.com/docs/release-phases/public-beta-agreement"

// Docs pages show the notice as a card beside the page instead.
function BetaBanner() {
  if (usePathname().startsWith("/docs")) return null
  return (
    <aside
      data-beta-banner
      aria-label="Beta notice"
      className="sticky top-0 z-20 flex h-9 items-center justify-center bg-muted px-4 dark:bg-canvas text-center text-xs text-muted-foreground sm:text-sm"
    >
      <p>
        UI SDK is in beta.{" "}
        <a
          href={betaTerms}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm font-medium text-foreground underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          Learn more
        </a>
        .
      </p>
    </aside>
  )
}

// Reads like the column around it: a hairline, then the notice.
function BetaCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mb-4 h-px bg-foreground/10" />
      <p className="text-[13px] leading-5 text-balance text-subtle">
        UI SDK is in beta, so some APIs may still change.{" "}
        <a
          href={betaTerms}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-sm font-medium whitespace-nowrap text-foreground underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          Learn more
          <ArrowUpRightIcon aria-hidden className="size-3.5" />
        </a>
      </p>
    </div>
  )
}

export { BetaBanner, BetaCard }
