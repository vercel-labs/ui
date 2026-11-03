import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

function Example() {
  return (
    <Field>
      <div data-slot="stack">
        <FieldLabel>Share across devices</FieldLabel>
        <FieldDescription>
          Focus is shared across devices, and turns off when you leave the app.
        </FieldDescription>
      </div>
      <Switch>
        <SwitchThumb />
      </Switch>
    </Field>
  )
}

export { Example }
