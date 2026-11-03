import { Field, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import * as React from "react"

export function Example() {
  const [same, setSame] = React.useState(true)
  return (
    <div data-slot="stack">
      <label data-slot="label">
        <Switch checked={same} onCheckedChange={setSame}>
          <SwitchThumb />
        </Switch>
        Billing address is the same as shipping
      </label>
      <FieldSet disabled={same}>
        <FieldLegend>Billing address</FieldLegend>
        <Field name="billing-street">
          <FieldLabel>Street address</FieldLabel>
          <Input autoComplete="billing street-address" />
        </Field>
        <Field name="billing-city">
          <FieldLabel>City</FieldLabel>
          <Input autoComplete="billing address-level2" />
        </Field>
      </FieldSet>
    </div>
  )
}
