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

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <h3 id="horizontal-days">Repeat on</h3>
      <ui-checkbox-group aria-labelledby="horizontal-days" default-value="mon,wed,fri">
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
    </div>
  `
}
