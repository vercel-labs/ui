import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable default-layout="30,70">
      <ui-resizable-panel>Files</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize files"></ui-resizable-handle>
      <ui-resizable-panel>Editor</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
