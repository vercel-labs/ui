import { confirm } from "@ui-sdk/react/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { OverlayHost } from "@ui-sdk/react/overlays"
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
import { toastFixture, toastOptions, usesHost } from "tests/fixtures/toast.ts"
import { createFixtureToasts } from "./shared"

let record: (action: string) => void = () => {}
const toasts = createFixtureToasts<React.ReactNode>((action) => record(action))

function Fixture() {
  const [action, setAction] = React.useState("")
  record = setAction
  const host = usesHost()
  return (
    <div className="fixture">
      <button>Before</button>
      <button onClick={toasts.basic}>{toastFixture.basic.trigger}</button>
      <button onClick={toasts.success}>{toastFixture.success.trigger}</button>
      <button onClick={toasts.error}>{toastFixture.error.trigger}</button>
      <button onClick={toasts.promise}>{toastFixture.promise.trigger}</button>
      <Dialog>
        <DialogTrigger>{toastFixture.dialog.trigger}</DialogTrigger>
        <DialogContent className="dialog">
          <DialogTitle className="title">
            {toastFixture.dialog.title}
          </DialogTitle>
          <button onClick={toasts.basic}>{toastFixture.dialog.toast}</button>
          <DialogClose>{toastFixture.dialog.close}</DialogClose>
        </DialogContent>
      </Dialog>
      {host && (
        <button
          onClick={async () => {
            const {
              title,
              confirm: confirmLabel,
              cancel,
            } = toastFixture.confirm
            const yes = await confirm({
              title,
              confirmLabel,
              cancelLabel: cancel,
            })
            setAction(yes ? "confirmed" : "declined")
          }}
        >
          {toastFixture.confirm.trigger}
        </button>
      )}
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      {host ? (
        <OverlayHost
          toast={{
            ...toastOptions(),
            className: "toast-region",
            children: (toast) => (
              <Toast className="toast">
                <ToastTitle />
                <ToastDescription />
                <ToastAction />
                {toast.cancel && (
                  <ToastClose action={toast.cancel.onCancel}>
                    {toast.cancel.label}
                  </ToastClose>
                )}
              </Toast>
            ),
          }}
        />
      ) : (
        <ToastRegion
          toaster={toasts.toast}
          className="toast-region"
          {...toastOptions()}
        >
          {() => (
            <Toast className="toast">
              <ToastTitle className="toast-title" />
              <ToastDescription className="toast-description" />
              <ToastAction className="toast-action" />
              <ToastClose className="toast-close">
                {toastFixture.dismiss}
              </ToastClose>
            </Toast>
          )}
        </ToastRegion>
      )}
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
