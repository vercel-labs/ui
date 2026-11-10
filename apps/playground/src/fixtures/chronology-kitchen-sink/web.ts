import { createChronologyController } from "@ui-sdk/core/chronology"
import type { UiChronologyElement } from "@ui-sdk/web"
import * as classes from "./classes"
import { kitchenSink } from "./shell"
import type { Event, Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const details = (event: Event) => `
  <ui-collapsible class="col-start-2">
    <ui-collapsible-trigger><button type="button" class="${classes.link}">Details</button></ui-collapsible-trigger>
    <ui-collapsible-panel class="${classes.description}" hidden>Handled by the ${event.title.toLowerCase()} team.</ui-collapsible-panel>
  </ui-collapsible>`

const item = (variant: Variant, event: Event) => `
  <ui-chronology-item class="${classes.item}" value="${event.value}"${event.status ? ` status="${event.status}"` : ""}>
    <ui-chronology-marker class="${classes.marker}"></ui-chronology-marker>
    <ui-chronology-connector class="${classes.connector}"></ui-chronology-connector>
    <ui-chronology-title class="${classes.title}">${event.title}</ui-chronology-title>
    <ui-chronology-time class="${classes.time}"><time datetime="${event.dateTime}">${event.time}</time></ui-chronology-time>
    <ui-chronology-description class="${classes.description}">${event.description}</ui-chronology-description>
    ${event.link ? `<a class="${classes.link}" href="#${event.value}">${event.link}</a>` : ""}
    ${variant.details ? details(event) : ""}
  </ui-chronology-item>`

async function mount(root: HTMLElement) {
  await Promise.all([
    import("@ui-sdk/web/chronology"),
    import("@ui-sdk/web/collapsible"),
  ])
  kitchenSink(root, "web", (slot, variant, env) => {
    const attributes = Object.entries(variant.options ?? {})
      .map(([key, value]) => `${kebab(key)}="${value === true ? "" : value}"`)
      .join(" ")
    slot.innerHTML = `
      <ui-chronology class="${classes.root}" aria-label="${variant.title}" ${attributes}>
        ${variant.events.map((event) => item(variant, event)).join("")}
      </ui-chronology>`
    const chronology = slot.querySelector<UiChronologyElement>("ui-chronology")!
    chronology.addEventListener("focusin", (event) => {
      const target = event.target as HTMLElement
      if (target.localName === "ui-chronology-item") {
        env.log(`focus ${target.getAttribute("value")}`)
      }
    })
    if (!variant.controller) {
      return
    }
    const controller = createChronologyController()
    chronology.controller = controller
    env.controls([
      ['focus("shipped")', () => controller.focus("shipped")],
      ["focus()", () => controller.focus()],
    ])
  })
}

export { mount }
