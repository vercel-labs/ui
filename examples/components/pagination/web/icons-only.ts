import "@ui-sdk/web/pagination"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-pagination aria-label="Pagination" page-count="10">
      <ui-pagination-list>
        <ui-pagination-item>
          <ui-pagination-first>
            <button data-variant="ghost" aria-label="First page">
              ${createElement(ChevronsLeft, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-pagination-first>
        </ui-pagination-item>
        <ui-pagination-item>
          <ui-pagination-previous>
            <button data-variant="ghost" aria-label="Previous page">
              ${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-pagination-previous>
        </ui-pagination-item>
        <ui-pagination-item>
          <span aria-live="polite">Page 1 of 10</span>
        </ui-pagination-item>
        <ui-pagination-item>
          <ui-pagination-next>
            <button data-variant="ghost" aria-label="Next page">
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-pagination-next>
        </ui-pagination-item>
        <ui-pagination-item>
          <ui-pagination-last>
            <button data-variant="ghost" aria-label="Last page">
              ${createElement(ChevronsRight, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-pagination-last>
        </ui-pagination-item>
      </ui-pagination-list>
    </ui-pagination>
  `
  const pagination = root.querySelector("ui-pagination")!
  const status = root.querySelector("[aria-live]")!
  pagination.addEventListener("pagechange", (event) => {
    status.textContent = `Page ${event.detail.value} of ${pagination.api.getPageCount()}`
  })
}

export { mount }
