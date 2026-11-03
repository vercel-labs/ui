"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"

function Example() {
  const [open, setOpen] = React.useState(false)
  const [note, setNote] = React.useState("")
  const [asking, setAsking] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const field = React.useRef<HTMLTextAreaElement>(null)
  const close = () => {
    setOpen(false)
    setAsking(false)
  }

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : close())}
        dismissible={note === ""}
        onDismissAttempt={() => setAsking(true)}
      >
        <PopoverTrigger>Add note</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Note</PopoverTitle>
          <PopoverDescription>Type something, then press Escape or click outside.</PopoverDescription>
          <textarea
            ref={field}
            aria-label="Note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          {asking ? (
            <div role="alert" data-slot="row">
              Discard your note?
              <button
                type="button"
                data-size="sm"
                onClick={() => {
                  setAsking(false)
                  field.current?.focus()
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
          ) : (
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
          )}
        </PopoverContent>
      </Popover>
      <output data-slot="output">{saved ? "Note saved" : "No note yet"}</output>
    </>
  )
}

export { Example }
