import "@ui-sdk/web/field"
import "@ui-sdk/web/textarea"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field name="bio">
      <ui-field-label>Bio</ui-field-label>
      <ui-textarea>
        <textarea maxlength="160" required></textarea>
      </ui-textarea>
      <ui-field-description>0 / 160</ui-field-description>
    </ui-field>
  `
  const count = root.querySelector("ui-field-description")!
  root.querySelector("ui-textarea")!.addEventListener("valuechange", (event) => {
    count.textContent = `${event.detail.value.length} / 160`
  })
}
