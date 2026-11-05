import "@ui-sdk/web/field"
import "@ui-sdk/web/segmented-control"
import { log } from "../../../shared/web/log"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field>
        <ui-field-label>Billing period</ui-field-label>
        <ui-segmented-control name="billing" required default-value="monthly">
          <ui-segmented-control-indicator></ui-segmented-control-indicator>
          <ui-segmented-control-item value="monthly">Monthly</ui-segmented-control-item>
          <ui-segmented-control-item value="yearly">Yearly</ui-segmented-control-item>
        </ui-segmented-control>
      </ui-field>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Continue</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    log(root, `Submitted billing=${new FormData(form).get("billing")}`)
  })
}

export { mount }
