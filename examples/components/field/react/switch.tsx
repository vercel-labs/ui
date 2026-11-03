import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

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
