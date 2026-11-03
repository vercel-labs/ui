import { createTooltipController, Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal } from "solid-js"

function Example() {
  const tooltip = createTooltipController()
  const [open, setOpen] = createSignal(false)
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <Tooltip
          open={open()}
          onOpenChange={(next, details) => {
            setOpen(next)
            setReason(details.reason)
          }}
          controller={tooltip}
        >
          <TooltipTrigger>Export</TooltipTrigger>
          <TooltipContent>Download a CSV of this table</TooltipContent>
        </Tooltip>
        <button type="button" onClick={() => tooltip.open()}>
          Show from elsewhere
        </button>
      </div>
      <output data-slot="output">
        {open() ? "Open" : "Closed"}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
