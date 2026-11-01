import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field disabled>
      <ui-field-label>Email</ui-field-label>
      <ui-input>
        <input type="email" value="ada@example.com" />
      </ui-input>
    </ui-field>
  `
}
