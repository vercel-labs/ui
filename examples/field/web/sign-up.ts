import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/switch"
import "@ui-sdk/web/radio"
import "@ui-sdk/web/field"
import { Check, createElement } from "lucide"

const planOptions = [
  { value: "hobby", title: "Hobby", description: "For personal projects." },
  { value: "pro", title: "Pro", description: "For teams that ship daily." },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field>
        <ui-field-label>Name</ui-field-label>
        <input name="name" required autocomplete="name" placeholder="Ada Lovelace" />
        <div><ui-field-error match="valueMissing">Enter your name.</ui-field-error>
      </div></ui-field>
      <ui-field name="email">
        <ui-field-label>Email</ui-field-label>
        <input type="email" required autocomplete="email" placeholder="m@example.com" />
        <div><ui-field-error></ui-field-error>
      </div></ui-field>
      <ui-field name="password">
        <ui-field-label>Password</ui-field-label>
        <input type="password" required minlength="8" pattern=".*[0-9].*" autocomplete="new-password" />
        <ui-field-description>At least 8 characters, with a number.</ui-field-description>
        <div><ui-field-error match="valueMissing">Enter a password.</ui-field-error>
        <ui-field-error match="tooShort">Use at least 8 characters.</ui-field-error>
        <ui-field-error match="patternMismatch">Include at least one number.</ui-field-error>
      </div></ui-field>
      <ui-field>
        <ui-field-label>Plan</ui-field-label>
        <ui-radio-group name="plan" required>
          ${planOptions
            .map(
              (plan) => `
                <label data-slot="card">
                  <ui-radio value="${plan.value}">
                    <ui-radio-indicator></ui-radio-indicator>
                  </ui-radio>
                  <span data-slot="stack">
                    <span>${plan.title}</span>
                    <span data-slot="hint">${plan.description}</span>
                  </span>
                </label>`,
            )
            .join("")}
        </ui-radio-group>
        <div><ui-field-error match="valueMissing">Choose a plan.</ui-field-error>
      </div></ui-field>
      <ui-field>
        <div data-slot="stack">
          <ui-field-label>Send me updates</ui-field-label>
          <ui-field-description>Product news, about once a month.</ui-field-description>
        </div>
        <ui-switch name="updates" default-checked>
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
      </ui-field>
      <ui-field>
        <div data-slot="row">
          <ui-checkbox name="terms" required>
            <ui-checkbox-indicator>
              ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
            </ui-checkbox-indicator>
          </ui-checkbox>
          <ui-field-label>I accept the terms of service</ui-field-label>
        </div>
        <div><ui-field-error match="valueMissing">Accept the terms to continue.</ui-field-error>
      </div></ui-field>
      <div data-slot="row">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <output data-slot="output" aria-label="Submitted"></output>
    </form>
  `
  const form = root.querySelector("form")!
  const output = root.querySelector("output")!

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    output.textContent = Array.from(new FormData(form).entries())
      .map(([key, value]) => `${key}: ${key === "password" ? "•".repeat(String(value).length) : value}`)
      .join("\n")
  })
  form.addEventListener("reset", () => {
    output.textContent = ""
  })
}
