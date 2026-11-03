import * as React from "react"
import {
  Toast,
  ToastAction,
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
          toast("Invoice created", {
            description: "INV-1042",
            action: { label: "View", href: "#invoice-1042" },
          })
        }
      >
        Create invoice
      </button>
      <p data-slot="hint" id="invoice-1042">
        Invoice INV-1042 · $240 · Draft
      </p>
      <ToastRegion toaster={toast}>
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastAction data-variant="secondary" />
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
