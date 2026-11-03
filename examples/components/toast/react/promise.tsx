import * as React from "react"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/react/toast"

export function Example() {
  const [toast] = React.useState(() => createToaster())

  const requests = React.useRef(0)

  function save() {
    const succeeds = ++requests.current % 2 === 1
    return new Promise<{ name: string }>((resolve, reject) =>
      setTimeout(
        () => (succeeds ? resolve({ name: "report.pdf" }) : reject(new Error("Network error"))),
        1500,
      ),
    )
  }
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
          toast.promise(save, {
            loading: "Saving…",
            success: (file) => ({ title: "Saved", description: file.name }),
            error: (error) => ({ title: "Could not save", description: (error as Error).message }),
          })
        }
      >
        Save
      </button>
      <ToastRegion toaster={toast}>
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
