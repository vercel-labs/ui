import { Component } from "@angular/core"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    Input,
  ],
  template: `
    <fieldset uiFieldSet>
      <legend uiFieldLegend>Address</legend>
      <p uiFieldDescription>We need your address to deliver your order.</p>
      <div uiFieldGroup>
        <div uiField name="street">
          <label uiFieldLabel>Street address</label>
          <input uiInput autocomplete="street-address" />
        </div>
        <div data-slot="grid">
          <div uiField name="city">
            <label uiFieldLabel>City</label>
            <input uiInput autocomplete="address-level2" />
          </div>
          <div uiField name="postal-code">
            <label uiFieldLabel>Postal code</label>
            <input uiInput autocomplete="postal-code" />
          </div>
        </div>
      </div>
    </fieldset>
  `,
})
class Example {}

export { Example }
