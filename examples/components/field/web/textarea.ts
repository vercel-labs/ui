import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-field-label>Feedback</ui-field-label>
      <textarea rows="4" name="feedback" placeholder="Your feedback helps us improve."></textarea>
      <ui-field-description>Share your thoughts about our service.</ui-field-description>
    </ui-field>
  `
}
