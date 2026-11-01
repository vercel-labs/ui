import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/field"
import { Check, createElement } from "lucide"

const options = [
  { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
  { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      ${options
        .map(
          (option) => `
            <ui-field-label as-child>
              <label data-variant="card">
                <ui-field>
                  <ui-checkbox name="${option.name}">
                    <ui-checkbox-indicator>
                      ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                    </ui-checkbox-indicator>
                  </ui-checkbox>
                  <span data-slot="stack">
                    <span>${option.title}</span>
                    <ui-field-description>${option.description}</ui-field-description>
                  </span>
                </ui-field>
              </label>
            </ui-field-label>`,
        )
        .join("")}
    </div>
  `
}
