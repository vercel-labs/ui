import type { UiPaginationElement } from "@ui-sdk/web"

// Web components bind whatever link they wrap. A router listens for clicks on the page.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-pagination aria-label="Results pages" page-count="5">
        <ui-pagination-list class="pagination-list">
          <ui-pagination-item><ui-pagination-previous><a class="pagination-step">Previous</a></ui-pagination-previous></ui-pagination-item>
          <template><ui-pagination-item><ui-pagination-link><a class="pagination-link"></a></ui-pagination-link></ui-pagination-item></template>
          <ui-pagination-item><ui-pagination-next><a class="pagination-step">Next</a></ui-pagination-next></ui-pagination-item>
        </ui-pagination-list>
      </ui-pagination>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/pagination")
  const pagination = root.querySelector<UiPaginationElement>("ui-pagination")!
  pagination.getHref = (page) => `#results-${page}`
  pagination.addEventListener("pagechange", (event) => {
    if (event.detail.value === 4) {
      return event.preventDefault()
    }
    root.querySelector("output")!.textContent = `page: ${event.detail.value}`
  })
  // A client-side router: links navigate without a page load.
  root.addEventListener("click", (event) => {
    const link = (event.target as Element).closest("a[href]")
    if (!link || event.defaultPrevented) {
      return
    }
    event.preventDefault()
    history.pushState(null, "", link.getAttribute("href"))
  })
}

export { mount }
