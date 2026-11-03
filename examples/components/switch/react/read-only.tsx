import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

function Example() {
  return (
    <Field>
      <div data-slot="stack">
        <FieldLabel>Encrypt backups</FieldLabel>
        <FieldDescription>Managed by your organization.</FieldDescription>
      </div>
      <Switch defaultChecked readOnly>
        <SwitchThumb />
      </Switch>
    </Field>
  )
}

export { Example }
