import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/react/toast"

export function Example() {
  const [toast] = React.useState(() => createToaster())
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
        onClick={() =>
          toast("Event has been created", {
            description: "Your event is ready to share.",
            cancel: { label: "Dismiss" },
          })
        }
      >
        Show toast
      </button>
      <ToastRegion toaster={toast}>
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>

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
