import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createEffect, createSignal } from "solid-js"

function Example() {
  const [color, setColor] = createSignal("")

  createEffect(
    () => 0,
    () => {
      const existing = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      const meta =
        existing ?? Object.assign(document.createElement("meta"), { name: "theme-color", content: "#ffffff" })
      if (!existing) document.head.append(meta)
      const read = () => setColor(meta.content)
      read()
      const observer = new MutationObserver(read)
      observer.observe(meta, { attributes: true, attributeFilter: ["content"] })
      return () => {
        observer.disconnect()
        if (!existing) meta.remove()
      }
    },
  )

  return (
    <div data-slot="stack">
      <Drawer themeColor>
        <DrawerTrigger>Dim the toolbar</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <div data-slot="grip" aria-hidden="true" />
          <div data-slot="stack">
            <DrawerTitle>Theme color</DrawerTitle>
            <DrawerDescription>
              On an iPhone, Safari's toolbars dim with the page. The drawer writes the color where motion
              starts and ends, never on every frame.
            </DrawerDescription>
          </div>
          <div data-slot="stack">
            <DrawerClose data-variant="solid">Close</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <p data-slot="row">
        <span data-slot="swatch" aria-hidden="true" style={{ background: color() }} />
        theme-color: {color()}
      </p>
    </div>
  )
}

export { Example }
