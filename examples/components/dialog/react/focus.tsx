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
  const next = React.useRef<HTMLButtonElement>(null)
  return (
    <div data-slot="row">
      <Dialog>
        <DialogTrigger>Invite</DialogTrigger>
        <DialogBackdrop />
        <DialogContent initialFocus="[name=email]" finalFocus={() => next.current}>
          <div data-slot="stack">
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>Focus starts on the email.</DialogDescription>
          </div>
          <div data-slot="stack">
            <label data-slot="label">
              Name
              <input name="name" defaultValue="Ada" />
            </label>
            <label data-slot="label">
              Email
              <input name="email" type="email" />
            </label>
          </div>
          <div data-slot="row">
            <DialogClose data-variant="solid">Send invite</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <button ref={next} type="button">
        Next step
      </button>
    </div>
  )
}

export { Example }
