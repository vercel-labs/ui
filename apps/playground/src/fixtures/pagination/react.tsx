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
} from "@ui-sdk/react/pagination"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  paginationAction,
  paginationFixture,
  paginationOptions,
} from "tests/fixtures/pagination.ts"

const pages = createPaginationController()

function Fixture() {
  const { controlled, cancel, rekey, defaultPage, ...options } =
    paginationOptions()
  const [action, setAction] = React.useState("")
  const [page, setPage] = React.useState(defaultPage ?? 1)
  const f = paginationFixture
  return (
    <div className="fixture">
      <button>Before</button>
      <Pagination
        aria-label={f.label}
        className="pagination"
        controller={pages}
        {...options}
        {...(controlled ? { page } : { defaultPage })}
        onPageChange={(next, details) => {
          if (next === cancel) {
            return details.cancel()
          }
          setPage(next)
          setAction(paginationAction(next, details.reason))
        }}
      >
        <PaginationList
          className="pagination-list"
          key={rekey ? page : undefined}
        >
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationFirst
                  className="pagination-step"
                  aria-label={f.first}
                >
                  «
                </PaginationFirst>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  className="pagination-step"
                  aria-label={f.previous}
                >
                  ‹
                </PaginationPrevious>
              </PaginationItem>
              {items.map((item) => (
                <PaginationItem key={item}>
                  {typeof item === "number" ? (
                    <PaginationLink className="pagination-link" page={item} />
                  ) : (
                    <PaginationEllipsis className="pagination-ellipsis" />
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext className="pagination-step" aria-label={f.next}>
                  ›
                </PaginationNext>
              </PaginationItem>
              <PaginationItem>
                <PaginationLast className="pagination-step" aria-label={f.last}>
                  »
                </PaginationLast>
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </Pagination>
      <button onClick={() => pages.setPage(f.controller.page)}>
        {f.controller.label}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
