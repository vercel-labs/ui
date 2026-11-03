import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const modes = [
  { value: "pointer", label: "Pointer" },
  { value: "true", label: "Modal" },
  { value: "false", label: "Non-modal" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div role="group" aria-label="Modal" data-slot="row">
        ${modes
          .map(
            (mode) => `
              <button type="button" data-mode="${mode.value}" aria-pressed="${mode.value === "pointer"}">
                ${mode.label}
              </button>
            `,
          )
          .join("")}
      </div>
      <ui-select modal="pointer" default-value="apple">
        <div data-slot="stack">
          <ui-select-label>Fruit</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </div>
        <ui-select-content>
          ${fruits
            .map(
              (fruit) => `
                <ui-select-item value="${fruit.value}">
                  ${fruit.label}
                  <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                </ui-select-item>
              `,
            )
            .join("")}
        </ui-select-content>
      </ui-select>
      <button type="button" data-press>
        Pressed 0 times
      </button>
    </div>
  `
  const select = root.querySelector("ui-select")!
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-mode]")
  for (const button of buttons)
    button.addEventListener("click", () => {
      select.setAttribute("modal", button.dataset.mode!)
      for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
    })
  let presses = 0
  const press = root.querySelector<HTMLButtonElement>("[data-press]")!
  press.addEventListener("click", () => (press.textContent = `Pressed ${++presses} times`))
}
