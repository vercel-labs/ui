import { Directive, input, output, type InputSignal } from "@angular/core"
import {
  textarea,
  type TextareaOptions,
  type TextareaSubmitDetails,
} from "@ui-sdk/core/input"
import { useFieldControl } from "./field-context.ts"
import { optionalBoolean } from "./inputs.ts"
import { emitChange, ListenedEmitter } from "./outputs.ts"
import { useTextControl } from "./text-control.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the text about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TextareaValueChange = Parameters<
  NonNullable<TextareaOptions["onValueChange"]>
>[1] & {
  /** The text the change would set. */
  value: string
}

/**
 * What `(submit)` emits: the text and the key press that submitted it.
 * @experimental
 */
type TextareaSubmit = TextareaSubmitDetails & {
  /** The text being submitted. */
  value: string
}

/**
 * A native `<textarea>`, wired to the Field it's in. It can grow with its
 * text and submit on a shortcut.
 * @experimental
 */
@Directive({
  selector: "textarea[uiTextarea]",
  exportAs: "uiTextarea",
  outputs: ["submit"],
})
class Textarea {
  readonly #field = useFieldControl()
  /** The text. Bind it with `[(value)]` to control the field. */
  readonly value: InputSignal<TextareaOptions["value"]> = input()
  /** The text at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<TextareaOptions["defaultValue"]> = input()
  /** The new text, after a change that wasn't canceled. */
  readonly valueChange = output<string>()
  /** Runs when the user types (`"input-change"`), a form resets (`"reset"`) or a controller writes (`"imperative"`). `$event.cancel()` keeps the text as it was. */
  readonly beforeValueChange = output<TextareaValueChange>()
  /** Grows and shrinks with the text. Bound it with CSS `min-height` and `max-height`; past the maximum, it scrolls. */
  readonly autoResize = input(undefined, { transform: optionalBoolean })
  /** Which keys submit: `"enter"`, with Shift+Enter for a new line, or `"mod+enter"`, with Enter for a new line. Without it, Enter always starts a new line. */
  readonly submitShortcut: InputSignal<TextareaOptions["submitShortcut"]> =
    input()
  /** Runs on the submit shortcut. Without a listener, the shortcut submits the form the textarea is in. */
  readonly submit = new ListenedEmitter<TextareaSubmit>()
  /** Disables the field. Inside a Field, the Field's `disabled` applies too. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Makes the field read-only. A native `readonly` attribute does the same. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Makes the field required. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** Reads and writes the field from anywhere. Create one with `createInputController()`. */
  readonly controller: InputSignal<TextareaOptions["controller"]> = input()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(textarea, () => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    autoResize: this.autoResize(),
    submitShortcut: this.submitShortcut(),
    onSubmit: this.submit.listened()
      ? (value: string, details: TextareaSubmitDetails) =>
          this.submit.emit({ ...details, value })
      : undefined,
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
  /** The textarea's state, as a signal. */
  readonly state = usePart(this.handle, "root", () => this.#states(), {
    joined: this.#field?.joined,
  }).state
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

export { Textarea, type TextareaSubmit, type TextareaValueChange }
