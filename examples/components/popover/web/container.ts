import "@ui-sdk/web/popover"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-popover container="#popover-container">
        <ui-popover-trigger><button>Open in the box</button></ui-popover-trigger>
        <ui-popover-content>
          <ui-popover-title>Portaled</ui-popover-title>
          <ui-popover-description>This popover is in the box below, in the DOM.</ui-popover-description>
        </ui-popover-content>
      </ui-popover>
      <div data-slot="card">
        Container
        <div id="popover-container"></div>
      </div>
    </div>
  `
}

export { mount }
