import "@ui-sdk/web/otp-input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-otp-input max-length="4" text-align="center" aria-label="PIN">
      <ui-otp-input-group>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
      </ui-otp-input-group>
    </ui-otp-input>
  `
}
