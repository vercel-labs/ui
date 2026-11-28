import {
  computed,
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  numberInput,
  type NumberInputOptions,
  type NumberInputScrubAreaProps,
  type NumberInputState,
} from "@ui-sdk/core/number-input"
import { useControllerEntry, useControllerTarget } from "./controller-target.ts"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { useOutsidePart, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type NumberInputValueChange = Parameters<
  NonNullable<NumberInputOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<NumberInputOptions["onValueChange"]>>[0]
}

/**
 * What `(valueCommit)` emits: the value and what came with it.
 * @experimental
 */
type NumberInputValueCommit = Parameters<
  NonNullable<NumberInputOptions["onValueCommit"]>
>[1] & {
  /** The number the interaction ended on. */
  value: Parameters<NonNullable<NumberInputOptions["onValueCommit"]>>[0]
}

/**
 * The root, and the hidden input that submits the number as is.
 * @experimental
 */
@Directive({ selector: "[uiNumberInput]", exportAs: "uiNumberInput" })
class NumberInput {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The value, or null for an empty field. Bind it with `[(value)]` to control the field. */
  readonly value: InputSignal<NumberInputOptions["value"]> = input()
  /** The value at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<NumberInputOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<NumberInputValueChange["value"]>()
  /** Runs when the value changes: as a typed number becomes valid, and on every step. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<NumberInputValueChange>()
  /** Runs once an interaction that changed the value ends: typing is committed, a key or a button is released, or a scrub ends. For saving. */
  readonly valueCommit = output<NumberInputValueCommit>()
  /** The lowest value. Typed values below it are raised to it when committed. */
  readonly min = input(undefined, { transform: optionalNumber })
  /** The highest value. Typed values above it are lowered to it when committed. */
  readonly max = input(undefined, { transform: optionalNumber })
  /** How far one step moves. Committed values snap to steps from `min`, or from 0 without one. */
  readonly step = input(undefined, { transform: optionalNumber })
  /** How far Page Up, Page Down, and Shift with an arrow key, a button, the wheel or a scrub move. */
  readonly largeStep = input(undefined, { transform: optionalNumber })
  /** How far Alt (Option on a Mac) with an arrow key, the wheel or a scrub moves, for fine changes. Values it reaches snap to it rather than to `step`. */
  readonly smallStep = input(undefined, { transform: optionalNumber })
  /** How the value shows: `Intl.NumberFormat` options, like `{ style: "currency", currency: "USD" }`. Typing accepts the same format in the locale, and percents are fractions: 50% is 0.5. */
  readonly format: InputSignal<NumberInputOptions["format"]> = input()
  /** The locale for formatting and reading typed numbers. Defaults to the page's `lang`, or the browser's language without one, once the page is interactive. Server markup uses English until then, so it never disagrees with the client. */
  readonly locale: InputSignal<NumberInputOptions["locale"]> = input()
  /** Lets the mouse wheel step the value while the input has focus. */
  readonly wheel = input(undefined, { transform: optionalBoolean })
  /** Disables it like a native control: it can't be focused or changed, and isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps it focusable and submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission while it's empty, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name it submits under. The number is submitted as is, like `1234.5`, never formatted. */
  readonly name: InputSignal<NumberInputOptions["name"]> = input()
  /** The id of a form to belong to, when it isn't inside that form. */
  readonly form: InputSignal<NumberInputOptions["form"]> = input()
  /** Steps it from anywhere. Create one with `createNumberInputController()`. */
  readonly controller: InputSignal<NumberInputOptions["controller"]> = input()

  readonly handle = usePrimitive(numberInput, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    onValueCommit: (value, details) =>
      this.valueCommit.emit({ ...details, value }),
    min: this.min(),
    max: this.max(),
    step: this.step(),
    largeStep: this.largeStep(),
    smallStep: this.smallStep(),
    format: this.format(),
    locale: this.locale(),
    wheel: this.wheel(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
    controlId: this.#field?.controlId(),
  }))
  /** The number input's state, as a signal. */
  readonly state = usePart(this.handle, "root").state

  constructor() {
    useNativeInput(this.handle, "hidden-input")
    useControllerEntry(() => this.controller(), this)
  }
}

