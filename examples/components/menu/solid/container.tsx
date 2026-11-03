import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { createSignal } from "solid-js"

function Example() {
  const [container, setContainer] = createSignal<HTMLDivElement | null>(null)

  return (
    <div data-slot="row">
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent container={container()}>
          <MenuItem>Rendered in the panel</MenuItem>
          <MenuItem>Still placed by the trigger</MenuItem>
        </MenuContent>
      </Menu>
      <div data-slot="card">
        Container
        <div ref={setContainer} />
      </div>
    </div>
  )
}

export { Example }
