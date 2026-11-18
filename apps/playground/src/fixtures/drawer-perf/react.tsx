import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"
import { createRoot } from "react-dom/client"
import { drawerOptions } from "tests/fixtures/drawer.ts"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A drawer whose content has many lines, for the counts specs. ?driver picks its driver.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Drawer {...drawerOptions()}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerBackdrop className="drawer-backdrop" />
        <DrawerContent className="drawer">
          <DrawerTitle className="title">Drawer</DrawerTitle>
          {items.map((item) => (
            <p key={item.value}>{item.label}</p>
          ))}
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
