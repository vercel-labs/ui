import * as Vue from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { flakyAction, type Variant } from "./variants"

const {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} = Vue

function body(variant: Variant, onDirty: () => void) {
  if (variant.body === "text") {
    return []
  }
  if (variant.body === "long") {
    return Array.from({ length: 40 }, (_, index) => h("p", `Line ${index + 1}`))
  }
  if (variant.body === "dialog-form") {
    return [
      h("form", { method: "dialog", class: "mb-4 flex gap-2" }, [
        h("button", { class: classes.button, value: "draft" }, "Save draft"),
        h("button", { class: classes.button, value: "publish" }, "Publish"),
      ]),
    ]
  }
  if (variant.body === "nested") {
    return [
      h(Dialog, null, () => [
        h(
          DialogTrigger,
          { class: `${classes.trigger} mb-4` },
          () => "Advanced"
        ),
        h(DialogBackdrop, { class: classes.backdrop() }),
        h(DialogContent, { class: classes.content() }, () => [
          h(DialogTitle, { class: classes.title }, () => "Advanced settings"),
          h(DialogClose, { class: classes.button }, () => "Done"),
        ]),
      ]),
    ]
  }
  return [
    h("label", { class: "mb-4 flex flex-col gap-1" }, [
      "Name",
      h("input", { class: classes.input, value: "Ada", onInput: onDirty }),
    ]),
  ]
}

const VariantDialog = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const open = ref(false)
    const dirty = ref(false)
    const controller = env.controller ?? Vue.createDialogController()
    const parts = variant.alert
      ? {
          Root: Vue.AlertDialog,
          Trigger: Vue.AlertDialogTrigger,
          Backdrop: Vue.AlertDialogBackdrop,
          Content: Vue.AlertDialogContent,
          Title: Vue.AlertDialogTitle,
          Description: Vue.AlertDialogDescription,
          Close: Vue.AlertDialogClose,
          Shortcut: Vue.AlertDialogShortcut,
        }
      : {
          Root: Vue.Dialog,
          Trigger: Vue.DialogTrigger,
          Backdrop: Vue.DialogBackdrop,
          Content: Vue.DialogContent,
          Title: Vue.DialogTitle,
          Description: Vue.DialogDescription,
          Close: Vue.DialogClose,
          Shortcut: Vue.DialogShortcut,
        }
    const backdrop = variant.backdrop ?? "part"
    return () =>
      h("div", { class: "flex items-center gap-3" }, [
        h(
          parts.Root as typeof Vue.Dialog,
          // Every variant's options, which differ in shape, so loosely typed.
          <Record<string, unknown>>{
            ...variant.options,
            controller,
            // A changed form refuses dismissals and asks. The Close part always closes.
            ...(variant.guard && { dismissible: !dirty.value }),
            onDismissAttempt: (details: { reason: string }) => {
              env.log(`dismissAttempt (${details.reason})`)
              if (variant.guard && window.confirm("Discard changes?")) {
                controller.close()
              }
            },
            container: env.container,
            ...(variant.controlled && { open: open.value }),
            "onUpdate:open": (next: boolean) => {
              if (variant.controlled) {
                open.value = next
              }
            },
            onOpenChange: (
              next: boolean,
              details: {
                reason: string
                returnValue?: string
                cancel: () => void
              }
            ) => {
              if (!next) {
                dirty.value = false
              }
              env.log(
                `openChange ${next} (${details.reason})${details.returnValue ? ` returnValue=${details.returnValue}` : ""}`
              )
            },
            onOpenChangeComplete: (next: boolean) =>
              env.log(`openChangeComplete ${next}`),
          },
          () => [
            h(
              parts.Trigger,
              { class: classes.trigger, shortcut: variant.shortcut },
              () => [
                variant.trigger ?? "Open",
                variant.shortcut &&
                  h(parts.Shortcut, { class: "text-xs text-neutral-500" }),
              ]
            ),
            backdrop === "part" &&
              h(parts.Backdrop, { class: classes.backdrop(variant.animation) }),
            h(
              parts.Content,
              {
                class: classes.content(
                  variant.animation,
                  backdrop === "pseudo"
                ),
                ...variant.content,
              },
              () => [
                variant.titled !== false &&
                  h(parts.Title, { class: classes.title }, () => variant.title),
                h(
                  parts.Description,
                  { class: classes.description },
                  () => variant.note ?? "A dialog."
                ),
                ...(variant.alert
                  ? []
                  : body(variant, () => (dirty.value = true))),
                h("div", { class: "flex justify-end gap-2" }, [
                  !variant.alert &&
                    h(
                      "button",
                      {
                        class: classes.button,
                        "data-save": "",
                        onClick: () => env.log("save"),
                      },
                      "Save"
                    ),
                  h(parts.Close, { class: classes.button }, () =>
                    variant.alert ? "Cancel" : "Close"
                  ),
                  variant.alert &&
                    h(
                      parts.Close,
                      {
                        class: classes.danger,
                        value: "confirm",
                        ...(variant.action && { action: flakyAction }),
                      },
                      {
                        default: ({
                          state,
                        }: {
                          state: { pending: boolean; error: unknown }
                        }) =>
                          state.pending
                            ? "Deleting…"
                            : state.error
                              ? "Retry"
                              : "Delete",
                      }
                    ),
                ]),
              ]
            ),
          ]
        ),
        variant.controlled &&
          h(
            "label",
            { class: "flex items-center gap-1.5 text-xs text-neutral-600" },
            [
              h("input", {
                type: "checkbox",
                checked: open.value,
                onChange: (event: Event) =>
                  (open.value = (event.target as HTMLInputElement).checked),
              }),
              "open",
            ]
          ),
      ])
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantDialog, { variant, env }).mount(slot)
  )
}

export { mount }
