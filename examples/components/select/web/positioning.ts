import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const sides = ["top", "right", "bottom", "left"]
const aligns = ["start", "center", "end"]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        <div role="group" aria-label="Side" data-slot="row">
          ${sides
            .map(
              (value) => `
                <button type="button" data-side="${value}" aria-pressed="${value === "bottom"}">
                  ${value}
                </button>
              `,
            )
            .join("")}
        </div>
        <div role="group" aria-label="Align" data-slot="row">
          ${aligns
            .map(
              (value) => `
                <button type="button" data-align="${value}" aria-pressed="${value === "start"}">
                  ${value}
                </button>
              `,
            )
            .join("")}
        </div>
        <label data-slot="label">
          <input type="checkbox" />
          Anchor to the box
        </label>
      </div>
      <div id="select-positioning-box" data-slot="card">
        <ui-select default-value="apple">
          <ui-select-trigger>
            <button aria-label="Fruit">
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
          <ui-select-content side="bottom" align="start" side-offset="10" align-offset="0" collision-padding="16">
            <ui-select-arrow></ui-select-arrow>
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
      </div>
    </div>
  `
  const content = root.querySelector("ui-select-content")!
  for (const name of ["side", "align"]) {
    const buttons = root.querySelectorAll<HTMLButtonElement>(`[data-${name}]`)
    for (const button of buttons)
      button.addEventListener("click", () => {
        content.setAttribute(name, button.getAttribute(`data-${name}`)!)
        for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
      })
  }
  const anchored = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!
  anchored.addEventListener("change", () => {
    if (anchored.checked) content.setAttribute("anchor", "#select-positioning-box")
    else content.removeAttribute("anchor")
  })
}
