import "@ui-sdk/web/password-input"
import "@ui-sdk/web/field"
import { createElement, Eye, EyeOff } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field>
        <ui-field-label>New password</ui-field-label>
        <ui-password-input name="new-password">
          <input autocomplete="new-password" />
          <ui-password-input-toggle>
            <button aria-label="Show password">
              ${createElement(Eye, { "aria-hidden": "true" }).outerHTML}
              ${createElement(EyeOff, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-password-input-toggle>
        </ui-password-input>
      </ui-field>
      <div data-slot="row">
        <button type="button" data-action="suggest">Suggest</button>
        <button type="button" data-action="toggle">Toggle</button>
        <button type="button" data-action="clear">Clear</button>
        <button type="button" data-action="read">Read</button>
        <button type="button" data-action="focus">Focus</button>
      </div>
      <output data-slot="output"></output>
    </div>
  `
  const password = root.querySelector("ui-password-input")!.api
  const reading = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    suggest: () => {
      password.setValue("plum-kettle-orbit-42")
      password.setVisible(true)
    },
    toggle: () => password.toggleVisible(),
    clear: () => password.clear(),
    read: () => {
      reading.textContent = `${password.getValue().length} characters, ${password.isVisible() ? "shown" : "hidden"}.`
    },
    focus: () => password.focus(),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[button.dataset.action!]())
  })
}