/**
 * Holds the input and its buttons.
 * @experimental
 */
@Directive({ selector: "[uiNumberInputGroup]", exportAs: "uiNumberInputGroup" })
class NumberInputGroup {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(NumberInput).handle, "group").state
}

/**
 * The text field, which shows the formatted number and takes typing.
 * @experimental
 */
@Directive({
  selector: "input[uiNumberInputControl]",
  exportAs: "uiNumberInputControl",
})
class NumberInputControl {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(NumberInput).handle, "control", undefined, {
    joined: useFieldControl()?.joined,
  }).state
}

/**
 * Steps up once, then repeats while held. Shift steps by `largeStep`.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInputIncrement]",
  exportAs: "uiNumberInputIncrement",
})
class NumberInputIncrement {
  /** Disables the button. */
  readonly disabled = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(NumberInput).handle, "increment", () => ({
    disabled: this.disabled(),
  })).state
}

/**
 * Steps down once, then repeats while held. Shift steps by `largeStep`.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInputDecrement]",
  exportAs: "uiNumberInputDecrement",
})
class NumberInputDecrement {
  /** Disables the button. */
  readonly disabled = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(NumberInput).handle, "decrement", () => ({
    disabled: this.disabled(),
  })).state
}

// A scrub area's state until the number input its controller names mounts.
const unconnected: NumberInputState = {
  value: null,
  disabled: false,
  readOnly: false,
  required: false,
  scrubbing: false,
}

/**
 * Drag across it to change the value. It works anywhere inside the number input, and outside it through `controller`, like an icon in a toolbar.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInputScrubArea]",
  exportAs: "uiNumberInputScrubArea",
})
class NumberInputScrubArea {
  /** Which way to drag: right and up increase. */
  readonly orientation: InputSignal<NumberInputScrubAreaProps["orientation"]> =
    input()
  /** How far the pointer moves for one step, in CSS pixels. */
  readonly pixelsPerStep = input(undefined, { transform: optionalNumber })
  /** The number input it drives when it isn't inside one. */
  readonly controller: InputSignal<NumberInputScrubAreaProps["controller"]> =
    input()

  readonly #numberInput = useControllerTarget(
    () => this.controller(),
    inject(NumberInput, { optional: true }) ?? undefined
  )
  readonly #part = useOutsidePart(
    () => this.#numberInput()?.handle,
    "scrub-area",
    () => ({
      orientation: this.orientation(),
      pixelsPerStep: this.pixelsPerStep(),
    }),
    {},
    () => ({})
  )
  /** The part's state, as a signal. */
  readonly state = computed<NumberInputState>(
    () => this.#part.state() ?? unconnected
  )
}

/**
 * Stands in for the mouse cursor while a scrub locks the pointer. `*uiNumberInputScrubAreaCursor` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInputScrubAreaCursor]",
  exportAs: "uiNumberInputScrubAreaCursor",
})
class NumberInputScrubAreaCursor {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(NumberInput).handle, "scrub-area-cursor")
    .state

  static ngTemplateContextGuard(
    _directive: NumberInputScrubAreaCursor,
    context: unknown
  ): context is { $implicit: ReturnType<NumberInputScrubAreaCursor["state"]> } {
    return true
  }
}

export { createNumberInputController } from "@ui-sdk/core/number-input"
export type {
  NumberInputApi,
  NumberInputButtonProps,
  NumberInputButtonState,
  NumberInputChangeOptions,
  NumberInputController,
  NumberInputOptions,
  NumberInputPrimitive,
  NumberInputScrubAreaProps,
  NumberInputState,
  NumberInputValueChangeReason,
} from "@ui-sdk/core/number-input"

export {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
  type NumberInputValueChange,
  type NumberInputValueCommit,
}
