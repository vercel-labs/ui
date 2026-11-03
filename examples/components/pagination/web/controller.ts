import "@ui-sdk/web/pagination"
import { createElement, Ellipsis } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-pagination aria-label="Pagination" page-count="10">
        <ui-pagination-list>
          <template>
            <ui-pagination-item>
              <ui-pagination-link>
                <button data-variant="ghost"></button>
              </ui-pagination-link>
            </ui-pagination-item>
          </template>
          <template data-ellipsis>
            <ui-pagination-item>
              <ui-pagination-ellipsis>${createElement(Ellipsis, { "aria-hidden": "true" }).outerHTML}</ui-pagination-ellipsis>
            </ui-pagination-item>
          </template>
        </ui-pagination-list>
      </ui-pagination>
      <div data-slot="row">
        <button data-variant="secondary" type="button" data-action="previous">Previous</button>
        <button data-variant="secondary" type="button" data-action="next">Next</button>
        <button data-variant="secondary" type="button" data-action="go">Go to page 5</button>
      </div>
      <output data-slot="output">Page 1 of 10</output>
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
