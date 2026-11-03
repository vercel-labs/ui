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
    <Pagination aria-label="Pagination" pageCount={10}>
      <PaginationList className="flex flex-wrap items-center justify-center gap-1">
        {({ items }) => (
          <>
            <PaginationItem>
              <PaginationPrevious
                aria-label="Previous page"
                className={(state) =>
                  [
                    "inline-flex cursor-default size-8 items-center justify-center rounded-2xl border border-transparent outline-none transition-colors motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                    state.disabled ? "cursor-default opacity-50" : "hover:bg-muted",
                  ].join(" ")
                }
                render={(props, state) => (
                  <button {...props} title={state.disabled ? undefined : ["Page", state.page].join(" ")} />
                )}
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </PaginationPrevious>
            </PaginationItem>
            {items.map((item) => (
              <PaginationItem key={item}>
                {typeof item === "number" ? (
                  <PaginationLink
                    page={item}
                    className={(state) =>
                      [
                        "relative inline-flex cursor-default size-8 items-center justify-center rounded-2xl border border-transparent text-sm font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                        state.current ? "border-border bg-background hover:bg-muted" : "hover:bg-muted",
                      ].join(" ")
                    }
                  >
                    {(state) => (
                      <>
                        {state.page}
                        {state.current && (
                          <span aria-hidden className="absolute bottom-1 size-1 rounded-full bg-current" />
                        )}
                      </>
                    )}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis className="flex size-8 items-center justify-center">
                    <Ellipsis className="size-4" />
                  </PaginationEllipsis>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                aria-label="Next page"
                className={(state) =>
                  [
                    "inline-flex cursor-default size-8 items-center justify-center rounded-2xl border border-transparent outline-none transition-colors motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                    state.disabled ? "cursor-default opacity-50" : "hover:bg-muted",
                  ].join(" ")
                }
                render={(props, state) => (
                  <button {...props} title={state.disabled ? undefined : ["Page", state.page].join(" ")} />
                )}
              >
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
