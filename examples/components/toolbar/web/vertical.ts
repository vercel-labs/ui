import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/toggle"
import { createElement, Image, MoveHorizontal, Pencil, Trash } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toolbar orientation="vertical" aria-label="Tools">
      <ui-toggle-group default-value="pencil" aria-label="Tool" orientation="vertical">
        <ui-toggle value="pencil">
          <button data-variant="ghost" aria-label="Pencil">
            ${createElement(Pencil, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toggle>
        <ui-toggle value="image">
          <button data-variant="ghost" aria-label="Image">
            ${createElement(Image, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toggle>
        <ui-toggle value="move">
          <button data-variant="ghost" aria-label="Move">
            ${createElement(MoveHorizontal, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toggle>
      </ui-toggle-group>
      <ui-toolbar-separator></ui-toolbar-separator>
      <ui-toolbar-button>
        <button data-variant="secondary" aria-label="Delete">
          ${createElement(Trash, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-toolbar-button>
    </ui-toolbar>
  `
}

export { mount }
