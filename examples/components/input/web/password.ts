import "@ui-sdk/web/field"
import "@ui-sdk/web/input"
import { Eye, EyeOff, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field name="password">
      <ui-field-label>Password</ui-field-label>
      <ui-input-group>
        <ui-input>
          <input type="password" autocomplete="current-password" />
        </ui-input>
        <button type="button" aria-label="Show password" aria-pressed="false">
          ${createElement(Eye, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-input-group>
    </ui-field>
  `
  const input = root.querySelector("input")!
  const button = root.querySelector("button")!
  button.addEventListener("click", () => {
    const visible = input.type === "password"
    input.type = visible ? "text" : "password"
    button.setAttribute("aria-pressed", String(visible))
    button.replaceChildren(createElement(visible ? EyeOff : Eye, { "aria-hidden": "true" }))
  })
}
