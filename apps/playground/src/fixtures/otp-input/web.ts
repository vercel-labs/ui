import "@ui-sdk/web/otp-input"
import type { OTPInputEvents, UiOTPInputElement } from "@ui-sdk/web"
import { otpInputAction, otpInputFixture, otpInputOptions } from "tests/fixtures/otp-input.ts"

const slots = (count: number) => '<ui-otp-input-slot class="otp-slot"></ui-otp-input-slot>'.repeat(count)

function mount(root: HTMLElement) {
  const { cancel, defaultValue, disabled, required } = otpInputOptions()
  const { code, recovery, form } = otpInputFixture
  const groups = code.groups
    .map((size) => `<ui-otp-input-group class="otp-group">${slots(size)}</ui-otp-input-group>`)
    .join('<ui-otp-input-separator class="otp-separator">-</ui-otp-input-separator>')
  const flags = [
    defaultValue && `default-value="${defaultValue}"`,
    disabled && "disabled",
    required && "required",
  ]
    .filter(Boolean)
    .join(" ")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form aria-label="${form.label}">
        <ui-otp-input id="code" class="otp" aria-label="${code.label}" name="${code.name}" max-length="${code.length}" ${flags}>${groups}</ui-otp-input>
        <button type="submit">${form.submit}</button>
        <button type="reset">${form.reset}</button>
      </form>
      <ui-otp-input class="otp" aria-label="${recovery.label}" max-length="${recovery.length}" pattern="alphanumeric">
        <ui-otp-input-group class="otp-group">${slots(recovery.length)}</ui-otp-input-group>
      </ui-otp-input>
      <button id="fill">Fill code</button>
      <button id="clear">Clear code</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output id="submitted" aria-label="Submitted"></output>
    </div>
  `
  const otp = root.querySelector<UiOTPInputElement>("#code")!
  const status = root.querySelector("output")!
  otp.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as OTPInputEvents["valuechange"]).detail
    if (cancel && value.includes(cancel)) return event.preventDefault()
    status.textContent = otpInputAction.change(value, reason)
  })
  otp.addEventListener("valuecommit", (event) => {
    status.textContent = otpInputAction.complete((event as OTPInputEvents["valuecommit"]).detail.value)
  })
  root.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("#submitted")!.textContent = String(
      new FormData(event.currentTarget as HTMLFormElement).get(code.name),
    )
  })
  root.querySelector("#fill")!.addEventListener("click", () => otp.api.setValue(otpInputFixture.filled))
  root.querySelector("#clear")!.addEventListener("click", () => otp.api.clear())
}

export { mount }
