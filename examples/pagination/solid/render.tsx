import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/solid/pagination"
import { For } from "solid-js"

function Example() {
  return (
    <Pagination aria-label="Pagination" pageCount={10}>
      <PaginationList class="flex flex-wrap items-center justify-center gap-1">
        {({ items }) => (
          <>
            <PaginationItem>
              <PaginationPrevious
                aria-label="Previous page"
                class={(state) =>
                  [
                    "inline-flex cursor-default size-8 items-center justify-center rounded-2xl border border-transparent outline-none transition-colors motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                    state.disabled ? "cursor-default opacity-50" : "hover:bg-muted",
                  ].join(" ")
                }
                render={(props, state) => (
                  <button {...props} title={state.disabled ? undefined : ["Page", state.page].join(" ")} />
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4 rtl:rotate-180"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </PaginationPrevious>
            </PaginationItem>
            <For each={items}>
              {(item) => (
                <PaginationItem>
                  {typeof item === "number" ? (
                    <PaginationLink
                      page={item}
                      class={(state) =>
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
                            <span
                              aria-hidden="true"
                              class="absolute bottom-1 size-1 rounded-full bg-current"
                            />
                          )}
                        </>
                      )}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis class="flex size-8 items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="size-4"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </PaginationEllipsis>
                  )}
                </PaginationItem>
              )}
            </For>
            <PaginationItem>
              <PaginationNext
                aria-label="Next page"
                class={(state) =>
                  [
                    "inline-flex cursor-default size-8 items-center justify-center rounded-2xl border border-transparent outline-none transition-colors motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                    state.disabled ? "cursor-default opacity-50" : "hover:bg-muted",
                  ].join(" ")
                }
                render={(props, state) => (
                  <button {...props} title={state.disabled ? undefined : ["Page", state.page].join(" ")} />
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4 rtl:rotate-180"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </Pagination>
  )
}

export { Example }
