import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/solid/pagination"
import type { JSX } from "@solidjs/web"
import { createSignal, For, merge, omit } from "solid-js"

function Link(props: JSX.IntrinsicElements["a"] & { onNavigate: (href: string) => void }) {
  const onClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") {
      props.onClick(event)
    }
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    history.replaceState(history.state, "", String(props.href))
    props.onNavigate(String(props.href))
  }
  const link = merge(omit(props, "onNavigate", "onClick"), { onClick })
  return <a {...link} />
}

function Example() {
  const [route, setRoute] = createSignal("?page=1")
  const page = () => Number(route().replace("?page=", ""))

  return (
    <div data-slot="stack">
      <Pagination aria-label="Pagination" pageCount={10} page={page()} getHref={(page) => `?page=${page}`}>
        <PaginationList>
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious
                  data-variant="ghost"
                  render={(props) => <Link {...props} onNavigate={setRoute} />}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  <span data-slot="visually-hidden">Previous</span>
                </PaginationPrevious>
              </PaginationItem>
              <For each={items}>
                {(item) => (
                  <PaginationItem>
                    {typeof item === "number" ? (
                      <PaginationLink
                        data-variant="ghost"
                        page={item}
                        render={(props) => <Link {...props} onNavigate={setRoute} />}
                      />
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
              <PaginationItem>
                <PaginationNext
                  data-variant="ghost"
                  render={(props) => <Link {...props} onNavigate={setRoute} />}
                >
                  <span data-slot="visually-hidden">Next</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </Pagination>
      <output data-slot="output">Route: {route()}</output>
    </div>
  )
}

export { Example }
