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
} from "@ui-sdk/solid/menu"
import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverTitle,
} from "@ui-sdk/solid/popover"
import {
  createTabsController,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/solid/tabs"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
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
  const [action, setAction] = createSignal("")
  const [result, setResult] = createSignal("")
  const [complete, setComplete] = createSignal("")
  const [change, setChange] = createSignal("")
  const [tabChanges, setTabChanges] = createSignal(0)
  const { keepMounted } = alignmentOptions()

  const showDetails = (payload: string) =>
    details
      .open({ payload })
      .then((closed) =>
        setResult(`${closed.reason}:${closed.returnValue ?? ""}`)
      )

  return (
    <div class="fixture">
      <button>Before</button>

      <ul class="rows">
        <For each={alignmentFixture.rows}>
          {(row) => (
            <li>
              Row {row}
              <MenuTrigger
                controller={rowMenu}
                payload={row}
                aria-label={`Actions for ${row}`}
              >
                …
              </MenuTrigger>
            </li>
          )}
        </For>
      </ul>
      <Menu
        controller={rowMenu}
        onAction={(value) => setAction(`${value}:${rowMenu.getPayload()}`)}
        onOpenChangeComplete={(open) => setComplete(open ? "open" : "closed")}
      >
        <MenuContent class="popup" keepMounted={keepMounted}>
          {(state) => (
            <>
              <div class="payload">{`Row ${state.payload}`}</div>
              <For each={alignmentFixture.rowActions}>
                {(item) => (
                  <MenuItem
                    class="item"
                    value={item.value}
                    onSelect={() => {
                      if (item.value === "details") {
                        showDetails(String(rowMenu.getPayload()))
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                )}
              </For>
            </>
          )}
        </MenuContent>
      </Menu>

      <Popover controller={details} modal="trap-focus">
        <PopoverContent class="popup">
          {(state) => (
            <form method="dialog">
              <PopoverTitle class="title">Details</PopoverTitle>
              <p class="payload">{`Details for ${state.payload}`}</p>
              <button value="save">Save</button>
              <button value="cancel">Cancel</button>
            </form>
          )}
        </PopoverContent>
      </Popover>
      <button onClick={() => showDetails("button")}>Show details</button>

      <Menu onAction={setAction}>
        <MenuContextTrigger class="canvas">Canvas</MenuContextTrigger>
        <MenuContent class="popup">
          <For each={alignmentFixture.canvasActions}>
            {(item) => (
              <MenuItem class="item" value={item.value}>
                {item.label}
              </MenuItem>
            )}
          </For>
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
        <MenuContent class="popup">
          <For each={dataItems}>
            {(entry) =>
              entry.type === "checkbox" ? (
                <MenuCheckboxItem class="item" value={entry.value}>
                  <MenuItemIndicator class="indicator">✓</MenuItemIndicator>
                  {entry.label}
                </MenuCheckboxItem>
              ) : entry.type === "radio-group" ? (
                <MenuRadioGroup name={entry.name}>
                  <For each={entry.items}>
                    {(radio) => (
                      <MenuRadioItem class="item" value={radio.value}>
                        <MenuItemIndicator class="indicator">
                          •
                        </MenuItemIndicator>
                        {radio.label}
                      </MenuRadioItem>
                    )}
                  </For>
                </MenuRadioGroup>
              ) : null
            }
          </For>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent class="popup">
          <For each={["ruler", "guides"]}>
            {(value) => (
              <MenuCheckboxItem class={() => count(value)} value={value}>
                <MenuItemIndicator class="indicator">✓</MenuItemIndicator>
                {value === "ruler" ? "Ruler" : "Guides"}
              </MenuCheckboxItem>
            )}
          </For>
        </MenuContent>
      </Menu>

      <Tabs
        class="tabs"
        controller={sections}
        hiddenUntilFound
        onValueChange={() => setTabChanges((count) => count + 1)}
      >
        <TabsList class="tablist scrolling" aria-label="Sections">
          <For each={alignmentFixture.sections}>
            {(section) => (
              <TabsTab class="tab" value={section.toLowerCase()}>
                {section}
              </TabsTab>
            )}
          </For>
        </TabsList>
        <For each={alignmentFixture.sections}>
          {(section) => (
            <TabsPanel class="panel" value={section.toLowerCase()}>
              {`The ${section} section`}
            </TabsPanel>
          )}
        </For>
      </Tabs>
      <button onClick={() => sections.select("hotel")}>
        Show the last section
      </button>

      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Last result">{result()}</output>
      <output aria-label="Last complete">{complete()}</output>
      <output aria-label="Last change">{change()}</output>
      <output aria-label="Tab changes">{tabChanges()}</output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
