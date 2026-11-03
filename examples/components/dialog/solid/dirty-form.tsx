import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { createSignal, Show } from "solid-js"

function Example() {
  const [open, setOpen] = createSignal(false)
  const [dirty, setDirty] = createSignal(false)
  const [asking, setAsking] = createSignal(false)
  let post: HTMLTextAreaElement | undefined
  const close = () => {
    setOpen(false)
    setDirty(false)
    setAsking(false)
  }
  return (
    <Dialog
      open={open()}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
      dismissible={!dirty()}
      onDismissAttempt={() => setAsking(true)}
    >
      <DialogTrigger>Write a post</DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <div data-slot="stack">
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>Type something, then press Escape or click outside.</DialogDescription>
        </div>
        <textarea
          ref={post}
          aria-label="Post"
          onInput={(event) => setDirty(event.currentTarget.value !== "")}
        />
        <Show
          when={asking()}
          fallback={
            <div data-slot="row">
              <DialogClose data-variant="solid" value="post">
                Post
              </DialogClose>
            </div>
          }
        >
          <div data-slot="row" role="alert">
            Discard your changes?
            <div data-slot="row">
              <button
                type="button"
                onClick={() => {
                  setAsking(false)
                  post?.focus()
                }}
              >
                Keep editing
              </button>
              <button data-variant="solid" type="button" onClick={close}>
                Discard
              </button>
            </div>
          </div>
        </Show>
      </DialogContent>
    </Dialog>
  )
}

export { Example }
