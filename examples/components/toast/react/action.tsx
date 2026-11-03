import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/react/toast"
import * as React from "react"

export function Example() {
  const [toast] = React.useState(() => createToaster())
  React.useEffect(
    () => () => {
      toast.dismiss()
    },
    [toast],
  )

  const [status, setStatus] = React.useState("")
  return (
    <>
      <button
        data-variant="secondary"
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
      <output data-slot="output">{status}</output>
      <ToastRegion toaster={toast}>
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastAction data-variant="secondary" />
            {item.cancel && (
              <ToastClose data-variant="secondary" action={item.cancel.onCancel}>
                {item.cancel.label}
              </ToastClose>
            )}
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
