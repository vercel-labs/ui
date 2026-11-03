import "@ui-sdk/web/alert-dialog"
import "@ui-sdk/web/overlays"
import {
  createConfirm,
  createOverlays,
  createToaster,
  type ConfirmOptions,
  type UiAlertDialogElement,
} from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const overlays = createOverlays()
  const toast = createToaster({ overlays })
  const confirm = createConfirm({ overlays })

  let projects = ["Acme", "Globex"]
  root.innerHTML = `<ul data-slot="list"></ul>`
  const list = root.querySelector("ul")!
  function render() {
    list.innerHTML = projects
      .map(
        (name) => `
          <li data-slot="row">
            ${name}
            <button data-variant="secondary" data-project="${name}">Delete</button>
          </li>
        `,
      )
      .join("")
  }
  async function remove(name: string) {
    const yes = await confirm({
      title: `Delete ${name}?`,
      description: "This permanently deletes the project and its files.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
    })
    if (!yes) return
    const index = projects.indexOf(name)
    projects = projects.filter((project) => project !== name)
    render()
    list.querySelectorAll("button")[Math.min(index, projects.length - 1)]?.focus()
    toast.success(`${name} deleted`, { priority: "assertive" })
  }
  list.addEventListener("click", (event) => {
    const name = (event.target as Element).closest("button")?.dataset.project
    if (name) remove(name)
  })
  render()

  root.insertAdjacentHTML(
    "beforeend",
    `
    <ui-alert-dialog>
      <ui-alert-dialog-content>
        <ui-alert-dialog-title></ui-alert-dialog-title>
        <ui-alert-dialog-description></ui-alert-dialog-description>
        <div data-slot="row">
          <ui-alert-dialog-close><button data-variant="secondary"></button></ui-alert-dialog-close>
          <ui-alert-dialog-close value="confirm"><button data-variant="secondary"></button></ui-alert-dialog-close>
        </div>
      </ui-alert-dialog-content>
    </ui-alert-dialog>
  `,
  )
  const dialog = root.querySelector<UiAlertDialogElement<ConfirmOptions>>("ui-alert-dialog")!
  dialog.controller = confirm.controller
  dialog.addEventListener("payloadchange", (event) => {
    const question = event.detail.value
    const [cancel, agree] = dialog.querySelectorAll("button")
    dialog.querySelector("ui-alert-dialog-title")!.textContent = question?.title ?? ""
    dialog.querySelector("ui-alert-dialog-description")!.textContent = question?.description ?? ""
    cancel.textContent = question?.cancelLabel ?? "Cancel"
    agree.textContent = question?.confirmLabel ?? "Continue"
  })

  const template = document.createElement("template")
  template.innerHTML = `
    <ui-toast>
      <div data-slot="stack">
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
      </div>
    </ui-toast>
  `
  const host = Object.assign(document.createElement("ui-overlay-host"), {
    overlays,
    toast: {
      template,
    },
  })
  root.append(host)
  return () => {
    toast.dismiss()
  }
}
