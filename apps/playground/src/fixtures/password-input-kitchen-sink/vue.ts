import {
  createPasswordInputController,
  Field,
  FieldDescription,
  FieldLabel,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/vue"
import type { ChangeDetails } from "@ui-sdk/core"
import { createApp, defineComponent, h, ref, type PropType } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"
import { renderAs } from "../vue-render-as"

const eye = () =>
  h(
    "svg",
    {
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      class: "size-4",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
    },
    [
      h("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" }),
      h("circle", { cx: "12", cy: "12", r: "3" }),
    ]
  )

const VariantPasswordInput = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true as const },
    env: { type: Object as PropType<Env>, required: true as const },
  },
  setup({ variant, env }) {
    const { fieldDisabled, ...options } = (variant.options ?? {}) as Record<
      string,
      unknown
    >
    const visible = ref(false)
    const controller = variant.controller
      ? createPasswordInputController()
      : undefined
    if (controller) {
      env.controls([
        ["toggleVisible()", () => controller.toggleVisible()],
        ["setVisible(true)", () => controller.setVisible(true)],
        ["isVisible()", () => controller.isVisible()],
        ['setValue("hunter22")', () => controller.setValue("hunter22")],
        ["getValue()", () => controller.getValue()],
        ["clear()", () => controller.clear()],
        ["focus()", () => controller.focus()],
      ])
    }
    const input = () =>
      h(
        PasswordInput,
        {
          class: classes.root,
          ...options,
          ...(variant.controlled && { visible: visible.value }),
          controller,
          onValueChange: (value: string, details: ChangeDetails) =>
            env.log(`valueChange "${value}" (${details.reason})`),
          onVisibleChange: (next: boolean, details: ChangeDetails) => {
            if (variant.cancel) {
              return details.cancel()
            }
            if (variant.controlled) {
              visible.value = next
            }
            env.log(
              `visibleChange ${next} (${details.reason}, ${details.source})`
            )
          },
        },
        () => [
          h(PasswordInputControl, {
            class: classes.input,
            "aria-label": variant.field ? undefined : "Password",
          }),
          h(
            PasswordInputToggle,
            {
              class: classes.toggle,
              "aria-label": "Show password",
            },
            renderAs(variant.render === "span" ? "span" : undefined, eye)
          ),
        ]
      )
    return () => {
      if (variant.field) {
        return h(
          Field,
          { disabled: !!fieldDisabled, class: "flex flex-col gap-1.5" },
          () => [
            h(FieldLabel, { class: classes.label }, () => "Password"),
            input(),
            h(
              FieldDescription,
              { class: classes.description },
              () => "At least 8 characters."
            ),
          ]
        )
      }
      if (variant.id === "caps-lock") {
        return h("div", { class: "group flex flex-col gap-1" }, [
          input(),
          h("p", { class: classes.capsLock }, "Caps Lock is on"),
        ])
      }
      if (!variant.form) {
        return input()
      }
      return h(
        "form",
        {
          class: "flex flex-col items-start gap-2",
          onSubmit: (event: SubmitEvent) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget as HTMLFormElement)
            env.log(`submit password=${JSON.stringify(data.get("password"))}`)
          },
          onReset: () => env.log("reset"),
        },
        [
          input(),
          h("div", { class: "flex gap-2" }, [
            h("button", { class: classes.button }, "Submit"),
            h("button", { type: "reset", class: classes.control }, "Reset"),
          ]),
        ]
      )
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantPasswordInput, { variant, env }).mount(slot)
  )
}

export { mount }
