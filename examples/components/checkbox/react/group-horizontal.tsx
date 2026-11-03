import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { CheckIcon } from "lucide-react"

const days = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
]

export function Example() {
  return (
    <div data-slot="stack">
      <h3 id="horizontal-days">Repeat on</h3>
      <CheckboxGroup aria-labelledby="horizontal-days" defaultValue={["mon", "wed", "fri"]}>
        {days.map((day) => (
          <label data-slot="label" key={day.value}>
            <Checkbox value={day.value}>
              <CheckboxIndicator>
                <CheckIcon />
              </CheckboxIndicator>
            </Checkbox>
            {day.label}
          </label>
        ))}
      </CheckboxGroup>
    </div>
  )
}
