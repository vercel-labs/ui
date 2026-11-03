import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { XIcon } from "lucide-react"

function Example() {
  return (
    <Dialog>
      <DialogTrigger>Share</DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <div data-slot="stack">
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </div>
        <label data-slot="label">
          <span data-slot="visually-hidden">Link</span>
          <input defaultValue="https://example.com/project" readOnly />
        </label>
        <div data-slot="row">
          <DialogClose>Close</DialogClose>
        </div>
        <DialogClose aria-label="Close">
          <XIcon aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export { Example }
