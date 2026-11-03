import "@ui-sdk/web/tooltip"
import { CircleQuestionMark, createElement } from "lucide"

const groups = [
  { name: "side", values: ["top", "right", "bottom", "left"], current: "top" },
  { name: "align", values: ["start", "center", "end"], current: "center" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="grid">
          ${groups
            .map(
              ({ name, values, current }) => `
          <span data-slot="hint">${name}</span>
          <div data-slot="row" role="group" aria-label="${name}" data-attribute="${name}">
            ${values.map((value) => `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === current}">${value}</button>`).join("")}
          </div>`,
            )
            .join("")}
        </div>
        <label data-slot="label"><input type="checkbox" /> Keep open</label>
      </div>
      <ui-tooltip>
        <ui-tooltip-trigger><button>${createElement(CircleQuestionMark, { "aria-hidden": "true" }).outerHTML}</button></ui-tooltip-trigger>
        <ui-tooltip-content side="top" align="center" side-offset="8" arrow-padding="8">
          <ui-tooltip-arrow></ui-tooltip-arrow>
          Keyboard shortcuts
        </ui-tooltip-content>
      </ui-tooltip>
    </div>
  `
  const tooltip = root.querySelector("ui-tooltip")!
  const content = root.querySelector("ui-tooltip-content")!
  for (const group of root.querySelectorAll<HTMLElement>("[data-attribute]"))
    group.addEventListener("click", (event) => {
      const button = (event.target as HTMLElement).closest("button")
      if (!button) return
      content.setAttribute(group.dataset.attribute!, button.value)
      for (const other of group.querySelectorAll("button"))
        other.setAttribute("aria-pressed", String(other === button))
    })
  const pin = root.querySelector<HTMLInputElement>("input")!
  pin.addEventListener("change", () => (tooltip.open = pin.checked))
  tooltip.addEventListener("openchange", (event) => {
    if (!event.detail.value && pin.checked) event.preventDefault()
  })
}

export { mount }
