import "@ui-sdk/web/popover"
import { CircleQuestionMark, createElement } from "lucide"

const sides = ["top", "right", "bottom", "left"]
const aligns = ["start", "center", "end"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack" data-controls>
        <div data-slot="row" role="group" aria-label="Side" data-attribute="side">
          ${sides
            .map(
              (value) =>
                `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === "bottom"}">${value}</button>`,
            )
            .join("")}
        </div>
        <div data-slot="row" role="group" aria-label="Align" data-attribute="align">
          ${aligns
            .map(
              (value) =>
                `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === "start"}">${value}</button>`,
            )
            .join("")}
        </div>
      </div>
      <ui-popover>
        <ui-popover-trigger><button aria-label="Help">${createElement(CircleQuestionMark, { "aria-hidden": "true" }).outerHTML}</button></ui-popover-trigger>
        <ui-popover-content side="bottom" align="start" side-offset="10" arrow-padding="12">
          <ui-popover-arrow></ui-popover-arrow>
          <ui-popover-title>Keyboard shortcuts</ui-popover-title>
          <ui-popover-description>Press ? anywhere to see every shortcut.</ui-popover-description>
        </ui-popover-content>
      </ui-popover>
    </div>
  `
  const controls = root.querySelector("[data-controls]")!
  const content = root.querySelector("ui-popover-content")!
  for (const group of root.querySelectorAll<HTMLElement>("[data-attribute]"))
    group.addEventListener("click", (event) => {
      const button = (event.target as HTMLElement).closest("button")
      if (!button) return
      content.setAttribute(group.dataset.attribute!, button.value)
      for (const other of group.querySelectorAll("button"))
        other.setAttribute("aria-pressed", String(other === button))
    })
  root.querySelector("ui-popover")!.addEventListener("openchange", (event) => {
    const { value, event: cause } = event.detail
    if (!value && cause?.target instanceof Node && controls.contains(cause.target)) event.preventDefault()
  })
}

export { mount }
