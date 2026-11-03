import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable orientation="vertical">
      <ui-resizable-panel default-size="25">Header</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize header"></ui-resizable-handle>
      <ui-resizable-panel default-size="75">Content</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
