import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
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

  root.innerHTML = `
    <button>Save</button>
    <ui-toast-region>
      <template>
        <ui-toast>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  root.querySelector("button")!.addEventListener("click", () =>
    toast.promise(save, {
      loading: "Saving…",
      success: (file) => ({ title: "Saved", description: file.name }),
      error: (error) => ({ title: "Could not save", description: (error as Error).message }),
    }),
  )
  return () => {
    toast.dismiss()
  }
}
