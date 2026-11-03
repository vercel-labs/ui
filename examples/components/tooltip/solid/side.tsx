import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { For } from "solid-js"

const sides = [
  { side: "left", label: "Left" },
  { side: "top", label: "Top" },
  { side: "bottom", label: "Bottom" },
  { side: "right", label: "Right" },
] as const

function Example() {
  return (
    <div data-slot="row">
      <For each={sides}>
        {({ side, label }) => (
          <Tooltip>
            <TooltipTrigger>{label}</TooltipTrigger>
            <TooltipContent side={side}>Add to library</TooltipContent>
          </Tooltip>
        )}
      </For>
    </div>
  )
}

export { Example }
