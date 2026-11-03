import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"

export function Example() {
  return (
    <Field>
      <Checkbox name="usage">
        <CheckboxIndicator>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </CheckboxIndicator>
      </Checkbox>
      <div data-slot="stack">
        <FieldLabel>Share usage data</FieldLabel>
        <FieldDescription>
          Help us improve by sending anonymous crash reports and usage statistics.
        </FieldDescription>
      </div>
    </Field>
  )
}
