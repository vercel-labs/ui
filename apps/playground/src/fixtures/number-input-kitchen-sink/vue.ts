import {
  createNumberInputController,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
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
import { renderShell, type Log } from "./shell"
import { describe, formats, type Variant } from "./variants"

const Card = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    log: { type: Object as PropType<Log>, required: true },
  },
  setup(props) {
    const options = (props.variant.options ?? {}) as Record<string, any>
    const value = ref<number | null>(options.defaultValue ?? null)
    const controller = createNumberInputController()
    const button = (label: string, onClick: () => unknown) =>
      h(
        "button",
        { key: label, type: "button", class: c.button, onClick },
        label
      )

    const control = (): VNodeChild => {
      const variant = props.variant
      const { defaultValue, ...rest } = options
      const scrub = variant.scrub
      const arrow = scrub?.orientation === "vertical" ? "↕" : "↔"
      const scrubArea = () =>
        scrub &&
        h(
          NumberInputScrubArea,
          {
            class: c.scrub,
            orientation: scrub.orientation,
            pixelsPerStep: scrub.pixelsPerStep,
            controller: scrub.outside ? controller : undefined,
          },
          () => [
            `${arrow} Drag`,
            h(NumberInputScrubAreaCursor, { class: c.cursor }, () => arrow),
          ]
        )
      return [
        scrub?.outside && scrubArea(),
        h(
          NumberInput,
          {
            class: c.root,
            ...rest,
            ...(variant.controlled ? { value: value.value } : { defaultValue }),
            format: variant.format && formats[variant.format],
            form: variant.place === "outside" ? variant.id : undefined,
            controller:
              variant.controller || scrub?.outside ? controller : undefined,
            onValueChange: (
              next: number | null,
              details: { reason: string }
            ) => {
              value.value = next
              props.log.change(`${describe(next)} (${details.reason})`)
            },
            onValueCommit: (next: number | null, details: { reason: string }) =>
              props.log.commit(`${describe(next)} (${details.reason})`),
          },
          () => [
            !scrub?.outside && scrubArea(),
            h(NumberInputGroup, { class: c.group }, () => [
              h(
                NumberInputDecrement,
                { class: c.step, "aria-label": "Decrease" },
                () => "−"
              ),
              h(NumberInputControl, {
                class: c.input,
                "aria-label": variant.place === "field" ? undefined : "Amount",
              }),
              h(
                NumberInputIncrement,
                { class: c.step, "aria-label": "Increase" },
                () => "+"
              ),
            ]),
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
              button(`Set ${describe(preset)}`, () =>
                variant.controller
                  ? controller.setValue(preset)
                  : (value.value = preset)
              )
            ),
            ...(variant.controller
              ? [
                  button("Decrement", () => controller.decrement()),
                  button("Increment large", () =>
                    controller.increment({ large: true })
                  ),
                  button("Focus", () => controller.focus()),
                ]
              : []),
          ]),
      ]
    }

    return () => {
      const variant = props.variant
      let body: VNodeChild = control()
      if (variant.place === "field") {
        body = h(Field, { class: c.form, name: "quantity" }, () => [
          h(FieldLabel, { class: c.label }, () => "Quantity"),
          control(),
          h(
            FieldDescription,
            { class: c.description },
            () => "How many to order."
          ),
          h(FieldError, { class: c.error }),
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
