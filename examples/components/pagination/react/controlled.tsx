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
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const [page, setPage] = React.useState(1)
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <Pagination
        aria-label="Pagination"
        pageCount={10}
        page={page}
        onPageChange={(next, details) => {
          setPage(next)
          setReason(details.reason)
        }}
      >
        <PaginationList>
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious data-variant="ghost">
                  <ChevronLeftIcon />
                  <span data-slot="visually-hidden">Previous</span>
                </PaginationPrevious>
              </PaginationItem>
              {items.map((item) => (
                <PaginationItem key={item}>
                  {typeof item === "number" ? (
                    <PaginationLink data-variant="ghost" page={item} />
                  ) : (
                    <PaginationEllipsis>
                      <EllipsisIcon />
                    </PaginationEllipsis>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext data-variant="ghost">
                  <span data-slot="visually-hidden">Next</span>
                  <ChevronRightIcon />
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </Pagination>
      <output data-slot="output">
        Page {page}
        {reason && `, from ${reason}`}
      </output>
    </div>
  )
}

export { Example }
