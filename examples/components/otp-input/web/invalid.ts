import "@ui-sdk/web/otp-input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-otp-input default-value="000000" aria-label="Verification code" aria-invalid="true" aria-describedby="otp-error">
        <ui-otp-input-group>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
        </ui-otp-input-group>
      </ui-otp-input>
      <p id="otp-error">That code didn't work. Check it and try again.</p>
    </div>
  `
}
