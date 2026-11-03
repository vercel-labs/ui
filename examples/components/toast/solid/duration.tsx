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
  const toast = createToaster({ duration: 3000 })
  onCleanup(() => {
    toast.dismiss()
  })

  return (
    <>
      <div data-slot="row">
        <button data-variant="secondary" onClick={() => toast("Copied", { duration: 1000 })}>
          1 second
        </button>
        <button data-variant="secondary" onClick={() => toast("Saved")}>
          3 seconds
        </button>
        <button
          data-variant="secondary"
          onClick={() =>
            toast("Your session expires soon", {
              duration: Infinity,
              dismissible: false,
              cancel: { label: "Got it" },
            })
          }
        >
          Until dismissed
        </button>
      </div>
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
