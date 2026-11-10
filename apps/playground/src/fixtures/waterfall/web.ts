import type { UiWaterfallElement } from "@ui-sdk/web/waterfall"
import {
  describeWaterfall,
  flatWaterfall,
  waterfallFixture,
  waterfallOptions,
} from "tests/fixtures/waterfall.ts"

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

const rows = flatWaterfall(waterfallFixture.items)
  .map(
    (span) => `
      <ui-waterfall-row value="${span.value}">
        <ui-waterfall-row-header>${
          span.children
            ? "<ui-waterfall-indicator></ui-waterfall-indicator>"
            : ""
        }${escape(span.label)}</ui-waterfall-row-header>
        <ui-waterfall-cell>${span.status}</ui-waterfall-cell>
        <ui-waterfall-bar></ui-waterfall-bar>
      </ui-waterfall-row>`
  )
  .join("")

async function mount(root: HTMLElement) {
  const { cancel, range, defaultExpanded, defaultValue } = waterfallOptions()
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-waterfall aria-label="${waterfallFixture.label}">
        <ui-waterfall-header-row>
          <ui-waterfall-column-header>Name</ui-waterfall-column-header>
          <ui-waterfall-column-header>Status</ui-waterfall-column-header>
          <ui-waterfall-column-header aria-label="Timeline">
            <ui-waterfall-axis></ui-waterfall-axis>
            <ui-waterfall-mark time="${waterfallFixture.mark.time}">${waterfallFixture.mark.label}</ui-waterfall-mark>
          </ui-waterfall-column-header>
        </ui-waterfall-header-row>
        ${rows}
      </ui-waterfall>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <button data-call="expandAll">Expand all</button>
      <button data-call="collapseAll">Collapse all</button>
      <button data-call="reveal">Reveal flags</button>
      <button data-call="zoom">Zoom</button>
    </div>
  `
  const waterfall = root.querySelector<UiWaterfallElement>("ui-waterfall")!
  if (defaultExpanded.length) {
    waterfall.setAttribute("default-expanded", defaultExpanded.join(","))
  }
  if (defaultValue) {
    waterfall.setAttribute("default-value", defaultValue)
  }
  waterfall.items = waterfallFixture.items
  waterfall.range = range
  const status = root.querySelector("output")!
  const report = (kind: string) => (event: Event) => {
    const value = (event as CustomEvent<{ value: string | string[] | null }>)
      .detail.value
    if (
      kind === "expanded" &&
      cancel &&
      (value as string[]).includes(cancel) &&
      !waterfall.api.isExpanded(cancel)
    ) {
      return event.preventDefault()
    }
    status.textContent = describeWaterfall(kind, value)
  }
  waterfall.addEventListener("valuechange", report("selected"))
  waterfall.addEventListener("expandedchange", report("expanded"))
  for (const button of root.querySelectorAll<HTMLElement>("[data-call]")) {
    button.addEventListener("click", () => {
      const call = button.dataset.call
      if (call === "reveal") {
        waterfall.api.reveal("flags")
      } else if (call === "zoom") {
        waterfall.range = [500, 1000]
      } else {
        waterfall.api[call as "expandAll" | "collapseAll"]()
      }
    })
  }
  await import("@ui-sdk/web/waterfall")
}

export { mount }
