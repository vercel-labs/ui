import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  type ListData,
} from "@ui-sdk/solid/select"
import { For } from "solid-js"

const sizeGroups = [
  { type: "group", label: "Common", items: ["Small", "Medium", "Large"] },
  { type: "group", label: "Extended", items: ["Extra small", "Extra large"] },
] satisfies ListData

export function Example() {
  return (
    <Select items={sizeGroups} name="size" defaultValue="Medium">
      <div data-slot="stack">
        <SelectLabel>Size</SelectLabel>
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
        <For each={sizeGroups}>
          {(group) => (
            <SelectGroup>
              <SelectGroupLabel>{group.label}</SelectGroupLabel>
              <For each={group.items}>
                {(size) => (
                  <SelectItem value={size}>
                    {size}
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
      </SelectContent>
    </Select>
  )
}
