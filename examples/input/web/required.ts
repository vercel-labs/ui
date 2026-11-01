import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field name="email">
        <ui-field-label>Email</ui-field-label>
        <ui-input>
          <input type="email" required />
        </ui-input>
        <ui-field-error></ui-field-error>
      </ui-field>
      <button type="submit">Continue</button>
    </form>
  `
  root.querySelector("form")!.addEventListener("submit", (event) => event.preventDefault())
}
