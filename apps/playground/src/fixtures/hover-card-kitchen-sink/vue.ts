import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { authors, type Variant } from "./variants"

function body(variant: Variant, name: string) {
  const heading = h("div", { class: "flex items-center gap-3" }, [
    h(
      "div",
      { class: classes.avatar, "aria-hidden": "true" },
      name.slice(0, 1).toUpperCase()
    ),
    h("div", [
      h("div", { class: classes.name }, name),
      h("div", { class: classes.handle }, `@${name}`),
    ]),
  ])
  const bio = h(
    "p",
    { class: classes.bio },
    variant.note ?? "Writes about headless components."
  )
  if (variant.body === "text") {
    return [heading, bio]
  }
  if (variant.body === "long") {
    return [
      heading,
      ...Array.from({ length: 30 }, (_, index) => h("p", `Line ${index + 1}`)),
    ]
  }
  if (variant.body === "tooltip") {
    return [
      heading,
      bio,
      h("div", { class: "mt-3" }, [
        h(Tooltip, { delay: 100 }, () => [
          h(TooltipTrigger, { class: classes.button }, () => "Follow"),
          h(
            TooltipContent,
            { class: classes.tooltip, sideOffset: 6 },
            () => `Get updates from @${name}`
          ),
        ]),
      ]),
    ]
  }
  return [
    heading,
    bio,
    h("div", { class: "mt-3 flex items-center gap-3" }, [
      h("a", { href: `#${name}`, class: classes.link }, "View profile"),
      h("button", { class: classes.button }, "Follow"),
    ]),
  ]
}

function content(variant: Variant, env: Env) {
  return h(
    HoverCardContent,
    {
      class: classes.content(variant.animation, variant.body === "long"),
      sideOffset: 8,
      ...variant.content,
      anchor: env.anchor,
    },
    {
      default: ({ state }: { state: { payload: unknown } }) => [
        variant.arrow !== false && h(HoverCardArrow, { class: classes.arrow }),
        ...body(
          variant,
          variant.controller ? String(state.payload ?? "nobody") : variant.id
        ),
      ],
    }
  )
}

const VariantHoverCard = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const open = ref(false)
    const root = () => ({
      ...variant.options,
      container: env.container,
      ...(variant.controlled && { open: open.value }),
      "onUpdate:open": (next: boolean) => {
        if (variant.controlled) {
          open.value = next
        }
      },
      onOpenChange: (next: boolean, details: { reason: string }) =>
        env.log(`openChange ${next} (${details.reason})`),
      onOpenChangeComplete: (next: boolean) =>
        env.log(`openChangeComplete ${next}`),
    })

    return () => {
      if (variant.controller) {
        return h("div", { class: "flex gap-3" }, [
          ...authors.map((author) =>
            h(
              HoverCardTrigger,
              {
                key: author,
                href: `#${author}`,
                class: classes.trigger,
                controller: env.controller,
                payload: author,
              },
              () => `@${author}`
            )
          ),
          h(HoverCard, { ...root(), controller: env.controller }, () =>
            content(variant, env)
          ),
        ])
      }

      return h("div", { class: "flex items-center gap-3" }, [
        h(HoverCard, root(), () => [
          h(
            HoverCardTrigger,
            { href: `#${variant.id}`, class: classes.trigger },
            () => variant.trigger ?? `@${variant.id}`
          ),
          content(variant, env),
        ]),
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
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantHoverCard, { variant, env }).mount(slot)
  )
}

export { mount }
