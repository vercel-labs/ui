import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/field"
import { Check, createElement } from "lucide"

const items = [
  { value: "comments", label: "Comments on your posts" },
  { value: "mentions", label: "Mentions" },
  { value: "follows", label: "New followers" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field-set>
      <fieldset data-slot="stack">
        <legend>Notifications</legend>
        <ui-field-description>Choose what we email you about.</ui-field-description>
        <ui-checkbox-group name="notify" default-value="mentions">
          ${items
            .map(
              (item) => `
                <label data-slot="label">
                  <ui-checkbox value="${item.value}">
                    <ui-checkbox-indicator>
                      ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                    </ui-checkbox-indicator>
                  </ui-checkbox>
                  ${item.label}
                </label>`,
            )
            .join("")}
        </ui-checkbox-group>
      </fieldset>
    </ui-field-set>
  `
}
