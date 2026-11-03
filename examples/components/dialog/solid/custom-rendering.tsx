import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger
        shortcut="mod+i"
        render={(props, state) => (
          <button {...props}>
            {state.open ? "Viewing" : "View details"}
            <DialogShortcut>{(shortcut) => shortcut.text}</DialogShortcut>
          </button>
        )}
      />
      <DialogBackdrop />
      <DialogContent>
        {(state) => (
          <>
            <div data-slot="stack">
              <DialogTitle render={(props) => <h3 {...props} />}>Details</DialogTitle>
              <DialogDescription>
                {state.nested ? "Opened from another dialog." : "Opened from the page."} {state.stack} open
                above it.
                {state.nestedOpen ? " A child is open." : ""}
              </DialogDescription>
            </div>
            <div data-slot="row">
              <DialogClose
                data-variant="solid"
                render={(props) => <a {...props} href="https://example.com/details" />}
              >
                Open the full page
              </DialogClose>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
