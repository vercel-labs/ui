import "@ui-sdk/web/toggle"
import { Bold, createElement, Italic, Underline } from "lucide"

const formatting = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toggle-group multiple disabled default-value="bold" aria-label="Text formatting, disabled">
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
      <ui-toggle-group multiple aria-label="Text formatting">
        ${formatting
          .map(
            (item) => `
              <ui-toggle value="${item.value}" ${item.value === "underline" ? "disabled" : ""}>
                <button aria-label="${item.label}">
                  <ui-toggle-icon>${createElement(item.icon, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
                </button>
              </ui-toggle>
            `,
          )
          .join("")}
      </ui-toggle-group>
    </div>
  `
}

export { mount }
