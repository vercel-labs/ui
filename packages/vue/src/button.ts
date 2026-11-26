import {
  button as buttonPrimitive,
  type ButtonActionDetails,
} from "@ui-sdk/core/button"
import { defineComponent, type PropType } from "vue"
import { withElement } from "./create-parts"
import {
  optionalBoolean,
  partListeners,
  usePart,
  usePrimitive,
  type PartSlots,
} from "./use-primitive"

type Click = (event: MouseEvent, details: ButtonActionDetails) => unknown

// A lone Promise goes back as it is, so a popup's `open()` keeps the button idle.
const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | null)?.then === "function"

/**
 * A button, or a link or any element that acts as one through the `render` slot.
 * @stable
 */
const Button = withElement(
  "button",
  defineComponent({
    name: "Button",
    inheritAttrs: false,
    props: {
      disabled: optionalBoolean,
      focusableWhenDisabled: optionalBoolean,
      type: String as PropType<"button" | "submit" | "reset">,
      pendingAnnouncement: String,
      debug: optionalBoolean,
      // `@click="save"` binds here, so the button gets the handler's Promise and
      // stays pending until it settles. Beside a slot's `v-bind="props"`, Vue
      // merges both listeners into an array.
      onClick: [Function, Array] as PropType<Click | Click[]>,
    },
    slots: Object as PartSlots<typeof buttonPrimitive, "root">,
    setup(props) {
      const button = usePrimitive(buttonPrimitive, () => ({
        disabled: props.disabled,
        focusableWhenDisabled: props.focusableWhenDisabled,
        type: props.type,
        pendingAnnouncement: props.pendingAnnouncement,
        debug: props.debug,
        action(event, details) {
          const handlers = [props.onClick ?? []].flat()
          const own = handlers.filter((fn) => !partListeners.has(fn))
          const results = own.map((fn) => fn(event as MouseEvent, details))
          for (const fn of handlers) {
            if (partListeners.has(fn)) {
              fn(event as MouseEvent, details)
            }
          }
          const waits = results.filter(isThenable)
          if (waits.length < 2) {
            return waits[0] ?? results[0]
          }
          // Pending until every wait settles, then failed with the first error.
          return Promise.allSettled(waits).then((settled) => {
            for (const result of settled) {
              if (result.status === "rejected") {
                throw result.reason
              }
            }
          })
        },
      }))
      return usePart(button, "root", undefined, undefined, "button")
    },
  })
)

export { Button }

export type {
  ButtonActionDetails,
  ButtonApi,
  ButtonOptions,
  ButtonPrimitive,
  ButtonState,
} from "@ui-sdk/core/button"
