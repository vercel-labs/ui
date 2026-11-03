import { createConfirm } from "@ui-sdk/core/alert-dialog"
import "@ui-sdk/web/alert-dialog"
import type { UiAlertDialogElement } from "@ui-sdk/web/alert-dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ul aria-label="Projects"></ul>
      <button
        type="button"
      >
        Reset projects
      </button>
      <ui-alert-dialog>
        <ui-alert-dialog-backdrop
          hidden
        ></ui-alert-dialog-backdrop>
        <ui-alert-dialog-content
          hidden
        >
          <div data-slot="stack">
            <ui-alert-dialog-title></ui-alert-dialog-title>
            <ui-alert-dialog-description
            >
              The project and its files will be deleted for everyone.
            </ui-alert-dialog-description>
          </div>
          <div data-slot="row">
            <ui-alert-dialog-close>
              <button
              >
                Cancel
              </button>
            </ui-alert-dialog-close>
            <ui-alert-dialog-close value="confirm">
              <button data-variant="solid"
              >
                Delete
              </button>
            </ui-alert-dialog-close>
          </div>
        </ui-alert-dialog-content>
      </ui-alert-dialog>
    </div>
  `
  const confirm = createConfirm<{ name: string }>()
  const dialog = root.querySelector<UiAlertDialogElement<{ name: string }>>("ui-alert-dialog")!
  const title = root.querySelector("ui-alert-dialog-title")!
  const list = root.querySelector("ul")!
  const reset = root.querySelector("button")!
  dialog.controller = confirm.controller
  dialog.addEventListener("payloadchange", (event) => {
    title.textContent = `Delete ${event.detail.value?.name}?`
  })

  function resetProjects() {
    list.innerHTML = ["Acme", "Globex", "Initech"]
      .map(
        (name) => `
    <li data-slot="row">${name}<button type="button">Delete</button></li>
  `,
      )
      .join("")
    for (const row of list.querySelectorAll("li")) {
      const button = row.querySelector("button")!
      const name = row.firstChild!.textContent!
      button.addEventListener("click", async () => {
        if (!(await confirm({ name }))) return
        const next = (row.nextElementSibling ?? row.previousElementSibling)?.querySelector("button")
        const target = next ?? reset
        target.focus()
        row.remove()
        if (!list.children.length) list.innerHTML = `<li data-slot="row">All projects deleted.</li>`
      })
    }
  }
  reset.addEventListener("click", resetProjects)
  resetProjects()
}

export { mount }
