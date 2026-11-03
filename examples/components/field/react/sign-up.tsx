import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import { CheckIcon } from "lucide-react"
import * as React from "react"

const planOptions = [
  { value: "hobby", title: "Hobby", description: "For personal projects." },
  { value: "pro", title: "Pro", description: "For teams that ship daily." },
]

function summarize(data: FormData) {
  return Array.from(data.entries())
    .map(([key, value]) => `${key}: ${key === "password" ? "•".repeat(String(value).length) : value}`)
    .join("\n")
}

export function Example() {
  const [submitted, setSubmitted] = React.useState("")

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(summarize(new FormData(event.currentTarget)))
      }}
      onReset={() => setSubmitted("")}
    >
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldControl name="name" required autoComplete="name" placeholder="Ada Lovelace" />
        <div>
          <FieldError match="valueMissing">Enter your name.</FieldError>
        </div>
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" required autoComplete="email" placeholder="m@example.com" />
        <div>
          <FieldError />
        </div>
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <FieldControl
          type="password"
          required
          minLength={8}
          pattern=".*[0-9].*"
          autoComplete="new-password"
        />
        <FieldDescription>At least 8 characters, with a number.</FieldDescription>
        <div>
          <FieldError match="valueMissing">Enter a password.</FieldError>
          <FieldError match="tooShort">Use at least 8 characters.</FieldError>
          <FieldError match="patternMismatch">Include at least one number.</FieldError>
        </div>
      </Field>
      <Field>
        <FieldLabel>Plan</FieldLabel>
        <RadioGroup name="plan" required>
          {planOptions.map((plan) => (
            <label data-slot="card" key={plan.value}>
              <Radio value={plan.value}>
                <RadioIndicator />
              </Radio>
              <span data-slot="stack">
                <span>{plan.title}</span>
                <span data-slot="hint">{plan.description}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
        <div>
          <FieldError match="valueMissing">Choose a plan.</FieldError>
        </div>
      </Field>
      <Field>
        <div data-slot="stack">
          <FieldLabel>Send me updates</FieldLabel>
          <FieldDescription>Product news, about once a month.</FieldDescription>
        </div>
        <Switch name="updates" defaultChecked>
          <SwitchThumb />
        </Switch>
      </Field>
      <Field>
        <div data-slot="row">
          <Checkbox name="terms" required>
            <CheckboxIndicator>
              <CheckIcon aria-hidden="true" />
            </CheckboxIndicator>
          </Checkbox>
          <FieldLabel>I accept the terms of service</FieldLabel>
        </div>
        <div>
          <FieldError match="valueMissing">Accept the terms to continue.</FieldError>
        </div>
      </Field>
      <div data-slot="row">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <output data-slot="output" aria-label="Submitted">
        {submitted}
      </output>
    </form>
  )
}
