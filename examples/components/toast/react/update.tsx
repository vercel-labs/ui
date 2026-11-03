import * as React from "react"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/react/toast"

export function Example() {
  const [toast] = React.useState(() => createToaster())

  const timer = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  function upload() {
    clearInterval(timer.current)
    const id = toast.loading("Uploading… 0%", { id: "upload" })
    let progress = 0
    timer.current = setInterval(() => {
      progress += 25
      const done = progress >= 100
      const open = toast.update(
        id,
        done ? { title: "Upload complete", type: "success" } : { title: `Uploading… ${progress}%` },
      )
      if (done || !open) clearInterval(timer.current)
    }, 600)
  }
  React.useEffect(
    () => () => {
      clearInterval(timer.current)
      toast.dismiss()
    },
    [toast],
  )

  return (
    <>
      <div data-slot="row">
        <button data-variant="secondary" onClick={upload}>
          Upload
        </button>
        <button data-variant="secondary" onClick={() => toast.dismiss("upload")}>
          Cancel upload
        </button>
        <button data-variant="secondary" onClick={() => toast.dismiss()}>
          Dismiss all
        </button>
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
