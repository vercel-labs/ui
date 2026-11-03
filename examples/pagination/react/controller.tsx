"use client"

import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@ui-sdk/react/pagination"
import { Ellipsis } from "lucide-react"
import * as React from "react"

function Example() {
  const [pages] = React.useState(createPaginationController)
  const [status, setStatus] = React.useState("Page 1 of 10")

  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination
        aria-label="Pagination"
        pageCount={10}
        controller={pages}
        onPageChange={(page) => setStatus(`Page ${page} of ${pages.getPageCount()}`)}
      >
        <PaginationList className="flex flex-wrap items-center justify-center gap-1">
          {({ items }) =>
            items.map((item) => (
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
            ))
          }
        </PaginationList>
      </Pagination>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => pages.previous()}
          className="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => pages.next()}
          className="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => pages.setPage(5)}
          className="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        >
          Go to page 5
        </button>
      </div>
      <output className="text-sm text-muted-foreground">{status}</output>
    </div>
  )
}

export { Example }
