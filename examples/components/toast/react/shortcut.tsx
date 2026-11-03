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
        onClick={() => toast("Press Alt+T to reach this toast", { cancel: { label: "Done" } })}
      >
        Show toast
      </button>
      <ToastRegion toaster={toast} shortcut="alt+t" aria-label="Alerts">
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastClose data-variant="secondary" />
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
