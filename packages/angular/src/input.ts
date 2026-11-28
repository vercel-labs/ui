import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  input as inputPrimitive,
  inputGroup,
  type InputGroupState,
  type InputOptions,
} from "@ui-sdk/core/input"
import { useFieldControl } from "./field-context.ts"
import { optionalBoolean } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useTextControl } from "./text-control.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the text about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type InputValueChange = Parameters<
  NonNullable<InputOptions["onValueChange"]>
>[1] & {
  /** The text the change would set. */
  value: string
}

/**
 * A native `<input>`, wired to the Field it's in.
 * @experimental
 */
@Directive({ selector: "input[uiInput]", exportAs: "uiInput" })
class Input {
  readonly #field = useFieldControl()
  /** The text. Bind it with `[(value)]` to control the field. */
  readonly value: InputSignal<InputOptions["value"]> = input()
  /** The text at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<InputOptions["defaultValue"]> = input()
  /** The new text, after a change that wasn't canceled. */
  readonly valueChange = output<string>()
  /** Runs when the user types (`"input-change"`), a Clear part empties the field (`"clear-press"`), a form resets (`"reset"`) or a controller writes (`"imperative"`). `$event.cancel()` keeps the text as it was. */
  readonly beforeValueChange = output<InputValueChange>()
  /** Disables the field. Inside a Field, the Field's `disabled` applies too. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Makes the field read-only. A native `readonly` attribute does the same. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Makes the field required. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** Reads and writes the field from anywhere. Create one with `createInputController()`. */
  readonly controller: InputSignal<InputOptions["controller"]> = input()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(inputPrimitive, () => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    controller: this.controller(),
    debug: this.debug(),
  }))
  readonly #states = useTextControl(() => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    name: this.#field?.name(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
  }))
  /** The input's state, as a signal. */
  readonly state = usePart(this.handle, "root", () => this.#states(), {
    joined: this.#field?.joined,
  }).state
}

/**
 * Holds an Input or Textarea with icons, text and buttons around it. Presses
 * on its text and icons focus the field.
 * @experimental
 */
@Directive({ selector: "[uiInputGroup]", exportAs: "uiInputGroup" })
class InputGroup {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(inputGroup, () => ({ debug: this.debug() }))
  /** The input group's state, as a signal. */
  readonly state = usePart(this.handle, "group").state
}

/**
 * Empties the field in its group and focuses it. Shown while there's text to
 * clear. `*uiInputClear` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiInputClear]", exportAs: "uiInputClear" })
class InputClear {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(InputGroup).handle, "clear").state

  static ngTemplateContextGuard(
    _directive: InputClear,
    context: unknown
  ): context is { $implicit: InputGroupState } {
    return true
  }
}

export { createInputController } from "@ui-sdk/core/input"
export type {
  InputController,
  InputGroupOptions,
  InputGroupPrimitive,
  InputGroupState,
  InputOptions,
  InputPrimitive,
  InputProps,
  InputState,
  InputValueChangeReason,
  TextareaOptions,
  TextareaPrimitive,
  TextareaProps,
  TextareaState,
  TextareaSubmitDetails,
} from "@ui-sdk/core/input"

export { Input, InputClear, InputGroup, type InputValueChange }
