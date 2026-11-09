import type { ChangeDetails } from "@ui-sdk/core"
import type { OTPInputSlotState } from "@ui-sdk/core/otp-input"
import {
  createOTPInputController,
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type PropType,
  type VNodeChild,
} from "vue"
import * as classes from "./classes"
import { formData, kitchenSink, type Env } from "./shell"
import {
  groupStarts,
  maxLengthOf,
  patterns,
  presets,
  type Variant,
} from "./variants"

function slots(variant: Variant) {
  const starts = groupStarts(variant)
  return variant.groups.flatMap((size, group) => [
    group > 0 && h(OTPInputSeparator, { class: classes.separator }, () => "-"),
    h(OTPInputGroup, { class: classes.group }, () =>
      Array.from({ length: size }, (_, offset) =>
        h(
          OTPInputSlot,
          { key: offset, index: starts[group] + offset, class: classes.slot },
          variant.masked
            ? {
                default: ({ state }: { state: OTPInputSlotState }) =>
                  state.char ? "•" : "",
              }
            : undefined
        )
      )
    ),
  ])
}

const VariantOTPInput = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    env: { type: Object as PropType<Env>, required: true },
  },
  setup({ variant, env }) {
    const { defaultValue, ...options } = variant.options ?? {}
    const value = ref(defaultValue ?? "")
    const invalid = ref(!!variant.invalid)
    const controller = variant.controller
      ? createOTPInputController()
      : undefined
    if (controller) {
      env.controls([
        ["setValue(123456)", () => controller.setValue("123456")],
        ["clear()", () => controller.clear()],
        ["focus()", () => controller.focus()],
        ["getValue()", () => controller.getValue()],
      ])
    } else if (variant.controlled) {
      env.controls(
        presets[variant.controlled].map(([label, next]) => [
          label,
          () => void (value.value = next),
        ])
      )
    }

    const otp = () =>
      h(
        OTPInput,
        {
          class: classes.root,
          "aria-label": "Verification code",
          ...options,
          ...(variant.controlled ? { value: value.value } : { defaultValue }),
          maxLength: maxLengthOf(variant),
          pattern: variant.pattern && patterns[variant.pattern],
          controller,
          debug: variant.debug,
          "aria-invalid": invalid.value || undefined,
          onValueChange: (next: string, details: ChangeDetails) => {
            if (variant.cancel && next.includes(variant.cancel)) {
              return details.cancel()
            }
            env.log(`valueChange "${next}" (${details.reason})`)
            if (variant.controlled) {
              value.value =
                variant.controlled === "uppercase" ? next.toUpperCase() : next
            }
            if (variant.verify) {
              invalid.value = false
            }
          },
          onValueCommit: (next: string) => {
            env.log(`complete "${next}"`)
            if (variant.verify) {
              invalid.value = next !== variant.verify
            }
          },
        },
        () => slots(variant)
      )

    return (): VNodeChild => {
      if (variant.place === "fieldset") {
        return h("fieldset", { disabled: true }, [otp()])
      }
      if (!variant.form) {
        return otp()
      }
      return h(
        "form",
        {
          class: classes.form,
          onSubmit: (event: SubmitEvent) => {
            event.preventDefault()
            env.log(
              `submit ${formData(event.currentTarget as HTMLFormElement)}`
            )
          },
          onReset: () => env.log("reset"),
          onInvalidCapture: (event: Event) =>
            env.log(
              `invalid: ${(event.target as HTMLInputElement).validationMessage}`
            ),
        },
        [
          otp(),
          h("div", { class: classes.row }, [
            h("button", { class: classes.button }, "Submit"),
            h("button", { type: "reset", class: classes.button }, "Reset"),
          ]),
        ]
      )
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantOTPInput, { variant, env }).mount(slot)
  )
}

export { mount }
