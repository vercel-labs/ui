import type { UiWaterfallElement } from "@ui-sdk/web/waterfall"
import { flatWaterfall, waterfallFixture } from "tests/fixtures/waterfall.ts"
import { kitchenSink, type Env } from "./shell"
import { barLabels, formats, items, type Variant } from "./variants"

const columns = `
  <ui-waterfall-header-row>
    <ui-waterfall-column-header>Name</ui-waterfall-column-header>
    <ui-waterfall-column-header>Status</ui-waterfall-column-header>
    <ui-waterfall-column-header aria-label="Timeline">
      <ui-waterfall-axis max-ticks="4"></ui-waterfall-axis>
      <ui-waterfall-mark time="${waterfallFixture.mark.time}">${waterfallFixture.mark.label}</ui-waterfall-mark>
    </ui-waterfall-column-header>
  </ui-waterfall-header-row>
  ${flatWaterfall(items)
    .map(
      (span) => `
        <ui-waterfall-row value="${span.value}">
          <ui-waterfall-row-header>${
            span.children
              ? "<ui-waterfall-indicator></ui-waterfall-indicator>"
              : ""
          }${span.label}</ui-waterfall-row-header>
          <ui-waterfall-cell>${span.status}</ui-waterfall-cell>
          <ui-waterfall-bar></ui-waterfall-bar>
        </ui-waterfall-row>`
    )
    .join("")}
`

// Options as attributes, lists separated by commas.
function attributes(options: Variant["options"]) {
  return Object.entries(options)
    .map(
      ([name, value]) =>
        ` ${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${value}"`
    )
    .join("")
}

function listen(waterfall: UiWaterfallElement, env: Env) {
  for (const name of ["valuechange", "expandedchange"]) {
    waterfall.addEventListener(name, (event) => {
      const { value, reason } = (
        event as CustomEvent<{ value: unknown; reason: string }>
      ).detail
      env.log(`${name} ${JSON.stringify(value)} (${reason})`)
    })
  }
}

async function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    slot.innerHTML = `<ui-waterfall aria-label="${waterfallFixture.label}"${attributes(variant.options)}>${variant.columns ? columns : ""}</ui-waterfall>`
    const waterfall = slot.firstElementChild as UiWaterfallElement
    // Rich options are properties, set here before the elements upgrade.
    waterfall.items = items
    waterfall.range = variant.range
    if (variant.format) {
      waterfall.format = formats[variant.format]
    }
    if (variant.barLabel) {
      waterfall.getBarLabel = barLabels[variant.barLabel]
    }
    listen(waterfall, env)
    if (variant.controller) {
      env.controls([
        ["expandAll()", () => waterfall.api.expandAll()],
        ["collapseAll()", () => waterfall.api.collapseAll()],
        ["reveal('flags')", () => waterfall.api.reveal("flags")],
      ])
    }
  })
  await import("@ui-sdk/web/waterfall")
}

export { mount }
