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
      <ui-toggle-group multiple default-value="bold" aria-label="Text formatting">
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
      <button type="button" data-action="clear">Clear</button>
      <output data-slot="output">Pressed: bold</output>
    </div>
  `
  const group = root.querySelector("ui-toggle-group")!
  root.querySelector('[data-action="clear"]')!.addEventListener("click", () => group.api.setValue([]))
  group.addEventListener("valuechange", (event) => {
    const { value, reason } = event.detail
    root.querySelector("output")!.textContent =
      `Pressed: ${value.length ? value.join(", ") : "none"}, last change: ${reason}`
  })
}

export { mount }
