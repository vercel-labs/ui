import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOutlet,
  DrawerTitle,
  DrawerTrigger,
  type SnapPoint,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type PropType,
  type VNode,
} from "vue"
import * as classes from "./classes"
import {
  kitchenSink,
  openChangeMessage,
  refuses,
  snapPointChangeMessage,
  snapPointsOf,
  type Env,
} from "./shell"
import { flakyAction, type Variant } from "./variants"

type OpenDetails = { reason: string; returnValue?: string }

function body(variant: Variant, onSnap: (point: SnapPoint) => void) {
  if (variant.body === "scroll") {
    return [
      h(
        "ul",
        { class: classes.scroll, "aria-label": "Activity", tabindex: 0 },
        Array.from({ length: 40 }, (_, index) =>
          h("li", { class: classes.scrollItem }, `Day ${index + 1}`)
        )
      ),
    ]
  }
  if (variant.body === "tall") {
    return Array.from({ length: 60 }, (_, index) =>
      h("p", `Paragraph ${index + 1}`)
    )
  }
  if (variant.body === "form") {
    return [
      h("div", { class: "flex flex-col gap-3" }, [
        h("label", { class: classes.field }, [
          "Name",
          h("input", { class: classes.input, value: "Ada" }),
        ]),
        h("label", { class: classes.field }, [
          "Email",
          h("input", { class: classes.input, type: "email" }),
        ]),
        h("label", { class: classes.field }, [
          "Notes",
          h("textarea", { class: classes.textarea }),
        ]),
      ]),
    ]
  }
  if (variant.body === "snap-buttons") {
    return [
      h(
        "div",
        { class: classes.snapButtons },
        snapPointsOf(variant).map((point) =>
          h(
            "button",
            { class: classes.button, onClick: () => onSnap(point) },
            String(point)
          )
        )
      ),
    ]
  }
  return []
}

// Drawers opened from inside each other, built from the innermost out.
function nestedDrawers(variant: Variant, env: Env) {
  let inner: VNode | undefined
  for (let level = (variant.nested ?? 0) + 1; level >= 2; level--) {
    const child = inner
    inner = h(
      Drawer,
      {
        side: variant.options?.side,
        onOpenChange: (next: boolean, details: OpenDetails) =>
          env.log(`level ${level} ${openChangeMessage(next, details)}`),
      },
      () => [
        h(
          DrawerTrigger,
          { class: classes.trigger },
          () => `Open level ${level}`
        ),
        h(DrawerBackdrop, { class: classes.backdrop }),
        h(DrawerContent, { class: classes.content() }, () => [
          h(DrawerHandle, { class: classes.handle, "aria-label": "Resize" }),
          h("div", { class: classes.header }, [
            h(DrawerTitle, { class: classes.title }, () => `Level ${level}`),
            h(
              DrawerDescription,
              { class: classes.description },
              () => "The one beneath scales back."
            ),
          ]),
          h("div", { class: classes.actions }, [
            child,
            h(DrawerClose, { class: classes.button }, () => "Close"),
          ]),
        ]),
      ]
    )
  }
  return inner
}

const VariantDrawer = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    env: { type: Object as PropType<Env>, required: true },
  },
  setup({ variant, env }) {
    const open = ref(false)
    const snapPoint = ref<SnapPoint>(snapPointsOf(variant)[0])
    const { controlled } = variant
    const short = variant.body === "short"
    const setSnap = (point: SnapPoint) =>
      controlled?.snapPoint
        ? (snapPoint.value = point)
        : env.controller.setSnapPoint(point)
    const outlet = () =>
      variant.outlet &&
      h(
        DrawerOutlet,
        {
          class: classes.outlet,
          keyframes: variant.outlet.keyframes,
          ...(!variant.outlet.inside && { controller: env.controller }),
        },
        () => "Page behind"
      )
    return () => [
      h("div", { class: "flex w-full flex-wrap items-center gap-3" }, [
        h(
          Drawer,
          {
            ...variant.options,
            controller: env.controller,
            container: env.container,
            ...(controlled?.open && { open: open.value }),
            ...(controlled?.snapPoint && { snapPoint: snapPoint.value }),
            "onUpdate:open": (next: boolean) => {
              if (controlled?.open) {
                open.value = next
              }
            },
            "onUpdate:snapPoint": (point: SnapPoint) => {
              if (controlled?.snapPoint) {
                snapPoint.value = point
              }
            },
            onOpenChange: (next: boolean, details: OpenDetails) =>
              env.log(openChangeMessage(next, details)),
            onOpenChangeComplete: (next: boolean) =>
              env.log(`openChangeComplete ${next}`),
            onSnapPointChange: (
              point: SnapPoint,
              details: { reason: string; cancel: () => void }
            ) => {
              const refused = refuses(variant, point)
              if (refused) {
                details.cancel()
              }
              env.log(snapPointChangeMessage(point, details, refused))
            },
            onDismissAttempt: (details: { reason: string }) =>
              env.log(`dismissAttempt (${details.reason})`),
          },
          () => [
            h(
              DrawerTrigger,
              { class: classes.trigger },
              () => variant.trigger ?? "Open"
            ),
            variant.outlet?.inside && outlet(),
            h(DrawerBackdrop, { class: classes.backdrop }),
            h(
              DrawerContent,
              { class: classes.content(variant.size), ...variant.content },
              () => [
                !short &&
                  h(DrawerHandle, {
                    class: classes.handle,
                    "aria-label": "Resize",
                  }),
                h("div", { class: classes.header }, [
                  h(DrawerTitle, { class: classes.title }, () => variant.title),
                  !short &&
                    h(
                      DrawerDescription,
                      { class: classes.description },
                      () => variant.note ?? "A drawer."
                    ),
                ]),
                ...body(variant, setSnap),
                h("div", { class: classes.actions }, [
                  nestedDrawers(variant, env),
                  variant.action &&
                    h(
                      DrawerClose,
                      {
                        class: classes.primary,
                        value: "saved",
                        action: flakyAction,
                      },
                      {
                        default: ({
                          state,
                        }: {
                          state: { pending: boolean; error: unknown }
                        }) =>
                          state.pending
                            ? "Saving…"
                            : state.error
                              ? "Retry"
                              : "Save",
                      }
                    ),
                  h(DrawerClose, { class: classes.button }, () => "Close"),
                ]),
              ]
            ),
          ]
        ),
        controlled?.open &&
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
        controlled?.snapPoint &&
          h(
            "span",
            { class: "text-xs text-neutral-600" },
            `snapPoint=${JSON.stringify(snapPoint.value)}`
          ),
      ]),
      !variant.outlet?.inside && outlet(),
    ]
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantDrawer, { variant, env }).mount(slot)
  )
}

export { mount }
