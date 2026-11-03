import "@ui-sdk/web/pagination"
import { ChevronLeft, ChevronRight, createElement, Ellipsis } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex flex-col items-center gap-3">
      <ui-pagination aria-label="Pagination" page-count="10">
        <ui-pagination-list class="flex flex-wrap items-center justify-center gap-1">
          <ui-pagination-item>
            <ui-pagination-previous>
              <a class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50">
                ${createElement(ChevronLeft, { class: "size-4 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
                <span class="sr-only">Previous</span>
              </a>
            </ui-pagination-previous>
          </ui-pagination-item>
          <template>
            <ui-pagination-item>
              <ui-pagination-link>
                <a class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"></a>
              </ui-pagination-link>
            </ui-pagination-item>
          </template>
          <template data-ellipsis>
            <ui-pagination-item>
              <ui-pagination-ellipsis class="flex size-8 items-center justify-center">${createElement(Ellipsis, { class: "size-4", "aria-hidden": "true" }).outerHTML}</ui-pagination-ellipsis>
            </ui-pagination-item>
          </template>
          <ui-pagination-item>
            <ui-pagination-next>
              <a class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50">
                <span class="sr-only">Next</span>
                ${createElement(ChevronRight, { class: "size-4 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
              </a>
            </ui-pagination-next>
          </ui-pagination-item>
        </ui-pagination-list>
      </ui-pagination>
      <output class="text-sm text-muted-foreground">Route: ?page=1</output>
    </div>
  `
  root.querySelector("ui-pagination")!.getHref = (page) => `?page=${page}`
  root.addEventListener("click", (event) => {
    const link = (event.target as Element).closest("a[href]")
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    history.replaceState(history.state, "", link.getAttribute("href"))
    root.querySelector("output")!.textContent = `Route: ${link.getAttribute("href")}`
  })
}

export { mount }
