import { onCleanup } from "solid-js"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/solid/toast"

export function Example() {
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
  onCleanup(() => {
    clearInterval(timer)
    toast.dismiss()
  })

  return (
    <>
      <div data-slot="row">
        <button onClick={upload}>Upload</button>
        <button onClick={() => toast.dismiss("upload")}>Cancel upload</button>
        <button onClick={() => toast.dismiss()}>Dismiss all</button>
      </div>
      <ToastRegion toaster={toast}>
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
