import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal } from "solid-js"

function Example() {
  const [container, setContainer] = createSignal<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <Tooltip container={container()}>
        <TooltipTrigger>Show in the box</TooltipTrigger>
        <TooltipContent>This tooltip is in the box below, in the DOM.</TooltipContent>
      </Tooltip>
      <div data-slot="card">
        Container
        <div ref={setContainer} />
      </div>
    </div>
  )
}

export { Example }
