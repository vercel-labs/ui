import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createSignal } from "solid-js"

function Example() {
  const [container, setContainer] = createSignal<HTMLDivElement>()
  return (
    <>
      <Drawer container={container()}>
        <DrawerTrigger>Open in the box</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <div data-slot="grip" aria-hidden="true" />
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
