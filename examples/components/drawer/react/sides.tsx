import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"

const sides = [
  { side: "top", label: "Top" },
  { side: "right", label: "Right" },
  { side: "bottom", label: "Bottom" },
  { side: "left", label: "Left" },
] as const

function Example() {
  return (
    <div data-slot="row">
      {sides.map(({ side, label }) => (
        <Drawer key={side} side={side} preventEdgeSwipe={side === "left" || side === "right"}>
          <DrawerTrigger>{label}</DrawerTrigger>
          <DrawerBackdrop />
          <DrawerContent>
            <div data-slot="stack">
              <DrawerTitle>Drawer from the {side}</DrawerTitle>
              <DrawerDescription>
                Drag it back toward its edge, press outside it or press Escape to close it.
              </DrawerDescription>
            </div>
            <DrawerClose data-variant="solid">Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}

export { Example }
