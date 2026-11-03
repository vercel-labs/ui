import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"

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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  data-disabled={!state.canExpand || undefined}
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
                {state.snapPoint}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  data-disabled={!state.canCollapse || undefined}
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
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
