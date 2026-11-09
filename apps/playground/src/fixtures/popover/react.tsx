import { createPopoverController } from "@ui-sdk/core/popover"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  popoverContentOptions,
  popoverFixture,
  popoverOptions,
  popoverParts,
} from "tests/fixtures/popover.ts"

const controller = createPopoverController()

const parts = popoverParts()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [triggerShown, setTriggerShown] = React.useState(true)
  const options = popoverOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      <Popover controller={controller} {...options}>
        {triggerShown && (
          <PopoverTrigger
            shortcut={
              parts.shortcut ? popoverFixture.shortcut.trigger : undefined
            }
          >
            {popoverFixture.trigger}
            {parts.shortcut && <PopoverShortcut />}
          </PopoverTrigger>
        )}
        <PopoverContent
          className="popup"
          sideOffset={8}
          {...popoverContentOptions()}
        >
          <PopoverArrow className="arrow" />
          {parts.title && (
            <PopoverTitle className="title">
              {popoverFixture.title}
            </PopoverTitle>
          )}
          <PopoverDescription className="description">
            {popoverFixture.description}
          </PopoverDescription>
          <label className="field">
            {popoverFixture.field}
            <input defaultValue={popoverFixture.defaultValue} />
          </label>
          <div className="actions">
            <button onClick={() => setAction("save")}>
              {popoverFixture.action}
              {parts.shortcut && (
                <PopoverShortcut shortcut={popoverFixture.shortcut.save} />
              )}
            </button>
            <PopoverClose>{popoverFixture.close}</PopoverClose>
            {parts.removable && (
              <button onClick={() => setTriggerShown(false)}>
                {popoverFixture.remove}
              </button>
            )}
          </div>
          {parts.menu && (
            <Menu container={options.container} onAction={setAction}>
              <MenuTrigger>{popoverFixture.menu.trigger}</MenuTrigger>
              <MenuContent className="popup">
                {popoverFixture.menu.items.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    className="item"
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
          )}
          {parts.nested && (
            <Popover>
              <PopoverTrigger>{popoverFixture.nested.trigger}</PopoverTrigger>
              <PopoverContent className="popup">
                <PopoverTitle className="title">
                  {popoverFixture.nested.title}
                </PopoverTitle>
                <button onClick={() => setAction("archive")}>
                  {popoverFixture.nested.action}
                </button>
              </PopoverContent>
            </Popover>
          )}
        </PopoverContent>
      </Popover>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.open()}>Open with controller</button>
      {parts.shortcut && (
        <PopoverTrigger
          controller={controller}
          shortcut={popoverFixture.shortcut.remote.keys}
        >
          {popoverFixture.shortcut.remote.trigger}
          <PopoverShortcut />
        </PopoverTrigger>
      )}
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
