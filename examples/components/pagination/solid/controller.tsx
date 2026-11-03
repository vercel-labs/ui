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
    <div data-slot="stack">
      <Pagination
        aria-label="Pagination"
        pageCount={10}
        controller={pages}
        onPageChange={(page) => setStatus(`Page ${page} of ${pages.getPageCount()}`)}
      >
        <PaginationList>
          {({ items }) => (
            <For each={items}>
              {(item) => (
                <PaginationItem>
                  {typeof item === "number" ? (
                    <PaginationLink data-variant="ghost" page={item} />
                  ) : (
                    <PaginationEllipsis>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
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
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => pages.previous()}>
          Previous
        </button>
        <button data-variant="secondary" type="button" onClick={() => pages.next()}>
          Next
        </button>
        <button data-variant="secondary" type="button" onClick={() => pages.setPage(5)}>
          Go to page 5
        </button>
      </div>
      <output data-slot="output">{status()}</output>
    </div>
  )
}

export { Example }
