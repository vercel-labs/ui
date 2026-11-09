import { createCalendarController } from "@ui-sdk/core/calendar"
import type { UiCalendarElement } from "@ui-sdk/web"
import {
  calendarAction,
  calendarFixture as f,
  calendarOptions,
} from "tests/fixtures/calendar.ts"

// URL options go in as attributes, never as markup, so a crafted URL can't add elements.
function setAttributes(
  el: Element,
  attributes: Record<string, string | number | boolean | null | undefined>
) {
  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined || value === null || value === false) {
      continue
    }
    el.setAttribute(name, value === true ? "" : String(value))
  }
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/calendar")
  // Web components have no controlled mode: the element owns its state, and
  // `value` and `month` set where it starts.
  const {
    controlled,
    selects,
    lang,
    defaultValue,
    defaultMonth,
    unavailable,
    ...options
  } = calendarOptions()
  const value = Array.isArray(defaultValue)
    ? defaultValue.join(",")
    : defaultValue
  const grids = Array.from(
    { length: options.months ?? 1 },
    (_, offset) =>
      `<ui-calendar-grid class="calendar-grid" offset="${offset}"></ui-calendar-grid>`
  ).join("")
  const selectParts = selects
    ? "<ui-calendar-month-select></ui-calendar-month-select><ui-calendar-year-select></ui-calendar-year-select>"
    : ""
  const template = document.createElement("template")
  template.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-calendar class="calendar">
        <div class="calendar-header">
          <ui-calendar-previous><button class="calendar-step">‹</button></ui-calendar-previous>
          <ui-calendar-heading class="calendar-heading"></ui-calendar-heading>${selectParts}
          <ui-calendar-next><button class="calendar-step">›</button></ui-calendar-next>
        </div>
        <div class="calendar-months">${grids}</div>
      </ui-calendar>
      <button id="go">${f.controller.label}</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>`
  // Set before the elements reach the page, so they start with these options.
  setAttributes(template.content.querySelector(".fixture")!, { lang })
  setAttributes(template.content.querySelector("ui-calendar")!, {
    today: f.today,
    mode: options.mode,
    [controlled ? "value" : "default-value"]: value,
    [controlled ? "month" : "default-month"]: defaultMonth,
    min: options.min,
    max: options.max,
    months: options.months,
    "page-by": options.pageBy,
    "week-starts-on": options.weekStartsOn,
    "fixed-weeks": options.fixedWeeks,
    "show-outside-days":
      options.showOutsideDays === false ? "false" : undefined,
    "min-days": options.minDays,
    "max-days": options.maxDays,
    "allow-unavailable": options.allowUnavailable,
    disabled: options.disabled,
    "read-only": options.readOnly,
  })
  root.replaceChildren(template.content)
  const calendar = root.querySelector<UiCalendarElement>("ui-calendar")!
  const status = root.querySelector("output")!
  const controller = createCalendarController()
  calendar.controller = controller
  if (unavailable) {
    calendar.unavailable = unavailable
  }
  calendar.addEventListener("valuechange", (event) => {
    status.textContent = calendarAction(
      "value",
      event.detail.value,
      event.detail.reason
    )
  })
  calendar.addEventListener("monthchange", (event) => {
    status.textContent = calendarAction(
      "month",
      event.detail.value,
      event.detail.reason
    )
  })
  root
    .querySelector("#go")!
    .addEventListener("click", () => controller.focus(f.controller.date))
}

export { mount }
