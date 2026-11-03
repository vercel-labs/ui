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
import * as React from "react"

function Link({ onNavigate, ...props }: React.ComponentProps<"a"> & { onNavigate: (href: string) => void }) {
  return (
    <a
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return
        }
        event.preventDefault()
        history.replaceState(history.state, "", props.href)
        onNavigate(props.href!)
      }}
    />
  )
}

function Example() {
  const [route, setRoute] = React.useState("?page=1")
  const page = Number(route.replace("?page=", ""))

  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination aria-label="Pagination" pageCount={10} page={page} getHref={(page) => `?page=${page}`}>
        <PaginationList className="flex flex-wrap items-center justify-center gap-1">
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious
                  render={<Link onNavigate={setRoute} />}
                  className="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
                >
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                  <span className="sr-only">Previous</span>
                </PaginationPrevious>
              </PaginationItem>
              {items.map((item) => (
                <PaginationItem key={item}>
                  {typeof item === "number" ? (
                    <PaginationLink
                      page={item}
                      render={<Link onNavigate={setRoute} />}
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
                <PaginationNext
                  render={<Link onNavigate={setRoute} />}
                  className="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </Pagination>
      <output className="text-sm text-muted-foreground">Route: {route}</output>
    </div>
  )
}

export { Example }
