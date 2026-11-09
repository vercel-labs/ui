import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/solid/pagination"
import { render, type JSX } from "@solidjs/web"
import { createSignal, For, merge, omit } from "solid-js"

// A client-side router's link: it navigates without a page load, unless a
// handler before it prevented that.
function RouterLink(props: JSX.IntrinsicElements["a"]) {
  const onClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") {
      props.onClick(event)
    }
    if (event.defaultPrevented) {
      return
    }
    event.preventDefault()
    history.pushState(null, "", String(props.href))
  }
  const link = merge(omit(props, "onClick"), { onClick })
  return <a {...link} />
}

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Pagination
        aria-label="Results pages"
        pageCount={5}
        getHref={(page) => `#results-${page}`}
        onPageChange={(page, details) => {
          if (page === 4) {
            return details.cancel()
          }
          setAction(`page: ${page}`)
        }}
      >
        <PaginationList class="pagination-list">
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious
                  render={(props) => <RouterLink {...props} />}
                  class="pagination-step"
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>
              <For each={items}>
                {(item) => (
                  <PaginationItem>
                    <PaginationLink
                      page={item as number}
                      render={(props) => <RouterLink {...props} />}
                      class={(state) =>
                        `pagination-link ${state.current ? "is-active" : "is-inactive"}`
                      }
                    >
                      {(state) => (
                        <>
                          {state.page}
                          {state.current && <span aria-hidden="true">•</span>}
                        </>
                      )}
                    </PaginationLink>
                  </PaginationItem>
                )}
              </For>
              <PaginationItem>
                <PaginationNext
                  render={(props, state) => (
                    <RouterLink {...props} data-target={state.page} />
                  )}
                  class="pagination-step"
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
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
