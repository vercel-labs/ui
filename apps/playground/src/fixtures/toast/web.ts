import { confirm, type ToastContent } from "@ui-sdk/web"
import { toastFixture, toastOptions, usesHost } from "tests/fixtures/toast.ts"
import { createFixtureToasts } from "./shared"

// Region options as attributes: side="top", max-visible="2", shortcut="none".
function regionAttributes() {
  const attributes: Record<string, string> = { class: "toast-region" }
  for (const [name, value] of Object.entries(toastOptions()))
    attributes[name] = value === true ? "" : value === null ? "none" : String(value)
  return attributes
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/dialog")
  await import("@ui-sdk/web/toast")
  await import("@ui-sdk/web/overlays")
  const { basic, success, error, promise, dialog } = toastFixture
  const host = usesHost()
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <button data-show="basic">${basic.trigger}</button>
      <button data-show="success">${success.trigger}</button>
      <button data-show="error">${error.trigger}</button>
      <button data-show="promise">${promise.trigger}</button>
      <ui-dialog>
        <ui-dialog-trigger><button>${dialog.trigger}</button></ui-dialog-trigger>
        <ui-dialog-content class="dialog">
          <ui-dialog-title class="title">${dialog.title}</ui-dialog-title>
          <button data-show="basic">${dialog.toast}</button>
          <ui-dialog-close><button>${dialog.close}</button></ui-dialog-close>
        </ui-dialog-content>
      </ui-dialog>
      ${host ? `<button data-confirm>${toastFixture.confirm.trigger}</button>` : ""}
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      ${
        host
          ? "<ui-overlay-host></ui-overlay-host>"
          : `<ui-toast-region>
              <template>
                <ui-toast class="toast">
                  <ui-toast-title class="toast-title"></ui-toast-title>
                  <ui-toast-description class="toast-description"></ui-toast-description>
                  <ui-toast-action><button class="toast-action"></button></ui-toast-action>
                  <ui-toast-close><button class="toast-close">${toastFixture.dismiss}</button></ui-toast-close>
                </ui-toast>
              </template>
            </ui-toast-region>`
      }
    </div>
  `
  const output = root.querySelector("output")!
  const toasts = createFixtureToasts<ToastContent>((action) => (output.textContent = action))
  root.addEventListener("click", async (event) => {
    const target = (event.target as Element).closest<HTMLElement>("[data-show], [data-confirm]")
    if (!target) return
    if (target.dataset.show) toasts[target.dataset.show as "basic" | "success" | "error" | "promise"]()
    if (target.hasAttribute("data-confirm")) {
      const { title, confirm: confirmLabel, cancel } = toastFixture.confirm
      output.textContent = (await confirm({ title, confirmLabel, cancelLabel: cancel }))
        ? "confirmed"
        : "declined"
    }
  })
  const overlayHost = root.querySelector("ui-overlay-host") as (HTMLElement & { toast?: object }) | null
  if (overlayHost) {
    const template = document.createElement("template")
    template.innerHTML = `
      <ui-toast class="toast">
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
        <ui-toast-close><button></button></ui-toast-close>
      </ui-toast>`
    overlayHost.toast = { attributes: regionAttributes(), template }
  }
  const region = root.querySelector("ui-toast-region") as (HTMLElement & { toaster?: unknown }) | null
  if (region) {
    for (const [name, value] of Object.entries(regionAttributes())) region.setAttribute(name, value)
    region.toaster = toasts.toast
  }
}

export { mount }
