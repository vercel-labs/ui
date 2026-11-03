import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable>
      <ui-resizable-panel default-size="50">One</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize one"></ui-resizable-handle>
      <ui-resizable-panel default-size="50">
        <ui-resizable orientation="vertical">
          <ui-resizable-panel default-size="25">Two</ui-resizable-panel>
          <ui-resizable-handle aria-label="Resize two"></ui-resizable-handle>
          <ui-resizable-panel default-size="75">Three</ui-resizable-panel>
        </ui-resizable>
      </ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
