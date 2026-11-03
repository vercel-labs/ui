import "@ui-sdk/web/otp-input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div dir="rtl" data-slot="stack">
      <span id="otp-rtl-label" data-slot="label">رمز التحقق</span>
      <ui-otp-input max-length="6" aria-labelledby="otp-rtl-label">
        <ui-otp-input-group>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
          <ui-otp-input-slot></ui-otp-input-slot>
        </ui-otp-input-group>
      </ui-otp-input>
    </div>
  `
}
