import "@ui-sdk/web/resizable"
import type { UiResizableElement } from "@ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-resizable default-layout="30,70">
        <ui-resizable-panel min-size="20">Files</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize files"></ui-resizable-handle>
        <ui-resizable-panel min-size="20">Editor</ui-resizable-panel>
      </ui-resizable>
      <div data-slot="row">
        <button data-variant="secondary" type="button" data-layout="20,80">Narrow</button>
        <button data-variant="secondary" type="button" data-layout="50,50">Even</button>
      </div>
      <output data-slot="output">30 / 70</output>
    </div>
  `
  const group = root.querySelector<UiResizableElement>("ui-resizable")!
  const output = root.querySelector("output")!
  group.addEventListener("layoutchange", (event) => {
    output.textContent = event.detail.value.map(Math.round).join(" / ")
  })
  root.querySelectorAll<HTMLButtonElement>("[data-layout]").forEach((button) => {
    button.addEventListener("click", () => (group.layout = button.dataset.layout!.split(",").map(Number)))
  })
}

export { mount }
