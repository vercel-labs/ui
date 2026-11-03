import "@ui-sdk/web/checkbox"
import { Check, createElement, Plus } from "lucide"

const topics = [
  { value: "design", label: "Design", checked: true },
  { value: "engineering", label: "Engineering", checked: false },
  { value: "marketing", label: "Marketing", checked: false },
  { value: "sales", label: "Sales", checked: false },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <fieldset>
        <legend>Topics you follow</legend>
        <div data-slot="row">
          ${topics
            .map(
              (topic) => `
                <ui-checkbox name="topics" value="${topic.value}"${topic.checked ? " default-checked" : ""}>
                  ${createElement(Plus, { "aria-hidden": "true" }).outerHTML}
                  ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                  ${topic.label}
                </ui-checkbox>
              `,
            )
            .join("")}
        </div>
      </fieldset>
      <label data-slot="label">
        <ui-checkbox>
          <ui-checkbox-indicator>
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </ui-checkbox-indicator>
        </ui-checkbox>
        Notify me about new topics
      </label>
    </div>
  `
}
