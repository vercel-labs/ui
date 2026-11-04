import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster({ duration: 3000 })

  root.innerHTML = `
    <div data-slot="row">
      <button>1 second</button>
      <button>3 seconds</button>
      <button>Until dismissed</button>
    </div>
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
  const [second, seconds, untilDismissed] = root.querySelectorAll("button")
  second.addEventListener("click", () => toast("Copied", { duration: 1000 }))
  seconds.addEventListener("click", () => toast("Saved"))
  untilDismissed.addEventListener("click", () =>
    toast("Your session expires soon", {
      duration: Infinity,
      dismissible: false,
      cancel: { label: "Got it" },
    }),
  )
  return () => {
    toast.dismiss()
  }
}
