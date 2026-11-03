import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerShortcut,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"

export function Example() {
  return (
    <Drawer snapPoints={[0.5, 1]}>
      <DrawerTrigger
        shortcut="mod+j"
        render={(props, state) => (
          <button {...props}>
            {state.open ? "Viewing" : "View details"}
            <DrawerShortcut>{(shortcut) => shortcut.text}</DrawerShortcut>
          </button>
        )}
      />
      <DrawerBackdrop />
      <DrawerContent>
        {(state) => (
          <>
            <DrawerHandle aria-label="Resize" />
            <div data-slot="stack">
              <DrawerTitle render={<h3 />}>Details</DrawerTitle>
              <DrawerDescription>
                {state.dragging
                  ? "Dragging."
                  : state.expanded
                    ? "Expanded to its largest snap point."
                    : `Resting at ${state.snapPoint}, from the ${state.side}.`}{" "}
                {state.stack} open above it.
              </DrawerDescription>
            </div>
            <div data-slot="stack">
              <DrawerClose data-variant="solid" render={<a href="https://example.com/details" />}>
                Open the full page
              </DrawerClose>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
