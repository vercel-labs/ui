import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination"
import * as React from "react"
import { createRoot } from "react-dom/client"

// A client-side router's link: it navigates without a page load, unless a
// handler before it prevented that.
function RouterLink({ onClick, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        history.pushState(null, "", props.href)
      }}
    />
  )
}

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <Pagination
        aria-label="Results pages"
        pageCount={5}
        getHref={(page) => `#results-${page}`}
        onPageChange={(page, details) => {
          if (page === 4) return details.cancel()
          setAction(`page: ${page}`)
        }}
      >
        <PaginationList className="pagination-list">
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious render={<RouterLink />} className="pagination-step">
                  Previous
                </PaginationPrevious>
              </PaginationItem>
              {items.map((item) => (
                <PaginationItem key={item}>
                  <PaginationLink
                    page={item as number}
                    render={<RouterLink />}
                    className={(state) => `pagination-link ${state.current ? "is-active" : "is-inactive"}`}
                  >
                    {(state) => (
                      <>
                        {state.page}
                        {state.current && <span aria-hidden="true">•</span>}
                      </>
                    )}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  render={(props, state) => <RouterLink {...props} data-target={state.page} />}
                  className="pagination-step"
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </Pagination>
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
    </React.StrictMode>,
  )
}

export { mount }
