import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type Component,
  type PropType,
} from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { content, tree, type TreeNode, type Variant } from "./variants"
import { renderAs } from "../vue-render-as"

const Grow = defineComponent({
  setup() {
    const lines = ref(1)
    return () => [
      ...Array.from({ length: lines.value }, (_, index) =>
        h("p", { key: index }, `Line ${index + 1}`)
      ),
      h(
        "button",
        { class: `${classes.button} self-start`, onClick: () => lines.value++ },
        "Add a line"
      ),
    ]
  },
})

// What the panel holds.
function body(variant: Variant) {
  if (variant.body === "long") {
    return Array.from({ length: 20 }, (_, index) => h("p", `Line ${index + 1}`))
  }
  if (variant.body === "form") {
    return [
      h("label", { class: "flex flex-col" }, [
        content.text,
        h("input", {
          class: classes.input,
          value: "Ada",
          "aria-label": "Name",
        }),
      ]),
    ]
  }
  if (variant.body === "grow") {
    return [h(Grow)]
  }
  return [content.text]
}

// A folder is a collapsible holding its children. Files are plain rows. Typed,
// so the recursion doesn't need the component's own inferred type.
const Folder: Component = defineComponent({
  name: "Folder",
  props: {
    node: { type: Object as PropType<TreeNode>, required: true },
    env: { type: Object as PropType<Env>, required: true },
  },
  setup({ node, env }) {
    return () => {
      if (!node.children) {
        return h("div", { class: classes.treeFile }, node.name)
      }
      return h(
        Collapsible,
        {
          onOpenChange: (open: boolean, details: { reason: string }) =>
            env.log(`${node.name} openChange ${open} (${details.reason})`),
          onOpenChangeComplete: (open: boolean) =>
            env.log(`${node.name} openChangeComplete ${open}`),
        },
        () => [
          h(CollapsibleTrigger, { class: classes.treeTrigger }, () => [
            h(
              "span",
              { "aria-hidden": "true", class: classes.treeChevron },
              "▸"
            ),
            `${node.name}/`,
          ]),
          h(CollapsiblePanel, { class: classes.treePanel }, () =>
            node.children!.map((child) =>
              h(Folder, { key: child.name, node: child, env })
            )
          ),
        ]
      )
    }
  },
})

const VariantCollapsible = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    env: { type: Object as PropType<Env>, required: true },
  },
  setup({ variant, env }) {
    const open = ref(variant.options?.defaultOpen ?? false)
    const tag =
      variant.render?.trigger === "link" ? "a" : variant.render?.trigger
    const trigger =
      variant.render?.trigger === "link" ? { href: "#collapsible-link" } : {}
    return () => {
      if (variant.body === "tree") {
        return h(
          "div",
          { class: "w-full rounded-lg border border-neutral-200 bg-white p-2" },
          [h(Folder, { node: tree, env })]
        )
      }
      return h("div", { class: "flex flex-col gap-2" }, [
        h(
          Collapsible,
          {
            class: classes.root,
            ...variant.options,
            controller: env.controller,
            // v-model:open, for the controlled variant.
            ...(variant.controlled && {
              open: open.value,
              "onUpdate:open": (next: boolean) => (open.value = next),
            }),
            onOpenChange: (
              next: boolean,
              details: { reason: string; cancel: () => void }
            ) => {
              if (variant.cancel === (next ? "open" : "close")) {
                details.cancel()
                env.log(`openChange ${next} canceled`)
                return
              }
              env.log(`openChange ${next} (${details.reason})`)
            },
            onOpenChangeComplete: (next: boolean) =>
              env.log(`openChangeComplete ${next}`),
          },
          () => [
            h(
              CollapsibleTrigger,
              { class: classes.trigger, ...trigger },
              renderAs(tag, () => [
                content.trigger,
                h(
                  "span",
                  { "aria-hidden": "true", class: classes.chevron },
                  "▾"
                ),
              ])
            ),
            h(
              CollapsiblePanel,
              {
                class: classes.panel(variant.animation),
                ...variant.panel,
              },
              renderAs(
                variant.render?.panel === "section" ? "section" : undefined,
                () => h("div", { class: classes.inner }, body(variant))
              )
            ),
          ]
        ),
        variant.controlled &&
          h("div", { class: "flex items-center gap-2 text-xs" }, [
            h("code", { class: "text-neutral-500" }, `open=${open.value}`),
            h(
              "button",
              { class: classes.button, onClick: () => (open.value = true) },
              "Open"
            ),
            h(
              "button",
              { class: classes.button, onClick: () => (open.value = false) },
              "Close"
            ),
            h(
              "button",
              {
                class: classes.button,
                onClick: () => (open.value = !open.value),
              },
              "Toggle"
            ),
          ]),
      ])
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(VariantCollapsible, { variant, env })
    // Every card is its own app, and each would count ids from zero.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
