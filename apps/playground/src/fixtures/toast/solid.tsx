import { confirm } from "@ui-sdk/solid/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { OverlayHost } from "@ui-sdk/solid/overlays"
import {
  createToaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/solid/toast"
import { isServer, render, type JSX } from "@solidjs/web"
import { createSignal, Show } from "solid-js"
import {
  toastDuration,
  toastFixture,
  toastOptions,
  usesHost,
} from "tests/fixtures/toast.ts"
import { createFixtureToasts } from "./shared"

function Fixture() {
  const [action, setAction] = createSignal("")
  // Read here, not at module level, so the server reads each request's URL.
  // The server only renders the region, so it gets a bare toaster: the
  // fixture's toasts put `showToast` on the window.
  const toasts = isServer
    ? { toast: createToaster<JSX.Element>({ duration: toastDuration() }) }
    : createFixtureToasts<JSX.Element>((action) => setAction(action))
  const host = usesHost()
  const show = (kind: "basic" | "success" | "error" | "promise") => () => {
    if ("basic" in toasts) {
      toasts[kind]()
    }
  }
  return (
    <div class="fixture">
      <button>Before</button>
      <button onClick={show("basic")}>{toastFixture.basic.trigger}</button>
      <button onClick={show("success")}>{toastFixture.success.trigger}</button>
      <button onClick={show("error")}>{toastFixture.error.trigger}</button>
      <button onClick={show("promise")}>{toastFixture.promise.trigger}</button>
      <Dialog>
        <DialogTrigger>{toastFixture.dialog.trigger}</DialogTrigger>
        <DialogContent class="dialog">
          <DialogTitle class="title">{toastFixture.dialog.title}</DialogTitle>
          <button onClick={show("basic")}>{toastFixture.dialog.toast}</button>
          <DialogClose>{toastFixture.dialog.close}</DialogClose>
        </DialogContent>
      </Dialog>
      <Show when={host}>
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
      </Show>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <Show
        when={host}
        fallback={
          <ToastRegion
            toaster={toasts.toast}
            class="toast-region"
            {...toastOptions()}
          >
            {() => (
              <Toast class="toast">
                <ToastTitle class="toast-title" />
                <ToastDescription class="toast-description" />
                <ToastAction class="toast-action" />
                <ToastClose class="toast-close">
                  {toastFixture.dismiss}
                </ToastClose>
              </Toast>
            )}
          </ToastRegion>
        }
      >
        <OverlayHost
          toast={{
            ...toastOptions(),
            class: "toast-region",
            children: (toast) => (
              <Toast class="toast">
                <ToastTitle />
                <ToastDescription />
                <ToastAction />
                <Show when={toast.cancel}>
                  {(cancel) => (
                    <ToastClose action={cancel().onCancel}>
                      {cancel().label}
                    </ToastClose>
                  )}
                </Show>
              </Toast>
            ),
          }}
        />
      </Show>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
