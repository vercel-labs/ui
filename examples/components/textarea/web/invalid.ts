import "@ui-sdk/web/field"
import "@ui-sdk/web/textarea"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field invalid>
      <ui-field-label>Message</ui-field-label>
      <ui-textarea>
        <textarea>hi</textarea>
      </ui-textarea>
      <ui-field-error match>Write at least 20 characters.</ui-field-error>
    </ui-field>
  `
}
