import "@ui-sdk/web/menubar"
import "@ui-sdk/web/menu"
import { Check, ChevronRight, Circle, createElement } from "lucide"
import type { MenuData } from "@ui-sdk/web"

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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menubar>
        <ui-menu>
          <ui-menu-trigger>
            <button>File</button>
          </ui-menu-trigger>
          <template>
            <ui-menu-content>
              <ui-menu-item></ui-menu-item>
              <ui-menu-checkbox-item>
              </ui-menu-checkbox-item>
              <ui-menu-radio-item>
              </ui-menu-radio-item>
              <ui-menu-sub-trigger>
                ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
              </ui-menu-sub-trigger>
              <ui-menu-sub-content></ui-menu-sub-content>
              <ui-menu-separator></ui-menu-separator>
            </ui-menu-content>
          </template>
        </ui-menu>
        <ui-menu>
          <ui-menu-trigger>
            <button>View</button>
          </ui-menu-trigger>
          <template>
            <ui-menu-content>
              <ui-menu-item></ui-menu-item>
              <ui-menu-checkbox-item>
                <ui-menu-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
              </ui-menu-checkbox-item>
              <ui-menu-radio-item>
                <ui-menu-item-indicator>${createElement(Circle, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
              </ui-menu-radio-item>
              <ui-menu-sub-trigger>
              </ui-menu-sub-trigger>
              <ui-menu-sub-content></ui-menu-sub-content>
            </ui-menu-content>
          </template>
        </ui-menu>
      </ui-menubar>
      <output data-slot="output">Last: nothing yet</output>
    </div>
  `
  const [fileMenu, viewMenu] = root.querySelectorAll("ui-menu")
  Object.assign(fileMenu, {
    items: file,
  })
  Object.assign(viewMenu, {
    items: view,
  })
  const output = root.querySelector("output")!
  const content = viewMenu.querySelector("ui-menu-content")!
  fileMenu.addEventListener("action", (event) => {
    output.textContent = `Last: ${event.detail.value}`
  })
  content.addEventListener(
    "checkedchange",
    (event) => {
      const { value } = (event as CustomEvent<{ value: boolean }>).detail
      output.textContent = `Last: ${(event.target as HTMLElement).getAttribute("value")} ${value ? "on" : "off"}`
    },
    { capture: true },
  )
}

export { mount }
