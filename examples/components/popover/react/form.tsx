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
  const [name, setName] = React.useState("Ada Lovelace")
  const [open, setOpen] = React.useState(false)
  const [saved, setSaved] = React.useState("")

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>Edit profile</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Profile</PopoverTitle>
          <PopoverDescription>Your name appears on your posts.</PopoverDescription>
          <form
            data-slot="stack"
            onSubmit={(event) => {
              event.preventDefault()
              setSaved(name)
              setOpen(false)
            }}
          >
            <label data-slot="label">
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <button type="submit" data-variant="solid">
              Save
            </button>
          </form>
        </PopoverContent>
      </Popover>
      <output data-slot="output">{saved ? `Saved ${saved}` : "Not saved yet"}</output>
    </>
  )
}

export { Example }
