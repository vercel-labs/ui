import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  root.innerHTML = `
    <button>Show toast</button>
    <ui-toast-region>
      <template>
        <ui-toast>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>

          <ui-toast-close><button></button></ui-toast-close>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  root.querySelector("button")!.addEventListener("click", () =>
    toast("Event has been created", {
      description: "Your event is ready to share.",
      cancel: { label: "Dismiss" },
    }),
  )
  return () => {
    toast.dismiss()
  }
}
