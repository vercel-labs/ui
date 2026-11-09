import { createConfirm } from "@ui-sdk/core/dialog"
import {
  alertDialogFixture,
  alertDialogOptions,
  dialogContentOptions,
  dialogFixture,
  dialogOptions,
  dialogParts,
} from "tests/fixtures/dialog.ts"
import { exposeDialogFixture, recordOpenChange } from "./shared"

const parts = dialogParts()
const backdrop = (owner: string) =>
  parts.backdrop
    ? `<${owner}-backdrop class="dialog-backdrop"></${owner}-backdrop>`
    : ""

const nested = `
  <ui-dialog id="nested">
    <ui-dialog-trigger><button>${dialogFixture.nested.trigger}</button></ui-dialog-trigger>
    ${backdrop("ui-dialog")}
    <ui-dialog-content class="dialog">
      <ui-dialog-title class="title">${dialogFixture.nested.title}</ui-dialog-title>
      <ui-dialog-close><button>${dialogFixture.nested.close}</button></ui-dialog-close>
    </ui-dialog-content>
  </ui-dialog>
`

// A trigger outside the dialog, connected through its id, with a Shortcut part.
const remoteTrigger = `
  <ui-dialog-trigger for="dialog" shortcut="${dialogFixture.shortcut.keys}">
    <button>${dialogFixture.shortcut.trigger} <ui-dialog-shortcut></ui-dialog-shortcut></button>
  </ui-dialog-trigger>
`

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-dialog id="dialog">
      ${`<ui-dialog-trigger><button>${dialogFixture.trigger}</button></ui-dialog-trigger>`}
      ${backdrop("ui-dialog")}
      <ui-dialog-content class="dialog">
        ${parts.title ? `<ui-dialog-title class="title">${dialogFixture.title}</ui-dialog-title>` : ""}
        <ui-dialog-description class="description">${dialogFixture.description}</ui-dialog-description>
        <label class="field">
          ${dialogFixture.field}
          <input value="${dialogFixture.defaultValue}" />
        </label>
        ${parts.long ? `<p class="long">${dialogFixture.long}</p>` : ""}
        <div class="actions">
          <button id="save">${dialogFixture.action}</button>
          <ui-dialog-close><button>${dialogFixture.close}</button></ui-dialog-close>
          ${parts.removable ? `<button id="remove">${dialogFixture.remove}</button>` : ""}
        </div>
        ${parts.form ? `<form method="dialog"><button value="${dialogFixture.form.value}">${dialogFixture.form.label}</button></form>` : ""}
        ${parts.nested ? nested : ""}
      </ui-dialog-content>
    </ui-dialog>
    <ui-alert-dialog id="alert">
      <ui-alert-dialog-trigger><button>${alertDialogFixture.trigger}</button></ui-alert-dialog-trigger>
      ${backdrop("ui-alert-dialog")}
      <ui-alert-dialog-content class="dialog">
        <ui-alert-dialog-title class="title">${alertDialogFixture.title}</ui-alert-dialog-title>
        <ui-alert-dialog-description class="description">${alertDialogFixture.description}</ui-alert-dialog-description>
        <div class="actions">
          <ui-alert-dialog-close><button>${alertDialogFixture.cancel}</button></ui-alert-dialog-close>
          <ui-alert-dialog-close value="confirm"><button id="delete">${alertDialogFixture.action}</button></ui-alert-dialog-close>
        </div>
      </ui-alert-dialog-content>
    </ui-alert-dialog>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <button id="controller">Open with controller</button>
    ${parts.shortcut ? remoteTrigger : ""}
  </div>
`

type DialogElement = HTMLElement & {
  api: { open: () => Promise<unknown>; close: () => void }
  controller?: unknown
}

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const dialog = root.querySelector<DialogElement>("#dialog")!
  const alert = root.querySelector<DialogElement>("#alert")!
  const content = dialog.querySelector(":scope > ui-dialog-content")!
  const options = dialogOptions()
  const output = root.querySelector("output")!
  if (options.defaultOpen) {
    dialog.setAttribute("default-open", "")
  }
  if (options.modal !== undefined) {
    dialog.setAttribute("modal", String(options.modal))
  }
  if (options.closeOnOutsidePress === false) {
    dialog.setAttribute("close-on-outside-press", "false")
  }
  if (options.presentation) {
    dialog.setAttribute("presentation", options.presentation)
  }
  if (alertDialogOptions().defaultOpen) {
    alert.setAttribute("default-open", "")
  }
  if (options.container) {
    dialog.setAttribute("container", `#${options.container.id}`)
    alert.setAttribute("container", `#${options.container.id}`)
  }
  for (const [name, value] of Object.entries(dialogContentOptions())) {
    content.setAttribute(
      name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
      value
    )
  }
  const confirm = createConfirm()
  alert.controller = confirm.controller
  // Found before the elements upgrade, since an open dialog's content may move into its container.
  const nested = root.querySelector("#nested")
  const remove = root.querySelector("#remove")
  const save = root.querySelector("#save")!
  const del = root.querySelector("#delete")!
  await import("@ui-sdk/web/dialog")
  await import("@ui-sdk/web/alert-dialog")
  exposeDialogFixture(dialog.api, confirm)
  dialog.addEventListener("openchange", (event) => {
    const { value, reason, returnValue } = (
      event as CustomEvent<{
        value: boolean
        reason: string
        returnValue?: string
      }>
    ).detail
    recordOpenChange("dialog", value, { reason })
    if (!value && returnValue) {
      output.textContent = returnValue
    }
  })
  nested?.addEventListener("openchange", (event) => {
    const { value, reason } = (
      event as CustomEvent<{ value: boolean; reason: string }>
    ).detail
    recordOpenChange("nested", value, { reason })
  })
  remove?.addEventListener("click", () =>
    root.querySelector("ui-dialog-trigger")?.remove()
  )
  save.addEventListener("click", () => (output.textContent = "save"))
  del.addEventListener("click", () => (output.textContent = "delete"))
  root
    .querySelector("#controller")!
    .addEventListener("click", () => dialog.api.open())
}

export { mount }
