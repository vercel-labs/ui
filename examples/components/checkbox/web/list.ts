import "@ui-sdk/web/checkbox"
import { Check, createElement } from "lucide"

const items = [
  { value: "hard-disks", label: "Hard disks", checked: false },
  { value: "external-disks", label: "External disks", checked: true },
  { value: "media", label: "CDs, DVDs and iPods", checked: true },
  { value: "servers", label: "Connected servers", checked: false },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <fieldset data-slot="stack">
      <legend>Show these items on the desktop</legend>
      <p data-slot="hint">Select the items you want to show on the desktop.</p>
      ${items
        .map(
          (item) => `
            <label data-slot="label">
              <ui-checkbox name="desktop" value="${item.value}"${item.checked ? " default-checked" : ""}>
                <ui-checkbox-indicator>
                  ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                </ui-checkbox-indicator>
              </ui-checkbox>
              ${item.label}
            </label>
          `,
        )
        .join("")}
    </fieldset>
  `
}

export { mount }
