import "@ui-sdk/web/file-input"
import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field>
        <ui-field-label>Proof of address</ui-field-label>
        <ui-file-input name="proof" required accept="image/*,.pdf">
          <ui-file-input-dropzone>
            <span data-slot="hint">Drop a scan here</span>
            <ui-file-input-trigger><button>Choose a file</button></ui-file-input-trigger>
          </ui-file-input-dropzone>
        </ui-file-input>
        <ui-field-description>A utility bill or bank statement from the last 3 months.</ui-field-description>
        <div><ui-field-error match="valueMissing">Add a scan to continue.</ui-field-error></div>
      </ui-field>
      <div data-slot="row">
        <button type="submit">Continue</button>
        <button type="reset">Reset</button>
        <span data-result data-slot="output"></span>
      </div>
    </form>
  `
  const form = root.querySelector("form")!
  const input = form.querySelector("ui-file-input")!
  const status = input.querySelector("span")!
  const trigger = input.querySelector("button")!
  const sent = form.querySelector<HTMLElement>("[data-result]")!

  input.addEventListener("valuechange", (event) => {
    const [file] = event.detail.value
    status.textContent = file?.name ?? "Drop a scan here"
    trigger.textContent = file ? "Replace" : "Choose a file"
  })
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    sent.textContent = "Sent."
  })
  form.addEventListener("reset", () => {
    sent.textContent = ""
  })
}
