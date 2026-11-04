import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster({ duration: 4000 })

  const restore = () => new Promise((resolve) => setTimeout(resolve, 1500))

  root.innerHTML = `
    <button>Delete file</button>
    <ui-toast-region>
      <template>
        <ui-toast>
          <ui-toast-title></ui-toast-title>
          <ui-toast-action><button><span>Undo</span><span>Restoring…</span></button></ui-toast-action>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, { toaster: toast })
  root
    .querySelector("button")!
    .addEventListener("click", () => toast("File deleted", { action: { label: "Undo", onAction: restore } }))
  return () => {
    toast.dismiss()
  }
}
