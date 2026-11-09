import { createMenuController } from "@ui-sdk/core/menu"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { menuOptions } from "tests/fixtures/page.ts"

const controller = createMenuController()

function Fixture() {
  const [action, setAction] = createSignal("")
  // Read here, not at module level, so the server reads each request's URL.
  const options = menuOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu onAction={setAction} controller={controller} {...options}>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem class="item" value="new" shortcut="mod+n">
            New file
          </MenuItem>
          <MenuItem class="item" value="open" shortcut="mod+o">
            Open…
          </MenuItem>
          <MenuItem class="item" value="save" disabled>
            Save
          </MenuItem>
          <MenuSeparator class="separator" />
          <MenuGroup>
            <MenuGroupLabel class="label">View</MenuGroupLabel>
            <MenuCheckboxItem class="item" value="sidebar" defaultChecked>
              Show sidebar
            </MenuCheckboxItem>
            <MenuCheckboxItem class="item" value="statusbar">
              Show status bar
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator class="separator" />
          <MenuRadioGroup defaultValue="name">
            <MenuGroupLabel class="label">Sort by</MenuGroupLabel>
            <MenuRadioItem class="item" value="name">
              Name
            </MenuRadioItem>
            <MenuRadioItem class="item" value="date">
              Date
            </MenuRadioItem>
            <MenuRadioItem class="item" value="size">
              Size
            </MenuRadioItem>
          </MenuRadioGroup>
          <MenuSeparator class="separator" />
          <MenuSub>
            <MenuSubTrigger class="item">Share</MenuSubTrigger>
            <MenuSubContent class="popup">
              <MenuItem class="item" value="email">
                Email
              </MenuItem>
              <MenuItem class="item" value="link">
                Copy link
              </MenuItem>
              <MenuSub>
                <MenuSubTrigger class="item">More</MenuSubTrigger>
                <MenuSubContent class="popup">
                  <MenuItem class="item" value="embed">
                    Embed
                  </MenuItem>
                </MenuSubContent>
              </MenuSub>
            </MenuSubContent>
          </MenuSub>
          <MenuItem class="item" value="delete">
            Delete
          </MenuItem>
        </MenuContent>
      </Menu>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.open({ focus: "first" })}>
        Open with controller
      </button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
