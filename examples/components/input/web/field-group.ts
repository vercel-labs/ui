import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field name="name">
        <ui-field-label>Name</ui-field-label>
        <ui-input>
          <input placeholder="Ada Lovelace" autocomplete="name" />
        </ui-input>
      </ui-field>
      <ui-field name="email">
        <ui-field-label>Email</ui-field-label>
        <ui-input>
          <input type="email" placeholder="ada@example.com" autocomplete="email" />
        </ui-input>
        <ui-field-description>We'll never share your email.</ui-field-description>
      </ui-field>
      <ui-field name="password">
        <ui-field-label>Password</ui-field-label>
        <ui-input>
          <input type="password" autocomplete="new-password" />
        </ui-input>
        <ui-field-description>At least 8 characters.</ui-field-description>
      </ui-field>
    </div>
  `
}
