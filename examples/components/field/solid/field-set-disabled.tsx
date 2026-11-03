import { Field, FieldControl, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/solid/field"
import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"
import { createSignal } from "solid-js"

export function Example() {
  const [same, setSame] = createSignal(true)
  return (
    <div data-slot="stack">
      <label data-slot="label">
        <Switch checked={same()} onCheckedChange={setSame}>
          <SwitchThumb />
        </Switch>
        Billing address is the same as shipping
      </label>
      <FieldSet disabled={same()}>
        <FieldLegend>Billing address</FieldLegend>
        <Field name="billing-street">
          <FieldLabel>Street address</FieldLabel>
          <FieldControl autocomplete="billing street-address" />
        </Field>
        <Field name="billing-city">
          <FieldLabel>City</FieldLabel>
          <FieldControl autocomplete="billing address-level2" />
        </Field>
      </FieldSet>
    </div>
  )
}
