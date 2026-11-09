import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  InputClear,
  InputGroup,
  Textarea,
  createInputController,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref, type PropType } from "vue"
import { classes as c, renderShell } from "./shell"
import type { Variant } from "./variants"
import { renderAs } from "../vue-render-as"

const Card = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    log: { type: Function as PropType<(text: string) => void>, required: true },
  },
  setup(props) {
    const value = ref("")
    const input = createInputController()
    return () => {
      const variant = props.variant
      const options = (variant.options ?? {}) as Record<string, any>
      const change = {
        ...(variant.controlled && { value: value.value }),
        controller: variant.controller === "input" ? input : undefined,
        onValueChange: (
          next: string,
          details: { reason: string; cancel: () => void }
        ) => {
          if (variant.digitsCanceled && /\d/.test(next)) {
            return details.cancel()
          }
          value.value = next
          props.log(`${JSON.stringify(next)} (${details.reason})`)
        },
      }
      const set = () =>
        h(FieldSet, { class: c.set, ...options }, () => [
          h(
            FieldLegend,
            { class: c.legend },
            renderAs(variant.legendAsDiv ? "div" : undefined, () => "Address")
          ),
          h(FieldDescription, { class: "text-xs" }, () => "Where we send it."),
          h(Field, { name: "value", class: c.field }, () => [
            h(FieldLabel, { class: c.label }, () => "Street"),
            h(Input, { class: c.input, required: true }),
          ]),
        ])
      const control = () =>
        variant.kind === "textarea"
          ? h(Textarea, { class: c.textarea, ...options, ...change })
          : variant.kind === "group"
            ? h(InputGroup, { class: c.group }, () => [
                variant.prefix ? h("span", variant.prefix) : null,
                h(Input, { class: c.groupInput, ...options, ...change }),
                h(
                  InputClear,
                  { class: c.clear, "aria-label": "Clear" },
                  () => "×"
                ),
              ])
            : h(Input, {
                class: c.input,
                "aria-label": variant.field ? undefined : "Value",
                ...options,
                ...change,
              })
      const body = () =>
        variant.kind === "set"
          ? variant.place === "disabled-fieldset"
            ? h("fieldset", { disabled: true }, [set()])
            : set()
          : variant.field
            ? h(
                Field,
                {
                  name: "value",
                  class: c.field,
                  invalid: variant.invalid ? true : undefined,
                },
                () => [
                  h(FieldLabel, { class: c.label }, () => "Value"),
                  control(),
                  h(
                    FieldError,
                    { class: c.error },
                    variant.invalid ? () => variant.invalid : undefined
                  ),
                ]
              )
            : control()
      const card = h(
        "form",
        {
          class: c.form,
          onSubmit: (event: SubmitEvent) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget as HTMLFormElement)
            props.log(
              `submitted ${new URLSearchParams(data as unknown as Record<string, string>)}`
            )
          },
        },
        [
          body(),
          variant.controller === "input"
            ? h("div", { class: c.row }, [
                h(
                  "button",
                  {
                    type: "button",
                    class: c.button,
                    onClick: () => input.setValue("Grace"),
                  },
                  "Set"
                ),
                h(
                  "button",
                  {
                    type: "button",
                    class: c.button,
                    onClick: () => input.clear(),
                  },
                  "Clear value"
                ),
              ])
            : null,
          h("div", { class: c.row }, [
            h("button", { type: "submit", class: c.button }, "Submit"),
            h("button", { type: "reset", class: c.button }, "Reset"),
          ]),
        ]
      )
      if (variant.place === "rtl") {
        return h("div", { dir: "rtl" }, [card])
      }
      return card
    }
  },
})

function mount(root: HTMLElement) {
  renderShell(root, (slot, variant, log) =>
    createApp(Card, { variant, log }).mount(slot)
  )
}

export { mount }
