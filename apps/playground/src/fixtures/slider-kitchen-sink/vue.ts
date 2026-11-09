import {
  createSliderController,
  Field,
  FieldDescription,
  FieldLabel,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/vue"
import type {
  SliderThumbState,
  SliderValueChangeDetails,
  SliderValueState,
} from "@ui-sdk/core/slider"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type PropType,
  type VNodeChild,
} from "vue"
import { classes as c } from "./classes"
import { renderShell, type Log } from "./shell"
import {
  describe,
  formats,
  thumbLabel,
  thumbsOf,
  type Variant,
} from "./variants"

const Card = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    log: { type: Object as PropType<Log>, required: true },
  },
  setup(props) {
    const options = (props.variant.options ?? {}) as Record<string, any>
    const value = ref<number | number[]>(options.defaultValue ?? 0)
    const controller = createSliderController()

    const control = (): VNodeChild => {
      const variant = props.variant
      const { defaultValue, ...rest } = options
      const thumbs = Array.from({ length: thumbsOf(variant) }, (_, index) =>
        h(
          SliderThumb,
          {
            key: index,
            index,
            class: c.thumb,
            "aria-label": thumbLabel(variant, index),
          },
          variant.custom
            ? {
                default: ({ state }: { state: SliderThumbState }) =>
                  h("span", { class: c.bubble }, String(state.thumbValue)),
              }
            : undefined
        )
      )
      return [
        h(
          Slider,
          {
            class: c.root,
            ...rest,
            ...(variant.controlled ? { value: value.value } : { defaultValue }),
            format: variant.format && formats[variant.format],
            form: variant.place === "outside" ? variant.id : undefined,
            controller: variant.controller ? controller : undefined,
            onValueChange: (
              next: number | number[],
              details: SliderValueChangeDetails
            ) => {
              value.value = next
              props.log.change(
                `${describe(next)} (${details.reason}, thumb ${details.thumb})`
              )
            },
            onValueCommit: (
              next: number | number[],
              details: { reason: string }
            ) => props.log.commit(`${describe(next)} (${details.reason})`),
          },
          () => [
            h(
              SliderValue,
              { class: c.value },
              variant.custom
                ? {
                    default: ({ state }: { state: SliderValueState }) =>
                      `Between ${state.text}`,
                  }
                : undefined
            ),
            h(SliderControl, { class: c.control }, () =>
              h(SliderTrack, { class: c.track }, () => [
                h(SliderIndicator, { class: c.indicator }),
                ...thumbs,
              ])
            ),
          ]
        ),
        variant.controlled &&
          h(
            "span",
            { class: c.description },
            `value: ${describe(value.value)}`
          ),
        variant.presets &&
          h("div", { class: c.row }, [
            ...variant.presets.map((preset) =>
              h(
                "button",
                {
                  key: describe(preset),
                  type: "button",
                  class: c.button,
                  onClick: () =>
                    variant.controller
                      ? controller.setValue(preset)
                      : (value.value = preset),
                },
                `Set ${describe(preset)}`
              )
            ),
            variant.controller &&
              h(
                "button",
                {
                  type: "button",
                  class: c.button,
                  onClick: () => controller.focus(thumbsOf(variant) - 1),
                },
                "Focus last thumb"
              ),
          ]),
      ]
    }

    return () => {
      const variant = props.variant
      let body: VNodeChild = control()
      if (variant.place === "field") {
        body = h(Field, { class: c.form, name: "level" }, () => [
          h(FieldLabel, { class: c.label }, () => "Level"),
          control(),
          h(
            FieldDescription,
            { class: c.description },
            () => "Where the level sits."
          ),
        ])
      }
      if (variant.place === "fieldset") {
        body = h("fieldset", { disabled: true }, [body])
      }
      if (variant.place === "rtl") {
        body = h("div", { dir: "rtl" }, [body])
      }
      if (variant.place === "transformed") {
        body = h("div", { class: c.transformed }, [body])
      }
      const buttons = h("div", { class: c.row }, [
        h("button", { class: c.button }, "Save"),
        h("button", { type: "reset", class: c.button }, "Reset"),
      ])
      const outside = variant.place === "outside"
      return [
        h(
          "form",
          { id: variant.id, class: c.form },
          outside ? [buttons] : [body, buttons]
        ),
        outside && body,
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
