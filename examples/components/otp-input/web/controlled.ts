import "@ui-sdk/web/otp-input"
import type { OTPInputEvents } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <label for="one-time-password" data-slot="label">One-time password</label>
      <ui-otp-input>
        <ui-otp-input-group>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
        </ui-otp-input-group>
        <ui-otp-input-control><input id="one-time-password" /></ui-otp-input-control>
      </ui-otp-input>
      <p data-slot="output">Enter your one-time password.</p>
    </div>
  `
  const message = root.querySelector("p")!
  root.querySelector("ui-otp-input")!.addEventListener("valuechange", (event) => {
    const { value } = (event as OTPInputEvents["valuechange"]).detail
    message.textContent = value ? `You entered: ${value}` : "Enter your one-time password."
  })
}
