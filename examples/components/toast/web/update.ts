import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  let timer: ReturnType<typeof setInterval> | undefined

  function upload() {
    clearInterval(timer)
    const id = toast.loading("Uploading… 0%", { id: "upload" })
    let progress = 0
    timer = setInterval(() => {
      progress += 25
      const done = progress >= 100
      const open = toast.update(
        id,
        done ? { title: "Upload complete", type: "success" } : { title: `Uploading… ${progress}%` },
      )
      if (done || !open) clearInterval(timer)
    }, 600)
  }

  root.innerHTML = `
    <div data-slot="row">
      <button data-variant="secondary">Upload</button>
      <button data-variant="secondary">Cancel upload</button>
      <button data-variant="secondary">Dismiss all</button>
    </div>
    <ui-toast-region>
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
  Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  const [start, cancel, dismissAll] = root.querySelectorAll("button")
  start.addEventListener("click", upload)
  cancel.addEventListener("click", () => toast.dismiss("upload"))
  dismissAll.addEventListener("click", () => toast.dismiss())
  return () => {
    clearInterval(timer)
    toast.dismiss()
  }
}
