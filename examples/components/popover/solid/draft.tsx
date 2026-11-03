import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal, Show } from "solid-js"

function Example() {
  const [open, setOpen] = createSignal(false)
  const [note, setNote] = createSignal("")
  const [asking, setAsking] = createSignal(false)
  const [saved, setSaved] = createSignal(false)
  let field: HTMLTextAreaElement | undefined
  const close = () => {
    setOpen(false)
    setAsking(false)
  }

  return (
    <>
      <Popover
        open={open()}
        onOpenChange={(next) => (next ? setOpen(true) : close())}
        dismissible={note() === ""}
        onDismissAttempt={() => setAsking(true)}
      >
        <PopoverTrigger>Add note</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Note</PopoverTitle>
          <PopoverDescription>Type something, then press Escape or click outside.</PopoverDescription>
          <textarea
            ref={field}
            aria-label="Note"
            value={note()}
            onInput={(event) => setNote(event.currentTarget.value)}
          />
          <Show
            when={asking()}
            fallback={
              <button
                type="button"
                data-variant="solid"
                onClick={() => {
                  setSaved(true)
                  setNote("")
                  close()
                }}
              >
                Save
              </button>
            }
          >
            <div role="alert" data-slot="row">
              Discard your note?
              <button
                type="button"
                data-size="sm"
                onClick={() => {
                  setAsking(false)
                  field?.focus()
                }}
              >
                Keep editing
              </button>
              <button
                type="button"
                data-size="sm"
                data-variant="destructive"
                onClick={() => {
                  setNote("")
                  close()
                }}
              >
                Discard
              </button>
            </div>
          </Show>
        </PopoverContent>
      </Popover>
      <output data-slot="output">{saved() ? "Note saved" : "No note yet"}</output>
    </>
  )
}

export { Example }
