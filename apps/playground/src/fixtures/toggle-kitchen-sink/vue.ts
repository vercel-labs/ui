import {
  Button,
  createToggleController,
  createToggleGroupController,
  Separator,
  Toggle,
  ToggleGroup,
} from "@ui-sdk/vue"
import type { ChangeDetails } from "@ui-sdk/core"
import { createApp, defineComponent, h, ref, type PropType } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { items, pendingAction, type Variant } from "./variants"
import { renderAs } from "../vue-render-as"

const props = {
  variant: { type: Object as PropType<Variant>, required: true as const },
  env: { type: Object as PropType<Env>, required: true as const },
}

const VariantToggle = defineComponent({
  props,
  setup({ variant, env }) {
    const pressed = ref(false)
    const controller = variant.controller ? createToggleController() : undefined
    if (controller) {
      env.controls([
        ["toggle()", () => controller.toggle()],
        ["setPressed(true)", () => controller.setPressed(true)],
        ["isPressed()", () => controller.isPressed()],
        ["focus()", () => controller.focus()],
      ])
    }
    return () =>
      h(
        Toggle,
        {
          class: classes.toggle,
          ...variant.options,
          ...(variant.controlled && { pressed: pressed.value }),
          controller,
          onPressedChange: (next: boolean, details: ChangeDetails) => {
            if (variant.cancel) {
              return details.cancel()
            }
            if (variant.controlled) {
              pressed.value = next
            }
            env.log(
              `pressedChange ${next} (${details.reason}, ${details.source})`
            )
          },
        },
        renderAs(
          variant.render === "span" ? "span" : undefined,
          () => "Bookmark"
        )
      )
  },
})

const VariantGroup = defineComponent({
  props,
  setup({ variant, env }) {
    const value = ref<string[]>([])
    const controller = variant.controller
      ? createToggleGroupController()
      : undefined
    if (controller) {
      env.controls([
        [
          "setValue([bold, italic])",
          () => controller.setValue(["bold", "italic"]),
        ],
        ["toggle(underline)", () => controller.toggle("underline")],
        ["getValue()", () => controller.getValue()],
        ["focus()", () => controller.focus()],
      ])
    }
    return () =>
      h(
        ToggleGroup,
        {
          class: classes.group,
          "aria-label": variant.title,
          ...variant.options,
          ...(variant.controlled && { value: value.value }),
          controller,
          onValueChange: (next: string[], details: ChangeDetails) => {
            if (variant.cancel) {
              return details.cancel()
            }
            if (variant.controlled) {
              value.value = next
            }
            env.log(
              `valueChange [${next}] (${details.reason}, ${details.source})`
            )
          },
        },
        () =>
          items[variant.items ?? "alignment"].map((item) =>
            h(
              Toggle,
              {
                key: item.value,
                class: classes.toggle,
                value: item.value,
                disabled: "disabled" in item && item.disabled,
              },
              renderAs(
                variant.render === "span" ? "span" : undefined,
                () => item.label
              )
            )
          )
      )
  },
})

const VariantButton = defineComponent({
  props,
  setup({ variant, env }) {
    const onClick = () => {
      env.log("click")
      if (variant.action !== "resolve" && variant.action !== "reject") {
        return
      }
      return pendingAction(variant).then(
        () => env.log("done"),
        (error: Error) => {
          env.log(`failed: ${error.message}`)
          throw error
        }
      )
    }
    const label =
      variant.form === "reset"
        ? "Reset"
        : variant.render === "link"
          ? "Docs"
          : "Save"
    return () => {
      const button = h(
        Button,
        {
          class: classes.button,
          ...variant.options,
          type: variant.form,
          href: variant.render === "link" ? "#kitchen-sink-link" : undefined,
          onClick: variant.action ? onClick : undefined,
        },
        renderAs(
          variant.render === "link"
            ? "a"
            : variant.render === "span"
              ? "span"
              : undefined,
          () => label
        )
      )
      if (!variant.form) {
        return button
      }
      return h(
        "form",
        {
          class: "flex items-center gap-2",
          onSubmit: (event: Event) => {
            event.preventDefault()
            env.log("submit")
          },
          onReset: () => env.log("reset"),
        },
        [
          h("input", {
            class:
              "h-8 w-28 rounded-md border border-neutral-200 px-2 text-[13px]",
            "aria-label": "Name",
            defaultValue: "Ada",
          }),
          button,
        ]
      )
    }
  },
})

const VariantSeparator = defineComponent({
  props,
  setup({ variant }) {
    return () =>
      h(
        "div",
        {
          class:
            variant.options?.orientation === "vertical"
              ? classes.row
              : classes.column,
        },
        [
          h("span", "Blog"),
          h(
            Separator,
            { class: classes.separator, ...variant.options },
            renderAs(variant.render === "hr" ? "hr" : undefined)
          ),
          h("span", "Docs"),
        ]
      )
  },
})

const parts = {
  Toggle: VariantToggle,
  "Toggle Group": VariantGroup,
  Button: VariantButton,
  Separator: VariantSeparator,
}

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(parts[variant.section], { variant, env }).mount(slot)
  )
}

export { mount }
