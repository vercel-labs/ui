"use client"

import {
  Pagination,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"

function Example() {
  return (
    <Pagination aria-label="Pagination" pageCount={10}>
      <PaginationList>
        {({ page, pageCount }) => (
          <>
            <PaginationItem>
              <PaginationFirst data-variant="ghost" aria-label="First page">
                <ChevronsLeftIcon />
              </PaginationFirst>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious data-variant="ghost" aria-label="Previous page">
                <ChevronLeftIcon />
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <span aria-live="polite">
                Page {page} of {pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext data-variant="ghost" aria-label="Next page">
                <ChevronRightIcon />
              </PaginationNext>
            </PaginationItem>
            <PaginationItem>
              <PaginationLast data-variant="ghost" aria-label="Last page">
                <ChevronsRightIcon />
              </PaginationLast>
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </Pagination>
  )
}

export { Example }
