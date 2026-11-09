"use client"

import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  Pagination as PaginationPrimitive,
  PaginationPrevious,
} from "@ui-sdk/react/pagination"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"

const step =
  "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium text-foreground outline-none select-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 not-data-disabled:hover:bg-muted data-disabled:opacity-50 data-current:border-border data-current:bg-background motion-reduce:transition-none"

function RouterLink(props: ComponentProps<"a">) {
  return props.href ? <Link {...props} href={props.href} /> : <a {...props} />
}

function Pagination({
  page,
  pageCount,
  getHref,
}: {
  page: number
  pageCount: number
  getHref: (page: number) => string
}) {
  return (
    <PaginationPrimitive
      aria-label="Pages"
      page={page}
      pageCount={pageCount}
      getHref={getHref}
    >
      <PaginationList className="flex items-center gap-1">
        {({ items }) => (
          <>
            <PaginationItem>
              <PaginationPrevious render={RouterLink} className={step}>
                <ChevronLeft
                  aria-hidden="true"
                  className="size-4 rtl:rotate-180"
                />
                <span className="sr-only">Previous</span>
              </PaginationPrevious>
            </PaginationItem>
            {items.map((item) => (
              <PaginationItem key={item}>
                {typeof item === "number" ? (
                  <PaginationLink
                    page={item}
                    render={RouterLink}
                    className={step}
                  />
                ) : (
                  <PaginationEllipsis className="flex size-8 items-center justify-center text-muted-foreground">
                    <Ellipsis aria-hidden="true" className="size-4" />
                  </PaginationEllipsis>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext render={RouterLink} className={step}>
                <span className="sr-only">Next</span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 rtl:rotate-180"
                />
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </PaginationPrimitive>
  )
}

export { Pagination }
