import Link from "next/link"
import { FrameworkPicker } from "./site-preferences"
import { Logo, VercelLogo } from "./logo"
import { SearchTrigger } from "./search"
import { HeaderMenu } from "./header-menu"

function SiteHeader({ urls }: { urls: string[] }) {
  return (
    <header className="sticky top-0 z-10 hidden bg-canvas/85 backdrop-blur-md lg:block">
      <div className="container flex h-16 items-center">
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Vercel"
            className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <VercelLogo className="h-5 w-auto" />
          </a>
          <span aria-hidden className="text-lg font-light text-foreground/20">
            /
          </span>
          <Link
            href="/"
            aria-label="ui-sdk home"
            className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <Logo className="h-5 w-auto" />
          </Link>
          <span aria-hidden className="text-lg font-light text-foreground/20">
            /
          </span>
          <FrameworkPicker urls={urls} />
        </div>
        <div className="ms-auto flex items-center gap-4">
          <HeaderMenu />
          <SearchTrigger
            label="Search the docs"
            shortcut
            className="flex h-8 w-48 items-center gap-2.5 whitespace-nowrap rounded-2xl bg-foreground/[0.045] px-3 text-sm text-subtle outline-none transition-colors hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
