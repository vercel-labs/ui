import "@ui-sdk/web/menu"
import { Check, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>View</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-group>
            <ui-menu-group-label>Appearance</ui-menu-group-label>
            <ui-menu-checkbox-item value="status-bar" checked="true">
              <ui-menu-item-indicator keep-mounted>
                ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
              </ui-menu-item-indicator>
              Status bar
            </ui-menu-checkbox-item>
            <ui-menu-checkbox-item value="minimap" checked="false">
              <ui-menu-item-indicator keep-mounted>
                ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
              </ui-menu-item-indicator>
              Minimap
            </ui-menu-checkbox-item>
          </ui-menu-group>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-checkbox-item value="line-numbers" default-checked>
            <ui-menu-item-indicator keep-mounted>
              ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-item-indicator>
            Line numbers
          </ui-menu-checkbox-item>
          <ui-menu-checkbox-item value="word-wrap">
            <ui-menu-item-indicator keep-mounted>
              ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-item-indicator>
            Word wrap
          </ui-menu-checkbox-item>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Status bar shown, minimap hidden</output>
    </div>
  `
  const statusBar = root.querySelector("[value=status-bar]")!
  const minimap = root.querySelector("[value=minimap]")!
  const content = root.querySelector("ui-menu-content")!
  content.addEventListener(
    "checkedchange",
    (event) => {
      const target = event.target as HTMLElement
      if (target !== statusBar && target !== minimap) return
      target.setAttribute("checked", String((event as CustomEvent<{ value: boolean }>).detail.value))
      const shown = (el: Element) => (el.getAttribute("checked") === "true" ? "shown" : "hidden")
      root.querySelector("output")!.textContent = `Status bar ${shown(statusBar)}, minimap ${shown(minimap)}`
    },
    { capture: true },
  )
}

export { mount }
