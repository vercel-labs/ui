"use client"

import * as React from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"

function Example() {
  const [open, setOpen] = React.useState(false)
  const [log, setLog] = React.useState<string[]>([])
  const write = (line: string) => setLog((lines) => [line, ...lines].slice(0, 8))
  return (
    <>
      <label data-slot="label">
        <input type="checkbox" checked={open} onChange={(event) => setOpen(event.target.checked)} />
        open
      </label>
      <Dialog
        open={open}
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
        {log.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ol>
    </>
  )
}

export { Example }
