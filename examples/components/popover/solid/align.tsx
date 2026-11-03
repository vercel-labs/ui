import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { For } from "solid-js"

const aligns = ["start", "center", "end"] as const

export function Example() {
  return (
    <div data-slot="row">
      <For each={aligns}>
        {(align) => (
          <Popover>
            <PopoverTrigger>Align {align}</PopoverTrigger>
            <PopoverContent align={align}>
              <PopoverTitle>Aligned to the {align}</PopoverTitle>
              <PopoverDescription>The popover lines up with the trigger's {align}.</PopoverDescription>
            </PopoverContent>
          </Popover>
        )}
      </For>
    </div>
  )
}
