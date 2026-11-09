import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/solid/pagination"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  paginationAction,
  paginationFixture,
  paginationOptions,
} from "tests/fixtures/pagination.ts"

const pages = createPaginationController()

function Fixture() {
  const { controlled, cancel, rekey, defaultPage, ...options } =
    paginationOptions()
  const [action, setAction] = createSignal("")
  const [page, setPage] = createSignal(defaultPage ?? 1)
  const f = paginationFixture
  // With ?rekey, the list is made again on every page change, like a keyed React list.
  const list = () => (
    <PaginationList class="pagination-list">
      {({ items }) => (
        <>
          <PaginationItem>
            <PaginationFirst class="pagination-step" aria-label={f.first}>
              «
            </PaginationFirst>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious class="pagination-step" aria-label={f.previous}>
              ‹
            </PaginationPrevious>
          </PaginationItem>
          <For each={items}>
            {(item) => (
              <PaginationItem>
                {typeof item === "number" ? (
                  <PaginationLink class="pagination-link" page={item} />
                ) : (
                  <PaginationEllipsis class="pagination-ellipsis" />
                )}
              </PaginationItem>
            )}
          </For>
          <PaginationItem>
            <PaginationNext class="pagination-step" aria-label={f.next}>
              ›
            </PaginationNext>
          </PaginationItem>
          <PaginationItem>
            <PaginationLast class="pagination-step" aria-label={f.last}>
              »
            </PaginationLast>
          </PaginationItem>
        </>
      )}
    </PaginationList>
  )
  return (
    <div class="fixture">
      <button>Before</button>
      <Pagination
        aria-label={f.label}
        class="pagination"
        controller={pages}
        {...options}
        page={controlled ? page() : undefined}
        defaultPage={controlled ? undefined : defaultPage}
        onPageChange={(next, details) => {
          if (next === cancel) {
            return details.cancel()
          }
          setPage(next)
          setAction(paginationAction(next, details.reason))
        }}
      >
        <Show when={rekey ? page() : true} keyed>
          {list()}
        </Show>
      </Pagination>
      <button onClick={() => pages.setPage(f.controller.page)}>
        {f.controller.label}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
