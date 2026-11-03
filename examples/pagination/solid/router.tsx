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
    <div class="flex flex-col items-center gap-3">
      <Pagination aria-label="Pagination" pageCount={10} page={page()} getHref={(page) => `?page=${page}`}>
        <PaginationList class="flex flex-wrap items-center justify-center gap-1">
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious
                  render={(props) => <Link {...props} onNavigate={setRoute} />}
                  class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
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
                  <span class="sr-only">Previous</span>
                </PaginationPrevious>
              </PaginationItem>
              <For each={items}>
                {(item) => (
                  <PaginationItem>
                    {typeof item === "number" ? (
                      <PaginationLink
                        page={item}
                        render={(props) => <Link {...props} onNavigate={setRoute} />}
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
              <PaginationItem>
                <PaginationNext
                  render={(props) => <Link {...props} onNavigate={setRoute} />}
                  class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
                >
                  <span class="sr-only">Next</span>
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
      <output class="text-sm text-muted-foreground">Route: {route()}</output>
    </div>
  )
}

export { Example }
