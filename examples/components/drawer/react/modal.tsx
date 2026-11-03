"use client"

import * as React from "react"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"

const modes = [
  { value: "true", label: "Modal" },
  { value: "trap-focus", label: "Trap focus" },
  { value: "false", label: "Non-modal" },
] as const

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
              name="drawer-modal"
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
      <Drawer modal={modal} closeOnOutsidePress={outside}>
        <DrawerTrigger>Open notes</DrawerTrigger>
        {modal === true && <DrawerBackdrop />}
        <DrawerContent>
          <DrawerTitle>Notes</DrawerTitle>
          <DrawerDescription>
            {modal === false
              ? "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside."
              : modal === true
                ? "The rest of the page is inert and doesn't scroll."
                : "Tab stays inside, and the page still scrolls and takes clicks."}
          </DrawerDescription>
          <textarea aria-label="Notes" defaultValue="Call the printer about the proofs." />
          <DrawerClose data-variant="solid">Done</DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { Example }
