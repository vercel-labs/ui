"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import * as React from "react"

const options = [
  { value: "email", label: "Email only" },
  { value: "sms", label: "SMS only" },
  { value: "both", label: "Both email and SMS" },
]

function Example() {
  const [saved, setSaved] = React.useState("")

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
          {options.map((option) => (
            <label data-slot="label" key={option.value}>
              <Radio value={option.value}>
                <RadioIndicator />
              </Radio>
              {option.label}
            </label>
          ))}
        </RadioGroup>
        <FieldError>Choose how to receive notifications.</FieldError>
      </Field>
      <button type="submit">Save</button>
      {saved && <output data-slot="output">Saved: {saved}</output>}
    </form>
  )
}

export { Example }
