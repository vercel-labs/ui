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
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  return (
    <>
      <Dialog container={container}>
        <DialogTrigger>Open in the box</DialogTrigger>
        <DialogBackdrop />
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>Portaled</DialogTitle>
            <DialogDescription>This dialog is in the box below, in the DOM.</DialogDescription>
          </div>
          <div data-slot="row">
            <DialogClose data-variant="solid">Close</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <div data-slot="stack">
        Container
        <div ref={setContainer} />
      </div>
    </>
  )
}

export { Example }
