import "@ui-sdk/web/toggle"
import { createElement, TextAlignCenter, TextAlignEnd, TextAlignStart } from "lucide"

const alignments = [
  { value: "left", label: "Align left", icon: TextAlignStart },
  { value: "center", label: "Align center", icon: TextAlignCenter },
  { value: "right", label: "Align right", icon: TextAlignEnd },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toggle-group default-value="left" aria-label="Text alignment">
      ${alignments
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
