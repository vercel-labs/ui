import "@ui-sdk/web/switch"
import "@ui-sdk/web/field"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field>
        <div data-slot="row">
          <ui-switch name="terms" required>
            <ui-switch-thumb></ui-switch-thumb>
          </ui-switch>
          <ui-field-label>I agree to the terms</ui-field-label>
        </div>
        <div><ui-field-error match="valueMissing">You must agree to the terms to continue.</ui-field-error></div>
      </ui-field>
      <button type="submit">Continue</button>
      <output data-slot="output"></output>
    </form>
  `
  const thanks = root.querySelector("output")!
  root.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault()
    thanks.textContent = "Thanks, you're all set."
  })
  root.querySelector("ui-switch")!.addEventListener("checkedchange", () => (thanks.textContent = ""))
}

export { mount }
