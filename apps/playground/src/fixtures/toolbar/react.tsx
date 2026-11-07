import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import { NumberInput, NumberInputControl } from "@ui-sdk/react/number-input"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
  createToolbarController,
} from "@ui-sdk/react/toolbar"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { toolbarFixture as f, toolbarLocked, toolbarOptions } from "tests/fixtures/toolbar.ts"

const controller = createToolbarController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [locked, setLocked] = React.useState(toolbarLocked)
  // Wraps an item in a disabled group while locked, for ?locked.
  const lock = (label: string, item: React.ReactNode) =>
    toolbarLocked() ? (
      <ToolbarGroup aria-label={label} disabled={locked}>
        {item}
      </ToolbarGroup>
    ) : (
      item
    )
  const group = ({ label, defaultValue, items }: typeof f.style, multiple: boolean) => (
    <ToggleGroup
      className="toggle-group"
      aria-label={label}
      multiple={multiple}
      defaultValue={defaultValue}
      onValueChange={(value) => setAction(`${label}: ${value.join(", ") || "none"}`)}
    >
      {items.map((item: (typeof f.style.items)[number]) => (
        <Toggle
          key={item.value}
          className="toggle"
          value={item.value}
          disabled={"disabled" in item && item.disabled}
        >
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )

  return (
    <div className="fixture">
      <button>Before</button>
      <Toolbar className="toolbar" aria-label={f.label} controller={controller} {...toolbarOptions()}>
        {lock("Locked style", group(f.style, true))}
        <ToolbarSeparator />
        {group(f.alignment, false)}
        <ToolbarSeparator />
        <Menu onAction={(value) => setAction(`font: ${value}`)}>
          <ToolbarButton render={<MenuTrigger />}>{f.font.trigger}</ToolbarButton>
          <MenuContent className="popup">
            {f.font.items.map((item) => (
              <MenuItem key={item} className="item" value={item}>
                {item}
              </MenuItem>
            ))}
          </MenuContent>
        </Menu>
        <NumberInput
          defaultValue={f.size.defaultValue}
          onValueChange={(value) => setAction(`size: ${value}`)}
        >
          <ToolbarInput render={<NumberInputControl aria-label={f.size.label} />} />
        </NumberInput>
        <ToolbarInput aria-label={f.comment.label} defaultValue={f.comment.defaultValue} />
        <ToolbarGroup
          className="toolbar-group"
          aria-label={f.history.label}
          disabled={toolbarLocked() && locked}
        >
          {f.history.items.map((item) => (
            <ToolbarButton
              key={item.label}
              disabled={"disabled" in item && item.disabled}
              onClick={() => setAction(item.label.toLowerCase())}
            >
              {item.label}
            </ToolbarButton>
          ))}
        </ToolbarGroup>
        {lock(
          "Locked proofing",
          <Toggle
            className="toggle"
            onPressedChange={(pressed) => setAction(`spellcheck: ${pressed ? "on" : "off"}`)}
          >
            {f.spellcheck.label}
          </Toggle>,
        )}
        {lock("Locked help", <ToolbarLink href={f.help.href}>{f.help.label}</ToolbarLink>)}
      </Toolbar>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.focus()}>Focus toolbar</button>
      <button onClick={() => setLocked(false)}>Unlock</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>,
  )
}

export { Fixture, mount }
