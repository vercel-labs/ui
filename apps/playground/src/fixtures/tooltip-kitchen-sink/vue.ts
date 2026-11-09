import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref, type VNodeChild } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { rows, toolbar, type Variant } from "./variants"
import { renderAs } from "../vue-render-as"

type ContentState = { payload: unknown }

function content(
  variant: Variant,
  env: Env,
  children: string | ((state: ContentState) => VNodeChild),
  shortcut = !!(variant.options?.shortcut || variant.partShortcut)
) {
  return h(
    TooltipContent,
    {
      class: classes.content(variant.animation),
      sideOffset: 6,
      ...variant.content,
      anchor: env.anchor,
    },
    {
      default: ({ state }: { state: ContentState }) => [
        variant.arrow !== false && h(TooltipArrow, { class: classes.arrow }),
        typeof children === "function" ? children(state) : children,
        shortcut &&
          h(TooltipShortcut, {
            class: classes.shortcut,
            shortcut: variant.partShortcut,
          }),
      ],
    }
  )
}

function trigger(variant: Variant, onClick: () => void) {
  if (variant.compose === "link") {
    return h(
      TooltipTrigger,
      { href: "#docs", class: classes.link, onClick },
      renderAs("a", () => variant.trigger)
    )
  }
  if (variant.compose === "popover-trigger") {
    return h(
      TooltipTrigger,
      { class: classes.trigger },
      renderAs(PopoverTrigger, () => variant.trigger)
    )
  }
  return h(
    TooltipTrigger,
    {
      class: variant.icon ? classes.iconTrigger : classes.trigger,
      "aria-label": variant.label,
      "aria-disabled": variant.ariaDisabled || undefined,
      onClick,
    },
    () =>
      variant.icon
        ? h("span", { "aria-hidden": "true" }, variant.trigger)
        : (variant.trigger ?? "Hover me")
  )
}

const VariantTooltip = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const open = ref(false)
    const copied = ref(false)
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
      onOpenChangeComplete: (next: boolean) => {
        if (!next) {
          copied.value = false
        }
        env.log(`openChangeComplete ${next}`)
      },
    })
    const press = () => {
      if (variant.ariaDisabled) {
        return env.log("press ignored, aria-disabled")
      }
      if (variant.copy) {
        copied.value = true
      }
      env.log("press")
    }

    return () => {
      if (variant.compose === "toolbar") {
        return h(
          "div",
          {
            role: "toolbar",
            "aria-label": "Formatting",
            class: classes.toolbar,
          },
          toolbar.map((item) =>
            h(
              Tooltip,
              { key: item.text, ...root(), shortcut: item.shortcut },
              () => [
                h(TooltipTrigger, { class: classes.toolbarButton }, () =>
                  h("span", { "aria-hidden": "true" }, item.icon)
                ),
                content(variant, env, item.text, !!item.shortcut),
              ]
            )
          )
        )
      }

      if (variant.controller) {
        return h("div", { class: "flex gap-2" }, [
          ...rows.map((row) =>
            h(
              TooltipTrigger,
              {
                key: row,
                class: classes.trigger,
                controller: env.controller,
                payload: row,
              },
              () => row
            )
          ),
          h(Tooltip, { ...root(), controller: env.controller }, () =>
            content(
              variant,
              env,
              (state) => `Open ${state.payload ?? "nothing"}`
            )
          ),
        ])
      }

      if (variant.compose === "in-popover") {
        return h(Popover, { container: env.container }, () => [
          h(PopoverTrigger, { class: classes.trigger }, () => variant.trigger),
          h(PopoverContent, { class: classes.popover, sideOffset: 8 }, () => [
            h(
              PopoverTitle,
              { class: classes.popoverTitle },
              () => "Formatting"
            ),
            h("div", { class: "flex gap-2" }, [
              h(Tooltip, root(), () => [
                h(TooltipTrigger, { class: classes.button }, () => "Help"),
                content(variant, env, "Opens the help center"),
              ]),
              h(PopoverClose, { class: classes.button }, () => "Close"),
            ]),
          ]),
        ])
      }

      const text = copied.value ? "Copied" : (variant.text ?? variant.title)
      const tooltip = h(Tooltip, root(), () => [
        trigger(variant, press),
        content(variant, env, text),
      ])

      return h("div", { class: "flex items-center gap-3" }, [
        variant.compose === "popover-trigger"
          ? h(
              Popover,
              {
                container: env.container,
                onOpenChange: (next: boolean, details: { reason: string }) =>
                  env.log(`popover openChange ${next} (${details.reason})`),
              },
              () => [
                tooltip,
                h(
                  PopoverContent,
                  { class: classes.popover, sideOffset: 8 },
                  () => [
                    h(
                      PopoverTitle,
                      { class: classes.popoverTitle },
                      () => "Profile settings"
                    ),
                    h(PopoverClose, { class: classes.button }, () => "Close"),
                  ]
                ),
              ]
            )
          : tooltip,
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
    createApp(VariantTooltip, { variant, env }).mount(slot)
  )
}

export { mount }
