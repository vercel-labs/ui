import {
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ui-sdk/solid/field"

export function Example() {
  return (
    <FieldSet>
      <FieldLegend>Address</FieldLegend>
      <FieldDescription>We need your address to deliver your order.</FieldDescription>
      <FieldGroup>
        <Field name="street">
          <FieldLabel>Street address</FieldLabel>
          <FieldControl autocomplete="street-address" />
        </Field>
        <div data-slot="grid">
          <Field name="city">
            <FieldLabel>City</FieldLabel>
            <FieldControl autocomplete="address-level2" />
          </Field>
          <Field name="postal-code">
            <FieldLabel>Postal code</FieldLabel>
            <FieldControl autocomplete="postal-code" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  )
}
