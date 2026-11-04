import { VercelLogo } from "./logo"
import { ThemeToggle } from "./theme-toggle"

function SiteFooter() {
  return (
    <footer className="container flex items-center justify-between gap-4 py-8">
      <div className="flex items-center gap-4">
        <a
          href="https://vercel.com"
          aria-label="Vercel"
          className="hit-area rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <VercelLogo className="h-4 w-auto" />
        </a>
        <p className="hidden text-[13px] text-subtle sm:block">
          The{" "}
          <a
            href="https://github.com/vercel-labs/ui"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground"
          >
            source code
          </a>{" "}
          is available on GitHub.
        </p>
      </div>
      <ThemeToggle />
    </footer>
  )
}

export { SiteFooter }
