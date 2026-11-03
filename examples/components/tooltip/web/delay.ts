import "@ui-sdk/web/tooltip"
import { Bold, Code, createElement, Italic, Link, Underline } from "lucide"

const tools = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: Link, label: "Link" },
  { icon: Code, label: "Code" },
]
const groups = [
  { name: "delay", values: ["0", "600", "1200"], current: "600" },
  { name: "close-delay", label: "closeDelay", values: ["0", "300"], current: "0" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="grid">
        ${groups
          .map(
            ({ name, label, values, current }) => `
        <span data-slot="hint">${label ?? name}</span>
        <div data-slot="row" role="group" aria-label="${label ?? name}" data-attribute="${name}">
          ${values.map((value) => `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === current}">${value}</button>`).join("")}
        </div>`,
          )
          .join("")}
      </div>
      <label data-slot="label"><input type="checkbox" checked /> Show tooltips</label>
      <div data-slot="row" role="group" aria-label="Formatting">
        ${tools
          .map(
            (tool) => `
        <ui-tooltip delay="600" close-delay="0">
          <ui-tooltip-trigger><button>${createElement(tool.icon, { "aria-hidden": "true" }).outerHTML}</button></ui-tooltip-trigger>
          <ui-tooltip-content>${tool.label}</ui-tooltip-content>
        </ui-tooltip>`,
          )
          .join("")}
      </div>
    </div>
  `
  const tooltips = root.querySelectorAll("ui-tooltip")
  for (const group of root.querySelectorAll<HTMLElement>("[data-attribute]"))
    group.addEventListener("click", (event) => {
      const button = (event.target as HTMLElement).closest("button")
      if (!button) return
      for (const tooltip of tooltips) tooltip.setAttribute(group.dataset.attribute!, button.value)
      for (const other of group.querySelectorAll("button"))
        other.setAttribute("aria-pressed", String(other === button))
    })
  const show = root.querySelector<HTMLInputElement>("input")!
  show.addEventListener("change", () => {
    for (const tooltip of tooltips) tooltip.toggleAttribute("disabled", !show.checked)
  })
}

export { mount }
