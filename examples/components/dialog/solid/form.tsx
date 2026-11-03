import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { createSignal } from "solid-js"

function Example() {
  const [result, setResult] = createSignal("")
  return (
    <>
      <Dialog
        onOpenChange={(open, details) => {
          if (!open)
            setResult(
              details.returnValue ? `Saved as ${details.returnValue}` : `Closed with ${details.reason}`,
            )
        }}
      >
        <DialogTrigger>New article</DialogTrigger>
        <DialogBackdrop />
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>New article</DialogTitle>
            <DialogDescription>Save it as a draft or publish it now.</DialogDescription>
          </div>
          <form data-slot="stack" method="dialog">
            <label data-slot="label">
              Title
              <input required value="Hello, world" />
            </label>
            <div data-slot="row">
              <button type="submit" value="draft">
                Save draft
              </button>
              <button data-variant="solid" type="submit" value="published">
                Publish
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <output data-slot="output">{result()}</output>
    </>
  )
}

export { Example }
