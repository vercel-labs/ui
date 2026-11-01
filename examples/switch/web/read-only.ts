import "@ui-sdk/web/switch"
import "@ui-sdk/web/field"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <div data-slot="stack">
        <ui-field-label>Encrypt backups</ui-field-label>
        <ui-field-description>Managed by your organization.</ui-field-description>
      </div>
      <ui-switch default-checked read-only>
        <ui-switch-thumb></ui-switch-thumb>
      </ui-switch>
    </ui-field>
  `
}

export { mount }
