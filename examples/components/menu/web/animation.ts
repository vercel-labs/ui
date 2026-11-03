import "@ui-sdk/web/menu"
import { ChevronRight, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>Animated</button>
        </ui-menu-trigger>
        <ui-menu-content keep-mounted>
          <ui-menu-item>Back</ui-menu-item>
          <ui-menu-item>Forward</ui-menu-item>
          <ui-menu-item>Reload</ui-menu-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-sub>
            <ui-menu-sub-trigger>
              More tools
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-sub-trigger>
            <ui-menu-sub-content>
              <ui-menu-item>Save page as…</ui-menu-item>
              <ui-menu-item>Developer tools</ui-menu-item>
            </ui-menu-sub-content>
          </ui-menu-sub>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Closed</output>
    </div>
  `
  const menu = root.querySelector("ui-menu")!
  const status = root.querySelector("output")!
  menu.addEventListener("openchange", (event) => {
    status.textContent = (event as CustomEvent<{ value: boolean }>).detail.value ? "Opening" : "Closing"
  })
  menu.addEventListener("openchangecomplete", (event) => {
    status.textContent = (event as CustomEvent<{ value: boolean }>).detail.value ? "Open" : "Closed"
  })
}

export { mount }
