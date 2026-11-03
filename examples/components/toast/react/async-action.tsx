import * as React from "react"
import { Toast, ToastAction, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/react/toast"

export function Example() {
  const [toast] = React.useState(() => createToaster({ duration: 4000 }))

  const restore = () => new Promise((resolve) => setTimeout(resolve, 1500))
  React.useEffect(
    () => () => {
      toast.dismiss()
    },
    [toast],
  )

  return (
    <>
      <button
        data-variant="secondary"
        onClick={() => toast("File deleted", { action: { label: "Undo", onAction: restore } })}
      >
        Delete file
      </button>
      <ToastRegion toaster={toast}>
        {() => (
          <Toast>
            <ToastTitle />
            <ToastAction data-variant="secondary">
              {(state) => (state.pending ? "Restoring…" : state.error ? "Try again" : "Undo")}
            </ToastAction>
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
