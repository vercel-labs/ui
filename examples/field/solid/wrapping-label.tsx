import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { For } from "solid-js"

const options = [
  { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
  { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
]

export function Example() {
  return (
    <div data-slot="stack">
      <For each={options}>
        {(option) => (
          <FieldLabel data-variant="card">
            <Field>
              <Checkbox name={option.name}>
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
              <span data-slot="stack">
                <span>{option.title}</span>
                <FieldDescription>{option.description}</FieldDescription>
              </span>
            </Field>
          </FieldLabel>
        )}
      </For>
    </div>
  )
}
