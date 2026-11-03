import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { For } from "solid-js"

const pages = ["Introduction", "Installation", "Dialog", "Alert Dialog", "Menu"]

function Example() {
  return (
    <Dialog>
      <DialogTrigger shortcut="mod+j">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        Search docs
        <DialogShortcut />
      </DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <DialogTitle>Search docs</DialogTitle>
        <input aria-label="Search" placeholder="Search…" />
        <div data-slot="stack">
          <For each={pages}>
            {(page) => (
              <DialogClose value={page}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                  <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                </svg>
                {page}
              </DialogClose>
            )}
          </For>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { Example }
