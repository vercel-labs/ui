import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { createSignal } from "solid-js"

function Example() {
  const [status, setStatus] = createSignal("Closed")
  return (
    <>
      <Dialog
        onOpenChange={(open) => setStatus(open ? "Opening" : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <DialogTrigger>Slide in</DialogTrigger>
        <DialogBackdrop />
        <DialogContent keepMounted>
          <div data-slot="stack">
            <DialogTitle>Slide and fade</DialogTitle>
            <DialogDescription>
              300ms in and out. Focus returns as soon as it starts closing.
            </DialogDescription>
          </div>
          <div data-slot="row">
            <DialogClose data-variant="solid">Close</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <output data-slot="output">{status()}</output>
    </>
  )
}

export { Example }
