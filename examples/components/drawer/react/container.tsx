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
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  return (
    <>
      <Drawer container={container}>
        <DrawerTrigger>Open in the box</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <div data-slot="grip" aria-hidden />
          <div data-slot="stack">
            <DrawerTitle>Portaled</DrawerTitle>
            <DrawerDescription>This drawer is in the box below, in the DOM.</DrawerDescription>
          </div>
          <div data-slot="stack">
            <DrawerClose data-variant="solid">Close</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <div data-slot="stack">
        Container
        <div ref={setContainer} />
      </div>
    </>
  )
}

export { Example }
