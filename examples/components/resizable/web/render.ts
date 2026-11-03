import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable>
      <ui-resizable-panel default-size="35" min-size="20" collapsible>
        <span>Files</span>
        <span data-slot="hint" data-size>35%</span>
        <span data-slot="hint">Collapsed</span>
      </ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize files"></ui-resizable-handle>
      <ui-resizable-panel>Editor, horizontal</ui-resizable-panel>
    </ui-resizable>
  `
  const size = root.querySelector<HTMLElement>("[data-size]")!
  root.querySelector("ui-resizable")!.addEventListener("layoutchange", (event) => {
    size.textContent = `${Math.round(event.detail.value[0])}%`
  })
}

export { mount }
