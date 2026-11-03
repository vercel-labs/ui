import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/toggle"
import { Bold, Code, createElement, Italic, Strikethrough } from "lucide"

const formats = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "strikethrough", label: "Strikethrough", icon: Strikethrough },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toolbar aria-label="Text">
        <ui-toggle-group multiple value="bold" aria-label="Text style">
          ${formats
            .map(
              (format) => `
                <ui-toggle value="${format.value}">
                  <button data-variant="ghost" aria-label="${format.label}">
                    ${createElement(format.icon, { "aria-hidden": "true" }).outerHTML}
                  </button>
                </ui-toggle>
              `,
            )
            .join("")}
        </ui-toggle-group>
        <ui-toolbar-separator></ui-toolbar-separator>
        <ui-toggle>
          <button data-variant="ghost" aria-label="Code">
            ${createElement(Code, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toggle>
        <ui-toolbar-button>
          <button data-variant="secondary" data-action="clear">Clear</button>
        </ui-toolbar-button>
      </ui-toolbar>
      <output data-slot="output">Style: bold</output>
    </div>
  `
  const group = root.querySelector("ui-toggle-group")!
  const setStyle = (style: string[]) => {
    group.setAttribute("value", style.join(","))
    root.querySelector("output")!.textContent = `Style: ${style.join(", ") || "none"}`
  }
  group.addEventListener("valuechange", (event) => setStyle(event.detail.value))
  root.querySelector("[data-action=clear]")!.addEventListener("click", () => setStyle([]))
}

export { mount }
