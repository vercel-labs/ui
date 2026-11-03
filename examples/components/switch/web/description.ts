import "@ui-sdk/web/switch"
import "@ui-sdk/web/field"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <div data-slot="stack">
        <ui-field-label>Share across devices</ui-field-label>
        <ui-field-description>
          Focus is shared across devices, and turns off when you leave the app.
        </ui-field-description>
      </div>
      <ui-switch>
        <ui-switch-thumb></ui-switch-thumb>
      </ui-switch>
    </ui-field>
  `
}

export { mount }
