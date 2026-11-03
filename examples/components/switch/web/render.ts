import "@ui-sdk/web/switch"
import { createElement, Moon, Sun } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <label data-slot="label">
      <ui-switch>
        <ui-switch-thumb>
          ${createElement(Sun, { "aria-hidden": "true" }).outerHTML}
          ${createElement(Moon, { "aria-hidden": "true" }).outerHTML}
        </ui-switch-thumb>
      </ui-switch>
      Dark mode
    </label>
  `
}
