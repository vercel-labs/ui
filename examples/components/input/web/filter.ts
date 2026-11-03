import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field name="code">
      <ui-field-label>Verification code</ui-field-label>
      <ui-input>
        <input inputmode="numeric" autocomplete="one-time-code" maxlength="6" />
      </ui-input>
      <ui-field-description>Six digits from the text we sent.</ui-field-description>
    </ui-field>
  `
  root.querySelector("ui-input")!.addEventListener("valuechange", (event) => {
    if (!/^\d*$/.test(event.detail.value)) event.preventDefault()
  })
}
