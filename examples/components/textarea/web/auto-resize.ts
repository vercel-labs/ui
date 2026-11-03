import "@ui-sdk/web/field"
import "@ui-sdk/web/textarea"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field name="notes">
      <ui-field-label>Notes</ui-field-label>
      <ui-textarea auto-resize>
        <textarea placeholder="Type a few lines…"></textarea>
      </ui-textarea>
      <ui-field-description>Grows as you type, then scrolls.</ui-field-description>
    </ui-field>
  `
}
