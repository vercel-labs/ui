import "@ui-sdk/web/radio"
import "@ui-sdk/web/field"

const options = [
  { value: "email", label: "Email only" },
  { value: "sms", label: "SMS only" },
  { value: "both", label: "Both email and SMS" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field>
        <ui-field-label>Notification preferences</ui-field-label>
        <ui-field-description>Choose how you want to receive notifications.</ui-field-description>
        <ui-radio-group name="notifications" required>
          ${options
            .map(
              (option) => `
                <label data-slot="label">
                  <ui-radio value="${option.value}">
                    <ui-radio-indicator></ui-radio-indicator>
                  </ui-radio>
                  ${option.label}
                </label>`,
            )
            .join("")}
        </ui-radio-group>
        <ui-field-error>Choose how to receive notifications.</ui-field-error>
      </ui-field>
      <button type="submit">Save</button>
      <output data-slot="output" hidden></output>
    </form>
  `
  const form = root.querySelector("form")!
  const saved = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    saved.hidden = false
    saved.textContent = `Saved: ${new FormData(form).get("notifications")}`
  })
}

export { mount }
