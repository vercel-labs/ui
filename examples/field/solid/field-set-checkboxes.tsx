import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { FieldDescription, FieldLegend, FieldSet } from "@ui-sdk/solid/field"
import { For } from "solid-js"

const items = [
  { value: "comments", label: "Comments on your posts" },
  { value: "mentions", label: "Mentions" },
  { value: "follows", label: "New followers" },
]

export function Example() {
  return (
    <FieldSet>
      <FieldLegend>Notifications</FieldLegend>
      <FieldDescription>Choose what we email you about.</FieldDescription>
      <CheckboxGroup name="notify" defaultValue={["mentions"]}>
        <For each={items}>
          {(item) => (
            <label data-slot="label">
              <Checkbox value={item.value}>
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
              {item.label}
            </label>
          )}
        </For>
      </CheckboxGroup>
    </FieldSet>
  )
}
