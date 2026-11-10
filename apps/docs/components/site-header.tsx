import Link from "next/link"
import { Logo, VercelLogo } from "./logo"
import { SearchTrigger } from "./search"
import { GitHubLink } from "./github-link"
import { HeaderMenu } from "./header-menu"
import { HeaderCopyPrompt } from "./copy-prompt"

function SiteHeader({ urls }: { urls: string[] }) {
  return (
    <header className="sticky top-0 z-10 hidden bg-canvas lg:block">
      <div className="container flex h-16 items-center">
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Vercel"
            className="hit-area rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <VercelLogo className="h-5 w-auto" />
          </a>
          <span aria-hidden className="text-lg font-light text-foreground/20">
            /
          </span>
          <Link
            href="/"
            aria-label="ui-sdk home"
            className="hit-area rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <Logo className="h-5 w-auto" />
          </Link>
        </div>
        <div className="ms-10">
          <HeaderMenu urls={urls} />
        </div>
        <div className="ms-auto flex items-center gap-4">
          <HeaderCopyPrompt registry={process.env.NPM_REGISTRY} />
          <SearchTrigger
            label="Search the docs"
            shortcut
            icon={false}
            className="flex h-8 w-48 items-center gap-2.5 whitespace-nowrap rounded-2xl border border-foreground px-3 text-sm text-subtle outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
          />
          <GitHubLink className="border border-foreground text-foreground hover:bg-foreground/[0.06]" />
        </div>
      </div>
      <div aria-hidden="true" className="container">
        <div className="relative h-[6px]">
          <span className="absolute inset-x-3.5 top-[5px] h-px bg-foreground [header:has(~[data-docs])_&]:bg-foreground/[0.06]" />
          <span className="pointer-events-none absolute size-[11px] text-foreground [header:has(~[data-docs])_&]:text-foreground/30 before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -start-[5px] top-0" />
          <span className="pointer-events-none absolute size-[11px] text-foreground [header:has(~[data-docs])_&]:text-foreground/30 before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40 -end-[5px] top-0" />
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
