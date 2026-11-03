import "@ui-sdk/web/number-input"
import "@ui-sdk/web/field"
import { createElement, MoveHorizontal, MoveVertical } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-field>
        <ui-number-input default-value="320" min="0">
          <ui-number-input-scrub-area orientation="horizontal" pixels-per-step="2">
            <ui-field-label>Width</ui-field-label>
            <ui-number-input-scrub-area-cursor>
              ${createElement(MoveHorizontal, { "aria-hidden": "true" }).outerHTML}
            </ui-number-input-scrub-area-cursor>
          </ui-number-input-scrub-area>
          <ui-number-input-group>
            <ui-number-input-control>
              <input />
            </ui-number-input-control>
          </ui-number-input-group>
        </ui-number-input>
      </ui-field>
      <ui-field>
        <ui-number-input default-value="240" min="0">
          <ui-number-input-scrub-area orientation="vertical" pixels-per-step="2">
            <ui-field-label>Height</ui-field-label>
            <ui-number-input-scrub-area-cursor>
              ${createElement(MoveVertical, { "aria-hidden": "true" }).outerHTML}
            </ui-number-input-scrub-area-cursor>
          </ui-number-input-scrub-area>
          <ui-number-input-group>
            <ui-number-input-control>
              <input />
            </ui-number-input-control>
          </ui-number-input-group>
        </ui-number-input>
      </ui-field>
    </div>
  `
}
