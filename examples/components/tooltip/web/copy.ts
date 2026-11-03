import "@ui-sdk/web/tooltip"
import { Check, Copy, createElement } from "lucide"

const command = "pnpm add @ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <code>${command}</code>
      <ui-tooltip close-on-press="false">
        <ui-tooltip-trigger><button>${createElement(Copy, { "aria-hidden": "true" }).outerHTML}</button></ui-tooltip-trigger>
        <ui-tooltip-content>Copy</ui-tooltip-content>
      </ui-tooltip>
    </div>
  `
  const button = root.querySelector("button")!
  const content = root.querySelector("ui-tooltip-content")!
  button.addEventListener("click", () => {
    navigator.clipboard?.writeText(command).catch(() => {})
    button.replaceChildren(createElement(Check, { "aria-hidden": "true" }))
    content.textContent = "Copied"
  })
  root.querySelector("ui-tooltip")!.addEventListener("openchangecomplete", (event) => {
    if (event.detail.value) return
    button.replaceChildren(createElement(Copy, { "aria-hidden": "true" }))
    content.textContent = "Copy"
  })
}

export { mount }
