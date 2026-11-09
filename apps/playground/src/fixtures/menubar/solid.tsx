import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createMenubarController, Menubar } from "@ui-sdk/solid/menubar"
import { isServer, render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { menubarFixture as f, menubarOptions } from "tests/fixtures/menubar.ts"

const controller = createMenubarController()

function Fixture() {
  // Specs drive the menubar through its controller. There's no window on the server.
  if (!isServer) {
    ;(window as unknown as { __menubar: typeof controller }).__menubar =
      controller
  }
  const [action, setAction] = createSignal("")
  // Read here, not at module level, so the server reads each request's URL.
  const options = menubarOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Menubar
        class="menubar"
        aria-label={f.label}
        controller={controller}
        {...options}
      >
        <Menu onAction={setAction}>
          <MenuTrigger>{f.file.trigger}</MenuTrigger>
          <MenuContent class="popup">
            <For each={f.file.items}>
              {(item) => (
                <MenuItem
                  class="item"
                  value={item.value}
                  shortcut={item.shortcut}
                >
                  {item.label}
                </MenuItem>
              )}
            </For>
            <MenuSub>
              <MenuSubTrigger class="item">
                {f.file.share.trigger}
              </MenuSubTrigger>
              <MenuSubContent class="popup">
                <For each={f.file.share.items}>
                  {(item) => (
                    <MenuItem class="item" value={item.value}>
                      {item.label}
                    </MenuItem>
                  )}
                </For>
              </MenuSubContent>
            </MenuSub>
            <MenuSeparator class="separator" />
            <MenuItem class="item" value={f.file.print.value}>
              {f.file.print.label}
            </MenuItem>
          </MenuContent>
        </Menu>
        <Menu onAction={setAction}>
          <MenuTrigger>{f.edit.trigger}</MenuTrigger>
          <MenuContent class="popup">
            <For each={f.edit.items}>
              {(item) => (
                <MenuItem
                  class="item"
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </MenuItem>
              )}
            </For>
          </MenuContent>
        </Menu>
        <Menu
          onCheckedChange={(checked, { value }) =>
            setAction(`${value}: ${checked ? "on" : "off"}`)
          }
        >
          <MenuTrigger shortcut={f.view.shortcut}>{f.view.trigger}</MenuTrigger>
          <MenuContent class="popup">
            <For each={f.view.checkboxes}>
              {(item) => (
                <MenuCheckboxItem
                  class="item"
                  value={item.value}
                  defaultChecked={item.defaultChecked}
                >
                  {item.label}
                </MenuCheckboxItem>
              )}
            </For>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger>{f.profiles.trigger}</MenuTrigger>
          <MenuContent class="popup">
            <MenuRadioGroup
              defaultValue={f.profiles.defaultValue}
              onValueChange={(value) => setAction(`profile: ${value}`)}
            >
              <For each={f.profiles.items}>
                {(item) => (
                  <MenuRadioItem class="item" value={item.value}>
                    {item.label}
                  </MenuRadioItem>
                )}
              </For>
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
        <Menu onAction={setAction}>
          <MenuTrigger disabled>{f.help.trigger}</MenuTrigger>
          <MenuContent class="popup">
            <For each={f.help.items}>
              {(item) => (
                <MenuItem class="item" value={item.value}>
                  {item.label}
                </MenuItem>
              )}
            </For>
          </MenuContent>
        </Menu>
      </Menubar>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
