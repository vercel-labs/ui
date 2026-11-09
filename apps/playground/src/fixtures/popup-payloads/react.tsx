import { Dialog, DialogContent, DialogTrigger } from "@ui-sdk/react/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@ui-sdk/react/drawer"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  contentFor,
  describeChange,
  payloadOf,
  popupPayloadsFixture as fixture,
} from "tests/fixtures/popup-payloads.ts"

type Details = { event?: Event }

const people = createPopoverController<string>()

function Fixture() {
  const [lastOpen, setLastOpen] = React.useState("")
  const [lastPayload, setLastPayload] = React.useState("")
  // The callbacks every popup reports through.
  const report = (name: string) => ({
    onOpenChange: (open: boolean, { event }: Details) =>
      open && setLastOpen(describeChange(name, "open", event)),
    onPayloadChange: (payload: unknown, { event }: Details) =>
      setLastPayload(describeChange(name, `payload ${payload}`, event)),
  })
  return (
    <div className="fixture">
      <button>Before</button>
      <Menu {...report("menu")}>
        {fixture.menu.triggers.map((label) => (
          <MenuTrigger key={label} payload={payloadOf(label)}>
            {label}
          </MenuTrigger>
        ))}
        <MenuContent className="popup">
          {(state) => (
            <MenuGroup>
              <MenuGroupLabel>{contentFor(state.payload)}</MenuGroupLabel>
              <MenuItem className="item" value="open">
                {fixture.menu.item}
              </MenuItem>
            </MenuGroup>
          )}
        </MenuContent>
      </Menu>
      <Popover controller={people} {...report("popover")}>
        {fixture.popover.triggers.map((label) => (
          <PopoverTrigger key={label} payload={payloadOf(label)}>
            {label}
          </PopoverTrigger>
        ))}
        <PopoverContent className="popup">
          {(state) => (
            <>
              {contentFor(state.payload)}
              <button
                onClick={() =>
                  people.open({ payload: fixture.popover.show.payload })
                }
              >
                {fixture.popover.show.label}
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>
      <Dialog modal={false} {...report("dialog")}>
        {fixture.dialog.triggers.map((label) => (
          <DialogTrigger key={label} payload={payloadOf(label)}>
            {label}
          </DialogTrigger>
        ))}
        <DialogContent className="dialog">
          {(state) => contentFor(state.payload)}
        </DialogContent>
      </Dialog>
      <Drawer modal={false} {...report("drawer")}>
        {fixture.drawer.triggers.map((label) => (
          <DrawerTrigger key={label} payload={payloadOf(label)}>
            {label}
          </DrawerTrigger>
        ))}
        <DrawerContent className="drawer">
          {(state) => contentFor(state.payload)}
        </DrawerContent>
      </Drawer>
      <output role="status" aria-label="Last open">
        {lastOpen}
      </output>
      <output role="status" aria-label="Last payload">
        {lastPayload}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
