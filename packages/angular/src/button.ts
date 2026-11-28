import { Directive, input, type InputSignal } from "@angular/core"
import { button, type ButtonOptions } from "@ui-sdk/core/button"
import { optionalBoolean } from "./inputs.ts"
import { ActionEmitter, type Action } from "./outputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(action)` emits: the press, how it was made, and `waitUntil()`.
 * @experimental
 */
type ButtonAction = Action

/**
 * A button. Put it on a `<button>`, or on a link or any element that should act as one.
 * @experimental
 */
@Directive({
  selector: "[uiButton]",
  exportAs: "uiButton",
  outputs: ["action"],
})
class Button {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Stops presses. The button is natively disabled, so it leaves the tab order and its form doesn't submit through it, unless `focusableWhenDisabled` is set. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps a disabled button in the tab order with `aria-disabled` instead of the native attribute, so it can hold focus while it becomes disabled and host a tooltip that says why. Presses still do nothing. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })
  /** What a native button does in a form: `"submit"` submits it and `"reset"` resets it. Ignored on an element that isn't a button. */
  readonly type: InputSignal<ButtonOptions["type"]> = input()
  /** What screen readers hear once the button has been pending for a second, so a slow action doesn't pass in silence. Set it in the page's language. An empty string says nothing. */
  readonly pendingAnnouncement: InputSignal<
    ButtonOptions["pendingAnnouncement"]
  > = input()
  /** Runs when the button is pressed. Pass a Promise to `$event.waitUntil()` to make the button pending until it settles: it gets `aria-busy`, `aria-disabled` and `data-pending`, keeps focus and ignores presses meanwhile, so a form can't submit twice. */
  readonly action = new ActionEmitter()

  readonly handle = usePrimitive(button, () => ({
    debug: this.debug(),
    disabled: this.disabled(),
    focusableWhenDisabled: this.focusableWhenDisabled(),
    type: this.type(),
    pendingAnnouncement: this.pendingAnnouncement(),
    action: this.action.handler(),
  }))
  /** The button's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

export type {
  ButtonActionDetails,
  ButtonApi,
  ButtonOptions,
  ButtonPrimitive,
  ButtonState,
} from "@ui-sdk/core/button"

export { Button, type ButtonAction }
