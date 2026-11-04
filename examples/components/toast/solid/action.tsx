import { onCleanup } from "solid-js"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/solid/toast"
import { createSignal } from "solid-js"

export function Example() {
  const toast = createToaster()
  onCleanup(() => {
    toast.dismiss()
  })

  const [status, setStatus] = createSignal("")
  return (
    <>
      <button
        onClick={() =>
          toast("Message archived", {
            action: { label: "Undo", onAction: () => setStatus("Restored"), dismiss: true },
            cancel: { label: "Dismiss", onCancel: () => setStatus("Kept archived") },
            onDismiss: ({ reason }) => reason === "timeout" && setStatus("Timed out"),
          })
        }
      >
        Archive message
      </button>
      <output data-slot="output">{status()}</output>
      <ToastRegion toaster={toast}>
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastAction />
            {item.cancel && <ToastClose action={item.cancel.onCancel}>{item.cancel.label}</ToastClose>}
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
