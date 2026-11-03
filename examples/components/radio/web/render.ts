import "@ui-sdk/web/radio"
import { Bell, Check, createElement, Mail, Moon } from "lucide"

const options = [
  { value: "all", label: "Everything", description: "Every message and update.", icon: Bell },
  { value: "mentions", label: "Mentions", description: "Only when someone mentions you.", icon: Mail },
  { value: "none", label: "Nothing", description: "Turn notifications off.", icon: Moon },
]

function mount(root: HTMLElement) {
  const id = crypto.randomUUID()
  root.innerHTML = `
    <ui-radio-group aria-label="Notify me about" default-value="mentions">
      ${options
        .map(
          (option) => `
            <ui-radio
              value="${option.value}"
              aria-labelledby="${id}-notify-${option.value}-label"
              aria-describedby="${id}-notify-${option.value}-description"
            >
              ${createElement(option.icon, { "aria-hidden": "true" }).outerHTML}
              <span data-slot="stack">
                <span id="${id}-notify-${option.value}-label">${option.label}</span>
                <span data-slot="hint" id="${id}-notify-${option.value}-description">${option.description}</span>
              </span>
              ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
            </ui-radio>`,
        )
        .join("")}
    </ui-radio-group>
  `
}

export { mount }
