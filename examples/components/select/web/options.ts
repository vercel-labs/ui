import "@ui-sdk/web/select"
import type { ListData } from "@ui-sdk/core/select"
import { Check, ChevronDown, createElement } from "lucide"

const sizeGroups: ListData = [
  { type: "group", label: "Common", items: ["Small", "Medium", "Large"] },
  { type: "group", label: "Extended", items: ["Extra small", "Extra large"] },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-select name="size" default-value="Medium">
      ${sizeGroups
        .map((group) =>
          typeof group === "object" && "items" in group
            ? `<optgroup label="${group.label}">${group.items.map((size) => `<option>${size}</option>`).join("")}</optgroup>`
            : "",
        )
        .join("")}
      <div data-slot="stack">
        <ui-select-label>Size</ui-select-label>
        <ui-select-trigger>
          <button>
            <ui-select-value></ui-select-value>
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-select-trigger>
      </div>
      <template>
        <ui-select-content>
          <ui-select-group>
            <ui-select-group-label></ui-select-group-label>
            <ui-select-item>
              <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
            </ui-select-item>
          </ui-select-group>
        </ui-select-content>
      </template>
    </ui-select>
  `
  const select = root.querySelector("ui-select")
}
