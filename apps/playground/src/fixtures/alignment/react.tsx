import {
  createMenuController,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
  type MenuDataItem,
} from "@ui-sdk/react/menu"
import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverTitle,
} from "@ui-sdk/react/popover"
import {
  createTabsController,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/react/tabs"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  alignmentFixture,
  alignmentOptions,
  renderCounter,
} from "tests/fixtures/alignment.ts"

const rowMenu = createMenuController<string>()
const details = createPopoverController<string>()
const sections = createTabsController()
const count = renderCounter()

const dataItems: MenuDataItem[] = [
  { type: "checkbox", value: "grid", label: "Grid" },
  {
    type: "radio-group",
    name: "sort",
    items: [
      { value: "name", label: "Name" },
      { value: "date", label: "Date" },
    ],
  },
]

function Fixture() {
  const [action, setAction] = React.useState("")
  const [result, setResult] = React.useState("")
  const [complete, setComplete] = React.useState("")
  const [change, setChange] = React.useState("")
  const [tabChanges, setTabChanges] = React.useState(0)
  const { keepMounted } = alignmentOptions()

  const showDetails = (payload: string) =>
    details
      .open({ payload })
      .then((closed) =>
        setResult(`${closed.reason}:${closed.returnValue ?? ""}`)
      )

  return (
    <div className="fixture">
      <button>Before</button>

      <ul className="rows">
        {alignmentFixture.rows.map((row) => (
          <li key={row}>
            Row {row}
            <MenuTrigger
              controller={rowMenu}
              payload={row}
              aria-label={`Actions for ${row}`}
            >
              …
            </MenuTrigger>
          </li>
        ))}
      </ul>
      <Menu
        controller={rowMenu}
        onAction={(value) => setAction(`${value}:${rowMenu.getPayload()}`)}
        onOpenChangeComplete={(open) => setComplete(open ? "open" : "closed")}
      >
        <MenuContent className="popup" keepMounted={keepMounted}>
          {(state) => (
            <>
              <div className="payload">{`Row ${state.payload}`}</div>
              {alignmentFixture.rowActions.map((item) => (
                <MenuItem
                  key={item.value}
                  className="item"
                  value={item.value}
                  onSelect={() => {
                    if (item.value === "details") {
                      showDetails(String(rowMenu.getPayload()))
                    }
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </>
          )}
        </MenuContent>
      </Menu>

      <Popover controller={details} modal="trap-focus">
        <PopoverContent className="popup">
          {(state) => (
            <form method="dialog">
              <PopoverTitle className="title">Details</PopoverTitle>
              <p className="payload">{`Details for ${state.payload}`}</p>
              <button value="save">Save</button>
              <button value="cancel">Cancel</button>
            </form>
          )}
        </PopoverContent>
      </Popover>
      <button onClick={() => showDetails("button")}>Show details</button>

      <Menu onAction={setAction}>
        <MenuContextTrigger className="canvas">Canvas</MenuContextTrigger>
        <MenuContent className="popup">
          {alignmentFixture.canvasActions.map((item) => (
            <MenuItem key={item.value} className="item" value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      <Menu
        items={dataItems}
        onCheckedChange={(checked, details) =>
          setChange(`checked:${details.value}:${checked}`)
        }
        onValueChange={(value, details) =>
          setChange(`value:${details.group}:${value}`)
        }
      >
        <MenuTrigger>Data</MenuTrigger>
        {/* The data's items, rendered with the fixture's classes. */}
        <MenuContent className="popup">
          {dataItems.map((entry) =>
            entry.type === "checkbox" ? (
              <MenuCheckboxItem
                key={entry.value}
                className="item"
                value={entry.value}
              >
                <MenuItemIndicator className="indicator">✓</MenuItemIndicator>
                {entry.label}
              </MenuCheckboxItem>
            ) : entry.type === "radio-group" ? (
              <MenuRadioGroup key={entry.name} name={entry.name}>
                {entry.items.map((radio) => (
                  <MenuRadioItem
                    key={radio.value}
                    className="item"
                    value={radio.value}
                  >
                    <MenuItemIndicator className="indicator">
                      •
                    </MenuItemIndicator>
                    {radio.label}
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
            ) : null
          )}
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent className="popup">
          {["ruler", "guides"].map((value) => (
            <MenuCheckboxItem
              key={value}
              className={() => count(value)}
              value={value}
            >
              <MenuItemIndicator className="indicator">✓</MenuItemIndicator>
              {value === "ruler" ? "Ruler" : "Guides"}
            </MenuCheckboxItem>
          ))}
        </MenuContent>
      </Menu>

      <Tabs
        className="tabs"
        controller={sections}
        hiddenUntilFound
        onValueChange={() => setTabChanges((count) => count + 1)}
      >
        <TabsList className="tablist scrolling" aria-label="Sections">
          {alignmentFixture.sections.map((section) => (
            <TabsTab
              key={section}
              className="tab"
              value={section.toLowerCase()}
            >
              {section}
            </TabsTab>
          ))}
        </TabsList>
        {alignmentFixture.sections.map((section) => (
          <TabsPanel
            key={section}
            className="panel"
            value={section.toLowerCase()}
          >
            {`The ${section} section`}
          </TabsPanel>
        ))}
      </Tabs>
      <button onClick={() => sections.select("hotel")}>
        Show the last section
      </button>

      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Last result">{result}</output>
      <output aria-label="Last complete">{complete}</output>
      <output aria-label="Last change">{change}</output>
      <output aria-label="Tab changes">{tabChanges}</output>
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
