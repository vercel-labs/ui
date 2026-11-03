import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field-set>
      <fieldset data-slot="stack">
        <legend>Address</legend>
        <ui-field-description>We need your address to deliver your order.</ui-field-description>
        <ui-field-group>
          <ui-field name="street">
            <ui-field-label>Street address</ui-field-label>
            <input autocomplete="street-address" />
          </ui-field>
          <div data-slot="grid">
            <ui-field name="city">
              <ui-field-label>City</ui-field-label>
              <input autocomplete="address-level2" />
            </ui-field>
            <ui-field name="postal-code">
              <ui-field-label>Postal code</ui-field-label>
              <input autocomplete="postal-code" />
            </ui-field>
          </div>
        </ui-field-group>
      </fieldset>
    </ui-field-set>
  `
}
