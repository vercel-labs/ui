import "@ui-sdk/web/pagination"
import { ChevronLeft, ChevronRight, createElement, Ellipsis } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-pagination aria-label="Pagination" page-count="10">
      <ui-pagination-list>
        <ui-pagination-item>
          <ui-pagination-previous>
            <a data-variant="ghost">
              ${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML}
              <span data-slot="visually-hidden">Previous</span>
            </a>
          </ui-pagination-previous>
        </ui-pagination-item>
        <template>
          <ui-pagination-item>
            <ui-pagination-link>
              <a data-variant="ghost"></a>
            </ui-pagination-link>
          </ui-pagination-item>
        </template>
        <template data-ellipsis>
          <ui-pagination-item>
            <ui-pagination-ellipsis>${createElement(Ellipsis, { "aria-hidden": "true" }).outerHTML}</ui-pagination-ellipsis>
          </ui-pagination-item>
        </template>
        <ui-pagination-item>
          <ui-pagination-next>
            <a data-variant="ghost">
              <span data-slot="visually-hidden">Next</span>
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </a>
          </ui-pagination-next>
        </ui-pagination-item>
      </ui-pagination-list>
    </ui-pagination>
  `
  root.querySelector("ui-pagination")!.getHref = (page) => `#page-${page}`
}

export { mount }
