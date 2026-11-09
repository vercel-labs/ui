import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/react/toast"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { classes, createShell } from "./shell"

function mount(root: HTMLElement) {
  const shell = createShell(root)
  function Region() {
    const [options, setOptions] = React.useState(shell.options())
    React.useEffect(() => {
      shell.onChange(() => setOptions(shell.options()))
    }, [])
    return (
      <ToastRegion
        toaster={shell.toast}
        {...options}
        className={classes.region}
      >
        {(toast) => (
          <Toast className={classes.toast}>
            <div className={classes.content}>
              <ToastTitle className={classes.title} />
              <ToastDescription className={classes.description} />
            </div>
            <ToastAction className={classes.action}>
              {(state) =>
                state.pending
                  ? "…"
                  : state.error
                    ? "Retry"
                    : (toast.action?.label as React.ReactNode)
              }
            </ToastAction>
            {toast.cancel && (
              <ToastClose
                className={classes.close}
                action={toast.cancel.onCancel}
              >
                {toast.cancel.label as React.ReactNode}
              </ToastClose>
            )}
            <ToastClose className={classes.close} aria-label="Close">
              ×
            </ToastClose>
          </Toast>
        )}
      </ToastRegion>
    )
  }
  createRoot(shell.slot).render(
    <React.StrictMode>
      <Region />
    </React.StrictMode>
  )
}

export { mount }
