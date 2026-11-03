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
          class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
        >
          {item.label}
        </MenuItem>
      )
    case "separator":
      return <MenuSeparator class="-mx-1 my-1 h-px bg-border/50" />
    case "group":
      return (
        <MenuGroup>
          <Show when={item.label}>
            <MenuGroupLabel class="py-1 ps-8 pe-2 text-xs text-muted-foreground">{item.label}</MenuGroupLabel>
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
          class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
        >
          <MenuItemIndicator class="invisible absolute start-2 flex w-4 justify-center group-data-checked:visible">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="size-4"
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
            <MenuGroupLabel class="py-1 ps-8 pe-2 text-xs text-muted-foreground">{item.label}</MenuGroupLabel>
          </Show>
          <For each={item.items}>
            {(radio) => (
              <MenuRadioItem
                value={radio.value}
                disabled={radio.disabled}
                class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
              >
                <MenuItemIndicator class="invisible absolute start-2 flex w-4 justify-center group-data-checked:visible">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    class="size-2 fill-current"
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
          <MenuSubTrigger
            disabled={item.disabled}
            class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
          >
            {item.label}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="size-4 ms-auto text-muted-foreground rtl:rotate-180"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </MenuSubTrigger>
          <MenuSubContent class="min-w-56 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 **:data-[slot=menu-shortcut]:ms-auto **:data-[slot=menu-shortcut]:ps-4 **:data-[slot=menu-shortcut]:text-xs **:data-[slot=menu-shortcut]:tracking-widest **:data-[slot=menu-shortcut]:text-muted-foreground motion-reduce:transition-none">
            <MenuEntries items={item.items} />
          </MenuSubContent>
        </MenuSub>
      )
  }
}

function Example() {
  const [status, setStatus] = createSignal("")

  return (
    <>
      <Menu
        items={fileMenu}
        itemShortcuts
        onAction={(value) => setStatus(`Ran ${value}`)}
        onCheckedChange={(checked, details) => setStatus(`${details.value} ${checked ? "on" : "off"}`)}
        onValueChange={(value, details) => setStatus(`${details.group}: ${value}`)}
      >
        <MenuTrigger class="inline-flex cursor-default h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none">
          File
        </MenuTrigger>
        <MenuContent class="min-w-56 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 **:data-[slot=menu-shortcut]:ms-auto **:data-[slot=menu-shortcut]:ps-4 **:data-[slot=menu-shortcut]:text-xs **:data-[slot=menu-shortcut]:tracking-widest **:data-[slot=menu-shortcut]:text-muted-foreground motion-reduce:transition-none">
          <MenuEntries items={fileMenu} />
        </MenuContent>
      </Menu>
      <output class="mt-3 text-sm text-muted-foreground block min-h-5">
        {status() || "Try the menu, or press its shortcuts while it's closed"}
      </output>
    </>
  )
}

export { Example }
