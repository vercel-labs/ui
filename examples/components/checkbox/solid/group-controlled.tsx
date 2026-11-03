import { createCheckboxGroupController } from "@ui-sdk/core/checkbox"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { createSignal, For } from "solid-js"

type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

const days: { value: Day; label: string }[] = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
]

const weekdays: Day[] = ["mon", "tue", "wed", "thu", "fri"]

function Example() {
  const schedule = createCheckboxGroupController<Day>()
  const [value, setValue] = createSignal<Day[]>(["mon", "tue"])
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <h3 id="controlled-days">Working days</h3>
      <CheckboxGroup
        aria-labelledby="controlled-days"
        value={value()}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        controller={schedule}
      >
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
      <div data-slot="row">
        <button type="button" onClick={() => schedule.setValue(weekdays)}>
          Select weekdays
        </button>
        <button type="button" onClick={() => schedule.setValue([])}>
          Clear
        </button>
      </div>

      <output data-slot="output">
        Value: {JSON.stringify(value())}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
