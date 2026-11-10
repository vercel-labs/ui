import { createTimelineController } from "@ui-sdk/core/timeline"
import type { UiTimelineElement } from "@ui-sdk/web"
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
  <ui-timeline-item class="${classes.item}" value="${event.value}"${event.status ? ` status="${event.status}"` : ""}>
    <ui-timeline-marker class="${classes.marker}"></ui-timeline-marker>
    <ui-timeline-connector class="${classes.connector}"></ui-timeline-connector>
    <ui-timeline-title class="${classes.title}">${event.title}</ui-timeline-title>
    <ui-timeline-time class="${classes.time}"><time datetime="${event.dateTime}">${event.time}</time></ui-timeline-time>
    <ui-timeline-description class="${classes.description}">${event.description}</ui-timeline-description>
    ${event.link ? `<a class="${classes.link}" href="#${event.value}">${event.link}</a>` : ""}
    ${variant.details ? details(event) : ""}
  </ui-timeline-item>`

async function mount(root: HTMLElement) {
  await Promise.all([
    import("@ui-sdk/web/timeline"),
    import("@ui-sdk/web/collapsible"),
  ])
  kitchenSink(root, "web", (slot, variant, env) => {
    const attributes = Object.entries(variant.options ?? {})
      .map(([key, value]) => `${kebab(key)}="${value === true ? "" : value}"`)
      .join(" ")
    slot.innerHTML = `
      <ui-timeline class="${classes.root}" aria-label="${variant.title}" ${attributes}>
        ${variant.events.map((event) => item(variant, event)).join("")}
      </ui-timeline>`
    const timeline = slot.querySelector<UiTimelineElement>("ui-timeline")!
    timeline.addEventListener("focusin", (event) => {
      const target = event.target as HTMLElement
      if (target.localName === "ui-timeline-item") {
        env.log(`focus ${target.getAttribute("value")}`)
      }
    })
    if (!variant.controller) {
      return
    }
    const controller = createTimelineController()
    timeline.controller = controller
    env.controls([
      ['focus("shipped")', () => controller.focus("shipped")],
      ["focus()", () => controller.focus()],
    ])
  })
}

export { mount }
