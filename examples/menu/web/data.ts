import "@ui-sdk/web/menu"
import { Check, ChevronRight, Circle, createElement } from "lucide"
import type { MenuData } from "@ui-sdk/web"

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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-menu item-shortcuts>
      <ui-menu-trigger>
        <button class="inline-flex cursor-default h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none">File</button>
      </ui-menu-trigger>
      <template>
        <ui-menu-content class="min-w-56 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 **:data-[slot=menu-shortcut]:ms-auto **:data-[slot=menu-shortcut]:ps-4 **:data-[slot=menu-shortcut]:text-xs **:data-[slot=menu-shortcut]:tracking-widest **:data-[slot=menu-shortcut]:text-muted-foreground motion-reduce:transition-none">
          <ui-menu-group-label class="py-1 ps-8 pe-2 text-xs text-muted-foreground"></ui-menu-group-label>
          <ui-menu-item class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"></ui-menu-item>
          <ui-menu-checkbox-item class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground">
            <ui-menu-item-indicator class="invisible absolute start-2 flex w-4 justify-center group-data-checked:visible">${createElement(Check, { class: "size-4", "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
          </ui-menu-checkbox-item>
          <ui-menu-radio-item class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground">
            <ui-menu-item-indicator class="invisible absolute start-2 flex w-4 justify-center group-data-checked:visible">${createElement(Circle, { class: "size-2 fill-current", "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
          </ui-menu-radio-item>
          <ui-menu-sub-trigger class="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground">
            ${createElement(ChevronRight, { class: "size-4 ms-auto text-muted-foreground rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
          </ui-menu-sub-trigger>
          <ui-menu-sub-content class="min-w-56 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 **:data-[slot=menu-shortcut]:ms-auto **:data-[slot=menu-shortcut]:ps-4 **:data-[slot=menu-shortcut]:text-xs **:data-[slot=menu-shortcut]:tracking-widest **:data-[slot=menu-shortcut]:text-muted-foreground motion-reduce:transition-none"></ui-menu-sub-content>
          <ui-menu-separator class="-mx-1 my-1 h-px bg-border/50"></ui-menu-separator>
        </ui-menu-content>
      </template>
    </ui-menu>
    <output class="mt-3 text-sm text-muted-foreground block min-h-5">Try the menu, or press its shortcuts while it's closed</output>
  `
  const menu = Object.assign(root.querySelector("ui-menu")!, {
    items: fileMenu,
  })
  const result = root.querySelector("output")!
  const content = menu.querySelector("ui-menu-content")!
  menu.addEventListener("action", (event) => {
    result.textContent = `Ran ${(event as CustomEvent<{ value: string }>).detail.value}`
  })
  content.addEventListener(
    "checkedchange",
    (event) => {
      const { value } = (event as CustomEvent<{ value: boolean }>).detail
      result.textContent = `${(event.target as HTMLElement).getAttribute("value")} ${value ? "on" : "off"}`
    },
    { capture: true },
  )
  content.addEventListener(
    "valuechange",
    (event) => {
      const { value } = (event as CustomEvent<{ value: string }>).detail
      result.textContent = `${(event.target as HTMLElement).getAttribute("name")}: ${value}`
    },
    { capture: true },
  )
}

export { mount }
