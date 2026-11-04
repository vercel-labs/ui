import { onCleanup } from "solid-js"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/solid/toast"

export function Example() {
  const toast = createToaster()
  onCleanup(() => {
    toast.dismiss()
  })

  return (
    <>
      <button onClick={() => toast("Press Alt+T to reach this toast", { cancel: { label: "Done" } })}>
        Show toast
      </button>
      <ToastRegion toaster={toast} shortcut="alt+t" aria-label="Alerts">
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastClose />
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
