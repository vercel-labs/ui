import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  root.innerHTML = `
    <button>Archive message</button>
    <output data-slot="output"></output>
    <ui-toast-region>
      <template>
        <ui-toast>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>
          <ui-toast-action><button></button></ui-toast-action>
          <ui-toast-close><button></button></ui-toast-close>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  const output = root.querySelector("output")!
  const setStatus = (status: string) => (output.textContent = status)
  root.querySelector("button")!.addEventListener("click", () =>
    toast("Message archived", {
      action: { label: "Undo", onAction: () => setStatus("Restored"), dismiss: true },
      cancel: { label: "Dismiss", onCancel: () => setStatus("Kept archived") },
      onDismiss: ({ reason }) => reason === "timeout" && setStatus("Timed out"),
    }),
  )
  return () => {
    toast.dismiss()
  }
}
