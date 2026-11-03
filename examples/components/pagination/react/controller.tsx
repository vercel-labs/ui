"use client"

import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@ui-sdk/react/pagination"
import { EllipsisIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const [pages] = React.useState(createPaginationController)
  const [status, setStatus] = React.useState("Page 1 of 10")

  return (
    <div data-slot="stack">
      <Pagination
        aria-label="Pagination"
        pageCount={10}
        controller={pages}
        onPageChange={(page) => setStatus(`Page ${page} of ${pages.getPageCount()}`)}
      >
        <PaginationList>
          {({ items }) =>
            items.map((item) => (
              <PaginationItem key={item}>
                {typeof item === "number" ? (
                  <PaginationLink data-variant="ghost" page={item} />
                ) : (
                  <PaginationEllipsis>
                    <EllipsisIcon />
                  </PaginationEllipsis>
                )}
              </PaginationItem>
            ))
          }
        </PaginationList>
      </Pagination>
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => pages.previous()}>
          Previous
        </button>
        <button data-variant="secondary" type="button" onClick={() => pages.next()}>
          Next
        </button>
        <button data-variant="secondary" type="button" onClick={() => pages.setPage(5)}>
          Go to page 5
        </button>
      </div>
      <output data-slot="output">{status}</output>
    </div>
  )
}

export { Example }
