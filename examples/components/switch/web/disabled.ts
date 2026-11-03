import "@ui-sdk/web/switch"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <label data-slot="label">
      <ui-switch disabled>
        <ui-switch-thumb></ui-switch-thumb>
      </ui-switch>
      Disabled
    </label>
  `
}

export { mount }
