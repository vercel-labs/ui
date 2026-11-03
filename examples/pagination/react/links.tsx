"use client"

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"

function Example() {
  return (
    <Pagination aria-label="Pagination" pageCount={10} getHref={(page) => `#page-${page}`}>
      <PaginationList className="flex flex-wrap items-center justify-center gap-1">
        {({ items }) => (
          <>
            <PaginationItem>
              <PaginationPrevious className="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50">
                <ChevronLeft className="size-4 rtl:rotate-180" />
                <span className="sr-only">Previous</span>
              </PaginationPrevious>
            </PaginationItem>
            {items.map((item) => (
              <PaginationItem key={item}>
                {typeof item === "number" ? (
                  <PaginationLink
                    page={item}
                    className="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"
                  />
                ) : (
                  <PaginationEllipsis className="flex size-8 items-center justify-center">
                    <Ellipsis className="size-4" />
                  </PaginationEllipsis>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext className="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50">
                <span className="sr-only">Next</span>
                <ChevronRight className="size-4 rtl:rotate-180" />
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </Pagination>
  )
}

export { Example }
