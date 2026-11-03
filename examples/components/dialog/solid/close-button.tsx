import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"

export function Example() {
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
          <input value="https://ui.shadcn.com/docs/installation" readonly />
        </label>
        <div data-slot="row">
          <DialogClose data-variant="secondary">Close</DialogClose>
        </div>
        <DialogClose aria-label="Close">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
