import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Check } from "lucide-react"

const options = [
  { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
  { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
]

export function Example() {
  return (
    <div data-slot="stack">
      {options.map((option) => (
        <FieldLabel key={option.name} data-variant="card">
          <Field>
            <Checkbox name={option.name}>
              <CheckboxIndicator>
                <Check />
              </CheckboxIndicator>
            </Checkbox>
            <span data-slot="stack">
              <span>{option.title}</span>
              <FieldDescription>{option.description}</FieldDescription>
            </span>
          </Field>
        </FieldLabel>
      ))}
    </div>
  )
}
