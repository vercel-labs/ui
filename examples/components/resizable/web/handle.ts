import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable>
      <ui-resizable-panel default-size="25">Sidebar</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize sidebar"><div></div></ui-resizable-handle>
      <ui-resizable-panel default-size="75">Content</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
