import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type Component,
  type PropType,
} from "vue"
import * as classes from "./classes"
import { itemsOf, kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

const Grow = defineComponent({
  setup() {
    const lines = ref(1)
    return () =>
      h("div", { class: "flex flex-col gap-1" }, [
        ...Array.from({ length: lines.value }, (_, index) =>
          h("p", { key: index }, `Line ${index + 1}`)
        ),
        h(
          "button",
          {
            class: `${classes.button} self-start`,
            onClick: () => lines.value++,
          },
          "Add a line"
        ),
      ])
  },
})

// An accordion in every item, two levels deep. Events are logged with the item's
// path. Typed, so the recursion doesn't need the component's own inferred type.
const Nested: Component = defineComponent({
  name: "Nested",
  props: {
    env: { type: Object as PropType<Env>, required: true },
    path: { type: String, required: true },
    depth: { type: Number, default: 1 },
  },
  setup({ env, path, depth }) {
    return () =>
      h(Accordion, { class: classes.root, multiple: true }, () =>
        ["One", "Two"].map((label) =>
          h(
            AccordionItem,
            {
              key: label,
              value: label,
              onOpenChange: (open: boolean) =>
                env.log(`${path}/${label} openChange ${open}`),
              onOpenChangeComplete: (open: boolean) =>
                env.log(`${path}/${label} openChangeComplete ${open}`),
            },
            () => [
              h(AccordionHeader, { class: classes.header }, () =>
                h(
                  AccordionTrigger,
                  { class: classes.trigger },
                  () => `Level ${depth}, ${label.toLowerCase()}`
                )
              ),
              h(AccordionPanel, { class: classes.panel() }, () =>
                h(
                  "div",
                  { class: classes.inner },
                  depth < 2
                    ? [
                        h(Nested, {
                          env,
                          path: `${path}/${label}`,
                          depth: depth + 1,
                        }),
                      ]
                    : `Inside ${path}/${label}.`
                )
              ),
            ]
          )
        )
      )
  },
})

// What the second item's panel holds.
function body(variant: Variant, content: string, env: Env) {
  if (variant.body === "long") {
    return Array.from({ length: 20 }, (_, index) => h("p", `Line ${index + 1}`))
  }
  if (variant.body === "form") {
    return [
      h("label", { class: "flex flex-col" }, [
        content,
        h("input", {
          class: classes.input,
          value: "Ada",
          "aria-label": "Name",
        }),
      ]),
    ]
  }
  if (variant.body === "nested") {
    return [
      h(Accordion, { class: classes.root }, () =>
        ["Nested one", "Nested two"].map((label) =>
          h(AccordionItem, { key: label, value: label }, () => [
            h(AccordionHeader, { class: classes.header }, () =>
              h(AccordionTrigger, { class: classes.trigger }, () => label)
            ),
            h(AccordionPanel, { class: classes.panel() }, () =>
              h(
                "div",
                { class: classes.inner },
                `Inside ${label.toLowerCase()}.`
              )
            ),
          ])
        )
      ),
    ]
  }
  if (variant.body === "nested-deep") {
    return [h(Nested, { env, path: "b" })]
  }
  if (variant.body === "grow") {
    return [h(Grow)]
  }
  return [content]
}

const VariantAccordion = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const list = ref(itemsOf(variant))
    const value = ref<string[]>(variant.options?.defaultValue ?? [])
    const button = "rounded border border-neutral-200 px-2 py-1"
    return () =>
      h("div", { class: "flex flex-col gap-2" }, [
        h(
          Accordion,
          {
            class: classes.root,
            ...variant.options,
            controller: env.controller,
            ...(variant.controlled && { value: value.value }),
            onValueChange: (
              next: string[],
              details: { reason: string; cancel: () => void }
            ) => {
              if (variant.cancel && next.includes(variant.cancel)) {
                details.cancel()
                env.log(`valueChange ${JSON.stringify(next)} canceled`)
                return
              }
              if (variant.controlled) {
                value.value = next
              }
              env.log(`valueChange ${JSON.stringify(next)} (${details.reason})`)
            },
          },
          () =>
            list.value.map((item, index) =>
              h(
                AccordionItem,
                {
                  key: item.value,
                  class: classes.item,
                  value: item.value,
                  disabled: variant.disabledItems?.includes(item.value),
                  onOpenChange: (
                    open: boolean,
                    details: { cancel: () => void; canceled: boolean }
                  ) => {
                    if (variant.itemCancel === item.value) {
                      details.cancel()
                    }
                    env.log(
                      `${item.value} openChange ${open}${details.canceled ? " canceled" : ""}`
                    )
                  },
                  onOpenChangeComplete: (open: boolean) =>
                    env.log(`${item.value} openChangeComplete ${open}`),
                },
                () => [
                  h(AccordionHeader, { class: classes.header }, () =>
                    h(
                      AccordionTrigger,
                      {
                        class: classes.trigger,
                        disabled: variant.disabledTriggers?.includes(
                          item.value
                        ),
                      },
                      {
                        // The index comes from the slot's state.
                        default: ({ state }: { state: { index: number } }) => [
                          item.label,
                          variant.index &&
                            h(
                              "span",
                              { class: classes.index },
                              `#${state.index}`
                            ),
                          h(
                            "span",
                            { "aria-hidden": "true", class: classes.chevron },
                            "▾"
                          ),
                        ],
                      }
                    )
                  ),
                  h(
                    AccordionPanel,
                    {
                      class: classes.panel(variant.animation),
                      ...(index === 1 && variant.panel),
                    },
                    () =>
                      h(
                        "div",
                        { class: classes.inner },
                        index === 1
                          ? body(variant, item.content, env)
                          : item.content
                      )
                  ),
                ]
              )
            )
        ),
        variant.index &&
          h(
            "button",
            {
              class: `${classes.button} self-start`,
              onClick: () => (list.value = [...list.value].reverse()),
            },
            "Reverse items"
          ),
        variant.controlled &&
          h("div", { class: "flex items-center gap-2 text-xs" }, [
            h(
              "code",
              { class: "text-neutral-500" },
              JSON.stringify(value.value)
            ),
            h(
              "button",
              { class: button, onClick: () => (value.value = []) },
              "Collapse all"
            ),
            h(
              "button",
              {
                class: button,
                onClick: () =>
                  (value.value = list.value.map((item) => item.value)),
              },
              "Expand all"
            ),
          ]),
      ])
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(VariantAccordion, { variant, env })
    // Every card is its own app, and each would count ids from zero.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
