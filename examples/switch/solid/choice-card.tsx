import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"
import { For } from "solid-js"

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
      <For each={options}>
        {(option) => (
          <Field data-variant="card">
            <div data-slot="stack">
              <FieldLabel>{option.label}</FieldLabel>
              <FieldDescription>{option.description}</FieldDescription>
            </div>
            <Switch defaultChecked={option.defaultChecked}>
              <SwitchThumb />
            </Switch>
          </Field>
        )}
      </For>
    </div>
  )
}

export { Example }
