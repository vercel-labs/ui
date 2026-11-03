import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { For, Show } from "solid-js"

const produce = [
  {
    label: "Fruits",
    items: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
]

function Example() {
  return (
    <Select placeholder="Select produce">
      <SelectTrigger aria-label="Produce">
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
        <For each={produce}>
          {(group, index) => (
            <>
              <Show when={index() > 0}>
                <SelectSeparator />
              </Show>
              <SelectGroup>
                <SelectGroupLabel>{group.label}</SelectGroupLabel>
                <For each={group.items}>
                  {(item) => (
                    <SelectItem value={item.value}>
                      {item.label}
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
              </SelectGroup>
            </>
          )}
        </For>
      </SelectContent>
    </Select>
  )
}

export { Example }
