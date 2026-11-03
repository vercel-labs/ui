import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/solid/menu"
import { Menubar } from "@ui-sdk/solid/menubar"
import { createSignal, For } from "solid-js"

const file: MenuData = [
  { value: "new", label: "New File", shortcut: "mod+alt+n" },
  { value: "open", label: "Open…" },
  { type: "separator" },
  { type: "submenu", label: "Share", items: [{ value: "email", label: "Email link" }] },
]
const view: MenuData = [
  { type: "checkbox", value: "minimap", label: "Minimap", defaultChecked: true },
  { type: "checkbox", value: "wrap", label: "Word Wrap" },
]

function MenuEntries(props: { items: MenuData }) {
  return <For each={props.items}>{(item) => <MenuEntry item={item} />}</For>
}

function MenuEntry(props: { item: MenuData[number] }) {
  const item: MenuDataItem =
    typeof props.item === "string" ? { value: props.item, label: props.item } : props.item
  switch (item.type) {
    case undefined:
    case "item":
      return (
        <MenuItem value={item.value} shortcut={item.shortcut}>
          {item.label}
        </MenuItem>
      )
    case "separator":
      return <MenuSeparator />
    case "checkbox":
      return (
        <MenuCheckboxItem value={item.value} defaultChecked={item.defaultChecked}>
          <MenuItemIndicator>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </MenuItemIndicator>
          {item.label}
        </MenuCheckboxItem>
      )
    case "submenu":
      return (
        <MenuSub>
          <MenuSubTrigger>
            {item.label}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuEntries items={item.items} />
          </MenuSubContent>
        </MenuSub>
      )
  }
}

function Example() {
  const [last, setLast] = createSignal("nothing yet")
  return (
    <div data-slot="stack">
      <Menubar>
        <Menu items={file} onAction={setLast}>
          <MenuTrigger>File</MenuTrigger>
          <MenuContent>
            <MenuEntries items={file} />
          </MenuContent>
        </Menu>
        <Menu
          items={view}
          onCheckedChange={(checked, { value }) => setLast(`${value} ${checked ? "on" : "off"}`)}
        >
          <MenuTrigger>View</MenuTrigger>
          <MenuContent>
            <MenuEntries items={view} />
          </MenuContent>
        </Menu>
      </Menubar>
      <output data-slot="output">Last: {last()}</output>
    </div>
  )
}

export { Example }
