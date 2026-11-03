import "@ui-sdk/web/otp-input"
import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <form id="verify" data-slot="stack">
        <ui-field>
          <ui-field-label>Verification code</ui-field-label>
          <ui-otp-input name="code" required auto-complete="one-time-code">
            <ui-otp-input-group>
              <ui-otp-input-slot></ui-otp-input-slot>
              <ui-otp-input-slot></ui-otp-input-slot>
              <ui-otp-input-slot></ui-otp-input-slot>
              <ui-otp-input-slot></ui-otp-input-slot>
              <ui-otp-input-slot></ui-otp-input-slot>
              <ui-otp-input-slot></ui-otp-input-slot>
            </ui-otp-input-group>
          </ui-otp-input>
          <ui-field-description>Enter the six-digit code from your message.</ui-field-description>
          <div><ui-field-error></ui-field-error></div>
        </ui-field>
        <div data-slot="row">
          <button type="submit">Verify</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <ui-field>
        <ui-field-label>Recovery code (optional)</ui-field-label>
        <ui-otp-input name="recovery" form="verify" max-length="8" pattern="alphanumeric">
          <ui-otp-input-group>
            <ui-otp-input-slot></ui-otp-input-slot>
            <ui-otp-input-slot></ui-otp-input-slot>
            <ui-otp-input-slot></ui-otp-input-slot>
            <ui-otp-input-slot></ui-otp-input-slot>
            <ui-otp-input-slot></ui-otp-input-slot>
            <ui-otp-input-slot></ui-otp-input-slot>
            <ui-otp-input-slot></ui-otp-input-slot>
            <ui-otp-input-slot></ui-otp-input-slot>
          </ui-otp-input-group>
        </ui-otp-input>
      </ui-field>
      <output data-slot="output"></output>
    </div>
  `
  const form = root.querySelector("form")!
  const submitted = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = [...new FormData(form)].map(([name, value]) => `${name}=${value}`)
    submitted.textContent = `Submitted: ${data.join(", ")}`
  })
  form.addEventListener("reset", () => (submitted.textContent = ""))
}
