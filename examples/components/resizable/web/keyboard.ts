import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable step="5" large-step="25">
      <ui-resizable-panel default-size="50" min-size="10">Left</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize left"></ui-resizable-handle>
      <ui-resizable-panel default-size="50" min-size="10">Right</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
