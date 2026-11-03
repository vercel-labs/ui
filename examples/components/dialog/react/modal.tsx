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

const modes = [
  { value: "true", label: "Modal" },
  { value: "trap-focus", label: "Trap focus" },
  { value: "false", label: "Non-modal" },
] as const

const notes = {
  true: "The rest of the page is inert and doesn't scroll.",
  "trap-focus": "Tab stays inside, and the page still scrolls and takes clicks.",
  false: "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
}

function Example() {
  const [mode, setMode] = React.useState<(typeof modes)[number]["value"]>("false")
  const [outside, setOutside] = React.useState(false)
  const modal = mode === "true" ? true : mode === "false" ? false : "trap-focus"
  return (
    <div data-slot="stack">
      <fieldset data-slot="row">
        <legend>modal</legend>
        {modes.map((option) => (
          <label data-slot="label" key={option.value}>
            <input
              type="radio"
              name="modal"
              checked={mode === option.value}
              onChange={() => setMode(option.value)}
            />
            {option.label}
          </label>
        ))}
        <label data-slot="label">
          <input type="checkbox" checked={outside} onChange={(event) => setOutside(event.target.checked)} />
          closeOnOutsidePress
        </label>
      </fieldset>
      <Dialog modal={modal} closeOnOutsidePress={outside}>
        <DialogTrigger>Open notes</DialogTrigger>
        {modal === true && <DialogBackdrop />}
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>Notes</DialogTitle>
            <DialogDescription>{notes[mode]}</DialogDescription>
          </div>
          <textarea aria-label="Notes" defaultValue="Call the printer about the proofs." />
          <DialogClose>Done</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { Example }
