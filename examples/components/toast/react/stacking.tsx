import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/react/toast"
import * as React from "react"

export function Example() {
  const [toast] = React.useState(() => createToaster())
  const count = React.useRef(0)
  React.useEffect(
    () => () => {
      toast.dismiss()
    },
    [toast],
  )

  const [expanded, setExpanded] = React.useState(false)
  return (
    <>
      <div data-slot="row">
        <button
          data-variant="secondary"
          onClick={() => toast(`Notification ${++count.current}`, { description: "Stacked with the others" })}
        >
          Add toast
        </button>
        <label data-slot="label">
          <input type="checkbox" checked={expanded} onChange={(event) => setExpanded(event.target.checked)} />
          Always expanded
        </label>
      </div>
      <ToastRegion toaster={toast} max={4} expanded={expanded}>
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
