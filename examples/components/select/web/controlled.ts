import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-select default-value="apple" debug>
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
      <div data-slot="row">
        <button type="button" data-value>
          Blueberry
        </button>
        <button type="button" data-open>
          Open
        </button>
      </div>
      <output data-slot="output">Change something</output>
    </div>
  `
  const select = root.querySelector("ui-select") as HTMLElement & { value: string | null; open: boolean }
  const log = root.querySelector("output")!
  select.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: string | null; reason: string }>).detail
    if (value === "pineapple") {
      event.preventDefault()
      log.textContent = "Pineapple is sold out"
      return
    }
    log.textContent = `value: ${value} (${reason})`
  })
  select.addEventListener("openchange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: boolean; reason: string }>).detail
    log.textContent = `open: ${value} (${reason})`
  })
  root.querySelector("[data-value]")!.addEventListener("click", () => (select.value = "blueberry"))
  root.querySelector("[data-open]")!.addEventListener("click", () => (select.open = true))
}
