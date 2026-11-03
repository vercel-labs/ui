import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { For } from "solid-js"

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
        <For each={days}>
          {(day) => (
            <label data-slot="label">
              <Checkbox value={day.value}>
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
              {day.label}
            </label>
          )}
        </For>
      </CheckboxGroup>
    </div>
  )
}
