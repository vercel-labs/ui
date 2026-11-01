import type { NumberInputController } from "@ui-sdk/core/number-input"
import "@ui-sdk/web/number-input"
import "@ui-sdk/web/field"
import { createElement, ZoomIn, ZoomOut } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field>
        <ui-field-label>Zoom</ui-field-label>
        <ui-number-input default-value="100" min="10" max="400" step="10">
          <ui-number-input-group>
            <ui-number-input-decrement>
              <button aria-label="Zoom out">
                ${createElement(ZoomOut, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-number-input-decrement>
            <ui-number-input-control>
              <input />
            </ui-number-input-control>
            <ui-number-input-increment>
              <button aria-label="Zoom in">
                ${createElement(ZoomIn, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-number-input-increment>
          </ui-number-input-group>
        </ui-number-input>
      </ui-field>
      <div data-slot="row">
        <button type="button" data-action="out">−100</button>
        <button type="button" data-action="in">+10</button>
        <button type="button" data-action="reset">Actual size</button>
        <button type="button" data-action="read">Read</button>
        <button type="button" data-action="focus">Focus</button>
      </div>
      <output data-slot="output"></output>
    </div>
  `
  const field = root.querySelector("ui-number-input") as HTMLElement & { api: NumberInputController }
  const zoom = field.api
  const reading = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    out: () => zoom.decrement({ large: true }),
    in: () => zoom.increment(),
    reset: () => zoom.setValue(100),
    read: () => {
      reading.textContent = `Zoom is ${zoom.getValue()}.`
    },
    focus: () => zoom.focus(),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[button.dataset.action!]())
  })
}
