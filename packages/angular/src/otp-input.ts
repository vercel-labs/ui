import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  numberAttribute,
  output,
  type InputSignal,
} from "@angular/core"
import { otpInput, type OTPInputOptions } from "@ui-sdk/core/otp-input"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { FieldContext } from "./field-context.ts"
import { OTPInputControl, OTPInputScope } from "./otp-input-context.ts"
import { moveAttributes, useText } from "./text.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type OTPInputValueChange = Parameters<
  NonNullable<OTPInputOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<OTPInputOptions["onValueChange"]>>[0]
}

/**
 * What `(valueCommit)` emits: the value and what came with it.
 * @experimental
 */
type OTPInputValueCommit = Parameters<
  NonNullable<OTPInputOptions["onValueCommit"]>
>[1] & {
  /** The whole code. */
  value: Parameters<NonNullable<OTPInputOptions["onValueCommit"]>>[0]
}

const inputAttributes = [
  "id",
  "autofocus",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-invalid",
]

/**
 * The root: the slots, and the one real input over them. `id`, `autofocus` and the `aria-*` naming attributes go to that input.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiOTPInput]",
  exportAs: "uiOTPInput",
  imports: [OTPInputControl],
  providers: [
    {
      provide: OTPInputScope,
      useFactory: () => {
        const root = inject(OTPInput)
        return { handle: root.handle, moved: root.moved, named: root.named }
      },
    },
  ],
  template: `<ng-content /><input uiOTPInputControl />`,
})
class OTPInput {
  readonly #field = inject(FieldContext, { optional: true })
  /** The attributes the author wrote on the root, which its input takes. */
  readonly moved = moveAttributes(inputAttributes)
  /** Names the input. Bind it with `[aria-label]`. */
  readonly ariaLabel = input<string>(undefined, { alias: "aria-label" })
  /** The id of the element that names the input. Bind it with `[aria-labelledby]`. */
  readonly ariaLabelledby = input<string>(undefined, {
    alias: "aria-labelledby",
  })
  /** The id of the element that describes the input. Bind it with `[aria-describedby]`. */
  readonly ariaDescribedby = input<string>(undefined, {
    alias: "aria-describedby",
  })
  /** The names the author bound on the root, which its input takes. */
  readonly named = computed(() => ({
    "aria-label": this.ariaLabel(),
    "aria-labelledby": this.ariaLabelledby(),
    "aria-describedby": this.ariaDescribedby(),
  }))
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The code, for a controlled input. */
  readonly value: InputSignal<OTPInputOptions["value"]> = input()
  /** The code it starts with, when uncontrolled. A form reset returns here. */
  readonly defaultValue: InputSignal<OTPInputOptions["defaultValue"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<OTPInputValueChange["value"]>()
  /** Runs when the code changes: typing or deleting (`"input-change"`), a paste (`"paste"`), the browser's undo and redo, a form reset, or a controller. Autofill and codes from the keyboard's suggestions are `"input-change"`. `$event.cancel()` keeps the code as it was. */
  readonly beforeValueChange = output<OTPInputValueChange>()
  /** Runs when a change fills every slot, with the whole code, like to verify it. A controller filling it counts, so does a code that changes while full. */
  readonly valueCommit = output<OTPInputValueCommit>()
  /** How many characters the code has, one slot each. */
  readonly maxLength = input(undefined, { transform: optionalNumber })
  /** Which characters it accepts: `"digits"`, `"letters"`, `"alphanumeric"`, or a regular expression each character must match, like `/[A-F0-9]/i`. Anything else typed, pasted or dropped is ignored. */
  readonly pattern: InputSignal<OTPInputOptions["pattern"]> = input()
  /** The keyboard touch screens show. */
  readonly inputMode: InputSignal<OTPInputOptions["inputMode"]> = input()
  /** Where the invisible input keeps its text and caret. It decides where the browser puts its own popups, like the paste menu on phones. `"start"` and `"end"` follow the reading direction. */
  readonly textAlign: InputSignal<OTPInputOptions["textAlign"]> = input()
  /** The input's `autocomplete`. `"one-time-code"` lets phones offer a code from a message, and password managers fill it. */
  readonly autoComplete: InputSignal<OTPInputOptions["autoComplete"]> = input()
  /** Disables it like a native input: it can't be focused, and isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Makes it read-only: focusable and submitted, but the code can't change. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Requires a code before the form submits. A partial code is too short either way. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name it submits the code under. */
  readonly name: InputSignal<OTPInputOptions["name"]> = input()
  /** The id of a form to belong to, when it isn't inside that form. */
  readonly form: InputSignal<OTPInputOptions["form"]> = input()
  /** Reads and writes the code from anywhere. Create one with `createOTPInputController()`. */
  readonly controller: InputSignal<OTPInputOptions["controller"]> = input()

  readonly handle = usePrimitive(otpInput, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    onValueCommit: (value, details) =>
      this.valueCommit.emit({ ...details, value }),
    maxLength: this.maxLength(),
    pattern: this.pattern(),
    inputMode: this.inputMode(),
    textAlign: this.textAlign(),
    autoComplete: this.autoComplete(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
  }))
  /** The OTP input's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * Lays out a run of slots.
 * @experimental
 */
@Directive({ selector: "[uiOTPInputGroup]", exportAs: "uiOTPInputGroup" })
class OTPInputGroup {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(OTPInput).handle, "group").state
}

/**
 * One character of the code. Without content, it shows the character.
 * @experimental
 */
@Directive({ selector: "[uiOTPInputSlot]", exportAs: "uiOTPInputSlot" })
class OTPInputSlot {
  /** Which character of the code the slot shows, from 0. */
  readonly index = input.required({ transform: numberAttribute })

  /** The slot's state, as a signal. */
  readonly state = usePart(inject(OTPInput).handle, "slot", () => ({
    index: this.index(),
    id: String(this.index()),
  })).state

  constructor() {
    useText(() => this.state().char ?? "")
  }
}

/**
 * Drawn between groups, like a dash.
 * @experimental
 */
@Directive({
  selector: "[uiOTPInputSeparator]",
  exportAs: "uiOTPInputSeparator",
})
class OTPInputSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(OTPInput).handle, "separator").state
}

export { createOTPInputController } from "@ui-sdk/core/otp-input"
export type {
  OTPInputApi,
  OTPInputChangeOptions,
  OTPInputController,
  OTPInputOptions,
  OTPInputPattern,
  OTPInputSlotData,
  OTPInputSlotProps,
  OTPInputSlotState,
  OTPInputState,
  OTPInputValueChangeReason,
  OtpInputPrimitive,
} from "@ui-sdk/core/otp-input"

export {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
  type OTPInputValueChange,
  type OTPInputValueCommit,
}
