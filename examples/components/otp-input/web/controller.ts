import "@ui-sdk/web/otp-input"
import type { UiOTPInputElement } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-otp-input aria-label="Verification code">
        <ui-otp-input-group>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
        </ui-otp-input-group>
      </ui-otp-input>
      <div data-slot="row">
        <button type="button" data-action="fill">Fill</button>
        <button type="button" data-action="clear">Clear</button>
        <button type="button" data-action="read">Read</button>
        <button type="button" data-action="focus">Focus</button>
      </div>
      <output data-slot="output"></output>
    </div>
  `
  const otp = root.querySelector<UiOTPInputElement>("ui-otp-input")!
  const code = otp.api
  const reading = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    fill: () => code.setValue("123456"),
    clear: () => code.clear(),
    read: () => {
      reading.textContent = `The code is "${code.getValue()}".`
    },
    focus: () => code.focus(),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[button.dataset.action!]())
  })
}
