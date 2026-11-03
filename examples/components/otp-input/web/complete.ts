import "@ui-sdk/web/otp-input"
import type { OTPInputEvents } from "@ui-sdk/web"

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
      <output data-slot="output"></output>
    </div>
  `
  const otp = root.querySelector("ui-otp-input")!
  const status = root.querySelector("output")!
  otp.addEventListener("valuechange", () => (status.textContent = ""))
  otp.addEventListener("valuecommit", (event) => {
    const { value, reason } = (event as OTPInputEvents["valuecommit"]).detail
    status.textContent = `Checking ${value}, from ${reason}.`
  })
}
