import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable auto-save-id="docs-persistence">
      <ui-resizable-panel id="docs-sidebar" default-size="30" min-size="20">Sidebar</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize sidebar"><div></div></ui-resizable-handle>
      <ui-resizable-panel id="docs-content">Content</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
