import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal } from "solid-js"

function Example() {
  const [status, setStatus] = createSignal("Closed")

  return (
    <>
      <Popover
        onOpenChange={(open) => setStatus(open ? "Opening" : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <PopoverTrigger>Animated</PopoverTrigger>
        <PopoverContent keepMounted>
          <PopoverTitle>Scale and fade</PopoverTitle>
          <PopoverDescription>300ms in and out, from the trigger.</PopoverDescription>
        </PopoverContent>
      </Popover>
      <output data-slot="output">{status()}</output>
    </>
  )
}

export { Example }
