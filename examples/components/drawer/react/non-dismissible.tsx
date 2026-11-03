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
  const [attempt, setAttempt] = React.useState<string | null>(null)
  return (
    <Drawer
      dismissible={false}
      onDismissAttempt={(details) => setAttempt(details.reason)}
      onOpenChange={(open) => open && setAttempt(null)}
    >
      <DrawerTrigger>Write a post</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <div data-slot="grip" aria-hidden />
        <div data-slot="stack">
          <DrawerTitle>New post</DrawerTitle>
          <DrawerDescription>Try to swipe it away, press outside it or press Escape.</DrawerDescription>
        </div>

        <textarea
          aria-label="Post"
          defaultValue="Shipped the new drawer today. It feels just like the system sheet."
        />

        {attempt && (
          <div data-slot="row" role="alert">
            <span>
              You have unsaved changes.
              <span data-slot="hint">Refused: {attempt}</span>
            </span>
            <DrawerClose>Discard</DrawerClose>
          </div>
        )}

        <div data-slot="stack">
          <DrawerClose data-variant="solid" value="post">
            Post
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { Example }
