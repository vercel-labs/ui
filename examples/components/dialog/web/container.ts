import "@ui-sdk/web/dialog"

let count = 0

function mount(root: HTMLElement) {
  const id = `dialog-container-${++count}`
  root.innerHTML = `
    <ui-dialog container="#${id}">
      <ui-dialog-trigger><button>Open in the box</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>Portaled</ui-dialog-title>
          <ui-dialog-description>This dialog is in the box below, in the DOM.</ui-dialog-description>
        </div>
        <div data-slot="row">
          <ui-dialog-close><button data-variant="solid">Close</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
    <div data-slot="stack">
      Container
      <div id="${id}"></div>
    </div>
  `
}

export { mount }
