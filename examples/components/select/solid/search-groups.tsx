import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { For } from "solid-js"

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
      <div data-slot="stack">
        <SelectLabel>Produce</SelectLabel>
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
      </div>
      <SelectContent>
        <SelectInput aria-label="Search produce" placeholder="Search…" />
        <SelectEmpty>Nothing found.</SelectEmpty>
        <SelectList>
          <For each={produce}>
            {(group) => (
              <SelectGroup>
                <SelectGroupLabel>{group.label}</SelectGroupLabel>
                <For each={group.items}>
                  {(item) => (
                    <SelectItem value={item.value} label={item.label}>
                      <SelectItemText>
                        {(state) =>
                          state.segments.map((segment, index) =>
                            segment.match ? <b>{segment.text}</b> : segment.text,
                          )
                        }
                      </SelectItemText>
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
            )}
          </For>
        </SelectList>
      </SelectContent>
    </Select>
  )
}

export { Example }
