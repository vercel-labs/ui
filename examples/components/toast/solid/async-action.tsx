import { onCleanup } from "solid-js"
import { Toast, ToastAction, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/solid/toast"

export function Example() {
  const toast = createToaster({ duration: 4000 })

  const restore = () => new Promise((resolve) => setTimeout(resolve, 1500))
  onCleanup(() => {
    toast.dismiss()
  })

  return (
    <>
      <button onClick={() => toast("File deleted", { action: { label: "Undo", onAction: restore } })}>
        Delete file
      </button>
      <ToastRegion toaster={toast}>
        {() => (
          <Toast>
            <ToastTitle />
            <ToastAction>
              {(state) => (state.pending ? "Restoring…" : state.error ? "Try again" : "Undo")}
            </ToastAction>
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
