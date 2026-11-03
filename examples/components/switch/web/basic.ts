import "@ui-sdk/web/switch"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <label data-slot="label">
      <ui-switch>
        <ui-switch-thumb></ui-switch-thumb>
      </ui-switch>
      Airplane Mode
    </label>
  `
}

export { mount }
