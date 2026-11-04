import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster()
  let count = 0

  root.innerHTML = `
    <div data-slot="row">
      <button>Add toast</button>
      <label data-slot="label">
        <input type="checkbox" />
        Always expanded
      </label>
    </div>
    <ui-toast-region max-visible="4">
      <template>
        <ui-toast>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  const region = Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  root
    .querySelector("button")!
    .addEventListener("click", () =>
      toast(`Notification ${++count}`, { description: "Stacked with the others" }),
    )
  const checkbox = root.querySelector<HTMLInputElement>("input")!
  checkbox.addEventListener("change", () => region.toggleAttribute("expanded", checkbox.checked))
  return () => {
    toast.dismiss()
  }
}
