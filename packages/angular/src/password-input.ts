import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  passwordInput,
  type PasswordInputOptions,
} from "@ui-sdk/core/password-input"
import { optionalBoolean } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useTextValue } from "./text-control.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type PasswordInputValueChange = Parameters<
  NonNullable<PasswordInputOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<PasswordInputOptions["onValueChange"]>>[0]
}

/**
 * What `(beforeVisibleChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type PasswordInputVisibleChange = Parameters<
  NonNullable<PasswordInputOptions["onVisibleChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<PasswordInputOptions["onVisibleChange"]>>[0]
}

/**
 * Holds the field and its toggle. Presses on its own text and icons focus the field.
 * @experimental
 */
@Directive({ selector: "[uiPasswordInput]", exportAs: "uiPasswordInput" })
class PasswordInput {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The value, for a controlled field. */
  readonly value: InputSignal<PasswordInputOptions["value"]> = input()
  /** The value it starts with. A form reset returns here. */
  readonly defaultValue: InputSignal<PasswordInputOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<PasswordInputValueChange["value"]>()
  /** Called when the user changes the value: typing (`"input-change"`), a Clear part (`"clear-press"`), a form reset (`"reset"`) or a controller (`"imperative"`). `$event.cancel()` keeps the value as it was. */
  readonly beforeValueChange = output<PasswordInputValueChange>()
  /** Whether the password is shown. Bind it with `[(visible)]` to control it. */
  readonly visible = input(undefined, { transform: optionalBoolean })
  /** Whether the password is shown at first, when uncontrolled. */
  readonly defaultVisible = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly visibleChange = output<PasswordInputVisibleChange["value"]>()
  /** Runs when the password wants to be shown or hidden: the toggle (`"toggle-press"`), submitting or resetting its form (`"form-submit"`, `"reset"`), the page being hidden (`"page-hide"`) or a controller (`"imperative"`). `$event.cancel()` keeps it as it was; the field is a password field while the browser reads a submitted form either way. */
  readonly beforeVisibleChange = output<PasswordInputVisibleChange>()
  /** What the browser and password managers fill in: `"current-password"` for signing in, `"new-password"` for signing up or changing it. */
  readonly autoComplete: InputSignal<PasswordInputOptions["autoComplete"]> =
    input()
  /** The name the password submits under. Inside a Field, the Field's name. */
  readonly name: InputSignal<PasswordInputOptions["name"]> = input()
  /** The id of the form the field belongs to, when it isn't inside it. */
  readonly form: InputSignal<PasswordInputOptions["form"]> = input()
  /** Whether a password is required to submit the form. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** Disables the field and the toggle. Inside a Field or a disabled `<fieldset>`, they follow it. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Makes the field read-only. The toggle still shows and hides it. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Reads, writes, shows and hides it from anywhere. Create one with `createPasswordInputController()`. */
  readonly controller: InputSignal<PasswordInputOptions["controller"]> = input()

  readonly handle = usePrimitive(passwordInput, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    visible: this.visible(),
    defaultVisible: this.defaultVisible(),
    onVisibleChange: emitChange(this.beforeVisibleChange, this.visibleChange),
    autoComplete: this.autoComplete(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    required: this.required(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    controller: this.controller(),
    controlId: this.#field?.controlId(),
  }))
  /** The password input's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The native `<input>`. Its type follows whether the password is shown, and form attributes come from the PasswordInput.
 * @experimental
 */
@Directive({
  selector: "input[uiPasswordInputControl]",
  exportAs: "uiPasswordInputControl",
})
class PasswordInputControl {
  readonly #root = inject(PasswordInput)
  /** The part's state, as a signal. */
  readonly state = usePart(this.#root.handle, "control", undefined, {
    joined: useFieldControl()?.joined,
  }).state

  constructor() {
    useTextValue(() => ({
      value: this.#root.value(),
      defaultValue: this.#root.defaultValue(),
    }))
  }
}

/**
 * Shows and hides the password. Name it by what it does, like "Show password": it's a toggle button, and `aria-pressed` says whether the password is shown.
 * @experimental
 */
@Directive({
  selector: "[uiPasswordInputToggle]",
  exportAs: "uiPasswordInputToggle",
})
class PasswordInputToggle {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(PasswordInput).handle, "toggle").state
}

export { createPasswordInputController } from "@ui-sdk/core/password-input"
export type {
  InputValueChangeReason,
  PasswordInputController,
  PasswordInputOptions,
  PasswordInputPrimitive,
  PasswordInputState,
  PasswordInputVisibleChangeReason,
} from "@ui-sdk/core/password-input"

export {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
  type PasswordInputValueChange,
  type PasswordInputVisibleChange,
}
