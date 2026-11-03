import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/menu"
import { createElement, Link, Mail, Save, Share } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toolbar aria-label="Document">
        <ui-toolbar-button>
          <button data-variant="secondary" value="save">
            ${createElement(Save, { "aria-hidden": "true" }).outerHTML}
            Save
          </button>
        </ui-toolbar-button>
        <ui-menu>
          <ui-toolbar-button>
            <ui-menu-trigger>
              <button data-variant="secondary">
                ${createElement(Share, { "aria-hidden": "true" }).outerHTML}
                Share
              </button>
            </ui-menu-trigger>
          </ui-toolbar-button>
          <ui-menu-content>
            <ui-menu-item value="email">
              <ui-menu-item-icon>${createElement(Mail, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-icon>
              Email
            </ui-menu-item>
            <ui-menu-item value="link">
              <ui-menu-item-icon>${createElement(Link, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-icon>
              Copy link
            </ui-menu-item>
          </ui-menu-content>
        </ui-menu>
        <ui-toolbar-button>
          <button data-variant="secondary" value="print">Print</button>
        </ui-toolbar-button>
      </ui-toolbar>
      <output data-slot="output">Last: nothing yet</output>
    </div>
  `
  const output = root.querySelector("output")!
  root.querySelectorAll<HTMLButtonElement>("button[value]").forEach((button) => {
    button.addEventListener("click", () => (output.textContent = `Last: ${button.value}`))
  })
  root.querySelector("ui-menu")!.addEventListener("action", (event) => {
    output.textContent = `Last: ${event.detail.value}`
  })
}

export { mount }
