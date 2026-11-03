import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

const options = [
  {
    label: "Share across devices",
    description: "Focus is shared across devices, and turns off when you leave the app.",
    defaultChecked: false,
  },
  {
    label: "Enable notifications",
    description: "Receive notifications when focus mode is enabled or disabled.",
    defaultChecked: true,
  },
]

function Example() {
  return (
    <div data-slot="stack">
      {options.map((option) => (
        <Field key={option.label} data-variant="card">
          <div data-slot="stack">
            <FieldLabel>{option.label}</FieldLabel>
            <FieldDescription>{option.description}</FieldDescription>
          </div>
          <Switch defaultChecked={option.defaultChecked}>
            <SwitchThumb />
          </Switch>
        </Field>
      ))}
    </div>
  )
}

export { Example }
