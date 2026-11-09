import { createPaginationController } from "@ui-sdk/core/pagination"
import type { UiPaginationElement } from "@ui-sdk/web"
import * as classes from "./classes"
import { kitchenSink } from "./shell"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/pagination")
  kitchenSink(root, "web", (slot, variant, env) => {
    const attributes = Object.entries(variant.options ?? {})
      .map(([key, value]) => `${kebab(key)}="${value}"`)
      .join(" ")
    const tag = variant.links ? "a" : "button"
    const text = variant.steps === "text"
    const step = (name: string, label: string | undefined, content: string) =>
      `<ui-pagination-item><ui-pagination-${name}><${tag} class="${classes.step}"${label ? ` aria-label="${label}"` : ""}>${content}</${tag}></ui-pagination-${name}></ui-pagination-item>`
    slot.innerHTML = `
      <ui-pagination aria-label="${variant.title}" ${attributes}>
        <ui-pagination-list class="${classes.list}">
          ${text ? "" : step("first", "First page", "«")}
          ${step("previous", text ? undefined : "Previous page", text ? "‹ Previous" : "‹")}
          <template><ui-pagination-item><ui-pagination-link><${tag} class="${classes.link}"></${tag}></ui-pagination-link></ui-pagination-item></template>
          <template data-ellipsis><ui-pagination-item><ui-pagination-ellipsis class="${classes.ellipsis}">…</ui-pagination-ellipsis></ui-pagination-item></template>
          ${step("next", text ? undefined : "Next page", text ? "Next ›" : "›")}
          ${text ? "" : step("last", "Last page", "»")}
        </ui-pagination-list>
      </ui-pagination>`
    const pagination = slot.querySelector<UiPaginationElement>("ui-pagination")!
    if (variant.links) {
      pagination.getHref = (target) => `#kitchen-${variant.id}-${target}`
    }
    pagination.addEventListener("pagechange", (event) => {
      if (variant.cancel) {
        return event.preventDefault()
      }
      env.log(
        `pageChange ${event.detail.value} (${event.detail.reason}, ${event.detail.source})`
      )
    })
    if (!variant.controller) {
      return
    }
    const controller = createPaginationController()
    pagination.controller = controller
    env.controls([
      ["next()", () => controller.next()],
      ["previous()", () => controller.previous()],
      ["first()", () => controller.first()],
      ["last()", () => controller.last()],
      ["setPage(5)", () => controller.setPage(5)],
      ["getPage()", () => controller.getPage()],
      ["getPageCount()", () => controller.getPageCount()],
    ])
  })
}

export { mount }
