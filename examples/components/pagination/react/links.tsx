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

function Example() {
  return (
    <Pagination aria-label="Pagination" pageCount={10} getHref={(page) => `#page-${page}`}>
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
  )
}

export { Example }
