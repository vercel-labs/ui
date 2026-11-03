import type { CalendarValue } from "@ui-sdk/core/calendar"
import { addMonths } from "@ui-sdk/core/date"
import "@ui-sdk/web/calendar"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-calendar default-value="2026-10-16">
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
          <div>
            <ui-calendar-weekday index="0"></ui-calendar-weekday>
            <ui-calendar-weekday index="1"></ui-calendar-weekday>
            <ui-calendar-weekday index="2"></ui-calendar-weekday>
            <ui-calendar-weekday index="3"></ui-calendar-weekday>
            <ui-calendar-weekday index="4"></ui-calendar-weekday>
            <ui-calendar-weekday index="5"></ui-calendar-weekday>
            <ui-calendar-weekday index="6"></ui-calendar-weekday>
          </div>
        </ui-calendar-weekdays>
        <ui-calendar-weeks>
          <template><ui-calendar-day></ui-calendar-day></template>
        </ui-calendar-weeks>
      </ui-calendar-grid>
      <p data-slot="hint"></p>
    </ui-calendar>
  `
  const calendar = root.querySelector("ui-calendar")!
  const previous = root.querySelector("ui-calendar-previous button")!
  const summary = root.querySelector("p")!
  const show = (value: CalendarValue, month: string) => {
    const mode = calendar.getAttribute("mode") ?? "single"
    const locked = calendar.hasAttribute("disabled") || calendar.hasAttribute("read-only")
    summary.textContent = `${mode}, ${value ?? "nothing"} selected in ${month}${locked ? " (locked)" : ""}`
    previous.setAttribute("title", `Show ${addMonths(`${month}-01`, -1).slice(0, 7)}`)
  }
  show(calendar.value, calendar.month)
  calendar.addEventListener("valuechange", (event) => show(event.detail.value, calendar.month))
  calendar.addEventListener("monthchange", (event) => show(calendar.value, event.detail.value))
}
