import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field name="username">
      <ui-field-label>Username</ui-field-label>
      <ui-input>
        <input placeholder="ada" autocomplete="username" />
      </ui-input>
      <ui-field-description>Choose a unique username for your account.</ui-field-description>
    </ui-field>
  `
}
