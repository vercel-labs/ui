import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const sizes = ["Extra small", "Small", "Medium", "Large", "Extra large"]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-select placeholder="Select a size">
        <div data-slot="stack">
          <ui-select-label>Size</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </div>
        <ui-select-content>
          ${sizes
            .map(
              (size) => `
                <ui-select-item value="${size}">
                  ${size}
                  <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                </ui-select-item>
              `,
            )
            .join("")}
        </ui-select-content>
      </ui-select>
      <ui-select>
        <div data-slot="stack">
          <ui-select-label>Gift wrap</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value placeholder="None"></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </div>
        <ui-select-content>
          ${["Paper", "Ribbon", "Box"]
            .map(
              (wrap) => `
                <ui-select-item value="${wrap}">
                  ${wrap}
                  <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                </ui-select-item>
              `,
            )
            .join("")}
        </ui-select-content>
      </ui-select>
    </div>
  `
}
