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

function Example() {
  const chat = React.useRef<HTMLButtonElement>(null)
  const [messages, setMessages] = React.useState(0)
  return (
    <>
      <Drawer
        persistentElements={() => (chat.current ? [chat.current] : [])}
        onOpenChange={(open) => {
          if (open) requestAnimationFrame(() => chat.current?.showPopover())
          else chat.current?.hidePopover()
        }}
      >
        <DrawerTrigger>Upgrade plan</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <div data-slot="grip" aria-hidden />
          <div data-slot="stack">
            <DrawerTitle>Upgrade to Pro</DrawerTitle>
            <DrawerDescription>Questions? The chat in the corner still works.</DrawerDescription>
          </div>
          <div data-slot="stack">
            <DrawerClose data-variant="solid" value="upgrade">
              Upgrade
            </DrawerClose>
            <DrawerClose>Not now</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
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
