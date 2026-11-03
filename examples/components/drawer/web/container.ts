import "@ui-sdk/web/drawer"

let count = 0

function mount(root: HTMLElement) {
  const id = `drawer-container-${++count}`
  root.innerHTML = `
    <ui-drawer container="#${id}">
      <ui-drawer-trigger><button>Open in the box</button></ui-drawer-trigger>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <ui-drawer-title>Portaled</ui-drawer-title>
          <ui-drawer-description>This drawer is in the box below, in the DOM.</ui-drawer-description>
        </div>
        <div data-slot="stack">
          <ui-drawer-close><button data-variant="solid">Close</button></ui-drawer-close>
        </div>
      </ui-drawer-content>
    </ui-drawer>
    <div data-slot="stack">
      Container
      <div id="${id}"></div>
    </div>
  `
}

export { mount }
