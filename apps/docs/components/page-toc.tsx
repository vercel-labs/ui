"use client"

import { cn } from "cn"
import {
  AnchorProvider,
  useActiveAnchor,
  type TableOfContents,
} from "fumadocs-core/toc"
import { ArrowUpRight, CircleArrowUp } from "lucide-react"
import { BetaCard } from "./beta-card"

function PageToc({ toc, url }: { toc: TableOfContents; url: string }) {
  const items = toc.filter((item) => item.depth <= 3)

  return (
    <nav
      aria-label="On this page"
      className="sticky p-1 ps-6 -m-1 top-[4.375rem] ms-auto hidden max-h-[calc(100dvh-4.375rem)] w-64 shrink-0 overflow-x-hidden overflow-y-auto overscroll-y-contain pt-10 pb-8 scrollbar-none xl:block"
    >
      {items.length > 1 && (
        <AnchorProvider toc={items} single>
          <div className="mb-2.5 font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
            On this page
          </div>
          <Items items={items} />
          <div className="my-4 h-px bg-foreground/10" />
        </AnchorProvider>
      )}
      <div className="flex flex-col gap-3">
        <a
          href={`${url}.md`}
          target="_blank"
          rel="noreferrer"
          className={action}
        >
          <ArrowUpRight aria-hidden className="size-4" />
          Open as Markdown
        </a>
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const reduce = matchMedia(
                "(prefers-reduced-motion: reduce)"
              ).matches
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
            }}
            className={action}
          >
            <CircleArrowUp aria-hidden className="size-4" />
            Scroll to top
          </button>
        )}
      </div>
      <BetaCard className="mt-4" />
    </nav>
  )
}

function Items({ items }: { items: TableOfContents }) {
  const active = useActiveAnchor()

  return (
    <ul className="-ms-6 flex flex-col">
      {items.map((item) => {
        const current = active === item.url.slice(1)
        return (
          <li key={item.url}>
            <a
              href={item.url}
              aria-current={current ? "location" : undefined}
              className={cn(
                "relative -ms-px block border-s py-[3px] text-[13px] leading-5 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
                item.depth > 2 ? "ps-9" : "ps-6",
                current
                  ? "border-foreground text-foreground"
                  : "border-transparent text-subtle hover:text-foreground"
              )}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

const action =
  "flex items-center gap-2 rounded-md text-[13px] leading-5 text-subtle outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"

export { PageToc }
