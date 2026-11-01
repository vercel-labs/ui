import "@ui-sdk/web/number-input"
import { createElement, MoveHorizontal } from "lucide"

let count = 0

export function mount(root: HTMLElement) {
  const id = `number-input-toolbar-${++count}`
  root.innerHTML = `
    <div data-slot="row" role="toolbar" aria-label="Text">
      <ui-number-input-scrub-area for="${id}" title="Drag to change the letter spacing">
        ${createElement(MoveHorizontal, { "aria-hidden": "true" }).outerHTML}
        <ui-number-input-scrub-area-cursor>
          ${createElement(MoveHorizontal, { "aria-hidden": "true" }).outerHTML}
        </ui-number-input-scrub-area-cursor>
      </ui-number-input-scrub-area>
      <ui-number-input id="${id}" default-value="0" min="-5" max="20" step="0.1">
        <ui-number-input-group>
          <ui-number-input-control>
            <input aria-label="Letter spacing" />
          </ui-number-input-control>
        </ui-number-input-group>
      </ui-number-input>
    </div>
  `
}
