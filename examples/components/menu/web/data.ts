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
    <div data-slot="stack">
      <ui-menu item-shortcuts>
        <ui-menu-trigger>
          <button>File</button>
        </ui-menu-trigger>
        <template>
          <ui-menu-content>
            <ui-menu-group-label></ui-menu-group-label>
            <ui-menu-item></ui-menu-item>
            <ui-menu-checkbox-item>
              <ui-menu-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
            </ui-menu-checkbox-item>
            <ui-menu-radio-item>
              <ui-menu-item-indicator>${createElement(Circle, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
            </ui-menu-radio-item>
            <ui-menu-sub-trigger>
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-sub-trigger>
            <ui-menu-sub-content></ui-menu-sub-content>
            <ui-menu-separator></ui-menu-separator>
          </ui-menu-content>
        </template>
      </ui-menu>
      <output data-slot="output">Try the menu, or press its shortcuts while it's closed</output>
    </div>
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
