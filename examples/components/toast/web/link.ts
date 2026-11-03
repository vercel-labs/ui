import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  root.innerHTML = `
    <button data-variant="secondary">Create invoice</button>
    <p data-slot="hint" id="invoice-1042">Invoice INV-1042 · $240 · Draft</p>
    <ui-toast-region>
      <template>
        <ui-toast>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>
          <ui-toast-action><button data-variant="secondary"></button></ui-toast-action>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  root.querySelector("button")!.addEventListener("click", () =>
    toast("Invoice created", {
      description: "INV-1042",
      action: { label: "View", href: "#invoice-1042" },
    }),
  )
  return () => {
    toast.dismiss()
  }
}
