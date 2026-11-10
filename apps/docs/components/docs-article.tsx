import { PageToc } from "@/components/page-toc"
import { pageDate } from "@/lib/page-date"
import type { TableOfContents } from "fumadocs-core/toc"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

type Neighbour = { name: ReactNode; url: string }

const pageButton =
  "hit-area inline-flex size-8 shrink-0 items-center justify-center bg-foreground/5 text-foreground outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/30 md:size-7"

function DocsArticle({
  title,
  description,
  date,
  previous,
  next,
  toc,
  url,
  children,
}: {
  title: ReactNode
  description?: ReactNode
  date?: string
  previous?: Neighbour
  next?: Neighbour
  toc: TableOfContents
  url: string
  children: ReactNode
}) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <article className="w-full xl:mx-auto xl:max-w-2xl min-[100rem]:max-w-3xl px-6 pt-8 pb-24 sm:px-8 lg:px-10 lg:pt-10">
          <header className="mb-10">
            {date && (
              <time
                dateTime={date}
                className="mb-3 block text-[13px] text-subtle"
              >
                {pageDate(date)}
              </time>
            )}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[28px] leading-tight font-medium tracking-[-0.02em] text-balance">
                {title}
              </h1>
              {(previous || next) && (
                <div className="flex h-[35px] shrink-0 items-center gap-2">
                  {previous && (
                    <Link href={previous.url} className={pageButton}>
                      <ArrowLeftIcon aria-hidden="true" className="size-4" />
                      <span className="sr-only">Previous: {previous.name}</span>
                    </Link>
                  )}
                  {next && (
                    <Link href={next.url} className={pageButton}>
                      <ArrowRightIcon aria-hidden="true" className="size-4" />
                      <span className="sr-only">Next: {next.name}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
            {description && (
              <p className="mt-3 text-[17px] leading-relaxed sm:text-[15px] text-pretty text-subtle">
                {description}
              </p>
            )}
          </header>
          {children}
          {(previous || next) && (
            <nav
              aria-label="Pages"
              className="mt-20 grid grid-cols-2 gap-4 border-t border-border/70 pt-6"
            >
              {previous ? (
                <Link
                  href={previous.url}
                  className="group flex flex-col gap-1 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <span className="text-[13px] text-subtle">Previous</span>
                  <span className="group-hover:underline group-hover:underline-offset-4">
                    {previous.name}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={next.url}
                  className="group flex flex-col items-end gap-1 rounded-md text-end text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <span className="text-[13px] text-subtle">Next</span>
                  <span className="group-hover:underline group-hover:underline-offset-4">
                    {next.name}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
      <div className="relative hidden shrink-0 border-s border-foreground/[0.06] xl:block">
        <PageToc toc={toc} url={url} />
      </div>
    </>
  )
}

export { DocsArticle }
