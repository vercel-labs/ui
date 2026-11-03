import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@ui-sdk/solid/pagination"
import { createSignal, For } from "solid-js"

function Example() {
  const pages = createPaginationController()
  const [status, setStatus] = createSignal("Page 1 of 10")

  return (
    <div class="flex flex-col items-center gap-3">
      <Pagination
        aria-label="Pagination"
        pageCount={10}
        controller={pages}
        onPageChange={(page) => setStatus(`Page ${page} of ${pages.getPageCount()}`)}
      >
        <PaginationList class="flex flex-wrap items-center justify-center gap-1">
          {({ items }) => (
            <For each={items}>
              {(item) => (
                <PaginationItem>
                  {typeof item === "number" ? (
                    <PaginationLink
                      page={item}
                      class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"
                    />
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
          )}
        </PaginationList>
      </Pagination>
      <div class="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => pages.previous()}
          class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => pages.next()}
          class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => pages.setPage(5)}
          class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        >
          Go to page 5
        </button>
      </div>
      <output class="text-sm text-muted-foreground">{status()}</output>
    </div>
  )
}

export { Example }
