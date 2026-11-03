import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { createSignal, For, Show } from "solid-js"

const options = [
  { value: "email", label: "Email only" },
  { value: "sms", label: "SMS only" },
  { value: "both", label: "Both email and SMS" },
]

function Example() {
  const [saved, setSaved] = createSignal("")

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(String(new FormData(event.currentTarget).get("notifications")))
      }}
    >
      <Field>
        <FieldLabel>Notification preferences</FieldLabel>
        <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
        <RadioGroup name="notifications" required>
          <For each={options}>
            {(option) => (
              <label data-slot="label">
                <Radio value={option.value}>
                  <RadioIndicator />
                </Radio>
                {option.label}
              </label>
            )}
          </For>
        </RadioGroup>
        <FieldError>Choose how to receive notifications.</FieldError>
      </Field>
      <button type="submit">Save</button>
      <Show when={saved()}>
        <output data-slot="output">Saved: {saved()}</output>
      </Show>
    </form>
  )
}

export { Example }
