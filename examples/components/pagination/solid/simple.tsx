import { Pagination, PaginationItem, PaginationLink, PaginationList } from "@ui-sdk/solid/pagination"
import { For } from "solid-js"

function Example() {
  return (
    <Pagination aria-label="Pagination" pageCount={5}>
      <PaginationList>
        <For each={[1, 2, 3, 4, 5]}>
          {(page) => (
            <PaginationItem>
              <PaginationLink data-variant="ghost" page={page} />
            </PaginationItem>
          )}
        </For>
      </PaginationList>
    </Pagination>
  )
}

export { Example }
