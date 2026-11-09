import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, shallowRef } from "vue"
import type { Toast as ToastData } from "@ui-sdk/core/toast"
import { classes, createShell } from "./shell"

function mount(root: HTMLElement) {
  const shell = createShell(root)
  const options = shallowRef(shell.options())
  shell.onChange(() => (options.value = shell.options()))
  const Region = defineComponent(
    () => () =>
      h(
        ToastRegion,
        { toaster: shell.toast, ...options.value, class: classes.region },
        {
          default: ({ toast }: { toast: ToastData<string> }) =>
            h(Toast, { class: classes.toast }, () => [
              h("div", { class: classes.content }, [
                h(ToastTitle, { class: classes.title }),
                h(ToastDescription, { class: classes.description }),
              ]),
              h(
                ToastAction,
                { class: classes.action },
                {
                  default: ({
                    state,
                  }: {
                    state: { pending: boolean; error?: unknown }
                  }) =>
                    state.pending
                      ? "…"
                      : state.error
                        ? "Retry"
                        : toast.action?.label,
                }
              ),
              toast.cancel
                ? h(
                    ToastClose,
                    { class: classes.close, action: toast.cancel.onCancel },
                    () => toast.cancel!.label
                  )
                : null,
              h(
                ToastClose,
                { class: classes.close, "aria-label": "Close" },
                () => "×"
              ),
            ]),
        }
      )
  )
  createApp(Region).mount(shell.slot)
}

export { mount }
