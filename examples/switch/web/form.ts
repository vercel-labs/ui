import "@ui-sdk/web/switch"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <form data-slot="stack" id="email-preferences">
        <fieldset data-slot="stack">
          <legend>Email notifications</legend>
          <label data-slot="label">
            Marketing emails
            <ui-switch name="marketing">
              <ui-switch-thumb></ui-switch-thumb>
            </ui-switch>
          </label>
          <label data-slot="label">
            Security alerts
            <ui-switch name="security" default-checked>
              <ui-switch-thumb></ui-switch-thumb>
            </ui-switch>
          </label>
          <label data-slot="label">
            Weekly digest
            <ui-switch name="digest" value="weekly" default-checked>
              <ui-switch-thumb></ui-switch-thumb>
            </ui-switch>
          </label>
        </fieldset>
        <div data-slot="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <div>
        <label data-slot="label">
          Join the beta
          <ui-switch name="beta" form="email-preferences">
            <ui-switch-thumb></ui-switch-thumb>
          </ui-switch>
        </label>
      </div>
      <output data-slot="output"></output>
    </div>
  `
  const preferences = root.querySelector("form")!
  const submitted = root.querySelector("output")!
  preferences.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = [...new FormData(preferences)].map(([name, value]) => `${name}=${value}`)
    submitted.textContent = `Submitted: ${data.join(", ") || "nothing"}`
  })
  preferences.addEventListener("reset", () => (submitted.textContent = ""))
}

export { mount }
