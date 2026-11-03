import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"

export function Example() {
  return (
    <Field data-variant="card">
      <div data-slot="stack">
        <FieldLabel>Multi-factor authentication</FieldLabel>
        <FieldDescription>
          Enable multi-factor authentication. If you don't have a two-factor device, use a one-time code sent
          to your email.
        </FieldDescription>
      </div>
      <Switch name="mfa">
        <SwitchThumb />
      </Switch>
    </Field>
  )
}
