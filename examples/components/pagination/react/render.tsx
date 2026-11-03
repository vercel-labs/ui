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
    <Pagination aria-label="Pagination" pageCount={10}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationItem>
              <PaginationPrevious
                data-variant="ghost"
                aria-label="Previous page"
                render={(props, state) => (
                  <button {...props} title={state.disabled ? undefined : ["Page", state.page].join(" ")} />
                )}
              >
                <ChevronLeftIcon />
              </PaginationPrevious>
            </PaginationItem>
            {items.map((item) => (
              <PaginationItem key={item}>
                {typeof item === "number" ? (
                  <PaginationLink page={item}>
                    {(state) => (
                      <>
                        {state.page}
                        {state.current && <span aria-hidden />}
                      </>
                    )}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis>
                    <EllipsisIcon />
                  </PaginationEllipsis>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                data-variant="ghost"
                aria-label="Next page"
                render={(props, state) => (
                  <button {...props} title={state.disabled ? undefined : ["Page", state.page].join(" ")} />
                )}
              >
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
