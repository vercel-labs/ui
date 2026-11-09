import type { UiDatePickerElement } from "@ui-sdk/web"
import {
  datePickerAction,
  datePickerFixture as f,
  datePickerOptions,
} from "tests/fixtures/date-picker.ts"

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
  await import("@ui-sdk/web/date-picker")
  // Web components have no controlled mode: `default-value` sets where the value starts.
  const { lang, container, ...options } = datePickerOptions()
  const range = options.mode === "range"
  const preset = range ? f.rangePreset : f.preset
  const list = (value: string | string[] | null | undefined) =>
    Array.isArray(value) ? value.join(",") : value
  const template = document.createElement("template")
  template.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form>
        <label for="date-start">${range ? "Stay" : "Due date"}</label>
        <ui-date-picker class="date-picker">
          <ui-date-picker-input><input id="date-start"${range ? ' aria-label="Start date"' : ""} /></ui-date-picker-input>
          ${range ? '<ui-date-picker-input end><input aria-label="End date" /></ui-date-picker-input>' : ""}
          <ui-date-picker-trigger></ui-date-picker-trigger>
          <ui-date-picker-clear><button>Clear</button></ui-date-picker-clear>
          <ui-date-picker-hint class="date-picker-hint"></ui-date-picker-hint>
          <ui-date-picker-content class="date-picker-content">
            <div class="calendar-header">
              <ui-calendar-previous><button class="calendar-step">‹</button></ui-calendar-previous>
              <ui-calendar-heading class="calendar-heading"></ui-calendar-heading>
              <ui-calendar-next><button class="calendar-step">›</button></ui-calendar-next>
            </div>
            <ui-calendar-grid class="calendar-grid"></ui-calendar-grid>
            <ui-date-picker-preset value="${list(preset.value)}"><button>${preset.label}</button></ui-date-picker-preset>
          </ui-date-picker-content>
        </ui-date-picker>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Submitted"></output>
    </div>`
  // Set before the elements reach the page, so they start with these options.
  setAttributes(template.content.querySelector(".fixture")!, { lang })
  setAttributes(template.content.querySelector("ui-date-picker")!, {
    today: f.today,
    mode: options.mode,
    name: range ? undefined : f.name,
    "start-name": range ? "start" : undefined,
    "end-name": range ? "end" : undefined,
    "default-value": list(options.defaultValue),
    min: options.min,
    max: options.max,
    unavailable: list(options.unavailable),
    required: options.required,
    disabled: options.disabled,
    "read-only": options.readOnly,
    "close-on-select": options.closeOnSelect === false ? "false" : undefined,
    "min-days": options.minDays,
    "max-days": options.maxDays,
    container: container ? `#${container.id}` : undefined,
  })
  root.replaceChildren(template.content)
  const picker = root.querySelector<UiDatePickerElement>("ui-date-picker")!
  const form = root.querySelector("form")!
  const [action, submitted] = root.querySelectorAll("output")
  picker.addEventListener("valuechange", (event) => {
    action!.textContent = datePickerAction(
      "value",
      event.detail.value,
      event.detail.reason
    )
  })
  picker.addEventListener("openchange", (event) => {
    action!.textContent = datePickerAction(
      "open",
      event.detail.value,
      event.detail.reason
    )
  })
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    submitted!.textContent = JSON.stringify([...new FormData(form)])
  })
}

export { mount }
