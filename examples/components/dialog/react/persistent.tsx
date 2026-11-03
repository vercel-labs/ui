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
  const chat = React.useRef<HTMLButtonElement>(null)
  const [messages, setMessages] = React.useState(0)
  return (
    <>
      <Dialog
        persistentElements={() => (chat.current ? [chat.current] : [])}
        onOpenChange={(open) => {
          if (open) requestAnimationFrame(() => chat.current?.showPopover())
          else chat.current?.hidePopover()
        }}
      >
        <DialogTrigger>Upgrade plan</DialogTrigger>
        <DialogBackdrop />
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription>Questions? The chat in the corner still works.</DialogDescription>
          </div>
          <div data-slot="row">
            <DialogClose>Not now</DialogClose>
            <DialogClose data-variant="solid" value="upgrade">
              Upgrade
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <button
        data-variant="solid"
        ref={chat}
        type="button"
        popover="manual"
        onClick={() => setMessages((count) => count + 1)}
      >
        Chat with us{messages ? ` (${messages})` : ""}
      </button>
    </>
  )
}

export { Example }
