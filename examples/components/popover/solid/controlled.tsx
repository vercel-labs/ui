import {
  createPopoverController,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal } from "solid-js"

function Example() {
  const popover = createPopoverController()
  const [open, setOpen] = createSignal(false)
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <Popover
          open={open()}
          onOpenChange={(next, details) => {
            setOpen(next)
            setReason(details.reason)
          }}
          controller={popover}
        >
          <PopoverTrigger>Share</PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Share this file</PopoverTitle>
            <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
            <PopoverClose>Done</PopoverClose>
          </PopoverContent>
        </Popover>
        <button type="button" data-variant="ghost" onClick={() => popover.open()}>
          Open from elsewhere
        </button>
      </div>

      <output data-slot="output">
        {open() ? "Open" : "Closed"}
        {reason() ? `, last change: ${reason()}` : ""}
      </output>
    </div>
  )
}

export { Example }
