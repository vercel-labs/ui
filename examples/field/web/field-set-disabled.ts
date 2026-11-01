import "@ui-sdk/web/field"
import "@ui-sdk/web/switch"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label">
        <ui-switch checked>
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
        Billing address is the same as shipping
      </label>
      <ui-field-set disabled>
        <fieldset data-slot="stack">
          <legend>Billing address</legend>
          <ui-field name="billing-street">
            <ui-field-label>Street address</ui-field-label>
            <input autocomplete="billing street-address" />
          </ui-field>
          <ui-field name="billing-city">
            <ui-field-label>City</ui-field-label>
            <input autocomplete="billing address-level2" />
          </ui-field>
        </fieldset>
      </ui-field-set>
    </div>
  `
  const set = root.querySelector("ui-field-set")!
  root.querySelector("ui-switch")!.addEventListener("checkedchange", (event) => {
    set.toggleAttribute("disabled", event.detail.value === true)
  })
}
