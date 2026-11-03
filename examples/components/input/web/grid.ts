import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="grid">
      <ui-field name="first-name">
        <ui-field-label>First name</ui-field-label>
        <ui-input>
          <input autocomplete="given-name" placeholder="Ada" />
        </ui-input>
      </ui-field>
      <ui-field name="last-name">
        <ui-field-label>Last name</ui-field-label>
        <ui-input>
          <input autocomplete="family-name" placeholder="Lovelace" />
        </ui-input>
      </ui-field>
    </div>
  `
}
