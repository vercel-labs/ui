import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  Pagination as PaginationPrimitive,
  PaginationPrevious,
} from "@ui-sdk/solid/pagination"
import { For } from "solid-js"
import { ChevronLeft, ChevronRight, Ellipsis } from "@/components/icons"

const step =
  "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium text-foreground outline-none select-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 not-data-disabled:hover:bg-muted data-disabled:opacity-50 aria-[current=page]:border-border aria-[current=page]:bg-background motion-reduce:transition-none"

function Pagination(props: { page: number; pageCount: number; getHref: (page: number) => string }) {
  return (
    <PaginationPrimitive
      aria-label="Pages"
      page={props.page}
      pageCount={props.pageCount}
      getHref={props.getHref}
    >
      <PaginationList class="flex items-center gap-1">
        {(state) => (
          <>
            <PaginationItem>
              <PaginationPrevious class={step}>
                <ChevronLeft aria-hidden="true" class="size-4 rtl:rotate-180" />
                <span class="sr-only">Previous</span>
              </PaginationPrevious>
            </PaginationItem>
            <For each={state.items}>
              {(item) => (
                <PaginationItem>
                  {typeof item === "number" ? (
                    <PaginationLink page={item} class={step} />
                  ) : (
                    <PaginationEllipsis class="flex size-8 items-center justify-center text-muted-foreground">
                      <Ellipsis aria-hidden="true" class="size-4" />
                    </PaginationEllipsis>
                  )}
                </PaginationItem>
              )}
            </For>
            <PaginationItem>
              <PaginationNext class={step}>
                <span class="sr-only">Next</span>
                <ChevronRight aria-hidden="true" class="size-4 rtl:rotate-180" />
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </PaginationPrimitive>
  )
}

export { Pagination }
