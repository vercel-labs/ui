"use client"

import { Pagination, PaginationItem, PaginationLink, PaginationList } from "@ui-sdk/react/pagination"

function Example() {
  return (
    <Pagination aria-label="Pagination" pageCount={5}>
      <PaginationList>
        {[1, 2, 3, 4, 5].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink data-variant="ghost" page={page} />
          </PaginationItem>
        ))}
      </PaginationList>
    </Pagination>
  )
}

export { Example }
