import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Input, type InputValueChangeReason } from "@ui-sdk/react/input"
import * as React from "react"

export function Example() {
  const [name, setName] = React.useState("Ada")
  const [reason, setReason] = React.useState<InputValueChangeReason>()
  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Display name</FieldLabel>
        <Input
          value={name}
          onValueChange={(value, details) => {
            setName(value)
            setReason(details.reason)
          }}
        />
        <FieldDescription>{reason ? `Changed by ${reason}.` : "Type to change it."}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Profile URL</FieldLabel>
        <Input readOnly value={`example.com/${name.toLowerCase()}`} />
      </Field>
    </div>
  )
}
