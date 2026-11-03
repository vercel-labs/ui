import type { ChangeDetails } from "@ui-sdk/core"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, onBeforeUnmount, ref, watch, type PropType } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { hasViewport, href, items, moreLinks, nestedLinks, type Item, type Variant } from "./variants"

const chevron = () =>
  h("svg", { class: classes.chevron, viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true" }, [
    h("path", {
      d: "M3 4.5 6 7.5l3-3",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
    }),
  ])

function link(variant: Variant, label: string, description?: string, closeOnSelect?: boolean) {
  return h("li", { key: label }, [
    h(NavigationMenuLink, { class: classes.link, href: href(variant, label), closeOnSelect }, () => [
      h("span", { class: classes.linkTitle }, label),
      description && h("span", { class: classes.linkDescription }, description),
    ]),
  ])
}

// A vertical menu inside the first panel, whose content is its own popup.
function nested(variant: Variant, env: Env) {
  return h(
    NavigationMenu,
    {
      orientation: "vertical",
      class: classes.nestedRoot,
      onValueChange: (value: string | null, { reason }: ChangeDetails) =>
        env.log(`nested valueChange ${value} (${reason})`),
    },
    () =>
      h(NavigationMenuList, { class: classes.list }, () =>
        h(NavigationMenuItem, { value: "learn" }, () => [
          h(NavigationMenuTrigger, { class: classes.trigger }, () => ["Learn ", chevron()]),
          h(NavigationMenuContent, { class: classes.nestedContent }, () =>
            h(
              "ul",
              { class: classes.links },
              nestedLinks.map((label) => link(variant, label)),
            ),
          ),
        ]),
      ),
  )
}

const Panel = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    env: { type: Object as PropType<Env>, required: true },
    item: { type: Object as PropType<Item>, required: true },
  },
  setup({ variant, env, item }) {
    const grown = ref(false)
    const first = item.value === "products"
    const menuCloses = variant.options?.closeOnSelect ?? true
    const links =
      first && variant.body === "long"
        ? Array.from({ length: 30 }, (_, index) => ({ label: `Product ${index + 1}`, description: "" }))
        : item.links
    return () =>
      h(
        NavigationMenuContent,
        {
          class: classes.content(variant, item.value, first && grown.value),
          ...variant.content,
          anchor: hasViewport(variant) ? undefined : env.anchor,
        },
        () => [
          h("ul", { class: classes.links }, [
            ...links.map((entry, index) =>
              link(
                variant,
                entry.label,
                entry.description,
                variant.linkCloseOnSelect && index === 0 ? !menuCloses : undefined,
              ),
            ),
            ...(grown.value ? moreLinks.map((label) => link(variant, label)) : []),
          ]),
          first &&
            variant.body === "dynamic" &&
            h("button", { class: classes.more, onClick: () => (grown.value = !grown.value) }, [
              grown.value ? "Show less" : "Show more",
            ]),
          first && variant.body === "nested" && nested(variant, env),
        ],
      )
  },
})

const VariantMenu = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    env: { type: Object as PropType<Env>, required: true },
  },
  setup({ variant, env }) {
    const value = ref<string | null>(null)

    // The select outside the menu shares the controlled value.
    const select = env.select
    const change = () => (value.value = select!.value || null)
    select?.addEventListener("change", change)
    onBeforeUnmount(() => select?.removeEventListener("change", change))
    watch(value, (next) => select && (select.value = next ?? ""))

    return () =>
      h(
        NavigationMenu,
        {
          id: env.navId,
          "aria-label": `Main ${variant.id}`,
          class: classes.root,
          ...variant.options,
          ...(variant.controlled && { value: value.value }),
          container: env.container,
          controller: env.controller,
          "onUpdate:value": (next: string | null) => {
            if (variant.controlled) value.value = next
          },
          onValueChange: (next: string | null, { reason }: ChangeDetails) =>
            env.log(`valueChange ${next} (${reason})`),
          onOpenChangeComplete: (open: boolean) => env.log(`openChangeComplete ${open}`),
        },
        () => [
          h(NavigationMenuList, { class: classes.list }, () => [
            ...items.map((item) =>
              h(NavigationMenuItem, { key: item.value, value: item.value }, () => [
                h(
                  NavigationMenuTrigger,
                  { class: classes.trigger, disabled: variant.disabled === item.value },
                  () => [`${item.label} `, chevron()],
                ),
                h(Panel, { variant, env, item }),
              ]),
            ),
            h(NavigationMenuItem, () =>
              h(
                NavigationMenuLink,
                {
                  class: classes.topLink,
                  href: href(variant, "pricing"),
                  current: variant.activeLink !== false,
                },
                () => "Pricing",
              ),
            ),
          ]),
          h(NavigationMenuIndicator, { class: classes.indicator }),
          hasViewport(variant) &&
            h(NavigationMenuViewport, {
              class: classes.viewport(variant.animation),
              ...(variant.viewport || {}),
              anchor: env.anchor,
            }),
        ],
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(VariantMenu, { variant, env })
    // Every card is its own app, so each gets its own id prefix.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
