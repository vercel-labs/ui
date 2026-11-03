"use client"

import { Pagination, PaginationItem, PaginationLink, PaginationList } from "@ui-sdk/react/pagination"

function Example() {
  return (
    <Pagination aria-label="Pagination" pageCount={5}>
      <PaginationList className="flex flex-wrap items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              page={page}
              className="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"
            />
          </PaginationItem>
        ))}
      </PaginationList>
    </Pagination>
  )
}

export { Example }
