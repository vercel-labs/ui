import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Input, type InputValueChangeReason } from "@ui-sdk/solid/input"
import { createSignal } from "solid-js"

export function Example() {
  const [name, setName] = createSignal("Ada")
  const [reason, setReason] = createSignal<InputValueChangeReason>()
  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Display name</FieldLabel>
        <Input
          value={name()}
          onValueChange={(value, details) => {
            setName(value)
            setReason(details.reason)
          }}
        />
        <FieldDescription>{reason() ? `Changed by ${reason()}.` : "Type to change it."}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Profile URL</FieldLabel>
        <Input readonly value={`example.com/${name().toLowerCase()}`} />
      </Field>
    </div>
  )
}
