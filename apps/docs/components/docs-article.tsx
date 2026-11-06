import { PageToc } from "@/components/page-toc"
import { pageDate } from "@/lib/page-date"
import type { TableOfContents } from "fumadocs-core/toc"
import Link from "next/link"
import type { ReactNode } from "react"

type Neighbour = { name: ReactNode; url: string }

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
        <article className="w-full xl:max-w-2xl px-6 pt-8 pb-24 sm:px-8 lg:px-10">
          <header className="mb-10">
            {date && (
              <time dateTime={date} className="mb-3 block text-[13px] text-subtle">
                {pageDate(date)}
              </time>
            )}
            <h1 className="text-[28px] leading-tight font-medium tracking-[-0.02em] text-balance">{title}</h1>
            {description && (
              <p className="mt-3 text-[17px] leading-relaxed sm:text-[15px] text-pretty text-subtle">
                {description}
              </p>
            )}
          </header>
          {children}
          {(previous || next) && (
            <nav aria-label="Pages" className="mt-20 grid grid-cols-2 gap-4 border-t border-border/70 pt-6">
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
                  <span className="group-hover:underline group-hover:underline-offset-4">{next.name}</span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
      <PageToc toc={toc} url={url} />
    </>
  )
}

export { DocsArticle }
