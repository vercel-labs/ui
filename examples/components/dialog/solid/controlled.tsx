import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { createSignal, For } from "solid-js"

function Example() {
  const [open, setOpen] = createSignal(false)
  const [log, setLog] = createSignal<string[]>([])
  const write = (line: string) => setLog((lines) => [line, ...lines].slice(0, 8))
  return (
    <>
      <label data-slot="label">
        <input type="checkbox" checked={open()} onChange={(event) => setOpen(event.currentTarget.checked)} />
        open
      </label>
      <Dialog
        open={open()}
        onOpenChange={(next, details) => {
          setOpen(next)
          write(`onOpenChange(${next}, "${details.reason}")`)
        }}
        onOpenChangeComplete={(next) => write(`onOpenChangeComplete(${next})`)}
      >
        <DialogTrigger>Open</DialogTrigger>
        <DialogBackdrop />
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>Controlled</DialogTitle>
            <DialogDescription>Close it any way you like, and watch the log.</DialogDescription>
          </div>
          <div data-slot="row">
            <DialogClose data-variant="solid">Close</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <ol data-slot="log">
        <For each={log()}>{(line) => <li>{line}</li>}</For>
      </ol>
    </>
  )
}

export { Example }
