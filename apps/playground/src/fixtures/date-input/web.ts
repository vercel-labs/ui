import "@ui-sdk/web/date-input"
import "@ui-sdk/web/field"
import "@ui-sdk/web/time-input"
import type {
  DateInputEvents,
  UiDateInputElement,
  UiTimeInputElement,
} from "@ui-sdk/web"
import {
  dateInputAction,
  dateInputFixture as f,
  dateInputOptions,
} from "tests/fixtures/date-input.ts"

// URL options go in as attributes, never as markup, so a crafted URL can't add elements.
function setAttributes(el: Element, options: Record<string, unknown>) {
  for (const [key, value] of Object.entries(options)) {
    if (value === undefined || value === false) {
      continue
    }
    el.setAttribute(
      key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
      value === true ? "" : String(value)
    )
  }
}

function mount(root: HTMLElement) {
  const { date, time, cancel, ...shared } = dateInputOptions()
  const { unavailable, ...dateAttributes } = date
  const template = document.createElement("template")
  template.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form aria-label="${f.form.label}">
        <ui-field class="field" name="${f.date.name}">
          <ui-field-label>${f.date.label}</ui-field-label>
          <ui-date-input id="date" class="date-input"></ui-date-input>
          <ui-field-error class="field-error"></ui-field-error>
        </ui-field>
        <ui-field class="field" name="${f.time.name}">
          <ui-field-label>${f.time.label}</ui-field-label>
          <ui-time-input id="time" class="date-input"></ui-time-input>
        </ui-field>
        <button type="submit">${f.form.submit}</button>
        <button type="reset">${f.form.reset}</button>
      </form>
      <button id="set">Set date</button>
      <button id="clear">Clear date</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output id="submitted" aria-label="Submitted"></output>
    </div>
  `
  // Set before the elements reach the page, so they start with these options.
  setAttributes(template.content.querySelector("#date")!, {
    ...dateAttributes,
    ...shared,
  })
  setAttributes(template.content.querySelector("#time")!, {
    ...time,
    ...shared,
  })
  root.replaceChildren(template.content)
  const dateInput = root.querySelector<UiDateInputElement>("#date")!
  const timeInput = root.querySelector<UiTimeInputElement>("#time")!
  if (unavailable) {
    dateInput.unavailable = unavailable
  }
  const status = root.querySelector("output")!
  dateInput.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as DateInputEvents["valuechange"]).detail
    if (cancel && value === cancel) {
      return event.preventDefault()
    }
    status.textContent = dateInputAction.change("date", value, reason)
  })
  timeInput.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as DateInputEvents["valuechange"]).detail
    status.textContent = dateInputAction.change("time", value, reason)
  })
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("#submitted")!.textContent = JSON.stringify([
      ...new FormData(form),
    ])
  })
  root
    .querySelector("#set")!
    .addEventListener("click", () => dateInput.api.setValue(f.filled))
  root
    .querySelector("#clear")!
    .addEventListener("click", () => dateInput.api.clear())
}

export { mount }
