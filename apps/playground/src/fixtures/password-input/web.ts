import { createPasswordInputController } from "@ui-sdk/core/password-input"
import type { UiPasswordInputElement } from "@ui-sdk/web"
import {
  passwordInputAction,
  passwordInputFixture,
  passwordInputOptions,
} from "tests/fixtures/password-input.ts"

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/password-input")
  // Web components have no controlled mode: the element owns its state.
  const { cancel, ...options } = passwordInputOptions()
  const { form, email, password } = passwordInputFixture
  const attributes = [
    options.defaultVisible && "default-visible",
    options.disabled && "disabled",
    options.readOnly && "read-only",
  ]
    .filter(Boolean)
    .join(" ")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form aria-label="${form.label}" class="password-form">
        <fieldset>
        <legend>${form.account}</legend>
        <label>${email.label} <input class="input" name="${email.name}" value="${email.defaultValue}"></label>
        <ui-field>
          <ui-field-label>${password.label}</ui-field-label>
          <ui-password-input class="password-input" name="${password.name}" ${attributes}>
            <input class="input"${options.autoComplete ? ` autocomplete="${options.autoComplete}"` : ""}>
            <ui-password-input-toggle>
              <button class="password-toggle" aria-label="${password.toggle}"><span aria-hidden="true">👁</span></button>
            </ui-password-input-toggle>
          </ui-password-input>
          <ui-field-description>${password.description}</ui-field-description>
        </ui-field>
        <p class="caps-lock">${password.capsLock}</p>
        </fieldset>
        <button type="submit">${form.submit}</button>
        <button type="reset">${form.reset}</button>
      </form>
      <button id="reveal">${passwordInputFixture.controller}</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>`
  const field = root.querySelector<UiPasswordInputElement>("ui-password-input")!
  const status = root.querySelector("output")!
  const reveal = createPasswordInputController()
  field.controller = reveal
  field.addEventListener("visiblechange", (event) => {
    if (cancel) {
      return event.preventDefault()
    }
    status.textContent = passwordInputAction.visible(
      event.detail.value,
      event.detail.reason
    )
  })
  root.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault()
    const input = (event.currentTarget as HTMLFormElement).elements.namedItem(
      password.name
    ) as HTMLInputElement
    status.textContent = passwordInputAction.submit(input.type)
  })
  root
    .querySelector("#reveal")!
    .addEventListener("click", () => reveal.toggleVisible())
}

export { mount }
