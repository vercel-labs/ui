import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { createSignal, For } from "solid-js"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function Example() {
  const [submitted, setSubmitted] = createSignal("")

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(`Ordered ${new FormData(event.currentTarget).get("fruit")}.`)
      }}
    >
      <Field name="fruit">
        <FieldLabel>Fruit</FieldLabel>
        <Select required placeholder="Select a fruit">
          <SelectTrigger>
            <SelectValue />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </SelectTrigger>
          <SelectContent>
            <For each={fruits}>
              {(fruit) => (
                <SelectItem value={fruit.value}>
                  {fruit.label}
                  <SelectItemIndicator>
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
                  </SelectItemIndicator>
                </SelectItem>
              )}
            </For>
          </SelectContent>
        </Select>
        <FieldDescription>We deliver it tomorrow.</FieldDescription>
        <FieldError match="valueMissing">Pick a fruit to order.</FieldError>
      </Field>
      <button type="submit">Order</button>
      <output data-slot="output">{submitted()}</output>
    </form>
  )
}

export { Example }
