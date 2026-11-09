import { VercelLogo } from "./logo"
import { ThemeToggle } from "./theme-toggle"

function SiteFooter() {
  return (
    <footer className="container">
      <div aria-hidden="true" className="relative h-px">
        <span className="absolute inset-x-3.5 top-0 h-px bg-foreground [body:has([data-docs])_&]:bg-foreground/[0.06]" />
        <span className="pointer-events-none absolute -top-[5px] size-[11px] text-foreground [body:has([data-docs])_&]:text-foreground/30 before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -start-[5px]" />
        <span className="pointer-events-none absolute -top-[5px] size-[11px] text-foreground [body:has([data-docs])_&]:text-foreground/30 before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -end-[5px]" />
      </div>
      <div className="flex items-center justify-between gap-4 py-8">
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
      </div>
    </footer>
  )
}

export { SiteFooter }
