import "@ui-sdk/web/switch"
import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field data-variant="card">
      <div data-slot="stack">
        <ui-field-label>Multi-factor authentication</ui-field-label>
        <ui-field-description>
          Enable multi-factor authentication. If you don't have a two-factor device, use a one-time code sent to
          your email.
        </ui-field-description>
      </div>
      <ui-switch name="mfa">
        <ui-switch-thumb></ui-switch-thumb>
      </ui-switch>
    </ui-field>
  `
}
