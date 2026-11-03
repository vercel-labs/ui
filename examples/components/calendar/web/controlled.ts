import "@ui-sdk/web/calendar"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div>
      <ui-calendar default-value="2026-10-16" default-month="2026-10">
        <div data-slot="row">
          <ui-calendar-previous>
            <button data-variant="ghost">
              ${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-calendar-previous>
          <ui-calendar-heading></ui-calendar-heading>
          <ui-calendar-next>
            <button data-variant="ghost">
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-calendar-next>
        </div>
        <ui-calendar-grid>
          <ui-calendar-weekdays>
            <template><ui-calendar-weekday></ui-calendar-weekday></template>
          </ui-calendar-weekdays>
          <ui-calendar-weeks>
            <template><ui-calendar-day></ui-calendar-day></template>
          </ui-calendar-weeks>
        </ui-calendar-grid>
      </ui-calendar>
      <output data-slot="output">2026-10-16, showing 2026-10</output>
    </div>
  `
  const calendar = root.querySelector("ui-calendar")!
  const output = root.querySelector("output")!
  let value = calendar.value
  let month = calendar.month
  const show = (reason: string) => {
    output.textContent = `${String(value)}, showing ${month} (${reason})`
  }
  calendar.addEventListener("valuechange", (event) => {
    value = event.detail.value
    show(event.detail.reason)
  })
  calendar.addEventListener("monthchange", (event) => {
    month = event.detail.value
    show(event.detail.reason)
  })
}
