import "@ui-sdk/web/resizable"
import type { UiResizableElement } from "@ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-resizable>
        <ui-resizable-panel id="controller-sidebar" default-size="30" min-size="20" collapsible>Sidebar</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize sidebar"></ui-resizable-handle>
        <ui-resizable-panel>Editor</ui-resizable-panel>
      </ui-resizable>
      <div data-slot="row">
        <button data-variant="secondary" type="button" data-action="collapse">Collapse</button>
        <button data-variant="secondary" type="button" data-action="expand">Expand</button>
        <button data-variant="secondary" type="button" data-action="resize">240px</button>
        <button data-variant="secondary" type="button" data-action="read">Read</button>
      </div>
      <output data-slot="output" hidden></output>
    </div>
  `
  const group = root.querySelector<UiResizableElement>("ui-resizable")!
  const editor = group.api
  const reading = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    collapse: () => editor.collapse("controller-sidebar"),
    expand: () => editor.expand("controller-sidebar"),
    resize: () => editor.resize("controller-sidebar", "240px"),
    read: () => {
      reading.textContent = `${editor.getLayout().map(Math.round).join(" / ")}${editor.isCollapsed(0) ? ", collapsed" : ""}`
      reading.hidden = false
    },
  }
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[button.dataset.action!]())
  })
}

export { mount }
