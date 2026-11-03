import "@ui-sdk/web/date-picker"
import { Calendar, ChevronLeft, ChevronRight, createElement } from "lucide"

let count = 0

function mount(root: HTMLElement) {
  const id = `date-picker-booking-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <ui-date-picker mode="range" months="2" page-by="page" min-days="2" max-days="14" unavailable="2026-10-24" allow-unavailable start-name="checkin" end-name="checkout" form="${id}" default-month="2026-10">
        <div data-slot="row">
          <ui-date-picker-input><input aria-label="Check in" /></ui-date-picker-input>
          <span data-slot="hint">–</span>
          <ui-date-picker-input end><input aria-label="Check out" /></ui-date-picker-input>
          <ui-date-picker-trigger>
            <button data-variant="ghost">
              ${createElement(Calendar, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-date-picker-trigger>
        </div>
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
          <div data-slot="stack">
            <ui-calendar-grid>
              <ui-calendar-weekdays>
                <template><ui-calendar-weekday></ui-calendar-weekday></template>
              </ui-calendar-weekdays>
              <ui-calendar-weeks>
                <template><ui-calendar-day></ui-calendar-day></template>
              </ui-calendar-weeks>
            </ui-calendar-grid>
            <ui-calendar-grid offset="1">
              <ui-calendar-weekdays>
                <template><ui-calendar-weekday></ui-calendar-weekday></template>
              </ui-calendar-weekdays>
              <ui-calendar-weeks>
                <template><ui-calendar-day></ui-calendar-day></template>
              </ui-calendar-weeks>
            </ui-calendar-grid>
          </div>
        </ui-date-picker-content>
      </ui-date-picker>
      <form id="${id}">
        <button type="submit">Book</button>
      </form>
      <p data-slot="hint">Ranges include 2 to 14 days, and may cross the booked 24th.</p>
    </div>
  `
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = [...new FormData(form)].map(([name, value]) => `${name}=${value}`)
    root.querySelector("p")!.textContent = data.join("&")
  })
}

export { mount }
