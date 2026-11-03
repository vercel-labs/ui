import "@ui-sdk/web/calendar"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div>
    <ui-calendar mode="range">
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
      <output data-slot="output">Focus on no date yet</output>
    </div>
  `
  const calendar = root.querySelector("ui-calendar")!
  const output = root.querySelector("output")!
  let anchor: string | null = null
  let focused: string | null = null
  const show = () => {
    output.textContent = anchor
      ? `Started on ${anchor}, focus on ${focused}`
      : `Focus on ${focused ?? "no date yet"}`
  }
  calendar.addEventListener("anchorchange", (event) => {
    anchor = event.detail.value
    show()
  })
  calendar.addEventListener("focusedchange", (event) => {
    focused = event.detail.value
    show()
  })
}

export { mount }
