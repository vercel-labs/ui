import "@ui-sdk/web/pagination"
import { createElement, Ellipsis } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex flex-col items-center gap-3">
      <ui-pagination aria-label="Pagination" page-count="10">
        <ui-pagination-list class="flex flex-wrap items-center justify-center gap-1">
          <template>
            <ui-pagination-item>
              <ui-pagination-link>
                <button class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"></button>
              </ui-pagination-link>
            </ui-pagination-item>
          </template>
          <template data-ellipsis>
            <ui-pagination-item>
              <ui-pagination-ellipsis class="flex size-8 items-center justify-center">${createElement(Ellipsis, { class: "size-4", "aria-hidden": "true" }).outerHTML}</ui-pagination-ellipsis>
            </ui-pagination-item>
          </template>
        </ui-pagination-list>
      </ui-pagination>
      <div class="flex flex-wrap justify-center gap-2">
        <button type="button" data-action="previous" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none">Previous</button>
        <button type="button" data-action="next" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none">Next</button>
        <button type="button" data-action="go" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none">Go to page 5</button>
      </div>
      <output class="text-sm text-muted-foreground">Page 1 of 10</output>
    </div>
  `
  const pagination = root.querySelector("ui-pagination")!
  const pages = pagination.api
  root.querySelector('[data-action="previous"]')!.addEventListener("click", () => pages.previous())
  root.querySelector('[data-action="next"]')!.addEventListener("click", () => pages.next())
  root.querySelector('[data-action="go"]')!.addEventListener("click", () => pages.setPage(5))
  pagination.addEventListener("pagechange", (event) => {
    root.querySelector("output")!.textContent = `Page ${event.detail.value} of ${pages.getPageCount()}`
  })
}

export { mount }
