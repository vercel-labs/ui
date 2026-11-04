import { onCleanup } from "solid-js"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/solid/toast"

export function Example() {
  const toast = createToaster()

  let requests = 0

  function save() {
    const succeeds = ++requests % 2 === 1
    return new Promise<{ name: string }>((resolve, reject) =>
      setTimeout(
        () => (succeeds ? resolve({ name: "report.pdf" }) : reject(new Error("Network error"))),
        1500,
      ),
    )
  }
  onCleanup(() => {
    toast.dismiss()
  })

  return (
    <>
      <button
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
