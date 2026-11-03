"use client"

import * as React from "react"
import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@ui-sdk/react/drawer"

type PhotoAction = "share" | "duplicate" | "delete" | "cancel"

function Example() {
  const [photoActions] = React.useState(() => createDrawerController<undefined, PhotoAction>())
  const [result, setResult] = React.useState("")

  async function choose() {
    const { returnValue = "cancel" } = await photoActions.open()
    setResult(returnValue === "cancel" ? "Canceled" : `Chose ${returnValue}`)
  }

  return (
    <div data-slot="row">
      <button type="button" onClick={choose}>
        Photo options
      </button>
      <span data-slot="hint" role="status">
        {result}
      </span>
      <Drawer controller={photoActions}>
        <DrawerBackdrop />
        <DrawerContent>
          <div data-slot="stack">
            <div data-slot="stack">
              <DrawerTitle>Beach.jpg</DrawerTitle>
              <DrawerDescription>Taken today at 9:41.</DrawerDescription>
            </div>
            <div data-slot="stack">
              <DrawerClose value="share">Share</DrawerClose>
              <DrawerClose value="duplicate">Duplicate</DrawerClose>
              <DrawerClose value="delete">Delete</DrawerClose>
            </div>
          </div>
          <DrawerClose value="cancel">Cancel</DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { Example }
