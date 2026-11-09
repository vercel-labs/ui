import { Dialog, DialogContent, DialogTrigger } from "@ui-sdk/solid/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@ui-sdk/solid/drawer"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import {
  contentFor,
  describeChange,
  payloadOf,
  popupPayloadsFixture as fixture,
} from "tests/fixtures/popup-payloads.ts"

type Details = { event?: Event }

const people = createPopoverController<string>()

function Fixture() {
  const [lastOpen, setLastOpen] = createSignal("")
  const [lastPayload, setLastPayload] = createSignal("")
  // The callbacks every popup reports through.
  const report = (name: string) => ({
    onOpenChange: (open: boolean, { event }: Details) =>
      open && setLastOpen(describeChange(name, "open", event)),
    onPayloadChange: (payload: unknown, { event }: Details) =>
      setLastPayload(describeChange(name, `payload ${payload}`, event)),
  })
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu {...report("menu")}>
        <For each={fixture.menu.triggers}>
          {(label) => (
            <MenuTrigger payload={payloadOf(label)}>{label}</MenuTrigger>
          )}
        </For>
        <MenuContent class="popup">
          {(state) => (
            <MenuGroup>
              <MenuGroupLabel>{contentFor(state.payload)}</MenuGroupLabel>
              <MenuItem class="item" value="open">
                {fixture.menu.item}
              </MenuItem>
            </MenuGroup>
          )}
        </MenuContent>
      </Menu>
      <Popover controller={people} {...report("popover")}>
        <For each={fixture.popover.triggers}>
          {(label) => (
            <PopoverTrigger payload={payloadOf(label)}>{label}</PopoverTrigger>
          )}
        </For>
        <PopoverContent class="popup">
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
        <For each={fixture.dialog.triggers}>
          {(label) => (
            <DialogTrigger payload={payloadOf(label)}>{label}</DialogTrigger>
          )}
        </For>
        <DialogContent class="dialog">
          {(state) => contentFor(state.payload)}
        </DialogContent>
      </Dialog>
      <Drawer modal={false} {...report("drawer")}>
        <For each={fixture.drawer.triggers}>
          {(label) => (
            <DrawerTrigger payload={payloadOf(label)}>{label}</DrawerTrigger>
          )}
        </For>
        <DrawerContent class="drawer">
          {(state) => contentFor(state.payload)}
        </DrawerContent>
      </Drawer>
      <output role="status" aria-label="Last open">
        {lastOpen()}
      </output>
      <output role="status" aria-label="Last payload">
        {lastPayload()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
