import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/toggle"
import "@ui-sdk/web/menu"
import { Bold, ChevronDown, createElement, Italic, Underline } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toolbar aria-label="Formatting">
      <ui-toggle-group multiple aria-label="Text style">
        <ui-toggle value="bold">
          <button data-variant="ghost" aria-label="Bold">
            ${createElement(Bold, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toggle>
        <ui-toggle value="italic">
          <button data-variant="ghost" aria-label="Italic">
            ${createElement(Italic, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toggle>
        <ui-toggle value="underline">
          <button data-variant="ghost" aria-label="Underline">
            ${createElement(Underline, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toggle>
      </ui-toggle-group>
      <ui-toolbar-separator></ui-toolbar-separator>
      <ui-menu>
        <ui-toolbar-button>
          <ui-menu-trigger>
            <button data-variant="secondary">
              Sans
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-menu-trigger>
        </ui-toolbar-button>
        <ui-menu-content>
          ${["Sans", "Serif", "Mono"].map((font) => `<ui-menu-item>${font}</ui-menu-item>`).join("")}
        </ui-menu-content>
      </ui-menu>
    </ui-toolbar>
  `
}

export { mount }
