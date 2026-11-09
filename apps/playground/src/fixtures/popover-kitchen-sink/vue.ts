import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

function body(variant: Variant) {
  if (variant.body === "text") {
    return []
  }
  if (variant.body === "long") {
    return Array.from({ length: 30 }, (_, index) => h("p", `Line ${index + 1}`))
  }
  if (variant.body === "nested") {
    return [
      h(Popover, null, () => [
        h(PopoverTrigger, { class: classes.trigger }, () => "More"),
        h(PopoverContent, { class: classes.content(), sideOffset: 8 }, () => [
          h(PopoverArrow, { class: classes.arrow }),
          h(PopoverTitle, { class: classes.title }, () => "More options"),
          h(PopoverClose, { class: classes.button }, () => "Done"),
        ]),
      ]),
    ]
  }
  return [
    h("label", { class: "mb-3 flex flex-col gap-1" }, [
      "Name",
      h("input", { class: classes.input, value: "Ada" }),
    ]),
  ]
}

const VariantPopover = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const open = ref(false)
    return () =>
      h("div", { class: "flex items-center gap-3" }, [
        h(
          Popover,
          {
            ...variant.options,
            controller: env.controller,
            container: env.container,
            ...(variant.controlled && { open: open.value }),
            "onUpdate:open": (next: boolean) => {
              if (variant.controlled) {
                open.value = next
              }
            },
            onOpenChange: (next: boolean, details: { reason: string }) =>
              env.log(`openChange ${next} (${details.reason})`),
          },
          () => [
            h(
              PopoverTrigger,
              { class: classes.trigger },
              () => variant.trigger ?? "Open"
            ),
            h(
              PopoverContent,
              {
                class: classes.content(variant.animation),
                sideOffset: 8,
                ...variant.content,
                anchor: env.anchor,
              },
              () => [
                variant.arrow !== false &&
                  h(PopoverArrow, { class: classes.arrow }),
                variant.titled !== false &&
                  h(
                    PopoverTitle,
                    { class: classes.title },
                    () => variant.title
                  ),
                h(
                  PopoverDescription,
                  { class: classes.description },
                  () => variant.note ?? "A popover."
                ),
                ...body(variant),
                h("div", { class: "flex gap-2" }, [
                  h(
                    "button",
                    {
                      class: classes.button,
                      "data-save": "",
                      onClick: () => env.log("save"),
                    },
                    "Save"
                  ),
                  h(PopoverClose, { class: classes.button }, () => "Close"),
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
    createApp(VariantPopover, { variant, env }).mount(slot)
  )
}

export { mount }
