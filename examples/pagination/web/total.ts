import "@ui-sdk/web/pagination"
import { ChevronLeft, ChevronRight, createElement, Ellipsis } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex flex-col items-center gap-3">
      <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <p class="tabular-nums">Showing 21–40 of 95</p>
        <label class="flex items-center gap-2">
          Rows per page
          <select class="h-8 cursor-default rounded-2xl border border-transparent bg-input/50 px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none">
            <option value="10">10</option>
            <option value="20" selected>20</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
      <ui-pagination aria-label="Pagination" total="95" page-size="20" default-page="2">
        <ui-pagination-list class="flex flex-wrap items-center justify-center gap-1">
          <ui-pagination-item>
            <ui-pagination-previous>
              <button class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50">
                ${createElement(ChevronLeft, { class: "size-4 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
                <span class="sr-only">Previous</span>
              </button>
            </ui-pagination-previous>
          </ui-pagination-item>
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
          <ui-pagination-item>
            <ui-pagination-next>
              <button class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50">
                <span class="sr-only">Next</span>
                ${createElement(ChevronRight, { class: "size-4 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-pagination-next>
          </ui-pagination-item>
        </ui-pagination-list>
      </ui-pagination>
    </div>
  `
  const pagination = root.querySelector("ui-pagination")!
  const select = root.querySelector("select")!
  const showing = (page: number) => {
    const size = Number(select.value)
    root.querySelector("p")!.textContent =
      `Showing ${(page - 1) * size + 1}–${Math.min(page * size, 95)} of 95`
  }
  pagination.addEventListener("pagechange", (event) => showing(event.detail.value))
  select.addEventListener("change", () => {
    pagination.setAttribute("page-size", select.value)
    pagination.page = 1
    showing(1)
  })
}

export { mount }
