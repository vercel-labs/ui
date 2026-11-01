import "@ui-sdk/web/password-input"
import "@ui-sdk/web/field"
import { createElement, Eye, EyeOff } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <form data-slot="stack" id="sign-in">
        <ui-field>
          <ui-field-label>Email</ui-field-label>
          <input type="email" name="email" required autocomplete="username" />
        </ui-field>
      </form>
      <ui-field>
        <ui-field-label>Password</ui-field-label>
        <ui-password-input name="password" form="sign-in" required>
          <input />
          <ui-password-input-toggle>
            <button aria-label="Show password">
              ${createElement(Eye, { "aria-hidden": "true" }).outerHTML}
              ${createElement(EyeOff, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-password-input-toggle>
        </ui-password-input>
      </ui-field>
      <div data-slot="row">
        <button type="submit" form="sign-in">Sign in</button>
        <button type="reset" form="sign-in">Reset</button>
      </div>
      <output data-slot="output"></output>
    </div>
  `
  const form = root.querySelector("form")!
  const submitted = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const length = String(data.get("password")).length
    submitted.textContent = `Signed in as ${data.get("email")}, with a password of ${length} characters.`
  })
  form.addEventListener("reset", () => (submitted.textContent = ""))
}
