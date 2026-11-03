import "@ui-sdk/web/switch"
import { createElement, LoaderCircle } from "lucide"

const save = (_checked: boolean) => new Promise((resolve) => setTimeout(resolve, 800))

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label">
        <ui-switch aria-busy="false">
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
        Automatic backups
      </label>
      <p data-slot="hint" role="status"></p>
    </div>
  `
  const backups = root.querySelector("ui-switch")!
  const thumb = root.querySelector("ui-switch-thumb")!
  const message = root.querySelector("p")!
  let saving = false

  backups.addEventListener("checkedchange", (event) => {
    const { value, reason } = event.detail
    if (reason === "imperative") return
    event.preventDefault()
    if (saving) return
    saving = true
    backups.setAttribute("aria-busy", "true")
    thumb.innerHTML = createElement(LoaderCircle, { "aria-hidden": "true" }).outerHTML
    message.textContent = "Saving…"
    save(value).then(() => {
      saving = false
      backups.api.setChecked(value, { reason: "imperative" })
      backups.setAttribute("aria-busy", "false")
      thumb.innerHTML = ""
      message.textContent = "Saved"
    })
  })
}

export { mount }
