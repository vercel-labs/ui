import "@ui-sdk/web/date-picker"
import { Calendar, ChevronLeft, ChevronRight, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-date-picker default-value="2026-10-16">
      <div data-slot="row">
        <ui-date-picker-input><input aria-label="Due date" /></ui-date-picker-input>
        <ui-date-picker-trigger>
          <button>
            ${createElement(Calendar, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-date-picker-trigger>
      </div>
      <ui-date-picker-hint></ui-date-picker-hint>
      <ui-date-picker-content>
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
      </ui-date-picker-content>
      <p data-slot="hint">2026-10-16 (initial)</p>
    </ui-date-picker>
  `
  const picker = root.querySelector("ui-date-picker")!
  picker.addEventListener("valuechange", (event) => {
    root.querySelector("p")!.textContent = `${event.detail.value ?? "No date"} (${event.detail.reason})`
  })
}
