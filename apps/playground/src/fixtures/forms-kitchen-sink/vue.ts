import { createCheckboxController } from "@ui-sdk/core/checkbox"
import { createRadioGroupController } from "@ui-sdk/core/radio"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Radio,
  RadioGroup,
  RadioIndicator,
  Switch,
  SwitchThumb,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type PropType,
  type VNodeChild,
} from "vue"
import { classes as c, renderShell } from "./shell"
import type { Variant } from "./variants"

const Card = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    log: { type: Function as PropType<(text: string) => void>, required: true },
  },
  setup(props) {
    const checked = ref<boolean | "indeterminate">(false)
    const value = ref<string | null>(null)
    const values = ref<string[]>([])
    const checkbox = createCheckboxController()
    const radio = createRadioGroupController()
    const report = (next: unknown, details: { reason: string }) =>
      props.log(`${JSON.stringify(next)} (${details.reason})`)

    const indicator = (radioPart = false) => {
      const variant = props.variant
      const className = `${radioPart ? c.dot : c.indicator} ${variant.indicator === "animated" ? c.animated : ""} ${variant.indicator === "kept" ? c.kept : ""}`
      return h(radioPart ? RadioIndicator : CheckboxIndicator, {
        class: className,
        keepMounted: variant.indicator === "kept",
      })
    }

    const control = (): VNodeChild => {
      const variant = props.variant
      const options = (variant.options ?? {}) as Record<string, unknown>
      if (variant.kind === "checkbox") {
        return [
          h("label", { class: c.row }, [
            h(
              Checkbox,
              {
                class: c.box,
                ...options,
                ...(variant.controlled && { checked: checked.value }),
                controller: variant.controller ? checkbox : undefined,
                form: variant.place === "outside" ? variant.id : undefined,
                onCheckedChange: (
                  next: boolean | "indeterminate",
                  details: { reason: string }
                ) => {
                  checked.value = next
                  report(next, details)
                },
              },
              () => indicator()
            ),
            "Accept",
          ]),
          variant.controlled && h("span", `checked: ${String(checked.value)}`),
          variant.controller &&
            h(
              "button",
              {
                type: "button",
                class: c.button,
                onClick: () => checkbox.toggle(),
              },
              "Toggle from outside"
            ),
        ]
      }
      if (variant.kind === "switch") {
        return h("label", { class: c.row }, [
          h(
            Switch,
            {
              class: c.track,
              ...options,
              ...(variant.controlled && { checked: checked.value === true }),
              onCheckedChange: (next: boolean, details: { reason: string }) => {
                checked.value = next
                report(next, details)
              },
            },
            () => h(SwitchThumb, { class: c.thumb })
          ),
          "Wi-Fi",
        ])
      }
      if (variant.kind === "radio") {
        return [
          h(
            RadioGroup,
            {
              class: c.form,
              "aria-label": "Plan",
              ...options,
              ...(variant.controlled && { value: value.value }),
              controller: variant.controller ? radio : undefined,
              onValueChange: (
                next: string | null,
                details: { reason: string }
              ) => {
                value.value = next
                report(next, details)
              },
            },
            () =>
              variant.items!.map(([item, label, disabled]) =>
                h("label", { key: item, class: c.row }, [
                  h(Radio, { class: c.radio, value: item, disabled }, () =>
                    indicator(true)
                  ),
                  label,
                ])
              )
          ),
          variant.controlled && h("span", `value: ${String(value.value)}`),
          variant.controller &&
            h(
              "button",
              {
                type: "button",
                class: c.button,
                onClick: () => radio.setValue("enterprise"),
              },
              "Choose Enterprise"
            ),
        ]
      }
      if (variant.kind === "checkbox-group") {
        return [
          h(
            CheckboxGroup,
            {
              class: c.form,
              "aria-label": "Toppings",
              ...options,
              ...(variant.controlled && { value: values.value }),
              onValueChange: (next: string[], details: { reason: string }) => {
                values.value = next
                report(next, details)
              },
            },
            () => [
              variant.parent &&
                h("label", { class: c.row }, [
                  h(Checkbox, { class: c.box, parent: true }, () =>
                    indicator()
                  ),
                  "All",
                ]),
              ...variant.items!.map(([item, label, disabled]) =>
                h("label", { key: item, class: c.row }, [
                  h(Checkbox, { class: c.box, value: item, disabled }, () =>
                    indicator()
                  ),
                  label,
                ])
              ),
            ]
          ),
          variant.controlled && h("span", `value: ${values.value.join(", ")}`),
        ]
      }
      return h(FieldControl, {
        class: c.input,
        type: "email",
        name: "email",
        required: true,
      })
    }

    return () => {
      const variant = props.variant
      let body: VNodeChild = control()
      if (variant.field) {
        body = h(
          Field,
          {
            class: c.form,
            invalid: variant.field.invalid,
            disabled: variant.field.disabled,
          },
          () => [
            h(FieldLabel, null, () => "Label"),
            control(),
            h(FieldDescription, { class: c.description }, () => "Description"),
            h(FieldError, { class: c.error }),
          ]
        )
      }
      if (variant.place === "fieldset") {
        body = h("fieldset", { disabled: true }, [body])
      }
      if (variant.place === "rtl") {
        body = h("div", { dir: "rtl" }, [body])
      }
      const buttons = h("div", { class: c.row }, [
        h("button", { class: c.button }, "Submit"),
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
  renderShell(root, (slot, variant, log) =>
    createApp(Card, { variant, log }).mount(slot)
  )
}

export { mount }
