import "@ui-sdk/web/field"
import "@ui-sdk/web/textarea"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field disabled>
      <ui-field-label>Message</ui-field-label>
      <ui-textarea>
        <textarea>Replies are closed for this thread.</textarea>
      </ui-textarea>
    </ui-field>
  `
}
