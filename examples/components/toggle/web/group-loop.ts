import "@ui-sdk/web/toggle"
import { Bold, createElement, Italic, Strikethrough, Underline } from "lucide"

const formatting = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
  { value: "strikethrough", label: "Strikethrough", icon: Strikethrough },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toggle-group multiple loop="false" aria-label="Text formatting">
      ${formatting
        .map(
          (item) => `
            <ui-toggle value="${item.value}">
              <button aria-label="${item.label}">
                <ui-toggle-icon>${createElement(item.icon, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
              </button>
            </ui-toggle>
          `,
        )
        .join("")}
    </ui-toggle-group>
  `
}

export { mount }
