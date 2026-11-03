"use client"

import * as React from "react"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { CheckIcon } from "lucide-react"

const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notifications" },
]

function Example() {
  const [saved, setSaved] = React.useState<string | null>(null)

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(new FormData(event.currentTarget).getAll("notifications").join(", "))
      }}
    >
      <Field>
        <FieldLabel>Notifications</FieldLabel>
        <FieldDescription>Choose how we tell you about your orders.</FieldDescription>
        <CheckboxGroup name="notifications" required>
          {channels.map((channel) => (
            <label data-slot="label" key={channel.value}>
              <Checkbox value={channel.value}>
                <CheckboxIndicator>
                  <CheckIcon aria-hidden="true" />
                </CheckboxIndicator>
              </Checkbox>
              {channel.label}
            </label>
          ))}
        </CheckboxGroup>
        <div>
          <FieldError>Choose at least one way to be notified.</FieldError>
        </div>
      </Field>
      <button type="submit">Save</button>
      <output data-slot="output">{saved !== null ? `notifications: ${saved}` : ""}</output>
    </form>
  )
}

export { Example }
