import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/solid/menu"
import { createSignal, For, Show } from "solid-js"

const fileMenu: MenuData = [
  { value: "quick-open", label: "Quick open…", shortcut: "mod+p" },
  { value: "open", label: "Open…", shortcut: "mod+o" },
  { value: "save", label: "Save", shortcut: "mod+s", disabled: true },
  { type: "separator" },
  {
    type: "group",
    label: "Show",
    items: [
      { type: "checkbox", value: "toolbar", label: "Toolbar", defaultChecked: true },
      { type: "checkbox", value: "status", label: "Status bar", closeOnSelect: true },
    ],
  },
  {
    type: "radio-group",
    name: "sort",
    label: "Sort by",
    defaultValue: "name",
    items: [
      { value: "name", label: "Name" },
      { value: "date", label: "Date modified" },
      { value: "size", label: "Size", disabled: true },
    ],
  },
  { type: "separator" },
  {
    type: "submenu",
    label: "Share",
    items: [
      { value: "email", label: "Email" },
      { value: "link", label: "Copy link", closeOnSelect: false },
    ],
  },
  { type: "submenu", label: "Move to", disabled: true, items: [{ value: "archive", label: "Archive" }] },
  { type: "separator" },
  { value: "delete", label: "Delete", destructive: true },
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
        <MenuItem
          value={item.value}
          disabled={item.disabled}
          shortcut={item.shortcut}
          closeOnSelect={item.closeOnSelect}
          destructive={item.destructive}
        >
          {item.label}
        </MenuItem>
      )
    case "separator":
      return <MenuSeparator />
    case "group":
      return (
        <MenuGroup>
          <Show when={item.label}>
            <MenuGroupLabel>{item.label}</MenuGroupLabel>
          </Show>
          <MenuEntries items={item.items} />
        </MenuGroup>
      )
    case "checkbox":
      return (
        <MenuCheckboxItem
          value={item.value}
          disabled={item.disabled}
          checked={item.checked}
          defaultChecked={item.defaultChecked}
          closeOnSelect={item.closeOnSelect}
        >
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
    case "radio-group":
      return (
        <MenuRadioGroup name={item.name} value={item.value} defaultValue={item.defaultValue}>
          <Show when={item.label}>
            <MenuGroupLabel>{item.label}</MenuGroupLabel>
          </Show>
          <For each={item.items}>
            {(radio) => (
              <MenuRadioItem value={radio.value} disabled={radio.disabled}>
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
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </MenuItemIndicator>
                {radio.label}
              </MenuRadioItem>
            )}
          </For>
        </MenuRadioGroup>
      )
    case "submenu":
      return (
        <MenuSub>
          <MenuSubTrigger disabled={item.disabled}>
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
  const [status, setStatus] = createSignal("")

  return (
    <div data-slot="stack">
      <Menu
        items={fileMenu}
        shortcuts
        onAction={(value) => setStatus(`Ran ${value}`)}
        onCheckedChange={(checked, details) => setStatus(`${details.value} ${checked ? "on" : "off"}`)}
        onValueChange={(value, details) => setStatus(`${details.group}: ${value}`)}
      >
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuEntries items={fileMenu} />
        </MenuContent>
      </Menu>
      <output data-slot="output">
        {status() || "Try the menu, or press its shortcuts while it's closed"}
      </output>
    </div>
  )
}

export { Example }
