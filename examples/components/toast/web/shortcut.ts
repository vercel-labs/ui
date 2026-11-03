import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  root.innerHTML = `
    <button data-variant="secondary">Show toast</button>
    <ui-toast-region shortcut="alt+t" aria-label="Alerts">
      <template>
        <ui-toast>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>
          <ui-toast-close><button data-variant="secondary"></button></ui-toast-close>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  root
    .querySelector("button")!
    .addEventListener("click", () => toast("Press Alt+T to reach this toast", { cancel: { label: "Done" } }))
  return () => {
    toast.dismiss()
  }
}
