import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">

      <ui-field name="website">
        <ui-field-label>Website</ui-field-label>
        <ui-input-group>
          <span>https://</span>
          <ui-input>
            <input placeholder="example" />
          </ui-input>
          <span>.com</span>
        </ui-input-group>
      </ui-field>

    </div>
  `
}
