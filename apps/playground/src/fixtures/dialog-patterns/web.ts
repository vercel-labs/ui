import { shortcuts } from "@ui-sdk/web"
import { dialogPatternsFixture as f } from "tests/fixtures/dialog.ts"
import { pendingAction, recordOpenChange } from "./shared"

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-menu id="file">
      <ui-menu-trigger shortcut="${f.menu.shortcut}"><button>${f.menu.trigger}</button></ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-item value="rename">${f.menu.rename}</ui-menu-item>
        <ui-menu-item value="close">${f.menu.close}</ui-menu-item>
      </ui-menu-content>
    </ui-menu>
    <ui-dialog id="rename" persistent-elements="#chat">
      <ui-dialog-trigger shortcut="${f.rename.shortcut}">
        <button>${f.rename.trigger} <ui-dialog-shortcut class="shortcut"></ui-dialog-shortcut></button>
      </ui-dialog-trigger>
      <ui-dialog-backdrop class="dialog-backdrop"></ui-dialog-backdrop>
      <ui-dialog-content class="dialog">
        <ui-dialog-title class="title">${f.rename.title}</ui-dialog-title>
        <label class="field">
          ${f.rename.field}
          <input value="${f.rename.defaultValue}" />
        </label>
        <ui-dialog-close><button>${f.rename.cancel}</button></ui-dialog-close>
      </ui-dialog-content>
    </ui-dialog>
    <ui-alert-dialog id="delete">
      <ui-alert-dialog-trigger><button>${f.remove.trigger}</button></ui-alert-dialog-trigger>
      <ui-alert-dialog-backdrop class="dialog-backdrop"></ui-alert-dialog-backdrop>
      <ui-alert-dialog-content class="dialog">
        <ui-alert-dialog-title class="title">${f.remove.title}</ui-alert-dialog-title>
        <ui-alert-dialog-description class="description">${f.remove.description}</ui-alert-dialog-description>
        <ui-alert-dialog-close><button>${f.remove.cancel}</button></ui-alert-dialog-close>
        <ui-alert-dialog-close value="confirm" action><button>${f.remove.action}</button></ui-alert-dialog-close>
      </ui-alert-dialog-content>
    </ui-alert-dialog>
    <label>
      ${f.search}
      <input />
    </label>
    <button id="chat">${f.chat}</button>
    <ui-popover container="#popover-root">
      <ui-popover-trigger shortcut="${f.share.shortcut}"><button>${f.share.trigger}</button></ui-popover-trigger>
      <ui-popover-content>
        <ui-popover-title>${f.share.title}</ui-popover-title>
        <ui-menu>
          <ui-menu-trigger><button>${f.share.menu}</button></ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item value="copy">${f.share.item}</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
        <ui-dialog>
          <ui-dialog-trigger><button>${f.share.dialog}</button></ui-dialog-trigger>
          <ui-dialog-content class="dialog">
            <ui-dialog-title class="title">${f.share.dialogTitle}</ui-dialog-title>
            <ui-dialog-close><button>${f.share.done}</button></ui-dialog-close>
          </ui-dialog-content>
        </ui-dialog>
      </ui-popover-content>
    </ui-popover>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
`

type DialogElement = HTMLElement & { api: { open: () => Promise<unknown> } }

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const output = root.querySelector("output")!
  const rename = root.querySelector<DialogElement>("#rename")!
  const field = rename.querySelector("input")!
  await import("@ui-sdk/web/menu")
  await import("@ui-sdk/web/popover")
  await import("@ui-sdk/web/dialog")
  await import("@ui-sdk/web/alert-dialog")
  root.querySelector("#file")!.addEventListener("action", (event) => {
    if ((event as CustomEvent<{ value: string }>).detail.value === "rename") {
      rename.api.open()
    }
  })
  // A dirty field makes the dialog refuse dismissals, which it reports.
  field.addEventListener("input", () =>
    rename.setAttribute("dismissible", "false")
  )
  rename.addEventListener("dismissattempt", (event) => {
    output.textContent = `attempt:${(event as CustomEvent<{ reason: string }>).detail.reason}`
  })
  rename.addEventListener("openchange", (event) => {
    if (event.target !== rename) {
      return
    }
    const { value, reason } = (
      event as CustomEvent<{ value: boolean; reason: string }>
    ).detail
    recordOpenChange("rename", value, { reason })
    if (!value) {
      rename.removeAttribute("dismissible")
    }
  })
  root.querySelector("#delete")!.addEventListener("openchange", (event) => {
    const { value, reason } = (
      event as CustomEvent<{ value: boolean; reason: string }>
    ).detail
    recordOpenChange("delete", value, { reason })
  })
  root
    .querySelector("ui-alert-dialog-close[action]")!
    .addEventListener("action", (event) =>
      (
        event as CustomEvent<{ waitUntil: (promise: Promise<unknown>) => void }>
      ).detail.waitUntil(pendingAction())
    )
  root
    .querySelector("#chat")!
    .addEventListener("click", () => (output.textContent = "chat"))
  shortcuts.register(
    f.pageShortcut,
    () => (output.textContent = "page shortcut")
  )
  shortcuts.register(f.slashShortcut, () => (output.textContent = "slash"))
  // Belongs to the dialog, so it runs while the dialog is open and modal.
  shortcuts.register(f.rename.save, () => (output.textContent = "saved"), {
    layer: field,
    allowInInput: true,
  })
}

export { mount }
