import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field name="avatar">
      <ui-field-label>Picture</ui-field-label>
      <ui-input>
        <input type="file" accept="image/*" />
      </ui-input>
      <ui-field-description>PNG or JPG, up to 2 MB.</ui-field-description>
    </ui-field>
  `
}
