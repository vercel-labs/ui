import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field name="webhook">
      <ui-field-label>
        Webhook URL
        <span data-slot="row">Recommended</span>
      </ui-field-label>
      <ui-input>
        <input type="url" placeholder="https://example.com/hooks" />
      </ui-input>
      <ui-field-description>We'll post an event here for every new order.</ui-field-description>
    </ui-field>
  `
}
