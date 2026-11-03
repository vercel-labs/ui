import "@ui-sdk/web/switch"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <label data-slot="label">
        <ui-switch data-size="sm">
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
        Small
      </label>
      <label data-slot="label">
        <ui-switch>
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
        Default
      </label>
    </div>
  `
}
