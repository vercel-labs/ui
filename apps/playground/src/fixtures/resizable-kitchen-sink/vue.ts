import type {
  ResizableLayoutCommitDetails,
  ResizableLayoutChangeDetails,
} from "@ui-sdk/core/resizable"
import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type PropType,
  type VNodeChild,
} from "vue"
import { classes as c } from "./classes"
import { describe, isHandleDisabled, renderShell, type Log } from "./shell"
import { presets, type GroupSpec, type Variant } from "./variants"

function group(
  spec: GroupSpec,
  log: Log,
  props: Record<string, unknown> = {},
  nested = false
): VNodeChild {
  const children = spec.panels.flatMap(
    ({ label, nested: inner, ...sizes }, index) => [
      index > 0 &&
        h(ResizableHandle, {
          key: `handle-${label}`,
          class: c.handle,
          "aria-label": `Resize ${spec.panels[index - 1].label}`,
          disabled: isHandleDisabled(spec, index - 1),
        }),
      h(ResizablePanel, { key: label, class: c.panel, ...sizes }, () =>
        inner ? group(inner, log, {}, true) : label
      ),
    ]
  )
  return h(
    Resizable,
    {
      class: nested ? c.nested : c.group,
      ...spec.options,
      onLayoutChange: (
        layout: number[],
        details: ResizableLayoutChangeDetails
      ) => log.change(`${describe(layout)} (${details.reason})`),
      // Vue merges a second `onUpdate:layout` beside this one, for the controlled card.
      onLayoutCommit: (
        layout: number[],
        details: ResizableLayoutCommitDetails
      ) => log.commit(`${describe(layout)} (${details.reason})`),
      ...props,
    },
    () => children.filter(Boolean)
  )
}

const Card = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    log: { type: Object as PropType<Log>, required: true },
  },
  setup(props) {
    const layout = ref(presets[0])
    const extra = ref(false)
    const controller = createResizableController()
    const button = (text: string, onClick: () => void) =>
      h("button", { type: "button", class: c.button, onClick }, text)
    return () => {
      const variant = props.variant
      const spec = extra.value
        ? {
            ...variant.group,
            panels: [...variant.group.panels, { label: "Extra", id: "extra" }],
          }
        : variant.group
      let body = group(spec, props.log, {
        controller: variant.controller ? controller : undefined,
        ...(variant.controlled && {
          layout: layout.value,
          "onUpdate:layout": (next: number[]) => (layout.value = next),
        }),
      })
      if (variant.place === "rtl") {
        body = h("div", { dir: "rtl" }, [body])
      }
      if (variant.place === "transformed") {
        body = h("div", { class: c.transformed }, [body])
      }
      if (variant.place === "scroll") {
        body = h("div", { class: c.scroll }, [body])
      }
      return [
        body,
        h("div", { class: c.row }, [
          ...(variant.controlled
            ? presets.map((preset) =>
                button(`Set ${describe(preset)}`, () => (layout.value = preset))
              )
            : []),
          ...(variant.controller
            ? [
                button("Collapse", () => controller.collapse("sidebar")),
                button("Expand", () => controller.expand("sidebar")),
                button("160px", () => controller.resize("sidebar", "160px")),
              ]
            : []),
          ...(variant.conditional
            ? [
                button(
                  extra.value ? "Remove panel" : "Add panel",
                  () => (extra.value = !extra.value)
                ),
              ]
            : []),
        ]),
      ]
    }
  },
})

function mount(root: HTMLElement) {
  renderShell(root, "vue", (slot, variant, log) =>
    createApp(Card, { variant, log }).mount(slot)
  )
}

export { mount }
