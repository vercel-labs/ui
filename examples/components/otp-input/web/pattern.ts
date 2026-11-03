import "@ui-sdk/web/otp-input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-otp-input max-length="6" pattern="[0-9A-Fa-f]" input-mode="text" aria-label="Device code">
      <ui-otp-input-group>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
      </ui-otp-input-group>
    </ui-otp-input>
  `
}
