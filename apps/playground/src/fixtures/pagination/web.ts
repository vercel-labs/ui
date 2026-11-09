import { createPaginationController } from "@ui-sdk/core/pagination"
import type { UiPaginationElement } from "@ui-sdk/web"
import {
  paginationAction,
  paginationFixture as f,
  paginationOptions,
} from "tests/fixtures/pagination.ts"

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/pagination")
  // Web components have no controlled mode: the element owns its state.
  const { cancel, defaultPage, pageCount, siblings, boundaries, getHref } =
    paginationOptions()
  const tag = getHref ? "a" : "button"
  const attributes = [
    `page-count="${pageCount}"`,
    defaultPage !== undefined && `default-page="${defaultPage}"`,
    siblings !== undefined && `siblings="${siblings}"`,
    boundaries !== undefined && `boundaries="${boundaries}"`,
  ]
    .filter(Boolean)
    .join(" ")
  const step = (name: string, label: string, text: string) =>
    `<ui-pagination-item><ui-pagination-${name}><${tag} class="pagination-step" aria-label="${label}">${text}</${tag}></ui-pagination-${name}></ui-pagination-item>`
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-pagination class="pagination" aria-label="${f.label}" ${attributes}>
        <ui-pagination-list class="pagination-list">
          ${step("first", f.first, "«")}
          ${step("previous", f.previous, "‹")}
          <template><ui-pagination-item><ui-pagination-link><${tag} class="pagination-link"></${tag}></ui-pagination-link></ui-pagination-item></template>
          <template data-ellipsis><ui-pagination-item><ui-pagination-ellipsis class="pagination-ellipsis">…</ui-pagination-ellipsis></ui-pagination-item></template>
          ${step("next", f.next, "›")}
          ${step("last", f.last, "»")}
        </ui-pagination-list>
      </ui-pagination>
      <button id="go">${f.controller.label}</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>`
  const pagination = root.querySelector<UiPaginationElement>("ui-pagination")!
  const status = root.querySelector("output")!
  const pages = createPaginationController()
  pagination.controller = pages
  if (getHref) {
    pagination.getHref = getHref
  }
  pagination.addEventListener("pagechange", (event) => {
    if (event.detail.value === cancel) {
      return event.preventDefault()
    }
    status.textContent = paginationAction(
      event.detail.value,
      event.detail.reason
    )
  })
  root
    .querySelector("#go")!
    .addEventListener("click", () => pages.setPage(f.controller.page))
}

export { mount }
