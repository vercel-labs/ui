import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field invalid>
      <ui-field-label>Email</ui-field-label>
      <ui-input>
        <input type="email" value="ada@example" />
      </ui-input>
      <ui-field-error match>Enter an email address like ada@example.com.</ui-field-error>
    </ui-field>
  `
}
