import "@ui-sdk/web/toggle"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-toggle disabled>
        <button>Disabled</button>
      </ui-toggle>
      <ui-toggle disabled default-pressed>
        <button>Disabled</button>
      </ui-toggle>
    </div>
  `
}

export { mount }
