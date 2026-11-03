import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field name="email">
        <ui-field-label>Email</ui-field-label>
        <input type="email" required placeholder="m@example.com" />
        <ui-field-description>
          <span data-hide="valid">We'll send you a confirmation link.</span>
          <span data-show="valid">Looks good.</span>
        </ui-field-description>
        <div><ui-field-error match="valueMissing">Enter your email address.</ui-field-error>
        <ui-field-error match="typeMismatch">Enter an email address like m@example.com.</ui-field-error>
      </div></ui-field>
      <ui-field name="website">
        <ui-field-label>Website</ui-field-label>
        <input type="url" required placeholder="https://example.com" />
        <div><ui-field-error></ui-field-error>
      </div></ui-field>
      <button type="submit">Subscribe</button>
      <output data-slot="output"></output>
    </form>
  `
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("output")!.textContent = `Subscribed ${new FormData(form).get("email")}.`
  })
}
