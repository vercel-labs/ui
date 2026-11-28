import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import { switchPrimitive, type SwitchOptions } from "@ui-sdk/core/switch"
import { optionalBoolean } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeCheckedChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type SwitchCheckedChange = Parameters<
  NonNullable<SwitchOptions["onCheckedChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<SwitchOptions["onCheckedChange"]>>[0]
}

/**
 * A control that turns a setting on or off, with the hidden native input that takes part in the form.
 * @experimental
 */
@Directive({ selector: "[uiSwitch]", exportAs: "uiSwitch" })
class Switch {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether it's on. Bind it with `[(checked)]` to control the switch. */
  readonly checked = input(undefined, { transform: optionalBoolean })
  /** Whether it's on at first, when uncontrolled. A form reset returns to it. */
  readonly defaultChecked = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly checkedChange = output<SwitchCheckedChange["value"]>()
  /** Runs when a user or a form reset wants to change it. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeCheckedChange = output<SwitchCheckedChange>()
  /** Disables it like a native control: it can't be focused or changed, and isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps it focusable and submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until it's checked, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name it submits under. Without one, it submits nothing. */
  readonly name: InputSignal<SwitchOptions["name"]> = input()
  /** What it submits while checked. */
  readonly value: InputSignal<SwitchOptions["value"]> = input()
  /** The id of a form to belong to, when it isn't inside that form. */
  readonly form: InputSignal<SwitchOptions["form"]> = input()
  /** Toggles it from anywhere. Create one with `createSwitchController()`. */
  readonly controller: InputSignal<SwitchOptions["controller"]> = input()

  readonly handle = usePrimitive(switchPrimitive, () => ({
    debug: this.debug(),
    checked: this.checked(),
    defaultChecked: this.defaultChecked(),
    onCheckedChange: emitChange(this.beforeCheckedChange, this.checkedChange),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    value: this.value(),
    form: this.form(),
    controller: this.controller(),
  }))
  /** The switch's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    useNativeInput(this.handle, "input")
  }
}

/**
 * The thumb that slides along the switch as it turns on or off.
 * @experimental
 */
@Directive({ selector: "[uiSwitchThumb]", exportAs: "uiSwitchThumb" })
class SwitchThumb {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Switch).handle, "thumb").state
}

export { createSwitchController } from "@ui-sdk/core/switch"
export type {
  SwitchApi,
  SwitchCheckedChangeReason,
  SwitchController,
  SwitchOptions,
  SwitchPrimitive,
  SwitchState,
  SwitchThumbState,
} from "@ui-sdk/core/switch"

export { Switch, type SwitchCheckedChange, SwitchThumb }
