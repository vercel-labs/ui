import { onCleanup } from "solid-js"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/solid/toast"
import { createSignal } from "solid-js"

export function Example() {
  const toast = createToaster()
  let count = 0
  onCleanup(() => {
    toast.dismiss()
  })

  const [expanded, setExpanded] = createSignal(false)
  return (
    <>
      <div data-slot="row">
        <button
          data-variant="secondary"
          onClick={() => toast(`Notification ${++count}`, { description: "Stacked with the others" })}
        >
          Add toast
        </button>
        <label data-slot="label">
          <input
            type="checkbox"
            checked={expanded()}
            onChange={(event) => setExpanded(event.currentTarget.checked)}
          />
          Always expanded
        </label>
      </div>
      <ToastRegion toaster={toast} maxVisible={4} expanded={expanded()}>
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
