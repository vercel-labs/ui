import { ArrowUpRightIcon } from "lucide-react"

// Reads like the column around it: a hairline, then the notice.
function BetaCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mb-4 h-px bg-foreground/10" />
      <p className="text-[13px] leading-5 text-balance text-subtle">
        UI SDK is in beta, so some APIs may still change.{" "}
        <a
          href="https://vercel.com/docs/release-phases/public-beta-agreement"
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

export { BetaCard }
