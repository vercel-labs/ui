import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-menu container="#menu-container-example">
        <ui-menu-trigger>
          <button>Open</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-item>Rendered in the panel</ui-menu-item>
          <ui-menu-item>Still placed by the trigger</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <div data-slot="card">
        Container
        <div id="menu-container-example"></div>
      </div>
    </div>
  `
}

export { mount }
