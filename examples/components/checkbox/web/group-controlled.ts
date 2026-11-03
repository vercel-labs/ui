import "@ui-sdk/web/checkbox"
import { Check, createElement } from "lucide"

const days = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
]

const weekdays = ["mon", "tue", "wed", "thu", "fri"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <h3 id="controlled-days">Working days</h3>
      <ui-checkbox-group aria-labelledby="controlled-days" default-value="mon,tue">
        ${days
          .map(
            (day) => `
              <label data-slot="label">
                <ui-checkbox value="${day.value}">
                  <ui-checkbox-indicator>
                    ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                  </ui-checkbox-indicator>
                </ui-checkbox>
                ${day.label}
              </label>
            `,
          )
          .join("")}
      </ui-checkbox-group>
      <div data-slot="row">
        <button type="button" data-action="weekdays">
          Select weekdays
        </button>
        <button type="button" data-action="clear">
          Clear
        </button>
      </div>

      <output data-slot="output">Value: ["mon","tue"]</output>
    </div>
  `
  const schedule = root.querySelector("ui-checkbox-group")!
  root.querySelector('[data-action="weekdays"]')!.addEventListener("click", () => (schedule.value = weekdays))
  root.querySelector('[data-action="clear"]')!.addEventListener("click", () => (schedule.value = []))

  schedule.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: string[]; reason: string }>).detail
    root.querySelector("output")!.textContent = `Value: ${JSON.stringify(value)}, last change: ${reason}`
  })
}

export { mount }
