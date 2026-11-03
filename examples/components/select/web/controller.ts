import "@ui-sdk/web/select"
import { Check, createElement } from "lucide"

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
      <div data-slot="row">
        <span data-slot="hint">Toolbar</span>
        <ui-select-trigger for="select-controller">
          <button aria-label="Fruit">
            <ui-select-value for="select-controller"></ui-select-value>
          </button>
        </ui-select-trigger>
      </div>
      <ui-select id="select-controller" placeholder="Fruit">
        <template>
          <ui-select-content>
            <ui-select-item>
              <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
            </ui-select-item>
          </ui-select-content>
        </template>
      </ui-select>
      <div data-slot="row">
        <button type="button" data-action="open">
          Open
        </button>
        <button type="button" data-action="banana">
          Banana
        </button>
        <button type="button" data-action="clear">
          Clear
        </button>
        <button type="button" data-action="focus">
          Focus
        </button>
      </div>
      <output data-slot="output">Use the buttons</output>
    </div>
  `
  const select = root.querySelector("ui-select") as HTMLElement & {
    items: typeof fruits
    api: {
      open: () => Promise<{ reason: string }>
      getValue: () => string | null
      setValue: (value: string | null) => void
      clear: () => void
      focus: () => void
    }
  }
  select.items = fruits
  const fruit = select.api
  const log = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    open: async () => {
      const { reason } = await fruit.open()
      log.textContent = `Closed by ${reason}, with ${fruit.getValue() ?? "nothing"}`
    },
    banana: () => fruit.setValue("banana"),
    clear: () => fruit.clear(),
    focus: () => fruit.focus(),
  }
  for (const button of root.querySelectorAll<HTMLElement>("[data-action]"))
    button.addEventListener("click", () => actions[button.dataset.action!]())
}
