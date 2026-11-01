import { Field, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/solid/number-input"
import { createSignal } from "solid-js"

export function Example() {
  const [submitted, setSubmitted] = createSignal("")

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("age")))
      }}
    >
      <Field>
        <FieldLabel>Age</FieldLabel>
        <NumberInput name="age" required min={18} max={120} onValueChange={() => setSubmitted("")}>
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Decrease">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
              </svg>
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Increase">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
        <div>
          <FieldError match="valueMissing">Enter your age.</FieldError>
        </div>
      </Field>
      <button type="submit">Continue</button>
      <output data-slot="output">{submitted() ? `Submitted: age=${submitted()}` : ""}</output>
    </form>
  )
}
