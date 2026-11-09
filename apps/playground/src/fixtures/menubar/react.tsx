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
} from "@ui-sdk/react/menu"
import { Menubar, createMenubarController } from "@ui-sdk/react/menubar"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { menubarFixture as f, menubarOptions } from "tests/fixtures/menubar.ts"

const controller = createMenubarController()
;(window as unknown as { __menubar: typeof controller }).__menubar = controller

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <Menubar
        className="menubar"
        aria-label={f.label}
        controller={controller}
        {...menubarOptions()}
      >
        <Menu onAction={setAction}>
          <MenuTrigger>{f.file.trigger}</MenuTrigger>
          <MenuContent className="popup">
            {f.file.items.map((item) => (
              <MenuItem
                key={item.value}
                className="item"
                value={item.value}
                shortcut={item.shortcut}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuSub>
              <MenuSubTrigger className="item">
                {f.file.share.trigger}
              </MenuSubTrigger>
              <MenuSubContent className="popup">
                {f.file.share.items.map((item) => (
                  <MenuItem
                    key={item.value}
                    className="item"
                    value={item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuSubContent>
            </MenuSub>
            <MenuSeparator className="separator" />
            <MenuItem className="item" value={f.file.print.value}>
              {f.file.print.label}
            </MenuItem>
          </MenuContent>
        </Menu>
        <Menu onAction={setAction}>
          <MenuTrigger>{f.edit.trigger}</MenuTrigger>
          <MenuContent className="popup">
            {f.edit.items.map((item) => (
              <MenuItem
                key={item.value}
                className="item"
                value={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuContent>
        </Menu>
        <Menu
          onCheckedChange={(checked, { value }) =>
            setAction(`${value}: ${checked ? "on" : "off"}`)
          }
        >
          <MenuTrigger shortcut={f.view.shortcut}>{f.view.trigger}</MenuTrigger>
          <MenuContent className="popup">
            {f.view.checkboxes.map((item) => (
              <MenuCheckboxItem
                key={item.value}
                className="item"
                value={item.value}
                defaultChecked={item.defaultChecked}
              >
                {item.label}
              </MenuCheckboxItem>
            ))}
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger>{f.profiles.trigger}</MenuTrigger>
          <MenuContent className="popup">
            <MenuRadioGroup
              defaultValue={f.profiles.defaultValue}
              onValueChange={(value) => setAction(`profile: ${value}`)}
            >
              {f.profiles.items.map((item) => (
                <MenuRadioItem
                  key={item.value}
                  className="item"
                  value={item.value}
                >
                  {item.label}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
        <Menu onAction={setAction}>
          <MenuTrigger disabled>{f.help.trigger}</MenuTrigger>
          <MenuContent className="popup">
            {f.help.items.map((item) => (
              <MenuItem key={item.value} className="item" value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </MenuContent>
        </Menu>
      </Menubar>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
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
