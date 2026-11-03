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
    <div data-slot="stack">
      <Pagination aria-label="Pagination" pageCount={10} page={page} getHref={(page) => `?page=${page}`}>
        <PaginationList>
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious data-variant="ghost" render={<Link onNavigate={setRoute} />}>
                  <ChevronLeftIcon />
                  <span data-slot="visually-hidden">Previous</span>
                </PaginationPrevious>
              </PaginationItem>
              {items.map((item) => (
                <PaginationItem key={item}>
                  {typeof item === "number" ? (
                    <PaginationLink
                      data-variant="ghost"
                      page={item}
                      render={<Link onNavigate={setRoute} />}
                    />
                  ) : (
                    <PaginationEllipsis>
                      <EllipsisIcon />
                    </PaginationEllipsis>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext data-variant="ghost" render={<Link onNavigate={setRoute} />}>
                  <span data-slot="visually-hidden">Next</span>
                  <ChevronRightIcon />
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </Pagination>
      <output data-slot="output">Route: {route}</output>
    </div>
  )
}

export { Example }
