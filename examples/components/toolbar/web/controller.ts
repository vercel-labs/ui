import "@ui-sdk/web/toolbar"
import { registerShortcut } from "@ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <textarea aria-label="Notes" placeholder="Type, then press Alt+F10"></textarea>
      <ui-toolbar aria-label="Notes">
        ${["Bold", "Italic", "Link"]
          .map(
            (label) => `
              <ui-toolbar-button>
                <button data-variant="secondary" value="${label.toLowerCase()}">${label}</button>
              </ui-toolbar-button>
            `,
          )
          .join("")}
      </ui-toolbar>
      <div data-slot="row">
        <button data-variant="secondary" type="button" data-action="focus">
          Focus toolbar
        </button>
        <output data-slot="output">Last: nothing yet</output>
      </div>
    </div>
  `
  const toolbar = root.querySelector("ui-toolbar")!
  const output = root.querySelector("output")!
  const off = registerShortcut("alt+f10", () => toolbar.api.focus(), { allowInInput: true })
  root.querySelector("[data-action=focus]")!.addEventListener("click", () => toolbar.api.focus())
  toolbar.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => (output.textContent = `Last: ${button.value}`))
  })
  return off
}

export { mount }
