import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"
import { CircleCheck, createElement, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  root.innerHTML = `
    <div data-slot="row">
      <button>Default</button>
      <button>Success</button>
      <button>Info</button>
      <button>Warning</button>
      <button>Error</button>
      <button>Promise</button>
    </div>
    <ui-toast-region>
      <template>
        <ui-toast>
          ${createElement(CircleCheck, { "aria-hidden": "true", "data-show": "success" }).outerHTML}
          ${createElement(Info, { "aria-hidden": "true", "data-show": "info" }).outerHTML}
          ${createElement(TriangleAlert, { "aria-hidden": "true", "data-show": "warning" }).outerHTML}
          ${createElement(OctagonX, { "aria-hidden": "true", "data-show": "error" }).outerHTML}
          ${createElement(LoaderCircle, { "aria-hidden": "true", "data-show": "loading" }).outerHTML}
          <ui-toast-title></ui-toast-title>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, { toaster: toast })
  const [plain, success, info, warning, error, promise] = root.querySelectorAll("button")
  plain.addEventListener("click", () => toast("Event has been created"))
  success.addEventListener("click", () => toast.success("Event has been created"))
  info.addEventListener("click", () => toast.info("Be at the area 10 minutes before the event time"))
  warning.addEventListener("click", () => toast.warning("Event start time cannot be earlier than 8am"))
  error.addEventListener("click", () => toast.error("Event has not been created"))
  promise.addEventListener("click", () =>
    toast.promise(
      new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "Event" }), 2000)),
      {
        loading: "Loading...",
        success: (data) => `${data.name} has been created`,
        error: "Error",
      },
    ),
  )
  return () => {
    toast.dismiss()
  }
}
