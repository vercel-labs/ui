"use client"

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

function Example() {
  return (
    <Drawer snapPoints={[160, "20rem", 1]}>
      <DrawerTrigger>Resize with the handle</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHandle aria-label="Resize">
          {(state) => (
            <>
              <span data-slot="grip" />
              <span data-slot="row">
                <ArrowUpIcon aria-hidden="true" data-disabled={!state.canExpand || undefined} />
                {state.snapPoint}
                <ArrowDownIcon aria-hidden="true" data-disabled={!state.canCollapse || undefined} />
              </span>
            </>
          )}
        </DrawerHandle>
        <div data-slot="stack">
          <DrawerTitle>Handle</DrawerTitle>
          <DrawerDescription>Focus the handle with Tab, then use the keys below.</DrawerDescription>
        </div>
        <dl>
          <dt>Press</dt>
          <dd>The next snap point, then back to the first</dd>
          <dt>↑ ↓</dt>
          <dd>One snap point larger or smaller</dd>
          <dt>Home End</dt>
          <dd>The smallest or the largest</dd>
        </dl>
        <div data-slot="stack">
          <DrawerClose>Close</DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { Example }
