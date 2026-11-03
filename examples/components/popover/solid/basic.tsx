import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { For } from "solid-js"

const dimensions = [
  { label: "Width", value: "100%" },
  { label: "Max. width", value: "300px" },
  { label: "Height", value: "25px" },
  { label: "Max. height", value: "none" },
]

function Example() {
  return (
    <Popover>
      <PopoverTrigger>Open popover</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        <div data-slot="stack">
          <For each={dimensions}>
            {(dimension) => (
              <label data-slot="label">
                {dimension.label}
                <input value={dimension.value} />
              </label>
            )}
          </For>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Example }
