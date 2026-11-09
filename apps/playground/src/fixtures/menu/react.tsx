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
} from "@ui-sdk/react/menu"
import { createMenuController } from "@ui-sdk/core/menu"
import * as React from "react"
import { menuOptions } from "tests/fixtures/page.ts"
import { createRoot } from "react-dom/client"

const controller = createMenuController()

// Counts React commits inside the menu, so specs can check highlight changes skip rendering.
const counter = { commits: 0 }
;(window as unknown as { __menuCommits: typeof counter }).__menuCommits =
  counter

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <React.Profiler id="menu" onRender={() => counter.commits++}>
        <Menu onAction={setAction} controller={controller} {...menuOptions()}>
          <MenuTrigger>File</MenuTrigger>
          <MenuContent className="popup">
            <MenuItem className="item" value="new" shortcut="mod+n">
              New file
            </MenuItem>
            <MenuItem className="item" value="open" shortcut="mod+o">
              Open…
            </MenuItem>
            <MenuItem className="item" value="save" disabled>
              Save
            </MenuItem>
            <MenuSeparator className="separator" />
            <MenuGroup>
              <MenuGroupLabel className="label">View</MenuGroupLabel>
              <MenuCheckboxItem className="item" value="sidebar" defaultChecked>
                Show sidebar
              </MenuCheckboxItem>
              <MenuCheckboxItem className="item" value="statusbar">
                Show status bar
              </MenuCheckboxItem>
            </MenuGroup>
            <MenuSeparator className="separator" />
            <MenuRadioGroup defaultValue="name">
              <MenuGroupLabel className="label">Sort by</MenuGroupLabel>
              <MenuRadioItem className="item" value="name">
                Name
              </MenuRadioItem>
              <MenuRadioItem className="item" value="date">
                Date
              </MenuRadioItem>
              <MenuRadioItem className="item" value="size">
                Size
              </MenuRadioItem>
            </MenuRadioGroup>
            <MenuSeparator className="separator" />
            <MenuSub>
              <MenuSubTrigger className="item">Share</MenuSubTrigger>
              <MenuSubContent className="popup">
                <MenuItem className="item" value="email">
                  Email
                </MenuItem>
                <MenuItem className="item" value="link">
                  Copy link
                </MenuItem>
                <MenuSub>
                  <MenuSubTrigger className="item">More</MenuSubTrigger>
                  <MenuSubContent className="popup">
                    <MenuItem className="item" value="embed">
                      Embed
                    </MenuItem>
                  </MenuSubContent>
                </MenuSub>
              </MenuSubContent>
            </MenuSub>
            <MenuItem className="item" value="delete">
              Delete
            </MenuItem>
          </MenuContent>
        </Menu>
      </React.Profiler>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.open({ focus: "first" })}>
        Open with controller
      </button>
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
